from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import pickle
from fastapi.middleware.cors import CORSMiddleware
import traceback

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the trained model and the TFIDF vectorizer
model = load_model('./models/genre_prediction_model.h5')
with open('./models/tfidf_vectorizer.pkl', 'rb') as file:
    tfid = pickle.load(file)

# Load the PCA transformation
with open('./models/pca_transform.pkl', 'rb') as file:
    pca = pickle.load(file)

# Define a request model for the API
class TextRequest(BaseModel):
    description: str

@app.post("/predict_genre/")
def predict_genre(request: TextRequest):
    try:
        # Transform the input description using the loaded TFIDF vectorizer
        X_input = tfid.transform([request.description])
        X_input = np.array(X_input.todense())
        
        # Apply PCA transformation
        X_input_pca = pca.transform(X_input)

        # Make the prediction
        predictions = model.predict(X_input_pca)
        predicted_genre = np.argmax(predictions, axis=1)[0]
        
        return {"predicted_genre": int(predicted_genre)}
    except Exception as e:
        print("Error during prediction:")
        print(e)
        traceback.print_exc()  # This will print the traceback in the server logs
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
