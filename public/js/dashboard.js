// Charge et affiche les statistiques sur le tableau de bord
async function chargerStatistiques() {
  const conteneur = document.getElementById('stats-grid');
  try {
    const stats = await appelApi('/statistiques');

    conteneur.innerHTML = `
      <div class="stat-card">
        <div class="valeur">${stats.total_livres}</div>
        <div class="label">Livres</div>
      </div>
      <div class="stat-card">
        <div class="valeur">${stats.total_adherents}</div>
        <div class="label">Adherents</div>
      </div>
      <div class="stat-card">
        <div class="valeur">${stats.emprunts_en_cours}</div>
        <div class="label">Emprunts en cours</div>
      </div>
      <div class="stat-card">
        <div class="valeur">${stats.emprunts_en_retard}</div>
        <div class="label">Emprunts en retard</div>
      </div>
      <div class="stat-card">
        <div class="valeur">${stats.livre_plus_emprunte ? stats.livre_plus_emprunte.titre : '-'}</div>
        <div class="label">Livre le plus emprunte</div>
      </div>
      <div class="stat-card">
        <div class="valeur">${stats.adherent_plus_actif ? stats.adherent_plus_actif.nom : '-'}</div>
        <div class="label">Adherent le plus actif</div>
      </div>
    `;
  } catch (err) {
    conteneur.innerHTML = `<p class="message-erreur">Erreur : ${err.message}</p>`;
  }
}

chargerStatistiques();