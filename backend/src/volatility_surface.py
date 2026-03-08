import pandas as pd
import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq

def black_scholes_iv(S, K, T, r, market_price, option_type='C'):
    """
    Calculate Implied Volatility using Newton/Brentq root finding.
    S: Spot Price
    K: Strike Price
    T: Time to expiry (in years)
    r: Risk-free rate
    """
    if T <= 0 or market_price <= 0:
        return 0.0

    def bs_price(sigma):
        d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
        d2 = d1 - sigma * np.sqrt(T)
        if option_type == 'C':
            price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
        else:
            price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
        return price - market_price

    try:
        # Searching between 0.1% and 300% volatility
        iv = brentq(bs_price, 0.001, 3.0)
        return iv
    except ValueError:
        return 0.0

def generate_volatility_surface(df: pd.DataFrame, risk_free_rate=0.05) -> dict:
    """
    Computes Implied Volatility for every Strike and Expiry, returning a 3D Cartesean grid payload.
    """
    if df.empty or 'CE' not in df.columns or 'spot_close' not in df.columns:
        return {}

    latest_df = df.sort_values('datetime').drop_duplicates(subset=['expiry', 'strike'], keep='last').copy()
    
    # Calculate days to expiry and convert to years
    latest_df['time_to_expiry_years'] = (latest_df['expiry'] - latest_df['datetime']).dt.total_seconds() / (365.25 * 24 * 3600)
    # Ensure non-negative T, cap minimum at 1 day logic
    latest_df['time_to_expiry_years'] = latest_df['time_to_expiry_years'].clip(lower=1/365.25)
    
    # PERFORMANCE OPTIMIZATION FOR DEMO:
    # Limit strikes to +/- 1500 from spot close to keep 3D charting smooth
    current_spot = latest_df['spot_close'].iloc[-1]
    latest_df = latest_df[(latest_df['strike'] > current_spot - 1500) & (latest_df['strike'] < current_spot + 1500)].copy()

    # Calculate IV for CE
    latest_df['IV_CE'] = latest_df.apply(
        lambda row: black_scholes_iv(
            S=row['spot_close'],
            K=row['strike'],
            T=row['time_to_expiry_years'],
            r=risk_free_rate,
            market_price=row['CE'],
            option_type='C'
        ), axis=1
    )

    # Calculate IV for PE
    latest_df['IV_PE'] = latest_df.apply(
        lambda row: black_scholes_iv(
            S=row['spot_close'],
            K=row['strike'],
            T=row['time_to_expiry_years'],
            r=risk_free_rate,
            market_price=row['PE'],
            option_type='P'
        ), axis=1
    )
    
    # Create the 3D Matrix
    iv_ce_matrix = latest_df.pivot(index='expiry', columns='strike', values='IV_CE').fillna(0)
    
    expiries = [str(x)[:10] for x in iv_ce_matrix.index.tolist()]
    strikes = iv_ce_matrix.columns.tolist()

    return {
        "x_strikes": strikes,
        "y_expiries": expiries,
        "z_iv_CE": iv_ce_matrix.values.tolist(),
    }
