#!/usr/bin/python3
from flask import Blueprint, request, render_template, make_response,jsonify
from flask_cors import CORS

from .FileManager import FileManager
import speech_recognition as sr
import pickle
from allennlp.predictors.predictor import Predictor
import os

bluePrint = Blueprint('fileBluePrint', __name__, url_prefix='/files',template_folder='templates')


@bluePrint.route('/filemanager')
def indexAction():
    ''' File Manager Home '''
    resp =  make_response(render_template('filemanager.html'))
    return resp


@bluePrint.route('/connectors/python/filemanager', methods = ['GET','POST'])
def fileManagerAction():
    ''' File Manager API endpoint '''
    fileManager = FileManager()
    mode = None
    if request.method == 'POST':
        if 'mode' in request.form:
            mode = request.form.get('mode')
    else:
        if 'mode' in request.args:
            mode = request.args.get('mode')
    return getattr(fileManager, mode, 'error')()


