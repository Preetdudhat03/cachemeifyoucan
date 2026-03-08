import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_sample_options_data(filepath: str, days: int = 5, strikes_per_day: int = 20):
    """
    Generate realistic synthetic options data for testing the platform.
    """
    np.random.seed(42)
    start_date = datetime.now() - timedelta(days=days)
    
    data = []
    
    # Base configuration
    base_spot = 20000
    base_strike = 20000
    strike_interval = 50
    
    for day in range(days):
        current_date = start_date + timedelta(days=day)
        # Random walk for spot price
        spot_close = base_spot + np.random.normal(0, 100)
        base_spot = spot_close
        
        # Expiry is end of current week (assuming Friday)
        days_to_friday = (4 - current_date.weekday()) % 7
        expiry = current_date + timedelta(days=days_to_friday)
        
        # Generate strikes around the spot
        atm_strike = round(spot_close / strike_interval) * strike_interval
        start_strike = atm_strike - (strikes_per_day // 2 * strike_interval)
        
        for i in range(strikes_per_day):
            strike = start_strike + (i * strike_interval)
            
            # Simple modeling: closer to ATM = higher volume and OI
            distance = abs(strike - atm_strike)
            intensity = max(0.1, 1 - (distance / 1000))
            
            # Introduce anomaly randomly
            is_anomaly = np.random.random() < 0.02
            
            oi_ce = int(np.random.gamma(shape=2.0, scale=50000) * intensity)
            oi_pe = int(np.random.gamma(shape=2.0, scale=50000) * intensity)
            
            vol_ce = int(np.random.gamma(shape=2.0, scale=10000) * intensity)
            vol_pe = int(np.random.gamma(shape=2.0, scale=10000) * intensity)
            
            if is_anomaly:
                if np.random.random() > 0.5:
                    vol_ce *= 10  # huge call volume
                    oi_ce *= 3
                else:
                    vol_pe *= 10  # huge put volume
                    oi_pe *= 3
            
            row = {
                'datetime': current_date.strftime('%Y-%m-%d %H:%M:%S'),
                'expiry': expiry.strftime('%Y-%m-%d'),
                'strike': strike,
                'spot_close': round(spot_close, 2),
                'oi_CE': oi_ce,
                'oi_PE': oi_pe,
                'volume_CE': vol_ce,
                'volume_PE': vol_pe,
                'ATM': 1 if strike == atm_strike else 0
            }
            data.append(row)
            
    df = pd.DataFrame(data)
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    df.to_csv(filepath, index=False)
    print(f"Generated {len(df)} sample rows to {filepath}")

if __name__ == "__main__":
    generate_sample_options_data("d:/preet/codeforge-options-analytics/data/options_data.csv", days=10, strikes_per_day=30)
