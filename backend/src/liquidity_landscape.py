import pandas as pd
import numpy as np

def generate_liquidity_landscape(df: pd.DataFrame, target_expiry: str = None) -> dict:
    """
    Generates a 3D Strike-Time Heatmap (Liquidity Landscape) showing how Open Interest
    mountains form and shift intraday.
    Axes: X=Strike, Y=Time, Z=Open Interest
    """
    if df.empty or 'datetime' not in df.columns:
        return {}
        
    latest_df = df.copy()
    
    # Filter by specific expiry if requested, otherwise take the nearest one
    if target_expiry:
        try:
            target_date = pd.to_datetime(target_expiry).date()
            latest_df = latest_df[latest_df['expiry'].dt.date == target_date]
        except Exception:
            pass
            
    if not target_expiry and not latest_df.empty:
        nearest_expiry = latest_df['expiry'].min()
        latest_df = latest_df[latest_df['expiry'] == nearest_expiry]
        
    if latest_df.empty:
        return {}
        
    # PERFORMANCE OPTIMIZATION FOR DEMO:
    # Limit strikes to +/- 1500 from spot close to keep 3D Liquidity Chart smooth
    current_spot = latest_df['spot_close'].iloc[-1] if 'spot_close' in latest_df.columns else 0
    if current_spot > 0:
        latest_df = latest_df[(latest_df['strike'] > current_spot - 1500) & (latest_df['strike'] < current_spot + 1500)].copy()
        
    # Aggregate Total OI
    latest_df['total_oi'] = latest_df['oi_CE'] + latest_df['oi_PE']
    
    # Create the 3D Matrix: Y=Time (rows), X=Strike (columns)
    latest_df['time_str'] = latest_df['datetime'].astype(str).str.slice(11, 16) # extract HH:MM
    
    # Pivot into the XYZ cartesian matrix format
    oi_matrix = latest_df.pivot_table(index='time_str', columns='strike', values='total_oi', aggfunc='sum').fillna(0)
    
    times = oi_matrix.index.tolist()
    strikes = oi_matrix.columns.tolist()
    z_oi = oi_matrix.values.tolist()
    
    # Capture the Spot History to overlay an ATM line on the 3D surface
    spot_series = latest_df.groupby('time_str')['spot_close'].last().reindex(times).ffill().fillna(0)
    
    return {
        "x_strikes": strikes,
        "y_times": times,
        "z_oi": z_oi,
        "spot_history": spot_series.tolist()
    }
