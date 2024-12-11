from flask import Flask, request, jsonify
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