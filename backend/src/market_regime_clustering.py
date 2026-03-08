import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np

def detect_market_regimes(df: pd.DataFrame) -> dict:
    """
    Unsupervised KMeans Clustering to automatically classify market behaviors 
    over time.
    """
    if df.empty or 'datetime' not in df.columns:
        return {}

    # Aggregate by timestamp to get market-wide features per timestep
    time_df = df.groupby('datetime').agg({
        'volume_CE': 'sum',
        'volume_PE': 'sum',
        'oi_CE': 'sum',
        'oi_PE': 'sum',
        'spot_close': 'last'
    }).copy()
    
    # Calculate structural features
    time_df['pcr_vol'] = time_df['volume_PE'] / time_df['volume_CE'].replace(0, 1)
    time_df['pcr_oi'] = time_df['oi_PE'] / time_df['oi_CE'].replace(0, 1)
    time_df['oi_change'] = (time_df['oi_CE'] + time_df['oi_PE']).diff().fillna(0)
    time_df['vol_change'] = (time_df['volume_CE'] + time_df['volume_PE']).diff().fillna(0)
    
    time_df = time_df.fillna(0)
    
    features = ['pcr_vol', 'pcr_oi', 'oi_change', 'vol_change']
    X = time_df[features].copy()
    
    if len(X) < 4:
        return {"current_regime": "Gathering Data", "history": []}
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # K-Means clustering with 4 distinct clusters
    model = KMeans(n_clusters=4, random_state=42, n_init=10)
    clusters = model.fit_predict(X_scaled)
    
    time_df['regime_cluster'] = clusters
    
    # Map clusters to narrative labels.
    regime_map = {
        0: "Accumulation Phase",
        1: "Breakout Activity",
        2: "Bearish Positioning",
        3: "Neutral Market"
    }
    
    time_df['regime_label'] = time_df['regime_cluster'].map(regime_map)
    
    # Extract historical timeline format
    history = []
    for idx, row in time_df.iterrows():
        history.append({
            "time": str(idx.time()),
            "regime": row['regime_label'],
            "cluster": int(row['regime_cluster'])
        })
        
    current_regime = time_df['regime_label'].iloc[-1]
    
    return {
        "current_regime": current_regime,
        "history": history
    }
