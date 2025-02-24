// genreUtils.ts

export const fetchGenre = async (text: string) => {
    try {
      const response = await fetch('http://0.0.0.0:8000/predict_genre/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: text }),
      });
      const data = await response.json();
      return data.predicted_genre;
    } catch (error) {
      console.error('Error fetching genre:', error);
      return null;
    }
  };

  