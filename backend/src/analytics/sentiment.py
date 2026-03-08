"""Options market sentiment analysis."""

from __future__ import annotations
from typing import Dict
import pandas as pd


def analyze_sentiment(df: pd.DataFrame) -> Dict:
    """
    Calculate market sentiment using:
      - call_volume vs put_volume
      - call_OI vs put_OI
    Returns bullish / bearish / neutral with supporting metrics.
    """
    latest = df.sort_values("datetime").groupby("strike").last().reset_index()

    total_vol_ce = int(latest["volume_CE"].sum())
    total_vol_pe = int(latest["volume_PE"].sum())
    total_oi_ce = int(latest["oi_CE"].sum())
    total_oi_pe = int(latest["oi_PE"].sum())

    # Put-Call Ratios
    pcr_volume = round(total_vol_pe / max(total_vol_ce, 1), 2)
    pcr_oi = round(total_oi_pe / max(total_oi_ce, 1), 2)

    # Sentiment scoring: PCR < 0.7 → bullish, > 1.2 → bearish
    score = 0
    if pcr_volume < 0.7:
        score += 1
    elif pcr_volume > 1.2:
        score -= 1
    if pcr_oi < 0.7:
        score += 1
    elif pcr_oi > 1.2:
        score -= 1

    if score >= 1:
        sentiment = "bullish"
    elif score <= -1:
        sentiment = "bearish"
    else:
        sentiment = "neutral"

    answer = (
        f"Market sentiment: {sentiment.upper()}. "
        f"PCR (Volume): {pcr_volume} | PCR (OI): {pcr_oi}. "
        f"Call volume: {total_vol_ce:,} vs Put volume: {total_vol_pe:,}. "
        f"Call OI: {total_oi_ce:,} vs Put OI: {total_oi_pe:,}."
    )

    insights = [
        f"Sentiment: {sentiment.upper()}",
        f"Put-Call Ratio (Volume): {pcr_volume}",
        f"Put-Call Ratio (OI): {pcr_oi}",
        f"Total Call Volume: {total_vol_ce:,}",
        f"Total Put Volume: {total_vol_pe:,}",
        f"Total Call OI: {total_oi_ce:,}",
        f"Total Put OI: {total_oi_pe:,}",
    ]

    strikes = latest["strike"].tolist()
    chart_data = {
        "strikes": strikes,
        "call_volume": latest["volume_CE"].fillna(0).astype(int).tolist(),
        "put_volume": latest["volume_PE"].fillna(0).astype(int).tolist(),
    }

    support_row = latest.loc[latest["oi_PE"].idxmax()]
    resistance_row = latest.loc[latest["oi_CE"].idxmax()]

    return {
        "answer": answer,
        "chart_type": "bar",
        "chart_data": chart_data,
        "insights": insights,
        "sentiment": sentiment,
        "support": int(support_row["strike"]),
        "resistance": int(resistance_row["strike"]),
    }
