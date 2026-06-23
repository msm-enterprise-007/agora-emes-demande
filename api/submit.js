import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { nom, prenom, email, typeDemande, niveau, motivation, macTel, macPc } = req.body;

    // Validation de sécurité basique
    if (!nom || !prenom || !email || !typeDemande || !macTel) {
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });
    }

    // Formatage des données identique à ta capture image_372f05.png
    const nouvelleDemande = {
      id: `req_${Date.now()}`,
      nomComplet: `${prenom} ${nom}`,
      email: email.toLowerCase().trim(),
      type: typeDemande === 'stage' ? 'Stagiaire' : 'Formation continue',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      niveau: niveau || 'N/A',
      motivation: motivation || 'Aucune motivation fournie.',
      macTel: macTel.toUpperCase(),
      macPc: macPc ? macPc.toUpperCase() : 'N/A'
    };

    // Ajout en haut de la liste dans la base de données Vercel KV
    await kv.lpush('demandes', JSON.stringify(nouvelleDemande));

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur interne lors de la sauvegarde.' });
  }
}