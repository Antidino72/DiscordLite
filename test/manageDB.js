const db = require('../src/db/index'); // Supposé être une instance de pg.Pool

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
    "PostgreSQL + Express + Socket.io = le combo parfait 👌",
    "Haha tellement vrai !",
    "Attention, message de test numéro...",
    "Tout fonctionne nickel sur la BDD !"
];

// Fonction pour tout vider et réinitialiser l'auto-incrément (SERIAL / BIGSERIAL)
async function clearMessages() {
    try {
        // TRUNCATE ... RESTART IDENTITY vide la table et remet la séquence d'ID à 1
        await db.query('TRUNCATE TABLE messages RESTART IDENTITY CASCADE;');
        console.log("🧹 Tous les anciens messages ont été supprimés et la séquence d'ID a été réinitialisée.");
    } catch (error) {
        console.error("❌ Erreur lors du nettoyage de la BDD :", error);
    }
}

// Fonction pour générer les faux messages
async function generateFakeMessages(count = 100) {
    console.log(`⏳ Génération de ${count} faux messages en cours...`);

    const client = await db.getClient ? await db.getClient() : await db.connect(); // Obtient un client pour la transaction

    try {
        await client.query('BEGIN'); // Début de la transaction

        const insertQuery = `
            INSERT INTO messages (user_id, username, user_image, content)
            VALUES ($1, $2, $3, $4)
        `;

        for (let i = 1; i <= count; i++) {
            const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
            const randomText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
            const content = `${randomText} (N°${i})`;

            await client.query(insertQuery, [user.id, user.username, user.image, content]);
        }

        await client.query('COMMIT'); // Validation de la transaction
        console.log(`✅ Succès ! ${count} messages ont été insérés.`);
    } catch (error) {
        await client.query('ROLLBACK'); // Annulation en cas d'erreur
        console.error("❌ Erreur lors de l'insertion :", error);
    } finally {
        client.release(); // Libère le client pour le pool
    }
}

// --- GESTION DES ARGUMENTS CLI ET EXÉCUTION ---
async function run() {
    const args = process.argv.slice(2);

    // Vérification des flags de nettoyage
    const shouldClear = args.includes('--clear') || args.includes('-c') || args.includes('--clean');

    // Récupération d'un éventuel nombre personnalisé (ex: node seed.js 50)
    const countArg = args.find(arg => !isNaN(parseInt(arg)));
    const countToGenerate = countArg ? parseInt(countArg) : 100;

    if (shouldClear) {
        await clearMessages();
    } else {
        await generateFakeMessages(countToGenerate);
    }

    // Fermeture propre de la connexion si db.end existe
    if (db.end) {
        await db.end();
    }
}

run();