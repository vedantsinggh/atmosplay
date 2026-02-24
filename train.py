import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error

# ------------------------------
# 1. Load dataset
# ------------------------------
df = pd.read_csv('cricket_weather_data.csv')

# ------------------------------
# 2. Handle missing values
# ------------------------------
print("Missing values per column before cleaning:")
print(df.isnull().sum())

# Drop rows with any missing values (simplest approach)
df = df.dropna().reset_index(drop=True)
print(f"\nRows after dropping missing values: {len(df)}")

# ------------------------------
# 3. Feature engineering
# ------------------------------
def over_to_num(over_str):
    return int(over_str.split('-')[0])

df['over_start'] = df['over_range'].apply(over_to_num)

# Domain‑inspired features
df['swing_index'] = df['humidity_%'] * df['wind_speed_kmh']
df['heat_stress'] = df['temperature_C'] * df['over_start']
df['aqi_impact'] = df['AQI'] * df['over_start']

categorical_features = ['venue', 'batting_team', 'bowling_team']
numeric_features = ['over_start', 'temperature_C', 'humidity_%', 
                    'wind_speed_kmh', 'AQI', 'swing_index', 
                    'heat_stress', 'aqi_impact']

# ------------------------------
# 4. Data augmentation (only on rows without NaNs)
# ------------------------------
def augment_data(df, weather_cols, n_copies=5, noise_scale=0.1):
    """
    Create n_copies of each row with small Gaussian noise added to weather_cols.
    Target runs remain the same.
    """
    augmented_rows = []
    for idx, row in df.iterrows():
        for _ in range(n_copies):
            new_row = row.copy()
            for col in weather_cols:
                # Add noise proportional to the absolute value
                noise = np.random.normal(0, noise_scale * abs(row[col]))
                new_row[col] = row[col] + noise
            augmented_rows.append(new_row)
    return pd.DataFrame(augmented_rows)

weather_cols = ['temperature_C', 'humidity_%', 'wind_speed_kmh', 'AQI']

# Augment the cleaned data
df_aug = augment_data(df, weather_cols, n_copies=5, noise_scale=0.1)

# (Optional) Clip values to realistic ranges
df_aug['temperature_C'] = df_aug['temperature_C'].clip(lower=-10, upper=50)
df_aug['humidity_%'] = df_aug['humidity_%'].clip(lower=0, upper=100)
df_aug['wind_speed_kmh'] = df_aug['wind_speed_kmh'].clip(lower=0, upper=150)
df_aug['AQI'] = df_aug['AQI'].clip(lower=0, upper=500)

print(f"Original size (after cleaning): {len(df)} → Augmented size: {len(df_aug)}")

# ------------------------------
# 5. Prepare features and target
# ------------------------------
X = df_aug[categorical_features + numeric_features]
y = df_aug['total_runs']

# Split into train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Double‑check for NaNs in train set
if X_train.isnull().any().any():
    print("Warning: NaNs still present in X_train. Dropping them now.")
    # Get indices where any row has NaN
    train_idx = X_train.dropna().index
    X_train = X_train.loc[train_idx]
    y_train = y_train.loc[train_idx]

if X_test.isnull().any().any():
    print("Warning: NaNs still present in X_test. Dropping them now.")
    test_idx = X_test.dropna().index
    X_test = X_test.loc[test_idx]
    y_test = y_test.loc[test_idx]

# ------------------------------
# 6. Build pipeline with Ridge regression
# ------------------------------
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
])

model = Pipeline([
    ('prep', preprocessor),
    ('ridge', Ridge(alpha=1.0))
])

# Train
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
print(f"\nTest MAE: {mae:.2f} runs")

# ------------------------------
# 7. Weather coefficients
# ------------------------------
cat_feature_names = model.named_steps['prep'].named_transformers_['cat'].get_feature_names_out(categorical_features)
all_feature_names = numeric_features + list(cat_feature_names)
coefs = model.named_steps['ridge'].coef_

print("\nWeather feature coefficients (standardised scale):")
for name, coef in zip(numeric_features, coefs[:len(numeric_features)]):
    print(f"{name:20s}: {coef:.3f}")

# ------------------------------
# 8. Reduction due to weather on a test sample
# ------------------------------
sample = X_test.iloc[[0]].copy()
actual_weather = sample[weather_cols].iloc[0].to_dict()
baseline_weather = X_train[weather_cols].mean().to_dict()

sample_actual = sample.copy()
sample_baseline = sample.copy()
for col in weather_cols:
    sample_baseline[col] = baseline_weather[col]

pred_actual = model.predict(sample_actual)[0]
pred_baseline = model.predict(sample_baseline)[0]
reduction = pred_baseline - pred_actual

print("\n--- Weather reduction on a test sample ---")
print(f"Actual weather   : {actual_weather}")
print(f"Baseline weather : {baseline_weather}")
print(f"Predicted runs (actual)   : {pred_actual:.1f}")
print(f"Predicted runs (baseline) : {pred_baseline:.1f}")
print(f"Reduction due to weather   : {reduction:.1f} runs")

# ------------------------------
# 9. Diagnostic: correlation in original data
# ------------------------------
print("\n--- Correlation of weather with runs in original cleaned data ---")
orig_corr = df[weather_cols + ['total_runs']].corr()['total_runs'].drop('total_runs')
print(orig_corr)
