# main.py
import os
import shutil
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Local imports
from extract_frames import split_video_to_frames
from predictor import predict_on_image, get_available_models

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
VIDEO_UPLOAD_DIR = "video_input"      # Where uploaded videos are saved
FRAME_OUTPUT_DIR = "frames"     # Where frames get extracted
IMAGE_UPLOAD_DIR = "image_uploads"    # If you also want to store uploaded images

# Ensure directories exist
os.makedirs(VIDEO_UPLOAD_DIR, exist_ok=True)
os.makedirs(FRAME_OUTPUT_DIR, exist_ok=True)
os.makedirs(IMAGE_UPLOAD_DIR, exist_ok=True)

# Serve frames as static files
app.mount("/frames", StaticFiles(directory=FRAME_OUTPUT_DIR), name="frames")
app.mount("/image_uploads", StaticFiles(directory=IMAGE_UPLOAD_DIR), name="image_uploads")

@app.get("/models")
async def list_models():
    """Return information about all available models."""
    logger.info("Getting available models")
    return JSONResponse(get_available_models())

@app.post("/upload_video")
async def upload_video(
    file: UploadFile = File(...),
    model_id: str = Form(...)
):
    """
    1. Receive a video.
    2. Extract frames.
    3. Predict using specified model on each frame.
    4. Return JSON with predictions.
    """
    logger.info(f"Received video upload request for model: {model_id}")
    try:
        # Save the uploaded video
        video_path = os.path.join(VIDEO_UPLOAD_DIR, file.filename)
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Saved video to: {video_path}")

        # Extract frames
        frames = split_video_to_frames(
            video_path=video_path,
            output_folder=FRAME_OUTPUT_DIR,
            frame_rate_divisor=100,  # Adjust as needed
            apply_colormap=False
        )
        logger.info(f"Extracted {len(frames)} frames")

        # Run predictions on each frame
        results = []
        for frame_path in frames:
            prediction = predict_on_image(frame_path, model_id)
            results.append(prediction)
        logger.info(f"Completed predictions for {len(frames)} frames")

        # Return results
        return JSONResponse({"results": results})
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload_image")
async def upload_image(
    file: UploadFile = File(...),
    model_id: str = Form(...)
):
    """
    1. Receive an image.
    2. Predict using specified model on this single image.
    3. Return JSON with prediction.
    """
    logger.info(f"Received image upload request for model: {model_id}")
    try:
        # Save the uploaded image
        image_path = os.path.join(IMAGE_UPLOAD_DIR, file.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Saved image to: {image_path}")

        # Predict on this single image
        result = predict_on_image(image_path, model_id)
        logger.info(f"Completed prediction: {result}")
        return JSONResponse(result)
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
