import sys
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import Optional, Dict, Any, List

# Add current directory to path to import local src modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.data_loader import load_options_data
from src.feature_engineering import run_feature_engineering
from src.sentiment_analysis import analyze_sentiment
from src.anomaly_detection import detect_anomalies
from src.insights_engine import generate_insights

# New Advanced Hackathon Modules
from src.volatility_surface import generate_volatility_surface
from src.heatmap_generator import generate_activity_heatmap
from src.volatility_patterns import detect_volatility_smile
from src.sentiment_index import calculate_master_sentiment
from src.unusual_activity import detect_unusual_activity
from src.market_regime_clustering import detect_market_regimes
from src.liquidity_landscape import generate_liquidity_landscape
from src.analytics_service import OptionsAnalyticsService
from pydantic import BaseModel

app = FastAPI(title="OptionSight AI - Advanced Hackathon API")

# Setup CORS to allow Next.js frontend to communicate with it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to cache massive DataFrames in memory
PARENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PARENT_DIR, "*_exp.csv")
market_df = pd.DataFrame()
market_sentiment = {}
market_insights = []
analytics_service = OptionsAnalyticsService()

def load_data(contamination: float = 0.05):
    """Loads and processes the analytics data strictly sequentially."""
    global market_df, market_sentiment, market_insights
    
    raw_df = load_options_data(DATA_PATH)
    if raw_df.empty:
        raise HTTPException(status_code=404, detail="Data not found - Be sure to define CSVs.")
        
    df = run_feature_engineering(raw_df)
    market_sentiment = analyze_sentiment(df)
    df = detect_anomalies(df, contamination=contamination)
    market_insights = generate_insights(df, market_sentiment)
    
    market_df = df

@app.on_event("startup")
async def startup_event():
    try:
        load_data()
    except Exception as e:
        print(f"Startup error: {e}")

# ---- CORE ENDPOINTS ----

@app.get("/api/overview")
async def get_overview():
    """Returns top-level market intelligence metrics."""
    if market_df.empty:
        load_data()
    latest_spot = market_df['spot_close'].iloc[-1] if 'spot_close' in market_df.columns else 0
    return {
        "spot_price": float(latest_spot),
        **market_sentiment
    }

@app.get("/api/chain")
async def get_chain(expiry: Optional[str] = None):
    """Returns the full options chain, optionally filtered by expiry."""
    df = market_df.copy()
    if df.empty:
        return []
    if expiry and expiry != "All" and 'expiry' in df.columns:
        df['expiry_str'] = df['expiry'].astype(str)
        df = df[df['expiry_str'].str.startswith(expiry)]
    df = df.fillna(0)
    return df.to_dict(orient="records")

@app.get("/api/insights")
async def get_insights():
    return {"insights": market_insights}

@app.get("/api/anomalies")
async def get_anomalies():
    """Returns rows flagged by Isolation Forest."""
    df = market_df.copy()
    if df.empty or 'anomaly' not in df.columns:
        return []
    anomalies = df[df['anomaly'] == -1].fillna(0)
    if 'datetime' in anomalies.columns:
        anomalies['datetime'] = anomalies['datetime'].astype(str)
    if 'expiry' in anomalies.columns:
        anomalies['expiry'] = anomalies['expiry'].astype(str)
    return anomalies.to_dict(orient="records")

# ---- NEW ADVANCED HACKATHON ENDPOINTS ----

@app.get("/api/volatility-surface")
async def api_get_volatility_surface():
    """Returns coordinates mapping the 3D Black-Scholes IV Surface."""
    return generate_volatility_surface(market_df)

@app.get("/api/volatility-smile")
async def api_get_volatility_smile(expiry: Optional[str] = None):
    """Returns polynomial regression curve fitting for IV Smiles."""
    return detect_volatility_smile(market_df, target_expiry=expiry)

@app.get("/api/heatmaps")
async def api_get_heatmaps():
    """Returns 2D grid matrix of Options Activity across Strike and Expiry."""
    return generate_activity_heatmap(market_df)

@app.get("/api/sentiment-index")
async def api_get_master_sentiment():
    """Returns unified float spanning -1.0 to 1.0 mapping market psychology."""
    return calculate_master_sentiment(market_df)

@app.get("/api/unusual-activity")
async def api_get_unusual_activity():
    """Returns isolated institutional spikes via Z-Scores."""
    return detect_unusual_activity(market_df)

@app.get("/api/market-regime")
async def api_get_market_regimes():
    """Returns K-Means unsupervised clustering of the current operating phase."""
    return detect_market_regimes(market_df)

@app.get("/api/liquidity-landscape")
async def api_get_liquidity_landscape(expiry: Optional[str] = None):
    """Returns the magnificent 3D Strike-Time liquidity matrix."""
    return generate_liquidity_landscape(market_df, target_expiry=expiry)

@app.post("/api/reload")
async def reload_dataset(contamination: float = 0.05):
    """Hot-reloads memory."""
    load_data(contamination=contamination)
    return {"status": "success"}

class SearchRequest(BaseModel):
    query: str

@app.post("/api/search")
async def api_search(request: SearchRequest):
    """Process natural language query and return analytics."""
    if market_df.empty:
        load_data()
    result = analytics_service.process_query(request.query, df_override=market_df)
    return result
