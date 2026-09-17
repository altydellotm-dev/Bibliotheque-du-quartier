const API_URL = 'http://localhost:3000/api';

// Fonction generique pour appeler l'API et gerer les erreurs
async function appelApi(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Erreur inconnue');
  }
  return data;
}