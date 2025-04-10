
🎙️ PodPulse: AI-Driven Podcast Creator

PodPulse is an intelligent platform that simplifies the entire podcast production pipeline. It leverages AI to assist with content creation, editing, publishing, and audience engagement—making podcasting more efficient, accessible, and fun.

---

🚀 Features

🎤 AI-Powered Content Creation
- Text-to-Speech Generation – Convert scripts into natural-sounding audio.
- Spelling & Grammar Correction – Ensure polished content using NLP tools.
- Real-Time Feedback – Improve content quality with live suggestions.

🔍 Enhanced User Experience
- Voice Search Integration – Search podcasts using natural voice queries.
- Notifications System – Stay updated with smart alerts.
- Offline Listening Support – Download and enjoy content without an internet connection.

🖼️ Automated Thumbnails
- Generate professional-grade podcast thumbnails using AI image tools.

---

🛠️ Tech Stack

Frontend
- Framework: Next.js (React)
- Language: TypeScript

Backend
- Convex – Realtime backend-as-a-service
- Clerk – Authentication and user management

Styling
- Tailwind CSS – Utility-first styling framework
- ShadCN – Component library built on Radix UI

AI & ML
- scikit-learn – ML model for podcast genre classification
- TensorFlow.js – Client-side AI features
- NLP Libraries – Text analysis for correction and insights

---

🧪 Setup & Installation

1. Clone the Repository
git clone https://github.com/Aashika101/Podcast.git
cd Podcast

2. Install Dependencies
npm install

3. Run the Development Servers
# Start the Next.js frontend
npm run dev

# In another terminal, run the Convex backend
npx convex dev

4. Run the Genre Classification Model
# Navigate to the AI Model folder
cd AI\ Model

# Run the Python API
python api.py

💡 Note: Before running the classification model, make sure to download and prepare the model files.

---

📁 Additional Resources

- AI Model Code:  
  https://github.com/Aashika101/AImodel  
  (Also available in the /AI Model folder in this repo.)

- Dataset for Genre Classification:  
  https://github.com/Aashika101/AImodel/tree/main/datasets

---