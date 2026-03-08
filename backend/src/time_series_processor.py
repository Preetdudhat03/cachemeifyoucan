import pandas as pd

def get_time_evolution_frames(df: pd.DataFrame, target_expiry: str = None) -> list:
    """
    Returns data formatted as frames for animating the options chain evolution over the day.
    Each frame contains the state of the chain at a specific timestamp.
    """
    if df.empty or 'datetime' not in df.columns:
        return []
        
    latest_df = df.sort_values(by=['datetime', 'strike']).copy()
    
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
        return []
        
    frames = []
    
    # Group by continuous timestamps
    grouped = latest_df.groupby('datetime')
    
    for dt, group in grouped:
        frame = {
            "timestamp": str(dt.time())[:5],  # HH:MM format
            "spot": float(group['spot_close'].iloc[0]) if 'spot_close' in group.columns else 0.0,
            "strikes": group['strike'].tolist(),
            "oi_ce": group['oi_CE'].tolist(),
            "oi_pe": group['oi_PE'].tolist(),
            "vol_ce": group['volume_CE'].tolist(),
            "vol_pe": group['volume_PE'].tolist()
        }
        frames.append(frame)
        
    return frames
