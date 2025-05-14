# Multi-Modal Medical Image Analysis System

This repository presents a comprehensive deep learning-based medical image analysis system for automated detection of multiple medical conditions using CT scans. The system supports both image and video inputs and is capable of detecting pneumonia, brain strokes, kidney stones, and spine fractures. It is designed with a modular architecture and provides a modern user interface for ease of use by medical professionals.

---




https://github.com/user-attachments/assets/70985e8a-8e4d-4af8-8298-8a2216c414ba




## Features

- Multi-disease detection: Pneumonia, Stroke, Kidney Stones, Spine Fractures
- Deep learning with EfficientNet and custom CNN layers
- Support for CT image and video inputs
- Real-time inference with confidence scoring
- FastAPI backend and Next.js frontend
- Modular, extensible system for additional models

---

## Table of Contents

- [Installation](#installation)
- [System Requirements](#system-requirements)
- [Usage](#usage)
- [Architecture](#architecture)
- [Model Details](#model-details)
- [Performance](#performance)
- [Example Code](#example-code)
- [Clinical Relevance](#clinical-relevance)
- [References](#references)
- [License](#license)

---

## Installation

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

cd frontend
npm install react-icons --legacy-peer-deps
npm run dev
