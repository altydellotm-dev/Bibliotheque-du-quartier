const API_URL = '/api';

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
