from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import pickle

import ee

ee.Initialize(credentials=ee.ServiceAccountCredentials('hydroguard-backend@hydroguard-testing.iam.gserviceaccount.com', 'key.json')
, project='hydroguard-testing')
app = Flask(__name__)

@app.post("/stats")
def get_surf_area():
    glcf = ee.ImageCollection("GLCF/GLS_WATER")

    data = request.get_json(force=True)
    coords = []
    for i in data['coordinates']:
        coords.append([i['longitude'], i['latitude']])
    reservoir = ee.Geometry.Polygon([coords])

    clip = glcf.select('water').mosaic().clip(reservoir)

    total_area = clip.eq(1).multiply(ee.Image.pixelArea()).reduceRegion(
        reducer=ee.Reducer.sum(),
        geometry=reservoir,
        scale=30,
        maxPixels=1e9
    )

    area_km2 = ee.Number(total_area.get('water')).divide(1e6).getInfo()
    return jsonify({
        'cover': str(area_km2)
    })

@app.post('/population')
def pop():
    states = ee.FeatureCollection("FAO/GAUL/2015/level1")


    data = request.get_json(force=True)
    state = data['state']
    year = None
    try:
        year = data['year']
    except:
        year = '2020'

    population_dataset = ee.ImageCollection("WorldPop/GP/100m/pop").filterDate(f'{year}-01-01', f'{year}-12-31')
    population_image = population_dataset.mean()

    indiaStates = states.filter(ee.filter.Filter.eq('ADM0_NAME', 'India'))
    punjabGeo = indiaStates.filter(ee.filter.Filter.eq('ADM1_NAME', state)).geometry()

    total_population = population_image.reduceRegion(
        reducer=ee.Reducer.sum(),
        geometry=punjabGeo,
        scale=100,
        maxPixels=1e9
    ).get('population')

    return str(ee.Number(total_population).getInfo())


def preprocess_data(df):
    # Create a copy of the dataframe to avoid modification warnings
    data = df.copy()

    # Encode categorical variables
    data['irrigation_encoded'] = data['irrigation'].map(IRRIGATION_EFFICIENCY)

    # One-hot encode crop and season
    data['crop_encoded'] = pd.Categorical(data['crop']).codes
    data['season_encoded'] = pd.Categorical(data['season']).codes

    # Calculate adjusted water parameters based on irrigation efficiency
    data['adjusted_l1'] = data['l1'] * data['irrigation_encoded']
    data['adjusted_l2'] = data['l2'] * data['irrigation_encoded']
    data['adjusted_l4'] = data['l4'] * data['irrigation_encoded']

    return data


@app.post('/area')
def area():
    data = request.get_json(force=True)
    coords = []
    for i in data['coordinates']:
        coords.append([i['longitude'], i['latitude']])
    area = ee.Geometry.Polygon(coords).area()
    return str(ee.Number(area).getInfo())

# Irrigation Efficiency Constants
IRRIGATION_EFFICIENCY = {
    'flood': 0.60,    # 60% efficiency
    'sprinkler': 0.75, # 75% efficiency
    'drip': 0.90      # 90% efficiency
}

# Load the model (You would load your trained model here)
with open('./irrr.bin', 'rb') as model_file:
    best_model = pickle.load(model_file)

# Function to process input JSON and make prediction
def process_input(json_data):
    # Extract input data from JSON
    crop = json_data.get('crop')
    season = json_data.get('season')
    l1 = json_data.get('l1')
    l2 = json_data.get('l2')
    l4 = json_data.get('l4')
    total = json_data.get('total')
    kc1 = json_data.get('kc1')
    kc2 = json_data.get('kc2')
    kc3 = json_data.get('kc3')
    eto = json_data.get('eto')
    etc = json_data.get('etc')
    total_etc = json_data.get('total_etc')
    irrigation = json_data.get('irrigation_method')

    p = pd.DataFrame([{
    "crop": crop,
    "season": season,
    "l1": l1,
    "l2": l2,
    "l4": l4,
    "total": total,
    "kc1": kc1,
    "kc2": kc2,
    "kc3": kc3,
    "eto": eto,
    "etc": etc,
    "total_etc": total_etc,
    "irrigation": irrigation
    }])

    p = preprocess_data(p)

    # Encode inputs
    crop_encoded = pd.Categorical([crop], categories=p['crop'].unique()).codes[0]
    season_encoded = pd.Categorical([season], categories=p['season'].unique()).codes[0]

    # Get irrigation efficiency
    irrigation_efficiency = IRRIGATION_EFFICIENCY.get(irrigation, 1.0)

    # Adjust water parameters
    adjusted_l1 = l1 * irrigation_efficiency
    adjusted_l2 = l2 * irrigation_efficiency
    adjusted_l4 = l4 * irrigation_efficiency

    # Prepare input features
    input_features = np.array([[
        crop_encoded, season_encoded,
        adjusted_l1, adjusted_l2, adjusted_l4,
        total,
        kc1, kc2, kc3,
        eto, etc, total_etc,
        irrigation_efficiency
    ]])

    return input_features

@app.route('/predict', methods=['POST'])
def predict():
    # Get the incoming JSON data
    data = request.get_json()

    # Process the data and prepare features for prediction
    input_features = process_input(data)

    # Make prediction using the model
    predicted_yield = best_model.predict(input_features)

    # Return the result as a JSON response
    return jsonify({'predicted_yield': predicted_yield[0]})

@app.post('/yield')
def predict_yield():
    data = request.get_json(force=True)
