import pandas as pd
import numpy as np

import glob
import os

def load_options_data(filepath_pattern: str) -> pd.DataFrame:
    """
    Loads options datasets from a file or glob pattern, preprocesses timestamps, 
    handles missing values, and sorts chronologically.
    
    Args:
        filepath_pattern (str): Path or glob pattern to the options data CSV(s).
        
    Returns:
        pd.DataFrame: Cleaned, concatenated, and sorted dataframe.
    """
    try:
        # Resolve all matching files
        if '*' in filepath_pattern or '?' in filepath_pattern:
            files = glob.glob(filepath_pattern)
        elif os.path.isdir(filepath_pattern):
            files = glob.glob(os.path.join(filepath_pattern, "*.csv"))
        else:
            files = [filepath_pattern]
            
        if not files:
            print(f"Error: No files found matching {filepath_pattern}")
            return pd.DataFrame()
            
        # Load and concatenate all datasets
        dfs = []
        for file in files:
            try:
                df = pd.read_csv(file)
                dfs.append(df)
            except Exception as e:
                print(f"Error reading {file}: {e}")
                
        if not dfs:
            return pd.DataFrame()
            
        df = pd.concat(dfs, ignore_index=True)
        
        # Convert datetime columns
        if 'datetime' in df.columns:
            df['datetime'] = pd.to_datetime(df['datetime'])
        if 'expiry' in df.columns:
            df['expiry'] = pd.to_datetime(df['expiry'])
            
        # Handle missing values: 
        # Fill numeric NaNs with 0 (since missing volume/OI usually means 0)
        numeric_cols = ['spot_close', 'strike', 'oi_CE', 'oi_PE', 'volume_CE', 'volume_PE', 'ATM', 'CE', 'PE']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].fillna(0)
                
        # Forward-fill spot_close if missing across sequential rows
        if 'spot_close' in df.columns:
            df['spot_close'] = df['spot_close'].replace(0, np.nan).ffill().fillna(0)
            
        # Sort chronologically
        if 'datetime' in df.columns:
            df = df.sort_values(by=['datetime', 'expiry', 'strike']).reset_index(drop=True)
            
        return df
        
    except Exception as e:
        print(f"Error loading data: {e}")
        return pd.DataFrame()

if __name__ == "__main__":
    # Test the loader
    test_df = load_options_data("../data/options_data.csv")
    print(f"Loaded DataFrame with shape: {test_df.shape}")
    if not test_df.empty:
        print(test_df.head())
