import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img , img_to_array
from tensorflow.keras.models import load_model as lm
import numpy as np

def predict_classes(model , image_path , debug = False):
    image = load_img(image_path , target_size = (128 , 128))
    img_arr = img_to_array(image)
    input_arr = np.array([img_arr])

    prediction = model.predict(input_arr)
    if debug:
        print( prediction )
    result = np.argmax(prediction )
    return result , prediction[0][result]

def predict_disease(model_path , image_path , class_names , debug = True):
    model = lm(model_path)
    class_index , confidence = predict_classes(model , image_path)
    class_name = class_names[class_index]
    return class_name ,  float(round(confidence * 100 , 2)) 