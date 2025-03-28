import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Create a custom DepthwiseConv2D layer that handles the 'groups' parameter
class CustomDepthwiseConv2D(tf.keras.layers.DepthwiseConv2D):
    def __init__(self, *args, groups=None, **kwargs):
        # Remove 'groups' from kwargs if present, as it's not used in DepthwiseConv2D
        if 'groups' in kwargs:
            del kwargs['groups']
        super().__init__(*args, **kwargs)

def main():
    try:
        print("Starting the program...")
        print(f"TensorFlow version: {tf.__version__}")
        
        # Load model with custom layer
        print("Loading Keras model...")
        model = tf.keras.models.load_model('keras_model.h5', compile=False, custom_objects={
            'DepthwiseConv2D': CustomDepthwiseConv2D
        })
        print("Model loaded successfully!")

        # Read labels
        with open('labels.txt', 'r') as f:
            class_labels = [line.strip() for line in f.readlines()]
        print(f"Found {len(class_labels)} classes: {class_labels}")

        # Process images
        input_dir = 'imput_img'
        if not os.path.exists(input_dir):
            print(f"Error: Directory '{input_dir}' not found!")
            return

        image_files = [f for f in os.listdir(input_dir) 
                      if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        if not image_files:
            print(f"No images found in {input_dir}")
            print(f"Contents of {input_dir}:", os.listdir(input_dir))
            return

        print(f"Found {len(image_files)} images to process")

        for image_file in image_files:
            try:
                image_path = os.path.join(input_dir, image_file)
                print(f"\nProcessing {image_path}")
                
                # Load and preprocess image
                img = Image.open(image_path)
                img = img.convert('RGB')
                img = img.resize((224, 224))
                
                # Convert to numpy array and normalize
                img_array = np.array(img)
                img_array = img_array.astype('float32') / 255.0
                img_array = np.expand_dims(img_array, axis=0)
                
                # Make prediction
                predictions = model.predict(img_array, verbose=0)
                
                # Get prediction results
                predicted_class_index = np.argmax(predictions[0])
                predicted_class = class_labels[predicted_class_index]
                confidence = predictions[0][predicted_class_index] * 100
                
                print(f"Results for {image_file}:")
                print(f"Predicted Class: {predicted_class}")
                print(f"Confidence: {confidence:.2f}%")
                
                # Print all probabilities
                print("\nAll class probabilities:")
                for i, label in enumerate(class_labels):
                    prob = predictions[0][i] * 100
                    print(f"{label}: {prob:.2f}%")

            except Exception as e:
                print(f"Error processing {image_file}: {str(e)}")
                import traceback
                traceback.print_exc()

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
