const listeLivres = document.getElementById('liste-livres');
const champRecherche = document.getElementById('recherche-livre');
const formLivre = document.getElementById('form-livre');
const formAuteur = document.getElementById('form-auteur');
const selectAuteur = document.getElementById('auteur_id');
const paginationDiv = document.getElementById('pagination-livres');

let pageActuelle = 1;

// Charge et affiche les livres, avec recherche et pagination
async function chargerLivres(recherche = '', page = 1) {
  try {
    let query = `?page=${page}&limit=5`;
    if (recherche) query += `&search=${encodeURIComponent(recherche)}`;
    const reponse = await appelApi(`/livres${query}`);
    const livres = reponse.data;
    const { totalPages, page: pageCourante } = reponse.pagination;
    pageActuelle = pageCourante;

    if (livres.length === 0) {
      listeLivres.innerHTML = '<tr><td colspan="4">Aucun livre trouve</td></tr>';
    } else {
      listeLivres.innerHTML = livres.map(livre => `
      <tr>
        <td data-label="Titre">${livre.titre}</td>
        <td data-label="Auteur">${livre.auteur_nom || '-'}</td>
        <td data-label="Annee">${livre.annee_publication || '-'}</td>
        <td data-label="Statut" class="statut-${livre.statut}">${livre.statut}</td>
      </tr>
    `).join('');
    }

    // Affiche les boutons de pagination
    if (totalPages > 1) {
      let boutons = '';
      for (let i = 1; i <= totalPages; i++) {
        boutons += `<button onclick="chargerLivres('${recherche}', ${i})" ${i === pageActuelle ? 'disabled' : ''}>${i}</button> `;
      }
      paginationDiv.innerHTML = boutons;
    } else {
      paginationDiv.innerHTML = '';
    }
  } catch (err) {
    listeLivres.innerHTML = `<tr><td colspan="4" class="message-erreur">Erreur : ${err.message}</td></tr>`;
  }
}

// Remplit le menu deroulant des auteurs pour le formulaire livre
async function chargerAuteursDansSelect() {
  try {
    const auteurs = await appelApi('/auteurs');
    selectAuteur.innerHTML = '<option value="">-- Aucun --</option>' +
      auteurs.map(a => `<option value="${a.id}">${a.nom}</option>`).join('');
  } catch (err) {
    console.error('Erreur chargement auteurs', err);
  }
}

// Recherche en temps reel (revient a la page 1)
champRecherche.addEventListener('input', () => {
  chargerLivres(champRecherche.value, 1);
});

// Soumission du formulaire d'ajout de livre
formLivre.addEventListener('submit', async (e) => {
  e.preventDefault();
  const erreurDiv = document.getElementById('erreur-livre');
  erreurDiv.textContent = '';

  const titre = document.getElementById('titre').value;
  const auteur_id = selectAuteur.value || null;
  const annee_publication = document.getElementById('annee_publication').value || null;

  try {
    await appelApi('/livres', {
      method: 'POST',
      body: JSON.stringify({ titre, auteur_id, annee_publication }),
    });
    formLivre.reset();
    chargerLivres(champRecherche.value, 1);
  } catch (err) {
    erreurDiv.textContent = err.message;
  }
});

// Soumission du formulaire d'ajout d'auteur
formAuteur.addEventListener('submit', async (e) => {
  e.preventDefault();
  const erreurDiv = document.getElementById('erreur-auteur');
  erreurDiv.textContent = '';

  const nom = document.getElementById('nom-auteur').value;
  const nationalite = document.getElementById('nationalite').value || null;

  try {
    await appelApi('/auteurs', {
      method: 'POST',
      body: JSON.stringify({ nom, nationalite }),
    });
    formAuteur.reset();
    chargerAuteursDansSelect();
  } catch (err) {
    erreurDiv.textContent = err.message;
  }
});

chargerLivres();
chargerAuteursDansSelect();