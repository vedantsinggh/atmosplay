import pandas as pd
import requests
from geopy.geocoders import Nominatim
from datetime import datetime
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# ================= CONFIG =================
INPUT_CSV = "input.csv"
OUTPUT_CSV = "enriched_output.csv"

AQI_KEYS = [
    "KEY_1",
    "KEY_2",
    "KEY_3",
    "KEY_4",
    "KEY_5"
]
# ==========================================


# ---------- Load Top 1000 Rows ----------
df = pd.read_csv(INPUT_CSV).head(1000).reset_index(drop=True)

# ---------- Geocoder with Cache ----------
geolocator = Nominatim(user_agent="stadium_weather_app")
venue_cache = {}

def get_lat_lon(venue):
    if venue in venue_cache:
        return venue_cache[venue]

    location = geolocator.geocode(venue)
    if location:
        coords = (location.latitude, location.longitude)
        venue_cache[venue] = coords
        time.sleep(1)
        return coords
    return (None, None)


# ---------- Weather ----------
def get_weather(lat, lon, date, time_str):
    dt = datetime.strptime(f"{date} {time_str}", "%Y-%m-%d %H:%M")
    hour = dt.hour

    url = (
        f"https://archive-api.open-meteo.com/v1/archive?"
        f"latitude={lat}&longitude={lon}"
        f"&start_date={date}&end_date={date}"
        f"&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    )

    r = requests.get(url, timeout=10)
    data = r.json()

    try:
        return (
            data["hourly"]["temperature_2m"][hour],
            data["hourly"]["relative_humidity_2m"][hour],
            data["hourly"]["wind_speed_10m"][hour]
        )
    except:
        return (None, None, None)


# ---------- AQI ----------
def get_aqi(lat, lon, token):
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={token}"
    r = requests.get(url, timeout=10)
    data = r.json()

    if data.get("status") == "ok":
        return data["data"].get("aqi")
    return None


# ---------- Worker Function ----------
def process_batch(batch_df, api_key):
    results = []

    for _, row in batch_df.iterrows():
        venue = row["venue"]
        date = row["full_date"]
        time_str = row["match_start_time_estimated"]

        lat, lon = get_lat_lon(venue)

        if lat is not None and lon is not None:
            temp, humidity, wind = get_weather(lat, lon, date, time_str)
            aqi = get_aqi(lat, lon, api_key)
        else:
            temp, humidity, wind, aqi = None, None, None, None

        enriched_row = row.to_dict()
        enriched_row.update({
            "latitude": lat,
            "longitude": lon,
            "temperature_C": temp,
            "humidity_%": humidity,
            "wind_speed_kmh": wind,
            "AQI": aqi
        })

        results.append(enriched_row)

    return results


# ---------- Split into 5 Batches ----------
batch_size = 200
batches = [df[i:i + batch_size] for i in range(0, 1000, batch_size)]


# ---------- Parallel Execution ----------
final_results = []

with ThreadPoolExecutor(max_workers=5) as executor:
    futures = []

    for i in range(5):
        futures.append(
            executor.submit(process_batch, batches[i], AQI_KEYS[i])
        )

    for future in as_completed(futures):
        final_results.extend(future.result())


# ---------- Save ----------
final_df = pd.DataFrame(final_results)
final_df.to_csv(OUTPUT_CSV, index=False)

print("Parallel enrichment completed successfully.")
