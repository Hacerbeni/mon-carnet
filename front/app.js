const API_URL = '/api/contacts';
const listeUI = document.getElementById('liste-contacts');
const formulaire = document.getElementById('form-contact');

// 1. GET : Charger et afficher les contacts
async function chargerContacts() {
    const reponse = await fetch(API_URL);
    const contacts = await reponse.json();
    
    listeUI.innerHTML = ''; // On vide la liste avant de la reconstruire
    
    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${contact.nom} ${contact.prenom}</strong> - ${contact.telephone || 'Pas de numéro'}</span>
            <button class="btn-supprimer" onclick="supprimerContact(${contact.id})">Supprimer</button>
        `;
        listeUI.appendChild(li);
    });
}

// 2. POST : Ajouter un contact (événement sur le formulaire)
formulaire.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    const nouveauContact = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        telephone: document.getElementById('telephone').value,
        email: document.getElementById('email').value
    };

    const reponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouveauContact)
    });

    if (reponse.ok) {
        formulaire.reset(); // Vide le formulaire
        chargerContacts();  // Rafraîchit la liste
    } else {
        const erreur = await reponse.json();
        alert(erreur.erreur);
    }
});

// 3. DELETE : Supprimer un contact
async function supprimerContact(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce contact ?")) return;
    
    const reponse = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (reponse.ok) {
        chargerContacts(); // Rafraîchit la liste après suppression
    }
}

// Au chargement de la page, on appelle la fonction
chargerContacts();