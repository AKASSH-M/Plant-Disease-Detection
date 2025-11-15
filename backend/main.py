from fastapi import FastAPI , UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from utils.predict import predict_disease

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try :
        file_location = f"temp_{file.filename}"

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        class_names = ['Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,bell___Bacterial_spot',
    'Pepper,bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy']
        model_path = "model/plant_disease_detection.keras"

        Class , confidence = predict_disease(model_path , file_location , class_names)
        plant , disease = Class.split("___")
        disease = disease.replace("_" , " ")
        affected = disease != "healthy"
        found = confidence > 70 

        if os.path.exists(file_location):
            os.remove(file_location)
            
        return {'status' : 'success' ,
                'found' : bool(found) , 
                'plant' : str(plant) , 
                'disease' : str(disease) , 
                'confidence' : float(confidence) , 
                'affected' : bool(affected)
                }
    except Exception as e:
        print("Error in prediction endpoint:", e)
        return {'status' : 'error' , 'message' : str(e) }