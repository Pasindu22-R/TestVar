import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Authentication
import RegisterForm from '../view/userLoging/Register';
import Login from '../view/userLoging/Login';

// Flashcards and Dashboard
import CreateCard from '../view/Flashcards/CreateCardPack';
import CardSet from '../view/Flashcards/CardPacks';
import CardDetails from '../view/Flashcards/CardPackDetails';
import UpdateFlashcard from '../view/Flashcards/UpdateCardPack';
import AllCards from '../view/Flashcards/AllFlashcards';

// Dashboard
import DashboardNav from '../NavBar/dashboardNav';

// Protected Layout Component
const ProtectedLayout = ({ children }) => {
  return (
    <>
      <DashboardNav />
      <div style={{ marginTop: '64px' }}>{children}</div>
    </>
  );
};

// Route Configuration
const routes = [
  // Authentication routes
  { path: '/', element: <Login />, isProtected: false },
  { path: '/register', element: <RegisterForm />, isProtected: false },

  // Profile routes
  { path: '/profile', element: <DashboardNav />, isProtected: false },
  { path: '/createcard', element: <CreateCard />, isProtected: true },
  { path: '/cards/update/:id', element: <UpdateFlashcard />, isProtected: true },
  { path: '/cards', element: <CardSet />, isProtected: true },
  { path: '/all-cardsnw', element: <AllCards />, isProtected: true },
  { path: '/cards/:id', element: <CardDetails />, isProtected: true },
];

function AppRoutes() {
  return (
    <Routes>
      {routes.map(({ path, element, isProtected }) => (
        <Route
          key={path}
          path={path}
          element={isProtected ? <ProtectedLayout>{element}</ProtectedLayout> : element}
        />
      ))}
    </Routes>
  );
}

export default AppRoutes;
