const express = require('express');
const db = require('./db');
const app = express();

// Middlewares
app.use(express.json()); // Pour lire le JSON (POST/PUT)
app.use(express.static('front')); // Sert les fichiers HTML/CSS/JS du dossier public

// --- L'API REST ---

// GET : Tous les contacts
app.get('/api/contacts', (req, res) => {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY nom ASC').all();
    res.json(contacts);
});

// POST : Ajouter un contact
app.post('/api/contacts', (req, res) => {
    const { nom, prenom, telephone, email } = req.body;
    if (!nom || !prenom) {
        return res.status(400).json({ erreur: "Le nom et le prénom sont obligatoires." });
    }
    const info = db.prepare('INSERT INTO contacts (nom, prenom, telephone, email) VALUES (?, ?, ?, ?)')
        .run(nom, prenom, telephone || null, email || null);
    
    const nouveauContact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(nouveauContact);
});

// PUT : Modifier un contact
app.put('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const { nom, prenom, telephone, email } = req.body;
    
    if (!nom || !prenom) {
        return res.status(400).json({ erreur: "Le nom et le prénom sont obligatoires." });
    }

    const info = db.prepare('UPDATE contacts SET nom = ?, prenom = ?, telephone = ?, email = ? WHERE id = ?')
        .run(nom, prenom, telephone || null, email || null, id);

    if (info.changes === 0) {
        return res.status(404).json({ erreur: "Contact introuvable." });
    }
    
    res.json(db.prepare('SELECT * FROM contacts WHERE id = ?').get(id));
});

// DELETE : Supprimer un contact
app.delete('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const info = db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
    
    if (info.changes === 0) {
        return res.status(404).json({ erreur: "Contact introuvable." });
    }
    res.status(204).end();
});

// Démarrage du serveur
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});