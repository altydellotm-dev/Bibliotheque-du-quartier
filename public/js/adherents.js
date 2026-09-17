const listeAdherents = document.getElementById('liste-adherents');
const formAdherent = document.getElementById('form-adherent');

async function chargerAdherents() {
  try {
    const adherents = await appelApi('/adherents');

    if (adherents.length === 0) {
      listeAdherents.innerHTML = '<tr><td colspan="2">Aucun adherent trouve</td></tr>';
      return;
    }

    listeAdherents.innerHTML = adherents.map(adherent => `
      <tr>
        <td data-label="Nom">${adherent.nom}</td>
        <td data-label="Contact">${adherent.contact}</td>
      </tr>
    `).join('');
  } catch (err) {
    listeAdherents.innerHTML = `<tr><td colspan="2" class="message-erreur">Erreur : ${err.message}</td></tr>`;
  }
}

formAdherent.addEventListener('submit', async (e) => {
  e.preventDefault();
  const erreurDiv = document.getElementById('erreur-adherent');
  erreurDiv.textContent = '';

  const nom = document.getElementById('nom').value;
  const contact = document.getElementById('contact').value;

  try {
    await appelApi('/adherents', {
      method: 'POST',
      body: JSON.stringify({ nom, contact }),
    });
    formAdherent.reset();
    chargerAdherents();
  } catch (err) {
    erreurDiv.textContent = err.message;
  }
});

chargerAdherents();