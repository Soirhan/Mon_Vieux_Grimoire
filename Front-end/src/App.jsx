import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Pages
import SignIn from './pages/SignIn/SignIn';
import Signup from './pages/Signup'; // Page inscription
import Home from './pages/Home/Home';
import Book from './pages/Book/Book';
import AddBook from './pages/AddBook/AddBook';
import UpdateBook from './pages/updateBook/UpdateBook';

// Composants globaux
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// Routes centralisées
import { APP_ROUTES } from './utils/constants';

// Hook custom pour récupérer l'utilisateur connecté
import { useUser } from './lib/customHooks';

function App() {
  const [user, setUser] = useState(null);
  const { connectedUser } = useUser();

  // Met à jour l'état user si l'utilisateur connecté change
  useEffect(() => {
    setUser(connectedUser);
  }, [connectedUser]);

  return (
    <BrowserRouter>
      <div>
        <ScrollToTop /> {/* Pour remonter automatiquement en haut de page à chaque navigation */}
        <Header user={user} setUser={setUser} /> {/* Header avec gestion de l'utilisateur connecté */}
        <Routes>
          {/* Page d'accueil */}
          <Route index element={<Home />} />

          {/* Page connexion */}
          <Route path={APP_ROUTES.SIGN_IN} element={<SignIn setUser={setUser} />} />

          {/* Page inscription */}
          <Route
            path={APP_ROUTES.SIGN_UP}
            element={<Signup />}
          />
          {/* route ajoutée pour l'inscription */}

          {/* Page détail livre */}
          <Route path={APP_ROUTES.BOOK} element={<Book />} />

          {/* Page mise à jour livre */}
          <Route path={APP_ROUTES.UPDATE_BOOK} element={<UpdateBook />} />

          {/* Page ajout livre */}
          <Route path={APP_ROUTES.ADD_BOOK} element={<AddBook />} />
        </Routes>
        <Footer /> {/* Footer global */}
      </div>
    </BrowserRouter>
  );
}

export default App;
