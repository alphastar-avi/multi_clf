# predictor.py
import tensorflow as tf
import numpy as np
import os
import json
import sys
import traceback
from PIL import Image, ImageOps
from tensorflow.keras.models import load_model # type: ignore

# Create a custom DepthwiseConv2D layer that ignores 'groups'
class CustomDepthwiseConv2D(tf.keras.layers.DepthwiseConv2D):
    def __init__(self, *args, groups=None, **kwargs):
        if 'groups' in kwargs:
            del kwargs['groups']
        super().__init__(*args, **kwargs)

# Helper logger
def log(message):
    print(f"LOG: {message}", file=sys.stderr)

# Global paths
MODEL_PATH = os.path.join("models", "lungs_pneu", "keras_model.h5")
LABELS_PATH = os.path.join("models", "lungs_pneu", "labels.txt")

# Verify existence of model and labels
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
if not os.path.exists(LABELS_PATH):
    raise FileNotFoundError(f"Labels file not found: {LABELS_PATH}")

# Load model with custom objects (only once)
log("Loading model...")
model = load_model(
    MODEL_PATH, 
    compile=False, 
    custom_objects={"DepthwiseConv2D": CustomDepthwiseConv2D}
)
log("Model loaded successfully.")

# Load labels
with open(LABELS_PATH, "r") as f:
    class_labels = [line.strip() for line in f.readlines()]
log(f"Loaded {len(class_labels)} class labels: {class_labels}")

def predict_on_image(image_path: str):
    """Run model prediction on a single image and return a dict with results."""
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")

        # Load and preprocess image
        img = Image.open(image_path).convert('RGB')
        img = ImageOps.fit(img, (224, 224), Image.Resampling.LANCZOS)
        img_array = np.asarray(img, dtype=np.float32)

        # Normalize
        img_array = (img_array / 127.5) - 1
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        # Predict
        predictions = model.predict(img_array, verbose=0)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_labels[predicted_class_index]
        confidence = float(predictions[0][predicted_class_index] * 100)

        # Build result
        result = {
            "filename": os.path.basename(image_path),
            "predicted_class": predicted_class,
            "confidence": confidence,
            "predictions": {
                label: float(pred * 100)
                for label, pred in zip(class_labels, predictions[0])
            }
        }
        return result

    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        return {"error": str(e)}
