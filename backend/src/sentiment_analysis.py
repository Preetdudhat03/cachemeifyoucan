import pandas as pd
from typing import Dict, Any

def get_market_sentiment(pcr: float) -> str:
    """
    Determine market sentiment based on Put-Call Ratio (PCR).
    
    Args:
        pcr (float): The calculated overall Put-Call Ratio.
        
    Returns:
        str: "bullish", "neutral", or "bearish".
    """
    if pcr < 0.7:
        return "bullish"
    elif pcr > 1.3:
        return "bearish"
    else:
        return "neutral"

def find_support_resistance(df: pd.DataFrame) -> tuple:
    """
    Determine Support and Resistance levels based on Open Interest.
    Support level = strike with highest Put OI
    Resistance level = strike with highest Call OI
    
    Args:
        df (pd.DataFrame): The options dataframe.
        
    Returns:
        tuple: (support_strike, resistance_strike)
    """
    if df.empty:
        return None, None
        
    # Find strike with max Put OI for Support
    max_pe_idx = df['oi_PE'].idxmax()
    support = df.loc[max_pe_idx, 'strike']
    
    # Find strike with max Call OI for Resistance
    max_ce_idx = df['oi_CE'].idxmax()
    resistance = df.loc[max_ce_idx, 'strike']
    
    return support, resistance

def analyze_sentiment(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Analyzes the entire dataframe to extract market sentiment and key levels.
    """
    if df.empty:
        return {}
        
    # Calculate overall PCR
    total_put_oi = df['oi_PE'].sum()
    total_call_oi = df['oi_CE'].sum()
    pcr = total_put_oi / total_call_oi if total_call_oi > 0 else 1.0
    
    sentiment = get_market_sentiment(pcr)
    support, resistance = find_support_resistance(df)
    
    return {
        "pcr": float(round(pcr, 2)),
        "sentiment": sentiment,
        "support": int(support) if support is not None else 0,
        "resistance": int(resistance) if resistance is not None else 0
    }
