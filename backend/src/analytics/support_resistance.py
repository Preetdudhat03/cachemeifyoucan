"""Support / Resistance and Call Wall / Put Wall detection."""

from __future__ import annotations
from typing import Dict
import pandas as pd


def detect_support_resistance(df: pd.DataFrame) -> Dict:
    """
    Support  = strike with highest PUT open interest (put wall).
    Resistance = strike with highest CALL open interest (call wall).
    Also returns secondary levels and ATM.
    """
    latest = df.sort_values("datetime").groupby("strike").last().reset_index()

    strikes = latest["strike"].tolist()
    oi_ce = latest["oi_CE"].fillna(0).astype(int).tolist()
    oi_pe = latest["oi_PE"].fillna(0).astype(int).tolist()

    # Primary levels
    resistance_row = latest.loc[latest["oi_CE"].idxmax()]
    support_row = latest.loc[latest["oi_PE"].idxmax()]
    resistance = int(resistance_row["strike"])
    support = int(support_row["strike"])

    # Call wall = top 3 call OI clusters
    call_walls = latest.nlargest(3, "oi_CE")[["strike", "oi_CE"]]
    put_walls = latest.nlargest(3, "oi_PE")[["strike", "oi_PE"]]

    # ATM
    atm = int(latest["ATM"].iloc[0]) if "ATM" in latest.columns else strikes[len(strikes) // 2]

    answer = (
        f"Resistance at {resistance:,} (Call Wall – {int(resistance_row['oi_CE']):,} OI). "
        f"Support at {support:,} (Put Wall – {int(support_row['oi_PE']):,} OI). "
        f"ATM: {atm:,}."
    )

    insights = [
        f"Primary Resistance (Call Wall): {resistance:,}",
        f"Primary Support (Put Wall): {support:,}",
        f"ATM Strike: {atm:,}",
    ]
    for _, row in call_walls.iterrows():
        insights.append(f"Call Wall: {int(row['strike']):,} ({int(row['oi_CE']):,} OI)")
    for _, row in put_walls.iterrows():
        insights.append(f"Put Wall: {int(row['strike']):,} ({int(row['oi_PE']):,} OI)")

    chart_data = {
        "strikes": strikes,
        "call_oi": oi_ce,
        "put_oi": oi_pe,
        "support_levels": put_walls["strike"].astype(int).tolist(),
        "resistance_levels": call_walls["strike"].astype(int).tolist(),
    }

    sentiment = "bullish" if support < resistance else "neutral"

    return {
        "answer": answer,
        "chart_type": "line",
        "chart_data": chart_data,
        "insights": insights,
        "sentiment": sentiment,
        "support": support,
        "resistance": resistance,
    }
