from flask import Flask, render_template, jsonify, request
from app.predict import from_image

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload-image', methods=['POST'])
def upload():
    image = request.files['image']
    return jsonify(from_image(image.stream))

if __name__ == "__main__":
    app.run(debug=True)