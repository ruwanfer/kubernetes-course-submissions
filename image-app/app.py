from flask import Flask, send_file
import os, time, requests

app = Flask(__name__)

IMAGE_URL = "https://picsum.photos/1200"
IMAGE_PATH = "./data/cached_image.jpg"

def download_image():
    try:
        response = requests.get(IMAGE_URL)
        with open(IMAGE_PATH, 'wb') as f:
            f.write(response.content)
        return True
    except:
        return False

@app.route('/')
def index():
    return '<h1>Random Image</h1><img src="/image" style="width:100%;">'

@app.route('/image')
def get_image():
    if not os.path.exists(IMAGE_PATH):
        download_image()
    return send_file(IMAGE_PATH, mimetype='image/jpeg')

if __name__ == '__main__':
    os.makedirs("./data", exist_ok=True)
    app.run(host='0.0.0.0', port=5000)

