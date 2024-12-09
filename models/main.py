import pickle

model = None

with open('rain.bin', 'rb') as file:
    model = pickle.load(file)

forecast = model.get_forecast(steps=20).predicted_mean
print(forecast)