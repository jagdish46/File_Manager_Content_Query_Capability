import os
from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from jinja2 import Markup, PackageLoader, Environment, FileSystemLoader, ChoiceLoader
import speech_recognition as sr
import pickle
from allennlp.predictors.predictor import Predictor
import os
from .File import bluePrint as fileBluePrint
from scipy.io import wavfile
from scipy.io.wavfile import read
import numpy as np
import wavio
import time

dir_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),'static')
app = Flask(__name__)
app.register_blueprint(fileBluePrint)
CORS(app)

predictor = Predictor.from_path(
        "https://s3-us-west-2.amazonaws.com/allennlp/models/bidaf-model-2017.09.15-charpad.tar.gz")


@app.route("/")
def hello():
    return "Hello World!"

@app.route('/speechtotext')
def speech_text():
    resp = {}
    audio_file = '/Users/Selva/Downloads/sample.wav'
    #target_file = '/Users/Selva/Downloads/output.wav'
    while not os.path.exists(audio_file):
        time.sleep(1)
    #a = read(audio_file)
    #data = np.array(a[1], dtype=float)
    save = ""
    #wavio.write(target_file, data, fs, sampwidth=2)
    r = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
    try:
        save = r.recognize_google(audio)
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")

    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
    resp["textout"] = save
    print(resp)
    os.remove(audio_file)
    #os.remove(target_file)
    return jsonify(resp)


@app.route('/getanswer', methods=['GET', 'POST'])
def content_query():
    content = request.json
    print(content)
    question = content["question"]
    resp = {}
    pickle_off = open(r'/Users/Selva/Desktop/RichFilemanager-Python3Flask/datafile.txt', "rb")
    inp = pickle.load(pickle_off)
    result = predictor.predict(
        passage=inp,
        question=question
    )
    resp["answer"] = result['best_span_str']
    print(resp)
    return jsonify(resp)

if __name__ == "__main__":
    app.run(debug=True)
