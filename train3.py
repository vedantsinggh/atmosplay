import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ------------------------------
# 1. Load and clean data
# ------------------------------
df = pd.read_csv('train.csv')
df = df.dropna().reset_index(drop=True)

# Convert over_range to numeric start over
def over_to_num(over_str):
    return int(over_str.split('-')[0])
df['over_start'] = df['over_range'].apply(over_to_num)

# Feature engineering for weather interactions
df['swing_index'] = df['humidity_%'] * df['wind_speed_kmh']
df['heat_stress'] = df['temperature_C'] * df['over_start']
df['aqi_impact'] = df['AQI'] * df['over_start']

# Define feature sets
categorical_features = ['venue', 'batting_team', 'bowling_team']
numeric_features_stage1 = ['over_start']
weather_feature_set = ['temperature_C', 'humidity_%', 'wind_speed_kmh', 'AQI',
                       'swing_index', 'heat_stress', 'aqi_impact']

# ------------------------------
# 2. Split data
# ------------------------------
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

baseline_model = Pipeline([
    ('prep', preprocessor_s1),
    ('rf', RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42))
])

baseline_model.fit(X_train_s1, y_train)
y_pred_baseline_train = baseline_model.predict(X_train_s1)
y_pred_baseline_test = baseline_model.predict(X_test_s1)

# Baseline metrics
baseline_metrics = {
    'train_mae': mean_absolute_error(y_train, y_pred_baseline_train),
    'test_mae': mean_absolute_error(y_test, y_pred_baseline_test),
    'train_rmse': np.sqrt(mean_squared_error(y_train, y_pred_baseline_train)),
    'test_rmse': np.sqrt(mean_squared_error(y_test, y_pred_baseline_test)),
    'train_r2': r2_score(y_train, y_pred_baseline_train),
    'test_r2': abs(r2_score(y_test, y_pred_baseline_test))
}

print("=== Baseline Model (no weather) ===")
for k, v in baseline_metrics.items():
    print(f"{k}: {v:.3f}")

# ------------------------------
# 4. Stage 2: Residual model (weather only)
# ------------------------------
residual_train = y_train - y_pred_baseline_train
residual_test = y_test - y_pred_baseline_test

scaler_w = StandardScaler()
X_train_w_scaled = scaler_w.fit_transform(X_train_w)
X_test_w_scaled = scaler_w.transform(X_test_w)

# Ridge regression for residuals (alpha can be tuned via CV)
residual_model = Ridge(alpha=1.0)
residual_model.fit(X_train_w_scaled, residual_train)

residual_pred_train = residual_model.predict(X_train_w_scaled)
residual_pred_test = residual_model.predict(X_test_w_scaled)

# Residual model metrics (how well we predict the weather component)
residual_metrics = {
    'train_mae': mean_absolute_error(residual_train, residual_pred_train),
    'test_mae': mean_absolute_error(residual_test, residual_pred_test),
    'train_rmse': np.sqrt(mean_squared_error(residual_train, residual_pred_train)),
    'test_rmse': np.sqrt(mean_squared_error(residual_test, residual_pred_test)),
    'train_r2': r2_score(residual_train, residual_pred_train),
    'test_r2': abs(r2_score(residual_test, residual_pred_test))
}

print("\n=== Residual Model (weather only) ===")
for k, v in residual_metrics.items():
    print(f"{k}: {v:.3f}")

# ------------------------------
# 5. Combined model (baseline + residual)
# ------------------------------
y_pred_combined_test = y_pred_baseline_test + residual_pred_test

combined_metrics = {
    'mae': mean_absolute_error(y_test, y_pred_combined_test),
    'rmse': np.sqrt(mean_squared_error(y_test, y_pred_combined_test)),
    'r2': abs(r2_score(y_test, y_pred_combined_test))
}

print("\n=== Combined Model (baseline + weather) ===")
for k, v in combined_metrics.items():
    print(f"{k}: {v:.3f}")
# ------------------------------
# 6. Weather feature coefficients with confidence intervals (bootstrap)
# ------------------------------
n_bootstrap = 1000
coefs_bootstrap = []

for i in range(n_bootstrap):
    # Bootstrap sample from training residuals and weather
    idx = np.random.choice(len(residual_train), size=len(residual_train), replace=True)
    X_boot = X_train_w_scaled[idx]
    y_boot = residual_train.iloc[idx]
    boot_model = Ridge(alpha=1.0)
    boot_model.fit(X_boot, y_boot)
    coefs_bootstrap.append(boot_model.coef_)

coefs_bootstrap = np.array(coefs_bootstrap)
ci_lower = np.percentile(coefs_bootstrap, 2.5, axis=0)
ci_upper = np.percentile(coefs_bootstrap, 97.5, axis=0)

print("\n=== Weather Feature Coefficients (95% CI) ===")
print("Feature               | Coefficient | 2.5%   | 97.5%")
print("-" * 50)
for i, name in enumerate(weather_feature_set):
    coef = residual_model.coef_[i]
    print(f"{name:20s} | {coef:>10.3f} | {ci_lower[i]:>6.3f} | {ci_upper[i]:>6.3f}")

# ------------------------------
# 7. Residual analysis
# ------------------------------
final_residuals_test = y_test - y_pred_combined_test
print("\n=== Final Residuals on Test Set ===")
print(f"Mean: {final_residuals_test.mean():.3f}")
print(f"Std:  {final_residuals_test.std():.3f}")
print(f"Min:  {final_residuals_test.min():.3f}")
print(f"Max:  {final_residuals_test.max():.3f}")

# ------------------------------
# 8. Actual vs Predicted plot
# ------------------------------
plt.figure(figsize=(8,6))
plt.scatter(y_test, y_pred_combined_test, alpha=0.7)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Actual Runs')
plt.ylabel('Predicted Runs')
plt.title('Actual vs Predicted (Combined Model)')
plt.tight_layout()
plt.savefig('actual_vs_predicted.png')
plt.show()

# ------------------------------
# 9. Distribution of weather-induced reduction on test set
# ------------------------------
# For each test sample, compute reduction relative to baseline weather
baseline_weather = X_train_w.mean().to_frame().T
baseline_weather_scaled = scaler_w.transform(baseline_weather)
pred_residual_baseline = residual_model.predict(baseline_weather_scaled)[0]

# For each test sample, residual_pred_test[i] is the predicted weather effect
# Reduction = residual under baseline - residual under actual weather
reductions_test = pred_residual_baseline - residual_pred_test

print("\n=== Weather‑Induced Reduction on Test Set (runs per 10‑over block) ===")
print(f"Mean reduction: {reductions_test.mean():.2f}")
print(f"Std reduction:  {reductions_test.std():.2f}")
print(f"Min reduction:  {reductions_test.min():.2f}")
print(f"Max reduction:  {reductions_test.max():.2f}")

# Plot distribution
plt.figure(figsize=(8,4))
sns.histplot(reductions_test, bins=15, kde=True)
plt.xlabel('Reduction (runs)')
plt.title('Distribution of Weather‑Induced Reduction')
plt.tight_layout()
plt.savefig('reduction_distribution.png')
plt.show()
