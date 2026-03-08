import pandas as pd

def generate_activity_heatmap(df: pd.DataFrame) -> dict:
    """
    Groups options dataset by Strike and Expiry to create a 2D matrix 
    for heatmap visualizing Open Interest and Volume.
    """
    if df.empty or 'strike' not in df.columns or 'expiry' not in df.columns:
        return {}

    # We want the latest snapshot per expiry and strike
    # Sort chronologically and drop duplicates keeping the last
    latest_df = df.sort_values('datetime').drop_duplicates(subset=['expiry', 'strike'], keep='last')

    # Pivot table to get Expiry (Y-axis) vs Strike (X-axis) for OI
    oi_ce_matrix = latest_df.pivot(index='expiry', columns='strike', values='oi_CE').fillna(0)
    oi_pe_matrix = latest_df.pivot(index='expiry', columns='strike', values='oi_PE').fillna(0)
    vol_ce_matrix = latest_df.pivot(index='expiry', columns='strike', values='volume_CE').fillna(0)
    vol_pe_matrix = latest_df.pivot(index='expiry', columns='strike', values='volume_PE').fillna(0)

    # Format for Plotly Heatmap: list of z arrays, x axis (strikes), y axis (expiries)
    # We serialize datetime to string for JSON
    expiries = [str(x)[:10] for x in oi_ce_matrix.index.tolist()]
    strikes = oi_ce_matrix.columns.tolist()

    return {
        "x_strikes": strikes,
        "y_expiries": expiries,
        "z_oi_CE": oi_ce_matrix.values.tolist(),
        "z_oi_PE": oi_pe_matrix.values.tolist(),
        "z_vol_CE": vol_ce_matrix.values.tolist(),
        "z_vol_PE": vol_pe_matrix.values.tolist()
    }
