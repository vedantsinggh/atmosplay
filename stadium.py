import pandas as pd
from geopy.geocoders import Nominatim
import time

INPUT_CSV = "input.csv"
OUTPUT_MASTER = "stadium_master.csv"

df = pd.read_csv(INPUT_CSV)

# Get unique venues
venues = df["venue"].dropna().unique()

geolocator = Nominatim(user_agent="atmosplay_stadium_builder")

records = []

for venue in venues:
    try:
        # Add country fallback automatically
        query = f"{venue}"
        location = geolocator.geocode(query, timeout=10)

        if location is None:
            print(f"Retrying with country hint for: {venue}")
            location = geolocator.geocode(f"{venue}, Bangladesh", timeout=10)

        if location:
            print(f"✓ Found: {venue}")
            records.append({
                "venue": venue,
                "latitude": location.latitude,
                "longitude": location.longitude
            })
        else:
            print(f"✗ Not found: {venue}")
            records.append({
                "venue": venue,
                "latitude": None,
                "longitude": None
            })

        time.sleep(1)  # Respect Nominatim rate limit

    except Exception as e:
        print(f"Error for {venue}: {e}")
        records.append({
            "venue": venue,
            "latitude": None,
            "longitude": None
        })

# Save master file
master_df = pd.DataFrame(records)
master_df.to_csv(OUTPUT_MASTER, index=False)

print("stadium_master.csv created.")
