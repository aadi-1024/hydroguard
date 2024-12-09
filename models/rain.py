import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.stattools import adfuller
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np
import matplotlib.pyplot as plt
import itertools
import pickle

# Step 1: Load the dataset
file_path = "./average_rainfall_1900_2020.csv"  # Replace with your dataset path
rainfall_data = pd.read_csv(file_path)

# Ensure the Year column is set as the index
rainfall_data.set_index("Year", inplace=True)

# Convert Average_Rainfall to numeric and drop missing values
rainfall_data["Average_Rainfall"] = pd.to_numeric(rainfall_data["Average_Rainfall"], errors="coerce")
rainfall_data = rainfall_data.dropna()

# Step 2: Check stationarity
def check_stationarity(data):
    adf_test = adfuller(data)
    print(f"ADF Statistic: {adf_test[0]}")
    print(f"p-value: {adf_test[1]}")
    if adf_test[1] <= 0.05:
        print("The data is stationary.")
    else:
        print("The data is not stationary; differencing may be needed.")

check_stationarity(rainfall_data["Average_Rainfall"])

# Step 3: Grid search for optimal SARIMA parameters
def sarima_grid_search(data, p_values, d_values, q_values, P_values, D_values, Q_values, s):
    best_aic = float("inf")
    best_params = None
    for param in itertools.product(p_values, d_values, q_values):
        for seasonal_param in itertools.product(P_values, D_values, Q_values, [s]):
            try:
                model = SARIMAX(data, 
                                order=param, 
                                seasonal_order=seasonal_param, 
                                enforce_stationarity=False, 
                                enforce_invertibility=False)
                results = model.fit()
                if results.aic < best_aic:
                    best_aic = results.aic
                    best_params = (param, seasonal_param)
            except:
                continue
    print(f"Best SARIMA parameters: {best_params} with AIC: {best_aic}")
    return best_params

# Define the parameter ranges
p = d = q = range(0, 3)  # ARIMA (p, d, q)
P = D = Q = range(0, 2)  # Seasonal SARIMA (P, D, Q, s)
s = 12  # Seasonal period (e.g., yearly seasonality)

# Find the best SARIMA parameters
best_params = sarima_grid_search(rainfall_data["Average_Rainfall"], p, d, q, P, D, Q, s)

# Step 4: Train SARIMA with the best parameters
model = SARIMAX(
    rainfall_data["Average_Rainfall"],
    order=best_params[0],
    seasonal_order=best_params[1],
    enforce_stationarity=False,
    enforce_invertibility=False,
)
sarima_result = model.fit()

with open('rain.bin', 'b+w') as file:
    pickle.dump(sarima_result, file)

# Step 5: Forecast for the next 10 years
# forecast_years = 20
# forecast = sarima_result.get_forecast(steps=forecast_years)
# forecast_index = range(rainfall_data.index[-1] + 1, rainfall_data.index[-1] + 1 + forecast_years)
# forecast_values = forecast.predicted_mean
# forecast_conf_int = forecast.conf_int()

# # Step 6: Plot the forecast
# plt.figure(figsize=(12, 6))
# plt.plot(rainfall_data.index, rainfall_data["Average_Rainfall"], label="Actual Data", marker='o')
# plt.plot(forecast_index, forecast_values, label="Forecasted Data", linestyle="--", marker='o', color="red")
# plt.fill_between(forecast_index, 
#                  forecast_conf_int.iloc[:, 0], 
#                  forecast_conf_int.iloc[:, 1], color="pink", alpha=0.3)
# plt.title(" Forecasted Average Rainfall with SARIMA")
# plt.xlabel("Year")
# plt.ylabel("Average Rainfall (mm)")
# plt.legend()
# plt.grid()
# plt.show()

# # Step 7: Print metrics and forecast values
# print("Mean Absolute Error (MAE):", mean_absolute_error(rainfall_data["Average_Rainfall"], sarima_result.fittedvalues))
# print("Root Mean Squared Error (RMSE):", np.sqrt(mean_squared_error(rainfall_data["Average_Rainfall"], sarima_result.fittedvalues)))

# print("\nForecasted Average Rainfall for Future Years:")
# forecast_values.index = forecast_index
# print(forecast_values)
