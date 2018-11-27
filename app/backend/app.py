import io
import base64
from PIL import Image
import numpy as np

from flask import Flask, request, jsonify
from sklearn import svm
from sklearn import datasets
from sklearn.externals import joblib

# declare constants
HOST = '0.0.0.0'
PORT = 8081

# initialize flask application
app = Flask(__name__)


@app.route('/api/predict', methods=['POST'])
def predict():
    X = request.get_json()
    results = []
    for array in X:
        tmp = {}
        head, data = array[0].split(',')
        tmp["name'"] = array[1]
        image = np.array(Image.open(io.BytesIO(base64.b64decode(data))))
        tmp["height"] = int(image.shape[0])
        tmp["width"] = int(image.shape[1])
        tmp["confidence"] = float(np.random.rand())
        results.append(tmp)
    return jsonify(results)
    # return jsonify([{"test": "test"}])

if __name__ == '__main__':
    # run web server
    app.run(host=HOST,
            debug=True,  # automatic reloading enabled
            port=PORT)
