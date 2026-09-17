DROP TABLE IF EXISTS emprunts CASCADE;
DROP TABLE IF EXISTS livres CASCADE;
DROP TABLE IF EXISTS adherents CASCADE;
DROP TABLE IF EXISTS auteurs CASCADE;

CREATE TABLE auteurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    nationalite VARCHAR(100)
);

CREATE TABLE adherents (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NOT NULL
);

CREATE TABLE livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    auteur_id INTEGER REFERENCES auteurs(id) ON DELETE SET NULL,
    annee_publication INTEGER,
    statut VARCHAR(20) NOT NULL DEFAULT 'disponible'
        CHECK (statut IN ('disponible', 'emprunte'))
);

CREATE TABLE emprunts (
    id SERIAL PRIMARY KEY,
    adherent_id INTEGER NOT NULL REFERENCES adherents(id) ON DELETE CASCADE,
    livre_id INTEGER NOT NULL REFERENCES livres(id) ON DELETE CASCADE,
    date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE
);

CREATE INDEX idx_livres_titre ON livres(titre);
CREATE INDEX idx_livres_auteur ON livres(auteur_id);
CREATE INDEX idx_emprunts_adherent ON emprunts(adherent_id);
CREATE INDEX idx_emprunts_livre ON emprunts(livre_id);