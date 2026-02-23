import os
import json
import csv
from datetime import datetime, timedelta

folder_path = './dataset/'
output_csv = 'odi_10over_segments_with_time.csv'

OVER_DURATION_MINUTES = 4.5
SEGMENT_SIZE = 10  # 10 overs per segment
SEGMENT_DURATION = OVER_DURATION_MINUTES * SEGMENT_SIZE  # 45 minutes


def estimate_start_time(venue):
    """
    Rule-based synthetic start time estimation.
    """

    venue_lower = venue.lower()

    # Australia rule
    if "australia" in venue_lower:
        return "13:00"

    # Subcontinent rule
    if any(country in venue_lower for country in
           ["india", "sri lanka", "pakistan", "bangladesh"]):
        return "14:30"

    # Default day match
    return "10:00"


rows = []

try:
    for file_name in os.listdir(folder_path):
        if not file_name.endswith(".json"):
            continue

        file_path = os.path.join(folder_path, file_name)

        with open(file_path, 'r') as f:
            data = json.load(f)

        if data["info"]["match_type"] != "ODI":
            continue

        venue = data["info"]["venue"]
        gender = data["info"]["gender"]
        full_date = data["info"]["dates"][0]
        teams = data["info"]["teams"]

        start_time_str = estimate_start_time(venue)

        # Create datetime object
        match_start_dt = datetime.strptime(
            full_date + " " + start_time_str,
            "%Y-%m-%d %H:%M"
        )

        for inning in data["innings"]:
            batting_team = inning["team"]
            bowling_team = [t for t in teams if t != batting_team][0]

            segment_runs = {}

            for over_data in inning["overs"]:
                over_number = over_data["over"]
                segment_index = over_number // SEGMENT_SIZE

                if segment_index not in segment_runs:
                    segment_runs[segment_index] = 0

                for delivery in over_data["deliveries"]:
                    segment_runs[segment_index] += delivery["runs"]["total"]

            for segment_index in sorted(segment_runs.keys()):
                start_over = segment_index * 10 + 1
                end_over = min((segment_index + 1) * 10, 50)

                # Calculate segment start time
                segment_start_dt = match_start_dt + timedelta(
                    minutes=SEGMENT_DURATION * segment_index
                )

                rows.append([
                    venue,
                    full_date,
                    start_time_str,
                    segment_start_dt.strftime("%H:%M"),
                    gender,
                    batting_team,
                    bowling_team,
                    f"{start_over}-{end_over}",
                    segment_runs[segment_index]
                ])

    with open(output_csv, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([
            "venue",
            "full_date",
            "match_start_time_estimated",
            "segment_start_time_estimated",
            "gender",
            "batting_team",
            "bowling_team",
            "over_range",
            "total_runs"
        ])
        writer.writerows(rows)

    print(f"CSV file '{output_csv}' created successfully.")

except FileNotFoundError:
    print(f"Error: The path '{folder_path}' does not exist.")
except NotADirectoryError:
    print(f"Error: The path '{folder_path}' is not a directory.")
