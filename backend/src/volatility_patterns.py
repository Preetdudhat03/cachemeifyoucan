import pandas as pd
import numpy as np

def detect_volatility_smile(df: pd.DataFrame, target_expiry: str = None) -> dict:
    """
    Detects Volatility Smile / Skew using Polynomial Curve Fitting (degree 2).
    Returns the curve data for the closest or specified expiry.
    """
    if df.empty or 'IV_CE' not in df.columns or 'IV_PE' not in df.columns:
        return {}
        
    # Get latest data
    latest_df = df.sort_values('datetime').drop_duplicates(subset=['expiry', 'strike'], keep='last').copy()
    
    if target_expiry:
        try:
            target_date = pd.to_datetime(target_expiry).date()
            latest_df = latest_df[latest_df['expiry'].dt.date == target_date]
        except Exception:
            pass
            
    if latest_df.empty:
        return {}
        
    if not target_expiry:
        # Default to the nearest expiry
        nearest_expiry = latest_df['expiry'].min()
        latest_df = latest_df[latest_df['expiry'] == nearest_expiry]
        
    # Filter out 0 IV Strings
    valid_mask = (latest_df['IV_CE'] > 0) & (latest_df['IV_PE'] > 0)
    valid_df = latest_df[valid_mask].copy()
    
    if len(valid_df) < 5:
        return {"error": "Not enough valid IV points"}
        
    strikes = valid_df['strike'].values
    iv_ce = valid_df['IV_CE'].values
    iv_pe = valid_df['IV_PE'].values
    
    # Fit a 2nd degree polynomial (parabola) to detect smile
    p_ce = np.polyfit(strikes, iv_ce, 2)
    p_pe = np.polyfit(strikes, iv_pe, 2)
    
    curve_ce = np.polyval(p_ce, strikes)
    curve_pe = np.polyval(p_pe, strikes)
    
    # Scaling coefficients for readability
    smile_intensity = float(p_ce[0]) * 1000000 
    skew_intensity = float(p_ce[1]) * 1000
    
    pattern_name = "Neutral"
    if smile_intensity > 0.5:
        pattern_name = "Volatility Smile"
    elif skew_intensity < -0.5:
        pattern_name = "Reverse Skew"
    elif skew_intensity > 0.5:
        pattern_name = "Forward Skew"
        
    return {
        "expiry": str(valid_df['expiry'].iloc[0].date()),
        "strikes": strikes.tolist(),
        "iv_ce": iv_ce.tolist(),
        "iv_pe": iv_pe.tolist(),
        "curve_ce": curve_ce.tolist(),
        "curve_pe": curve_pe.tolist(),
        "pattern": pattern_name,
        "smile_intensity": smile_intensity,
        "skew_intensity": skew_intensity
    }
