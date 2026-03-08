import pandas as pd

def calculate_master_sentiment(df: pd.DataFrame) -> dict:
    """
    Computes a single continuous master sentiment score ranging from -1.0 (Extreme Bearish) 
    to +1.0 (Extreme Bullish).
    """
    if df.empty:
        return {"score": 0.0, "label": "Neutral"}
        
    latest_df = df.sort_values('datetime').drop_duplicates(subset=['expiry', 'strike'], keep='last').copy()
    
    if latest_df.empty:
        return {"score": 0.0, "label": "Neutral"}
        
    total_vol_ce = latest_df['volume_CE'].sum()
    total_vol_pe = latest_df['volume_PE'].sum()
    pcr_vol = total_vol_pe / max(total_vol_ce, 1)
    
    total_oi_ce = latest_df['oi_CE'].sum()
    total_oi_pe = latest_df['oi_PE'].sum()
    pcr_oi = total_oi_pe / max(total_oi_ce, 1)
    
    # Scoring math
    # High PCR usually means bearish sentiment
    score = 0.0
    score -= (pcr_oi - 0.9) * 2.0 
    score -= (pcr_vol - 0.9) * 1.5
    
    # Cap between -1.0 and 1.0
    score = max(min(score, 1.0), -1.0)
    
    # Label logic
    if score > 0.6:
        label = "Extreme Bullish"
    elif score > 0.2:
        label = "Bullish"
    elif score > -0.2:
        label = "Neutral"
    elif score > -0.6:
        label = "Bearish"
    else:
        label = "Extreme Bearish"
        
    return {
        "score": round(score, 2),
        "label": label,
        "pcr_oi": round(pcr_oi, 2),
        "pcr_vol": round(pcr_vol, 2)
    }
