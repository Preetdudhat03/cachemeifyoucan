"""
OptionsAnalyticsService – lightweight orchestrator.
Refactored for OptionSight AI main platform.
"""

from __future__ import annotations
import re
from typing import Dict, Optional
import pandas as pd

from src.analytics.open_interest import analyze_open_interest
from src.analytics.support_resistance import detect_support_resistance
from src.analytics.unusual_activity import detect_unusual_activity
from src.analytics.sentiment import analyze_sentiment
from src.analytics.gamma_exposure import estimate_gamma_exposure

# ──────────────────────────────────────────────
# Query classification
# ──────────────────────────────────────────────

_PATTERNS: list[tuple[str, str]] = [
    # support / resistance / walls
    (r"support|resistance|level|key.?level", "support_resistance"),
    (r"call.?wall|put.?wall|wall", "support_resistance"),
    # unusual activity
    (r"unusual|abnormal|anomal|spike|whale", "unusual_activity"),
    # sentiment
    (r"sentiment|bullish|bearish|pcr|put.?call.?ratio", "sentiment"),
    # gamma exposure
    (r"gamma|gex|exposure|hedg", "gamma_exposure"),
    # volume analysis
    (r"volume|traded|liquidity", "sentiment"),
    # open interest
    (r"open.?interest|oi|concentration|cluster|buildup|highest.?oi", "open_interest"),
]


def classify_query(query: str) -> str:
    """Map a natural-language query to an analytics function name."""
    q = query.lower().strip()
    for pattern, category in _PATTERNS:
        if re.search(pattern, q):
            return category
    return "open_interest"


# ──────────────────────────────────────────────
# Orchestrator
# ──────────────────────────────────────────────

class OptionsAnalyticsService:
    """Thin orchestrator – holds the dataset and routes queries."""

    def __init__(self, dataset: Optional[pd.DataFrame] = None):
        if dataset is not None:
            self.dataset = dataset
        else:
            self.dataset = pd.DataFrame()

    def process_query(self, query: str, df_override: Optional[pd.DataFrame] = None) -> Dict:
        """
        Classify → analyse → return standardised response.
        """
        df = df_override if df_override is not None else self.dataset
        
        if df.empty:
            return self._empty_response(query)

        category = classify_query(query)

        dispatch = {
            "open_interest": analyze_open_interest,
            "support_resistance": detect_support_resistance,
            "unusual_activity": detect_unusual_activity,
            "sentiment": analyze_sentiment,
            "gamma_exposure": estimate_gamma_exposure,
        }

        fn = dispatch.get(category, analyze_open_interest)
        result: Dict = fn(df)

        # Guarantee all required keys
        result.setdefault("answer", "Analysis complete.")
        result.setdefault("chart_type", None)
        result.setdefault("chart_data", {})
        result.setdefault("insights", [])
        result.setdefault("sentiment", "neutral")
        result.setdefault("support", None)
        result.setdefault("resistance", None)

        return result

    @staticmethod
    def _empty_response(query: str) -> Dict:
        return {
            "answer": "No dataset loaded. Please sync data first.",
            "chart_type": None,
            "chart_data": {},
            "insights": ["No data available"],
            "sentiment": "neutral",
            "support": None,
            "resistance": None,
        }
