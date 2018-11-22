import io
import base64
from PIL import Image

from flask import Flask, request, jsonify
from sklearn import svm
from sklearn import datasets
from sklearn.externals import joblib

# declare constants
HOST = '0.0.0.0'
PORT = 8081

# initialize flask application
app = Flask(__name__)


@app.route('/api/train', methods=['POST'])
def train():
    # get parameters from request
    parameters = request.get_json()

    # read iris data set
    iris = datasets.load_iris()
    X, y = iris.data, iris.target

    # fit model
    clf = svm.SVC(C=float(parameters['C']),
                  probability=True,
                  random_state=1)
    clf.fit(X, y)

    # persist model
    joblib.dump(clf, 'model.pkl')

    return jsonify({'accuracy': round(clf.score(X, y) * 100, 2)})


@app.route('/api/predict', methods=['POST'])
def predict():
    X = request.get_json()
    head, data = X[0].split(',')
    image = Image.open(io.BytesIO(base64.b64decode(data)))
    return jsonify([{"class": "phyto1"},
                    {"class": "phyto2"}])


@app.route('/api/upload', methods=['POST'])
def upload():
    print('Thomas')
    return jsonify({'success': "True"})


if __name__ == '__main__':
    # run web server
    app.run(host=HOST,
            debug=True,  # automatic reloading enabled
            port=PORT)
