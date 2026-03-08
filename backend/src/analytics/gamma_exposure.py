"""Simplified Gamma Exposure (GEX) estimation."""

from __future__ import annotations
from typing import Dict
import pandas as pd


def estimate_gamma_exposure(df: pd.DataFrame) -> Dict:
    """
    Estimate gamma exposure per strike.
    Since gamma is not in the dataset, approximate with:
        gamma_exposure ≈ open_interest * volume
    Higher values indicate strikes where market-maker hedging is most intense.
    """
    latest = df.sort_values("datetime").groupby("strike").last().reset_index()

    latest = latest.copy()
    latest["gex_ce"] = latest["oi_CE"].fillna(0) * latest["volume_CE"].fillna(0)
    latest["gex_pe"] = latest["oi_PE"].fillna(0) * latest["volume_PE"].fillna(0)
    latest["gex_total"] = latest["gex_ce"] + latest["gex_pe"]

    # Top 10 gamma exposure strikes
    top_gex = latest.nlargest(10, "gex_total")

    strikes = latest["strike"].tolist()
    gex_values = latest["gex_total"].astype(float).tolist()
    labels = [f"{int(s)}" for s in strikes]

    top_strike = int(top_gex.iloc[0]["strike"])
    top_val = float(top_gex.iloc[0]["gex_total"])

    answer = (
        f"Highest estimated Gamma Exposure at {top_strike:,} "
        f"(GEX: {top_val:,.0f}). "
        f"Top strikes indicate where market-maker hedging activity is most concentrated."
    )

    insights = [f"Top GEX: {top_strike:,} (GEX={top_val:,.0f})"]
    for _, row in top_gex.head(5).iterrows():
        insights.append(
            f"Strike {int(row['strike']):,}: "
            f"Call GEX={int(row['gex_ce']):,}, Put GEX={int(row['gex_pe']):,}"
        )

    chart_data = {
        "strikes": strikes,
        "gamma_values": gex_values,
        "labels": labels,
        "call_oi": latest["oi_CE"].fillna(0).astype(int).tolist(),
        "put_oi": latest["oi_PE"].fillna(0).astype(int).tolist(),
    }

    support_row = latest.loc[latest["oi_PE"].idxmax()]
    resistance_row = latest.loc[latest["oi_CE"].idxmax()]

    return {
        "answer": answer,
        "chart_type": "bar",
        "chart_data": chart_data,
        "insights": insights,
        "sentiment": "neutral",
        "support": int(support_row["strike"]),
        "resistance": int(resistance_row["strike"]),
    }
