import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Step 1: Read the dataset from a CSV file
df = pd.read_csv('C:\\Users\\HP\\OneDrive\\Desktop\\Sih 123\\book4.csv')

# Step 2: Handle null values
df['ANNUAL'] = df['ANNUAL'].fillna(df['ANNUAL'].mean())  # Fill missing values in ANNUAL with mean

# Step 3: Train a Linear Regression model for each state
future_years = np.arange(2021, 2031)  # Future years for prediction
predictions_df = pd.DataFrame()  # DataFrame to store predictions for all states

# Ensure the 'SUBDIVISION' column has no null values
df['SUBDIVISION'] = df['SUBDIVISION'].fillna('Unknown')

# Step 4: Loop through each unique state (SUBDIVISION)
for state in df['SUBDIVISION'].unique():
    # Filter data for the specific state
    state_data = df[df['SUBDIVISION'] == state]

    # Check if the state has enough data points to train
    if len(state_data) < 2:
        print(f"Not enough data to train for {state}")
        continue

    # Create a one-hot encoded DataFrame for the state
    state_encoded_data = pd.get_dummies(state_data, columns=['SUBDIVISION'], drop_first=True)

    # Features (YEAR and one-hot encoded SUBDIVISION columns) and target (ANNUAL rainfall)
    X = state_encoded_data.drop(columns=['ANNUAL'], errors='ignore')
    y = state_encoded_data['ANNUAL']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a Linear Regression model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Create a DataFrame for future years
    future_data = pd.DataFrame({'YEAR': future_years})

    # Add one-hot encoded columns with the same values as the last row of state data
    for col in X.columns:
        if col != 'YEAR':
            future_data[col] = state_encoded_data[col].iloc[-1]

    # Predict future rainfall
    future_rainfall = model.predict(future_data)

    # Store predictions in the DataFrame
    future_data['PredictedRainfall'] = future_rainfall
    future_data['State'] = state
    predictions_df = pd.concat([predictions_df, future_data])

# Step 5: Plot predictions for all states
plt.figure(figsize=(12, 8))

# Plot historical and predicted data for each state
for state in df['SUBDIVISION'].unique():
    state_data = df[df['SUBDIVISION'] == state]
    plt.plot(state_data['YEAR'], state_data['ANNUAL'], label=f"Historical Data - {state}")

    state_predictions = predictions_df[predictions_df['State'] == state]
    plt.plot(state_predictions['YEAR'], state_predictions['PredictedRainfall'], label=f"Predicted Rainfall - {state}", linestyle="--")

plt.xlabel('Year')
plt.ylabel('Annual Rainfall (mm)')
plt.title('Rainfall Prediction by State/Subdivision (2021-2030)')
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', fontsize='small')
plt.xticks(rotation=90)
plt.tight_layout()
plt.show()

# Step 6: Display predicted rainfall
print("\nPredicted Rainfall for the Next 10 Years (2021-2030):")
print(predictions_df)
