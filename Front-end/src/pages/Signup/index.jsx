import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  // États locaux pour stocker email et mot de passe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fonction appelée lors de l'envoi du formulaire
  const handleSignup = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    try {
      // Requête POST vers le backend pour créer un utilisateur
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
      });

      // Affiche un message de confirmation
      alert(res.data.message || 'Utilisateur créé avec succès !');
    } catch (err) {
      // Gestion des erreurs
      console.error(err.response?.data || err.message);
      alert('Erreur lors de l&apos;inscription');
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">S&apos;inscrire</button>
      </form>
    </div>
  );
}

export default Signup;
