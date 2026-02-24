import pandas as pd
import requests
from geopy.geocoders import Nominatim
from datetime import datetime
import time

# ========= CONFIG =========
INPUT_CSV = "input.csv"
OUTPUT_CSV = "test_enriched_output.csv"
AQI_TOKEN = "9bcb1220df1f7315aab5838ac1091ed66d0f4708"
# ==========================

# -------- Load Top 200 --------
df = pd.read_csv(INPUT_CSV).head(200).reset_index(drop=True)

# -------- Geocoder Cache --------
geolocator = Nominatim(user_agent="stadium_weather_test")
venue_cache = {}

def get_lat_lon(venue):
    if venue in venue_cache:
        return venue_cache[venue]

    location = geolocator.geocode(venue)
    if location:
        coords = (location.latitude, location.longitude)
        venue_cache[venue] = coords
        time.sleep(1)  # Respect rate limit
        return coords
    return (None, None)


# -------- Weather --------
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


# -------- AQI --------
def get_aqi(lat, lon):
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={AQI_TOKEN}"
    r = requests.get(url, timeout=10)
    data = r.json()

    if data.get("status") == "ok":
        return data["data"].get("aqi")
    return None


# -------- Process --------
results = []

for i, row in df.iterrows():
    venue = row["venue"]
    date = row["full_date"]
    time_str = row["match_start_time_estimated"]

    lat, lon = get_lat_lon(venue)

    if lat is not None and lon is not None:
        temp, humidity, wind = get_weather(lat, lon, date, time_str)
        aqi = get_aqi(lat, lon)
    else:
        temp, humidity, wind, aqi = None, None, None, None

    enriched = row.to_dict()
    enriched.update({
        "latitude": lat,
        "longitude": lon,
        "temperature_C": temp,
        "humidity_%": humidity,
        "wind_speed_kmh": wind,
        "AQI": aqi
    })

    results.append(enriched)

    print(f"Processed {i+1}/200")

# -------- Save --------
final_df = pd.DataFrame(results)
final_df.to_csv(OUTPUT_CSV, index=False)

print("Test enrichment complete.")
