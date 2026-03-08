import pandas as pd
import numpy as np

def detect_unusual_activity(df: pd.DataFrame, z_threshold: float = 3.0) -> list:
    """
    Detects unusual intraday spikes in Volume or Open Interest using Z-Scores.
    Returns a list of alerts formatted for UI.
    """
    if df.empty or 'datetime' not in df.columns:
        return []
        
    alerts = []
    
    # Sort chronologically
    df_sorted = df.sort_values(by=['expiry', 'strike', 'datetime']).copy()
    
    # Calculate difference over time per strike
    df_sorted['vol_CE_diff'] = df_sorted.groupby(['expiry', 'strike'])['volume_CE'].diff().fillna(0)
    df_sorted['vol_PE_diff'] = df_sorted.groupby(['expiry', 'strike'])['volume_PE'].diff().fillna(0)
    df_sorted['oi_CE_diff'] = df_sorted.groupby(['expiry', 'strike'])['oi_CE'].diff().fillna(0)
    df_sorted['oi_PE_diff'] = df_sorted.groupby(['expiry', 'strike'])['oi_PE'].diff().fillna(0)
    
    # Calculate Z-scores 
    for col in ['vol_CE_diff', 'vol_PE_diff', 'oi_CE_diff', 'oi_PE_diff']:
        mean = df_sorted[col].mean()
        std = df_sorted[col].std()
        if std > 0:
            df_sorted[f'{col}_z'] = (df_sorted[col] - mean) / std
        else:
            df_sorted[f'{col}_z'] = 0
            
    # Filter for unusual spikes at the latest timestamp
    latest_time = df_sorted['datetime'].max()
    latest_df = df_sorted[df_sorted['datetime'] == latest_time]
    
    spike_candidates = latest_df[
        (latest_df['vol_CE_diff_z'] > z_threshold) |
        (latest_df['vol_PE_diff_z'] > z_threshold) |
        (latest_df['oi_CE_diff_z'] > z_threshold) |
        (latest_df['oi_PE_diff_z'] > z_threshold)
    ]
    
    for _, row in spike_candidates.iterrows():
        strike = row['strike']
        time_str = str(row['datetime'].time())
        expiry_str = str(row['expiry'].date())
        
        if row['vol_CE_diff_z'] > z_threshold:
            alerts.append({"type": "Volume Spike", "strike": strike, "option": "CE", "value": f"+{int(row['vol_CE_diff'])}", "expiry": expiry_str, "time": time_str})
        if row['vol_PE_diff_z'] > z_threshold:
            alerts.append({"type": "Volume Spike", "strike": strike, "option": "PE", "value": f"+{int(row['vol_PE_diff'])}", "expiry": expiry_str, "time": time_str})
        if row['oi_CE_diff_z'] > z_threshold:
            alerts.append({"type": "OI Spike", "strike": strike, "option": "CE", "value": f"+{int(row['oi_CE_diff'])}", "expiry": expiry_str, "time": time_str})
        if row['oi_PE_diff_z'] > z_threshold:
            alerts.append({"type": "OI Spike", "strike": strike, "option": "PE", "value": f"+{int(row['oi_PE_diff'])}", "expiry": expiry_str, "time": time_str})

    return alerts
