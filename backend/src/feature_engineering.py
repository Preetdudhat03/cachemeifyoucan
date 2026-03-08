import pandas as pd
import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq

def _bs_iv(S, K, T, r, market_price, option_type='C'):
    """Calculate Implied Volatility using Brentq root finding."""
    if T <= 0 or market_price <= 0 or S <= 0 or K <= 0:
        return 0.0
    def bs_price(sigma):
        d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
        d2 = d1 - sigma * np.sqrt(T)
        if option_type == 'C':
            return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2) - market_price
        else:
            return K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1) - market_price
    try:
        return brentq(bs_price, 0.001, 3.0)
    except (ValueError, RuntimeError):
        return 0.0

def calculate_put_call_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate Put Call Ratio (PCR) based on Open Interest."""
    # PCR = total_put_open_interest / total_call_open_interest
    # Handle division by zero
    df['PCR_OI'] = df['oi_PE'] / df['oi_CE'].replace(0, 1)
    # Also calculate volume-based PCR
    df['PCR_Volume'] = df['volume_PE'] / df['volume_CE'].replace(0, 1)
    return df

def calculate_call_put_volume_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate Call Put Volume Ratio."""
    df['CP_Volume_Ratio'] = df['volume_CE'] / df['volume_PE'].replace(0, 1)
    return df

def calculate_money_flow(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate Money Flow Indicators."""
    # call_money_flow = volume_CE * strike
    # put_money_flow = volume_PE * strike
    df['call_money_flow'] = df['volume_CE'] * df['strike']
    df['put_money_flow'] = df['volume_PE'] * df['strike']
    return df

def calculate_oi_change(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate Open Interest Change."""
    # Group by expiry and strike, calculate diff over time
    if 'datetime' in df.columns:
        df = df.sort_values(by=['datetime'])
        df['oi_CE_change'] = df.groupby(['expiry', 'strike'])['oi_CE'].diff().fillna(0)
        df['oi_PE_change'] = df.groupby(['expiry', 'strike'])['oi_PE'].diff().fillna(0)
    return df

def calculate_strike_distance_atm(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate Strike Distance from ATM."""
    if 'spot_close' in df.columns and 'strike' in df.columns:
        df['distance_from_spot'] = df['strike'] - df['spot_close']
        df['distance_from_spot_pct'] = (df['strike'] - df['spot_close']) / df['spot_close'] * 100
    return df

def calculate_implied_volatility(df: pd.DataFrame, risk_free_rate: float = 0.05) -> pd.DataFrame:
    """
    Calculate Implied Volatility for CE and PE using the Black-Scholes model.
    Only compute for a representative sample (latest snapshot per expiry+strike)
    to keep startup time reasonable, then merge back.
    """
    required = ['CE', 'PE', 'spot_close', 'strike', 'expiry', 'datetime']
    if not all(c in df.columns for c in required):
        return df

    # Take the latest snapshot per expiry+strike for IV calculation
    iv_df = df.sort_values('datetime').drop_duplicates(subset=['expiry', 'strike'], keep='last').copy()

    # Time to expiry in years
    iv_df['_T'] = (iv_df['expiry'] - iv_df['datetime']).dt.total_seconds() / (365.25 * 24 * 3600)
    iv_df['_T'] = iv_df['_T'].clip(lower=1/365.25)

    # Limit to strikes within +/- 2000 of spot for speed
    spot = iv_df['spot_close'].iloc[-1] if len(iv_df) > 0 else 0
    iv_df = iv_df[(iv_df['strike'] > spot - 2000) & (iv_df['strike'] < spot + 2000)]

    iv_df['IV_CE'] = iv_df.apply(
        lambda r: _bs_iv(r['spot_close'], r['strike'], r['_T'], risk_free_rate, r['CE'], 'C'), axis=1
    )
    iv_df['IV_PE'] = iv_df.apply(
        lambda r: _bs_iv(r['spot_close'], r['strike'], r['_T'], risk_free_rate, r['PE'], 'P'), axis=1
    )

    # Merge IV columns back into the main df on expiry+strike
    iv_map = iv_df[['expiry', 'strike', 'IV_CE', 'IV_PE']].drop_duplicates(subset=['expiry', 'strike'])
    df = df.merge(iv_map, on=['expiry', 'strike'], how='left', suffixes=('', '_new'))
    # If IV columns already existed, overwrite; otherwise use the new ones
    if 'IV_CE_new' in df.columns:
        df['IV_CE'] = df['IV_CE_new'].fillna(0)
        df['IV_PE'] = df['IV_PE_new'].fillna(0)
        df.drop(columns=['IV_CE_new', 'IV_PE_new'], inplace=True, errors='ignore')
    df['IV_CE'] = df['IV_CE'].fillna(0)
    df['IV_PE'] = df['IV_PE'].fillna(0)

    iv_df.drop(columns=['_T'], inplace=True, errors='ignore')
    return df

def run_feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """Run all feature engineering steps."""
    if df.empty:
        return df
        
    df = calculate_put_call_ratio(df)
    df = calculate_call_put_volume_ratio(df)
    df = calculate_money_flow(df)
    df = calculate_oi_change(df)
    df = calculate_strike_distance_atm(df)
    df = calculate_implied_volatility(df)
    
    return df

