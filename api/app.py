from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Added this import
import pandas as pd
import pickle
import numpy as np

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # <-- Added this line to enable CORS

# Load the trained model and other necessary data
# Ensure the model file (e.g., model.pkl) is in the same directory
try:
    with open('model.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
except FileNotFoundError:
    print("Error: 'model.pkl' not found. Please ensure your trained model is saved and in the correct directory.")
    model = None

# Define the API endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded.'}), 500

    data = request.get_json(force=True)
    try:
        input_data = pd.DataFrame(data, index=[0])
        prediction = model.predict(input_data)
        
        # This is the line to fix the error:
        # Convert the NumPy int32 to a standard Python int
        prediction_as_int = int(prediction[0])
        
        return jsonify({'prediction': prediction_as_int})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Run the Flask application
if __name__ == '__main__':
    # Use debug=True for development, disable in production
    app.run(debug=True)