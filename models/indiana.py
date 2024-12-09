import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import matplotlib.pyplot as plt
import seaborn as sns
# 1. Load the dataset
# Replace 'rainfall_data.csv' with your dataset path
df = pd.read_csv('C:\\Users\\HP\\OneDrive\\Desktop\\Sih 123\\book5.csv')

# 2. Data preprocessing
# Handle null values
df.dropna(inplace=True)  # Drop rows with missing values

# One-hot encoding for 'Subdivision' column
df = pd.get_dummies(df, columns=['State'], drop_first=True)

# 3. Feature selection
# Assuming 'Year' and rainfall columns are named as 'Year' and 'Avg_Rainfall'
X = df.drop(['Annual'], axis=1)  # Features
y = df['Annual']  # Target variable

# Normalize the feature data (important for LSTM)
scaler = MinMaxScaler(feature_range=(0, 1))
X_scaled = scaler.fit_transform(X)

# Reshape input for LSTM (LSTM expects 3D input: [samples, time steps, features])
X_reshaped = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))

# 4. Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_reshaped, y, test_size=0.2, random_state=42)

# 5. Build LSTM model
model = Sequential()
model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
model.add(LSTM(units=50, return_sequences=False))
model.add(Dense(units=25))
model.add(Dense(units=1))  # Single output for rainfall prediction

# 6. Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# 7. Train the model
history = model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test))

# 8. Predict rainfall for the next 10 years
# Assuming the last known year is the most recent in the dataset
last_known_year = df['Year'].max()

# Prepare data for the next 10 years
future_years = np.arange(last_known_year + 1, last_known_year + 11)
future_subdivision_data = pd.DataFrame({'Year': future_years})
# Add one-hot encoded subdivision columns with zeros (since we are predicting for future years)
for col in df.columns:
    if 'State' in col:
        future_subdivision_data[col] = 0  # Assuming we don't know the subdivision, we keep it zero

# Normalize and reshape future data
future_scaled = scaler.transform(future_subdivision_data)
future_reshaped = future_scaled.reshape((future_scaled.shape[0], 1, future_scaled.shape[1]))

# Predict rainfall for the next 10 years
predicted_rainfall = model.predict(future_reshaped)

# 9. Display the predicted rainfall
predicted_rainfall = predicted_rainfall.flatten()  # Flatten the predictions array
future_predictions = pd.DataFrame({'Year': future_years, 'Predicted_Rainfall': predicted_rainfall})

print("\nPredicted Rainfall for the Next 10 Years:")
print(future_predictions)

# Optional: Save the predictions to a CSV file
future_predictions.to_csv('predicted_rainfall.csv', index=False)
plt.figure(figsize=(10, 6))
sns.lineplot(x='Year', y='Predicted_Rainfall', data=future_predictions, marker='o', color='orange', label='Predicted Rainfall')
plt.title('Predicted Rainfall for Next 10 Years')
plt.xlabel('Year')
plt.ylabel('Rainfall (mm)')
plt.grid(True, linestyle='--', alpha=0.6)
plt.xticks(future_predictions['Year'], rotation=45)
plt.legend()
plt.show()
