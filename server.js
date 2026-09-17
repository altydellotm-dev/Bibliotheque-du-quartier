const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');

const auteursRoutes = require('./src/routes/auteurs.routes');
const adherentsRoutes = require('./src/routes/adherents.routes');
const livresRoutes = require('./src/routes/livres.routes');
const empruntsRoutes = require('./src/routes/emprunts.routes');
const statsRoutes = require('./src/routes/stats.routes');

const app = express();
app.use(express.static('public'));

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/auteurs', auteursRoutes);
app.use('/api/adherents', adherentsRoutes);
app.use('/api/livres', livresRoutes);
app.use('/api/emprunts', empruntsRoutes);
app.use('/api/statistiques', statsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvee' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur demarre sur http://localhost:${PORT}`);
});