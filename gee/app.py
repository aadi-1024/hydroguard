from flask import Flask, request, jsonify
import ee

ee.Initialize(credentials=ee.ServiceAccountCredentials('hydroguard-backend@hydroguard-testing.iam.gserviceaccount.com', 'key.json')
, project='hydroguard-testing')
app = Flask(__name__)

@app.post("/surface")
def get_surf_area():
    glcf = ee.ImageCollection("GLCF/GLS_WATER")

    data = request.get_json(force=True)
    coords = []
    for i in data:
        coords.append([i['longitude'], i['latitude']])
    reservoir = ee.Geometry.Polygon([coords])

    # Select and process the water image
    clip = glcf.select('water').mosaic().clip(reservoir)

    # Calculate the total water area
    total_area = clip.eq(1).multiply(ee.Image.pixelArea()).reduceRegion(
        reducer=ee.Reducer.sum(),
        geometry=reservoir,
        scale=30,
        maxPixels=1e9
    )

    # Print the total area in square kilometers
    area_km2 = ee.Number(total_area.get('water')).divide(1e6).getInfo()
    return jsonify({
        'cover': str(area_km2)
    })