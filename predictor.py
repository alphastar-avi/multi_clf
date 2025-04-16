# predictor.py
import tensorflow as tf
import numpy as np
import os
import json
import sys
import traceback
from PIL import Image, ImageOps
from tensorflow.keras.models import load_model # type: ignore
from typing import Dict, List, Optional

# Create a custom DepthwiseConv2D layer that ignores 'groups'
class CustomDepthwiseConv2D(tf.keras.layers.DepthwiseConv2D):
    def __init__(self, *args, groups=None, **kwargs):
        if 'groups' in kwargs:
            del kwargs['groups']
        super().__init__(*args, **kwargs)

# Helper logger
def log(message):
    print(f"LOG: {message}", file=sys.stderr)

# Model configuration
MODELS_CONFIG = {
    "lungs_pneu": {
        "name": "Lung Pneumonia Detection",
        "model_path": os.path.join("models", "lungs_pneu", "keras_model.h5"),
        "labels_path": os.path.join("models", "lungs_pneu", "labels.txt")
    },
    "brain_stroke": {
        "name": "Brain Stroke Detection",
        "model_path": os.path.join("models", "brain_stroke", "keras_model.h5"),
        "labels_path": os.path.join("models", "brain_stroke", "labels.txt")
    },
    "kidney_stone": {
        "name": "Kidney Stone Detection",
        "model_path": os.path.join("models", "kidney_stone", "keras_model.h5"),
        "labels_path": os.path.join("models", "kidney_stone", "labels.txt")
    },
    "spine_fracture": {
        "name": "Spine Fracture Detection",
        "model_path": os.path.join("models", "spine_fracture", "keras_model.h5"),
        "labels_path": os.path.join("models", "spine_fracture", "labels.txt")
    }
}

# Load all models and their labels
models: Dict[str, Dict] = {}
for model_id, config in MODELS_CONFIG.items():
    try:
        log(f"\n=== Loading Model: {model_id} ===")
        log(f"Model path: {config['model_path']}")
        log(f"Labels path: {config['labels_path']}")
        
        # Verify existence of model and labels
        if not os.path.exists(config["model_path"]):
            log(f"ERROR: Model file not found for {model_id}: {config['model_path']}")
            continue
        if not os.path.exists(config["labels_path"]):
            log(f"ERROR: Labels file not found for {model_id}: {config['labels_path']}")
            continue

        # Check file sizes
        model_size = os.path.getsize(config["model_path"])
        labels_size = os.path.getsize(config["labels_path"])
        log(f"Model file size: {model_size} bytes")
        log(f"Labels file size: {labels_size} bytes")

        # Load model
        log(f"Loading model for {model_id}...")
        try:
            model = load_model(
                config["model_path"],
                compile=False,
                custom_objects={"DepthwiseConv2D": CustomDepthwiseConv2D}
            )
            log(f"Model loaded successfully for {model_id}")
        except Exception as e:
            log(f"ERROR loading model file: {str(e)}")
            traceback.print_exc(file=sys.stderr)
            continue

        # Load labels
        try:
            with open(config["labels_path"], "r") as f:
                class_labels = [line.strip() for line in f.readlines()]
            log(f"Loaded {len(class_labels)} class labels for {model_id}: {class_labels}")
        except Exception as e:
            log(f"ERROR loading labels file: {str(e)}")
            traceback.print_exc(file=sys.stderr)
            continue

        models[model_id] = {
            "model": model,
            "labels": class_labels,
            "name": config["name"]
        }
        log(f"Successfully loaded model for {model_id} with {len(class_labels)} classes")

    except Exception as e:
        log(f"ERROR loading model {model_id}: {str(e)}")
        traceback.print_exc(file=sys.stderr)

log("\n=== Final Loaded Models ===")
for model_id in models.keys():
    log(f"- {model_id}")
log(f"Total models loaded: {len(models)}")

def get_available_models() -> List[Dict]:
    """Return information about available models."""
    log("\nGetting available models...")
    available_models = [
        {
            "id": model_id,
            "name": config["name"],
            "classes": config["labels"]
        }
        for model_id, config in models.items()
    ]
    log(f"Available models: {[m['id'] for m in available_models]}")
    return available_models

def predict_on_image(image_path: str, model_id: str) -> Dict:
    """Run model prediction on a single image and return a dict with results."""
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")

        log(f"\n=== Attempting Prediction ===")
        log(f"Model requested: {model_id}")
        log(f"Available models: {list(models.keys())}")

        if model_id not in models:
            raise ValueError(f"Model {model_id} not found. Available models: {list(models.keys())}")

        model_config = models[model_id]
        model = model_config["model"]
        class_labels = model_config["labels"]

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

        # Check if the predicted class is a normal CT (starts with "0")
        is_normal = predicted_class.startswith("0")

        # Build result
        result = {
            "model_id": model_id,
            "model_name": model_config["name"],
            "filename": os.path.basename(image_path),
            "predicted_class": predicted_class,
            "confidence": confidence,
            "is_normal": is_normal,  # Add flag for normal CT
            "predictions": {
                label: float(pred * 100)
                for label, pred in zip(class_labels, predictions[0])
            }
        }
        log(f"Prediction successful for {model_id}")
        log(f"Predicted class: {predicted_class} (Normal CT: {is_normal})")
        return result

    except Exception as e:
        log(f"ERROR in prediction: {str(e)}")
        traceback.print_exc(file=sys.stderr)
        return {"error": str(e)}
