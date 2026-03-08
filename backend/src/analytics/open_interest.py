"""Open Interest cluster detection and analysis."""

from __future__ import annotations
from typing import Dict
import pandas as pd


def analyze_open_interest(df: pd.DataFrame) -> Dict:
    """
    Detect strikes with highest open interest.
    Returns top OI levels, call/put concentration, and chart data.
    """
    # Use latest snapshot per strike
    latest = df.sort_values("datetime").groupby("strike").last().reset_index()

    strikes = latest["strike"].tolist()
    oi_ce = latest["oi_CE"].fillna(0).astype(int).tolist()
    oi_pe = latest["oi_PE"].fillna(0).astype(int).tolist()

    # Top 5 call OI and put OI strikes
    top_call_oi = latest.nlargest(5, "oi_CE")[["strike", "oi_CE"]]
    top_put_oi = latest.nlargest(5, "oi_PE")[["strike", "oi_PE"]]

    total_ce = latest["oi_CE"].sum()
    total_pe = latest["oi_PE"].sum()
    total = total_ce + total_pe
    call_pct = round(total_ce / total * 100, 1) if total > 0 else 50.0
    put_pct = round(total_pe / total * 100, 1) if total > 0 else 50.0

    top_ce_strike = int(top_call_oi.iloc[0]["strike"])
    top_ce_val = int(top_call_oi.iloc[0]["oi_CE"])
    top_pe_strike = int(top_put_oi.iloc[0]["strike"])
    top_pe_val = int(top_put_oi.iloc[0]["oi_PE"])

    answer = (
        f"Highest Call OI at {top_ce_strike:,} ({top_ce_val:,} contracts) "
        f"and highest Put OI at {top_pe_strike:,} ({top_pe_val:,} contracts). "
        f"Call/Put OI split: {call_pct}% / {put_pct}%."
    )

    insights = [
        f"Max Call OI: {top_ce_strike:,} with {top_ce_val:,} contracts",
        f"Max Put OI: {top_pe_strike:,} with {top_pe_val:,} contracts",
        f"Call OI concentration: {call_pct}%",
        f"Put OI concentration: {put_pct}%",
        f"Total Open Interest: {total:,} contracts",
    ]

    chart_data = {
        "strikes": strikes,
        "call_oi": oi_ce,
        "put_oi": oi_pe,
    }

    sentiment = "bullish" if call_pct > put_pct + 10 else "bearish" if put_pct > call_pct + 10 else "neutral"

    return {
        "answer": answer,
        "chart_type": "bar",
        "chart_data": chart_data,
        "insights": insights,
        "sentiment": sentiment,
        "support": top_pe_strike,
        "resistance": top_ce_strike,
    }
