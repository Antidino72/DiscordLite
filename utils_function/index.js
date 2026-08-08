const db = require('../src/db/index');

const fakeUsers = [
    { id: 1, username: 'Antoine Veillé', image: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, username: 'Alice_Dev', image: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, username: 'Bob_Tester', image: 'https://i.pravatar.cc/150?img=12' },
    { id: 4, username: 'Charlie_Bot', image: 'https://i.pravatar.cc/150?img=33' }
];

const sampleMessages = [
    "Salut tout le monde ! Vous allez bien ?",
    "Est-ce que le système de scroll infini fonctionne ?",
    "Je fais un petit test d'envoi de message.",
    "WebStorm, c'est vraiment un super IDE.",
    "Quelqu'un veut faire une partie ce soir ?",
    "Le CSS 'content-visibility' est vraiment magique pour les perfs.",
    "SQLite + Express + Socket.io = le combo parfait 👌",
    "Haha tellement vrai !",
    "Attention, message de test numéro...",
    "Tout fonctionne nickel sur la BDD !"
];

// Préparation des requêtes
const insertStmt = db.prepare(`
    INSERT INTO messages (user_id, username, user_image, content)
    VALUES (?, ?, ?, ?)
`);

const clearStmt = db.prepare('DELETE FROM messages');
const resetSeqStmt = db.prepare("DELETE FROM sqlite_sequence WHERE name='messages'");

// Fonction pour tout vider
function clearMessages() {
    db.transaction(() => {
        clearStmt.run();
        try {
            resetSeqStmt.run(); // Réinitialise l'AUTOINCREMENT de l'ID à 1
        } catch (e) {
            // Ignoré si la table n'utilise pas AUTOINCREMENT
        }
    })();
    console.log("🧹 Tous les anciens messages ont été supprimés de la BDD.");
}

function generateFakeMessages(count = 100) {
    console.log(`⏳ Génération de ${count} faux messages en cours...`);

    const insertMany = db.transaction((total) => {
        for (let i = 1; i <= total; i++) {
            const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
            const randomText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
            const content = `${randomText} (N°${i})`;

            insertStmt.run(user.id, user.username, user.image, content);
        }
    });

    try {
        insertMany(count);
        console.log(`✅ Succès ! ${count} messages ont été insérés.`);
    } catch (error) {
        console.error("❌ Erreur lors de l'insertion :", error);
    }
}

// --- GESTION DES ARGUMENTS CLI ---
const args = process.argv.slice(2);

// Vérification des flags de nettoyage
const shouldClear = args.includes('--clear') || args.includes('-c') || args.includes('--clean');

// Récupération d'un éventuel nombre personnalisé (ex: node seed.js 50)
const countArg = args.find(arg => !isNaN(parseInt(arg)));
const countToGenerate = countArg ? parseInt(countArg) : 100;

if (shouldClear) {
    clearMessages();
}else {
    generateFakeMessages(countToGenerate);
}

