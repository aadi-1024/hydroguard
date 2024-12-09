import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# 1. Load Data
data = pd.read_csv('./Crop_recommendation.csv')

# 2. Feature Encoding (One-Hot Encode 'season' and 'label')
data = pd.get_dummies(data, columns=['season', 'label'])

# 3. Split Features (X) and Target (y)
X = data[['temperature', 'humidity', 'ph'] + list(data.columns[data.columns.str.startswith('season_')]) + list(data.columns[data.columns.str.startswith('label_')])]
y = data['water availability']

# 4. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Train Random Forest Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Make Predictions
y_pred = model.predict(X_test)

# 7. Evaluate the Model
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Print Evaluation Metrics
print(f'MAE: {mae}, MSE: {mse}, R2: {r2}')

# Print a few predicted and actual values for comparison
comparison_df = pd.DataFrame({'Actual': y_test.values[:10], 'Predicted': y_pred[:10]})
print("\nSample of Actual vs Predicted Water Usage:")
print(comparison_df)
