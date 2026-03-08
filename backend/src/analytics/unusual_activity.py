"""Unusual options activity detection via volume/OI ratio."""

from __future__ import annotations
from typing import Dict
import pandas as pd
import numpy as np


UNUSUAL_THRESHOLD = 1.5  # volume/OI ratio threshold


def detect_unusual_activity(df: pd.DataFrame) -> Dict:
    """
    Detect abnormal volume spikes using volume / open_interest ratio.
    Flags strikes where ratio exceeds threshold.
    """
    latest = df.sort_values("datetime").groupby("strike").last().reset_index()

    latest = latest.copy()
    # Compute volume/OI ratios for calls and puts
    latest["vol_oi_ce"] = latest["volume_CE"] / latest["oi_CE"].replace(0, np.nan)
    latest["vol_oi_pe"] = latest["volume_PE"] / latest["oi_PE"].replace(0, np.nan)

    unusual = []

    # Check calls
    mask_ce = latest["vol_oi_ce"] > UNUSUAL_THRESHOLD
    for _, row in latest[mask_ce].iterrows():
        unusual.append({
            "strike": int(row["strike"]),
            "option_type": "CALL",
            "volume": int(row["volume_CE"]),
            "open_interest": int(row["oi_CE"]),
            "ratio": round(float(row["vol_oi_ce"]), 2),
        })

    # Check puts
    mask_pe = latest["vol_oi_pe"] > UNUSUAL_THRESHOLD
    for _, row in latest[mask_pe].iterrows():
        unusual.append({
            "strike": int(row["strike"]),
            "option_type": "PUT",
            "volume": int(row["volume_PE"]),
            "open_interest": int(row["oi_PE"]),
            "ratio": round(float(row["vol_oi_pe"]), 2),
        })

    # Sort by ratio descending
    unusual.sort(key=lambda x: x["ratio"], reverse=True)
    top = unusual[:15]

    if top:
        t = top[0]
        answer = (
            f"Unusual activity detected! Top spike: {t['strike']:,} {t['option_type']} "
            f"with volume/OI ratio of {t['ratio']:.2f} "
            f"({t['volume']:,} volume vs {t['open_interest']:,} OI). "
            f"Found {len(unusual)} anomalous contracts above {UNUSUAL_THRESHOLD}x threshold."
        )
    else:
        answer = f"No significant unusual activity detected (threshold: {UNUSUAL_THRESHOLD}x volume/OI)."

    insights = [f"Total unusual contracts: {len(unusual)}"]
    for t in top[:5]:
        insights.append(
            f"{t['strike']:,} {t['option_type']}: ratio={t['ratio']:.2f} "
            f"(vol={t['volume']:,}, oi={t['open_interest']:,})"
        )

    # Chart: scatter plot of unusual trades
    chart_data = {
        "unusual_trades": [
            {
                "strike": t["strike"],
                "option_type": t["option_type"],
                "volume": t["volume"],
                "z_score": t["ratio"],  # reuse z_score field for frontend compat
            }
            for t in top
        ]
    }

    support_row = latest.loc[latest["oi_PE"].idxmax()]
    resistance_row = latest.loc[latest["oi_CE"].idxmax()]

    return {
        "answer": answer,
        "chart_type": "scatter",
        "chart_data": chart_data,
        "insights": insights,
        "sentiment": "bullish" if sum(1 for t in top[:5] if t["option_type"] == "CALL") >= 3 else "neutral",
        "support": int(support_row["strike"]),
        "resistance": int(resistance_row["strike"]),
    }
