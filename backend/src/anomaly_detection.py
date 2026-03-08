import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

def detect_anomalies(df: pd.DataFrame, contamination: float = 0.05) -> pd.DataFrame:
    """
    Detects unusual options activity using Isolation Forest from scikit-learn.
    
    Args:
        df (pd.DataFrame): Dataframe containing options data.
        contamination (float): The proportion of outliers in the data set.
        
    Returns:
        pd.DataFrame: Dataframe with an 'anomaly' column (-1 for anomaly, 1 for normal).
    """
    if df.empty or len(df) < 5:
        # Not enough data to train an ML model
        df['anomaly'] = 1
        return df
        
    features = ['volume_CE', 'volume_PE', 'oi_CE', 'oi_PE']
    
    # Ensure features exist
    if not all(col in df.columns for col in features):
        df['anomaly'] = 1
        return df

    X = df[features].copy()
    
    # Normalize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train IsolationForest model
    # random_state ensures reproducibility
    model = IsolationForest(contamination=contamination, random_state=42)
    model.fit(X_scaled)
    
    # Detect unusual activity
    predictions = model.predict(X_scaled)
    
    # Mark rows as anomaly (-1) or normal (1)
    df['anomaly'] = predictions
    
    return df
