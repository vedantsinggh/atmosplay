import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# ------------------------------
# 1. Load and clean data
# ------------------------------
df = pd.read_csv('train.csv')
df = df.dropna().reset_index(drop=True)

# Convert over_range to numeric start over
def over_to_num(over_str):
    return int(over_str.split('-')[0])
df['over_start'] = df['over_range'].apply(over_to_num)

# Create a copy for weather features only (will be used in stage 2)
weather_features = ['temperature_C', 'humidity_%', 'wind_speed_kmh', 'AQI']
X_weather = df[weather_features].copy()

# Feature engineering for weather interactions (optional)
df['swing_index'] = df['humidity_%'] * df['wind_speed_kmh']
df['heat_stress'] = df['temperature_C'] * df['over_start']
df['aqi_impact'] = df['AQI'] * df['over_start']

# Non‑weather features for stage 1
categorical_features = ['venue', 'batting_team', 'bowling_team']
numeric_features_stage1 = ['over_start']  # only over phase

# Features for stage 2 (weather + interactions)
weather_feature_set = ['temperature_C', 'humidity_%', 'wind_speed_kmh', 'AQI',
                       'swing_index', 'heat_stress', 'aqi_impact']

# ------------------------------
# 2. Split data
# ------------------------------
# We'll keep the same split for both stages
X_stage1 = df[categorical_features + numeric_features_stage1]
y = df['total_runs']

X_train_s1, X_test_s1, y_train, y_test, X_train_w, X_test_w = train_test_split(
    X_stage1, y, df[weather_feature_set], test_size=0.2, random_state=42
)

# ------------------------------
# 3. Stage 1: Baseline model (no weather)
# ------------------------------
preprocessor_s1 = ColumnTransformer([
    ('num', StandardScaler(), numeric_features_stage1),
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
])

# Use a flexible model for baseline (e.g., RandomForest with limited depth)
baseline_model = Pipeline([
    ('prep', preprocessor_s1),
    ('rf', RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42))
])

baseline_model.fit(X_train_s1, y_train)
y_pred_baseline_train = baseline_model.predict(X_train_s1)
y_pred_baseline_test = baseline_model.predict(X_test_s1)

print(f"Baseline MAE (train): {mean_absolute_error(y_train, y_pred_baseline_train):.2f}")
print(f"Baseline MAE (test):  {mean_absolute_error(y_test, y_pred_baseline_test):.2f}")

# ------------------------------
# 4. Stage 2: Residual model (weather only)
# ------------------------------
residual_train = y_train - y_pred_baseline_train
residual_test = y_test - y_pred_baseline_test

# Scale weather features
scaler_w = StandardScaler()
X_train_w_scaled = scaler_w.fit_transform(X_train_w)
X_test_w_scaled = scaler_w.transform(X_test_w)

# Simple linear model for residuals (Ridge to avoid overfitting)
residual_model = Ridge(alpha=1.0)
residual_model.fit(X_train_w_scaled, residual_train)

# Evaluate residual predictions
residual_pred_test = residual_model.predict(X_test_w_scaled)
residual_mae = mean_absolute_error(residual_test, residual_pred_test)
print(f"Residual prediction MAE (test): {residual_mae:.2f} runs")

# ------------------------------
# 5. Interpret weather effects on residuals
# ------------------------------
print("\nWeather coefficients (standardised scale):")
for name, coef in zip(weather_feature_set, residual_model.coef_):
    print(f"{name:20s}: {coef:.3f}")

# ------------------------------
# 6. Compute reduction due to weather on a test sample
# ------------------------------
sample_idx = 0
sample_weather = X_test_w.iloc[[sample_idx]]
sample_weather_scaled = scaler_w.transform(sample_weather)

# Predict baseline runs for this sample (using its non‑weather features)
sample_baseline = baseline_model.predict(X_test_s1.iloc[[sample_idx]])[0]

# Predict residual from weather
pred_residual = residual_model.predict(sample_weather_scaled)[0]

# Total predicted runs = baseline + residual
pred_total = sample_baseline + pred_residual

# To compute reduction, we need a baseline weather scenario (e.g., average weather)
baseline_weather = X_train_w.mean().to_frame().T  # mean of training weather
baseline_weather_scaled = scaler_w.transform(baseline_weather)
pred_residual_baseline = residual_model.predict(baseline_weather_scaled)[0]

# Reduction = (baseline residual - actual residual)  [negative residual means runs lost]
# But careful: if baseline weather is "ideal", its residual might be positive.
# We define reduction as: predicted runs under baseline weather minus predicted runs under actual weather.
# Since baseline runs are the same (sample_baseline), this equals (pred_residual_baseline - pred_residual).
reduction = pred_residual_baseline - pred_residual

print("\n--- Weather reduction on a test sample ---")
print(f"Actual weather features: {sample_weather.iloc[0].to_dict()}")
print(f"Baseline weather (mean): {baseline_weather.iloc[0].to_dict()}")
print(f"Baseline predicted runs (no weather): {sample_baseline:.1f}")
print(f"Predicted residual (actual weather)  : {pred_residual:.1f}")
print(f"Predicted residual (baseline weather): {pred_residual_baseline:.1f}")
print(f"Total predicted runs (actual weather): {pred_total:.1f}")
print(f"Reduction due to weather              : {reduction:.1f} runs")
