import io
import base64
import json
from PIL import Image
import numpy as np

from flask import Flask, request, jsonify
import keras
from skimage.transform import resize
from sklearn import svm
from sklearn import datasets
from sklearn.externals import joblib


# declare constants
HOST = '0.0.0.0'
PORT = 8081
INPUT_SIZE = (64, 64, 3)

# initialize flask application
app = Flask(__name__)
model = None
# global model, class_map
# print("loading model")
# model = keras.models.load_model("./model2.h5")
# with open("./class2.json", "r") as f:
#     class_map = json.load(f)
# print(model.summary())


def model_predict(image):
    # remove the black border
    imgsum = np.sum(image, axis=2)
    ind0 = np.where(np.sum(imgsum, axis=1) < 5000)[0]
    ind1 = np.where(np.sum(imgsum, axis=0) < 5000)[0]
    if len(ind0) > 0 and len(ind1) >0:
        new_im = image[:ind0.min(), :ind1.min(), :]
    elif len(ind0) > 0 and len(ind1) == 0:
        new_im = image[:ind0.min(), :, :]
    elif len(ind0) == 0 and len(ind1) > 0:
        new_im = image[:, :ind1.min(), :]
    else:
        new_im = image
    rimage = resize(new_im, INPUT_SIZE)
    predictions = model.predict_on_batch(np.expand_dims(rimage, axis=0))[0]
    return predictions


@app.route('/api/load_model', methods=['POST'])
def load_model():
    global model, class_map
    model_type = request.get_json()[0]
    print(model_type)
    if "antarctica" in model_type:
        weights = "./model2.h5"
        class_map_path = "./class2.json"
    else:
        weights = "./model_all.h5"
        class_map_path = "./class_all.json"

    model = keras.models.load_model(weights)
    model._make_predict_function()
    with open(class_map_path, "r") as f:
        class_map = json.load(f)
    return jsonify({"sucess": True})


@app.route('/api/predict', methods=['POST'])
def predict():
    images = request.get_json()
    results = []
    for array in images:
        tmp = {}
        head, data = array[0].split(',')
        tmp["name'"] = array[1]
        image = np.array(Image.open(io.BytesIO(base64.b64decode(data))))
        predictions = model_predict(image)
        # predictions = np.random.rand(10)
        top_5_idx = np.argsort(predictions)[::-1][:5]
        tmp["height"] = int(image.shape[0])
        tmp["width"] = int(image.shape[1])
        tmp["scores"] = [float(predictions[idx]) for idx in top_5_idx]
        # tmp["class"] = ["class1", "class2", "class3", "class3", "class3"]
        tmp["classes"] = [class_map[str(idx)] for idx in top_5_idx]
        print(tmp["classes"])
        
        results.append(tmp)
    return jsonify(results)
    # return jsonify([{"test": "test"}])

if __name__ == '__main__':
    # run web server
    app.run(host=HOST,
            debug=True,  # automatic reloading enabled
            port=PORT)
