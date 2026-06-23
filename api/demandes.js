import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const data = await kv.lrange('demandes', 0, -1);
    
    if (!data) {
      return res.status(200).json([]);
    }

    // Conversion des chaînes de texte de la base en véritables objets JSON
    const demandes = data.map(item => typeof item === 'string' ? JSON.parse(item) : item);
    return res.status(200).json(demandes);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
  }
}