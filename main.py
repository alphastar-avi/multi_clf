# main.py
import os
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Local imports
from extract_frames import split_video_to_frames
from predictor import predict_on_image

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
FRAME_OUTPUT_DIR = "frame_output"     # Where frames get extracted
IMAGE_UPLOAD_DIR = "image_uploads"    # If you also want to store uploaded images

# Ensure directories exist
os.makedirs(VIDEO_UPLOAD_DIR, exist_ok=True)
os.makedirs(FRAME_OUTPUT_DIR, exist_ok=True)
os.makedirs(IMAGE_UPLOAD_DIR, exist_ok=True)

# Serve frames as static files (optional)
# This way, you can access them at: http://localhost:8000/frames/<filename>
app.mount("/frames", StaticFiles(directory=FRAME_OUTPUT_DIR), name="frames")
app.mount("/image_uploads", StaticFiles(directory=IMAGE_UPLOAD_DIR), name="image_uploads")

@app.post("/upload_video")
async def upload_video(file: UploadFile = File(...)):
    """
    1. Receive a video.
    2. Extract frames.
    3. Predict pneumonia on each frame.
    4. Return JSON with predictions.
    """
    # Save the uploaded video
    video_path = os.path.join(VIDEO_UPLOAD_DIR, file.filename)
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract frames
    frames = split_video_to_frames(
        video_path=video_path,
        output_folder=FRAME_OUTPUT_DIR,
        frame_rate_divisor=100,  # Adjust as needed
        apply_colormap=False
    )

    # Run predictions on each frame
    results = []
    for frame_path in frames:
        prediction = predict_on_image(frame_path)
        results.append(prediction)

    # Return results
    return JSONResponse({"results": results})

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    """
    1. Receive an image.
    2. Predict pneumonia on this single image.
    3. Return JSON with prediction.
    """
    # Save the uploaded image
    image_path = os.path.join(IMAGE_UPLOAD_DIR, file.filename)
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Predict on this single image
    result = predict_on_image(image_path)
    return JSONResponse(result)
