from tensorflow.keras.models import load_model
import cv2
import numpy as np
# import os

# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

XRAY_THRESHOLD = 0.8
DISEASE_THRESHOLD = 0.8

xray_model = load_model('app/models/x-ray')
# lung_model = load_model('app/models/lung')
disease_model = load_model('app/models/disease')


def from_image(image):
    img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
    g_img = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (32, 32))
    inp = np.expand_dims(g_img.reshape((32, 32, 1)), axis=0)
    result = xray_model.predict(inp)[0, 0]
    with open('D:/sad.txt', 'a') as f:
        f.write(str(result)+'\n')
    if result < 0.8:
        return {
            'success': False,
            'description': 'Not a valid image!'
        }

    m_img = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (256, 256))
    inp = np.expand_dims(m_img, axis=0)
    result = disease_model.predict(inp)[0]
    return {
        'success': True,
        'type': int(result.argmax()),
        'probs': list(np.round(result*100, 2).astype(str))
    }


def from_image2(image):
    img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    x_img = cv2.resize(img, (32, 32))
    d_img = cv2.resize(img, (224, 224))

    result = xray_model.predict(np.expand_dims(x_img, axis=0))[0, 0]
    if result < XRAY_THRESHOLD:
        return {'success': 0}

    result = lung_model.predict(np.expand_dims(d_img, axis=0))[0, 0]
    if result < DISEASE_THRESHOLD:
        return {
            'success': 1,
            'probs': np.round(result*100, 2).astype(str)
        }

    result = disease_model.predict(np.expand_dims(d_img, axis=0))[0]
    return {
        'success': 2,
        'type': int(result.argmax()),
        'probs': list(np.round(result*100, 2).astype(str))
    }


'''
status
0 - Not an X-Ray
1 - Normal Lungs
2 - Diseases Lungs

type
Result

probs
Probabilities for status 1 or 2
'''
