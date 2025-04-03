# extract_frames.py
import cv2
import os

def split_video_to_frames(video_path: str, output_folder: str, frame_rate_divisor: int = 1, apply_colormap: bool = False):
    """
    Splits a video into frames, allowing frame skipping and optional colormap enhancement.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: OpenCV cannot read the video file.")
        return []

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    print(f"Video Total Frame: {total_frames} frames, {fps:.2f} FPS")

    saved_frames = []
    frame_id = 0

    while frame_id < total_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_id)  # Jump to the specific frame
        ret, frame = cap.read()
        if not ret:
            break

        if apply_colormap:
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            frame = cv2.applyColorMap(gray_frame, cv2.COLORMAP_JET)

        frame_filename = f"frame_{frame_id:05d}.png"
        output_path = os.path.join(output_folder, frame_filename)
        cv2.imwrite(output_path, frame)
        saved_frames.append(output_path)
        print(f" Saved frame: {output_path}")

        frame_id += frame_rate_divisor  # Skip frames

    cap.release()
    print(f"Total frames extracted: {len(saved_frames)}")
    return saved_frames
