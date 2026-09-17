const formEmprunt = document.getElementById('form-emprunt');
const selectAdherent = document.getElementById('adherent_id');
const selectLivre = document.getElementById('livre_id');
const listeEnCours = document.getElementById('liste-emprunts-cours');
const listeEnRetard = document.getElementById('liste-emprunts-retard');

// Formate une date ISO en format lisible jj/mm/aaaa
function formaterDate(dateIso) {
  if (!dateIso) return '-';
  const d = new Date(dateIso);
  return d.toLocaleDateString('fr-FR');
}

// Remplit le menu deroulant des adherents
async function chargerAdherentsDansSelect() {
  try {
    const adherents = await appelApi('/adherents');
    selectAdherent.innerHTML = '<option value="">-- Choisir --</option>' +
      adherents.map(a => `<option value="${a.id}">${a.nom}</option>`).join('');
  } catch (err) {
    console.error('Erreur chargement adherents', err);
  }
}

// Remplit le menu deroulant avec seulement les livres disponibles
async function chargerLivresDisponiblesDansSelect() {
  try {
    const reponse = await appelApi('/livres?limit=100');
    const livresDisponibles = reponse.data.filter(l => l.statut === 'disponible');
    selectLivre.innerHTML = '<option value="">-- Choisir --</option>' +
      livresDisponibles.map(l => `<option value="${l.id}">${l.titre}</option>`).join('');
  } catch (err) {
    console.error('Erreur chargement livres', err);
  }
}

// Charge la liste des emprunts en cours
async function chargerEmpruntsEnCours() {
  try {
    const emprunts = await appelApi('/emprunts/en-cours');
    if (emprunts.length === 0) {
      listeEnCours.innerHTML = '<tr><td colspan="5">Aucun emprunt en cours</td></tr>';
      return;
    }
    listeEnCours.innerHTML = emprunts.map(e => `
      <tr>
        <td data-label="Adherent">${e.adherent_nom}</td>
        <td data-label="Livre">${e.livre_titre}</td>
        <td data-label="Date d'emprunt">${formaterDate(e.date_emprunt)}</td>
        <td data-label="Retour prevu">${formaterDate(e.date_retour_prevue)}</td>
        <td data-label="Action"><button onclick="retournerLivre(${e.id})">Marquer comme rendu</button></td>
      </tr>
    `).join('');
  } catch (err) {
    listeEnCours.innerHTML = `<tr><td colspan="5" class="message-erreur">Erreur : ${err.message}</td></tr>`;
  }
}

// Charge la liste des emprunts en retard
async function chargerEmpruntsEnRetard() {
  try {
    const emprunts = await appelApi('/emprunts/en-retard');
    if (emprunts.length === 0) {
      listeEnRetard.innerHTML = '<tr><td colspan="5">Aucun emprunt en retard</td></tr>';
      return;
    }
    listeEnRetard.innerHTML = emprunts.map(e => `
      <tr class="en-retard">
        <td data-label="Adherent">${e.adherent_nom}</td>
        <td data-label="Livre">${e.livre_titre}</td>
        <td data-label="Date d'emprunt">${formaterDate(e.date_emprunt)}</td>
        <td data-label="Retour prevu">${formaterDate(e.date_retour_prevue)}</td>
        <td data-label="Action"><button onclick="retournerLivre(${e.id})">Marquer comme rendu</button></td>
      </tr>
    `).join('');
  } catch (err) {
    listeEnRetard.innerHTML = `<tr><td colspan="5" class="message-erreur">Erreur : ${err.message}</td></tr>`;
  }
}

// Recharge tout apres une action (creation ou retour)
function rechargerTout() {
  chargerEmpruntsEnCours();
  chargerEmpruntsEnRetard();
  chargerLivresDisponiblesDansSelect();
}

// Marque un emprunt comme rendu
async function retournerLivre(id) {
  try {
    await appelApi(`/emprunts/${id}/retour`, { method: 'PUT' });
    rechargerTout();
  } catch (err) {
    alert('Erreur : ' + err.message);
  }
}

// Soumission du formulaire de creation d'emprunt
formEmprunt.addEventListener('submit', async (e) => {
  e.preventDefault();
  const erreurDiv = document.getElementById('erreur-emprunt');
  erreurDiv.textContent = '';

  const adherent_id = selectAdherent.value;
  const livre_id = selectLivre.value;
  const date_retour_prevue = document.getElementById('date_retour_prevue').value;

  try {
    await appelApi('/emprunts', {
      method: 'POST',
      body: JSON.stringify({ adherent_id, livre_id, date_retour_prevue }),
    });
    formEmprunt.reset();
    rechargerTout();
  } catch (err) {
    erreurDiv.textContent = err.message;
  }
});

chargerAdherentsDansSelect();
chargerLivresDisponiblesDansSelect();
chargerEmpruntsEnCours();
chargerEmpruntsEnRetard();