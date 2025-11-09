# 🌿 Plant-Disease-Detection
This project aims to identify plant leaf diseases using Convolutional Neural Networks (CNN). It preprocesses plant images, trains a deep learning model for classification, and provides accurate predictions of plant health. The goal is to assist farmers and researchers in early disease detection to improve crop yield and reduce losses.



## 🧩 Problem Statement
Plant diseases can significantly reduce agricultural productivity and affect food security. Early detection of these diseases is crucial for preventing widespread damage and helping farmers take timely actions.  
The goal of this project is to build a deep learning-based system that can automatically detect and classify plant leaf diseases from images. Using Convolutional Neural Networks (CNNs), the system analyzes leaf images and predicts whether a plant is healthy or affected by a specific disease.

---

## 📅 Week 1 task

### 🔹 Problem Statement
In Week 1, the focus is on **understanding the project scope, collecting the dataset, and setting up the basic model structure** for plant disease classification.  
The objectives for this week include:
- Understanding the problem domain and expected outcomes.
- Exploring datasets containing plant leaf images.
- Performing initial preprocessing on the dataset (resizing, normalization, labeling).
- Designing the initial CNN model structure for classification.

### 🔹 Dataset
The dataset used for this project is the **PlantVillage Dataset**, which contains images of both healthy and diseased plant leaves across multiple species.  
**Key Details:**
- Total Images: ~54,000  
- Classes: 38 plant species and diseases  
- Format: RGB images (256x256 pixels)  
- Source: [PlantVillage Dataset on Kaggle](https://www.kaggle.com/datasets/moazeldsokyx/plantvillage)

---


## 📅 Week 2 Task

### 🔹 Model Training and Evaluation
In Week 2, the focus was on **training and evaluating the deep learning model** using the prepared dataset. The following steps were carried out:

- **Image Preprocessing:**  
  - Loaded and augmented training and validation images.  
  - Normalized pixel values to improve convergence.  

- **Model Architecture:**  
  - Built a CNN model with multiple convolutional, pooling, and dense layers.  
  - Included dropout layers to prevent overfitting.  

- **Model Compilation:**  
  - Used `Adam` optimizer and `categorical_crossentropy` loss function.  
  - Tracked metrics like `accuracy` during training.  

- **Model Training:**  
  - Trained the model using training data for multiple epochs.  
  - Monitored training and validation accuracy/loss.  

- **Evaluation and Saving:**  
  - Evaluated performance on validation data.  
  - Saved the trained model for deployment and future inference.

📘 *All training and evaluation steps are demonstrated in the `model_training.ipynb` notebook.*

---


## 🧑‍💻 Author
**Akassh M**  
[Portfolio](https://akassh-m-portfolio.vercel.app) | [GitHub](https://github.com/AKASSH-M) | [LinkedIn](https://www.linkedin.com/in/akassh-m-b0a339307/)
