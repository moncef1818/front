import { Routes, Route, Navigate } from 'react-router-dom'  
import { useState, useEffect } from 'react';
import Home from './Pages/Home/Home'
import Login from './Pages/Login/Login'
import ClubRegister from './Pages/Club-register/ClubRegister'
import Leaderboard from './leadboard';
import './App.css'

function App() {
  const [gamePhase, setGamePhase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkGamePhase = async () => {
      try {
        const response = await fetch('https://cic-opening-day-backend.onrender.com/api/game/phase/');
        const data = await response.json();
        setGamePhase(data);
      } catch (error) {
        console.error('Failed to fetch game phase:', error);
        setGamePhase({ has_ended: false, game_active: true });
      } finally {
        setLoading(false);
      }
    };

    checkGamePhase();
  }, []);

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  const { has_ended } = gamePhase || { has_ended: false };
  const token = localStorage.getItem('access_token');

  return (
    <Routes>
      {/* LOGIN - Only show if game not ended */}
      <Route path='/login' element={
        !has_ended && !token ? <Login /> : <Navigate to="/club-register" replace />
      } />

      {/* HOME - Only show if game not ended and logged in */}
      <Route path='/' element={
        !has_ended && token ? <Home /> : <Navigate to="/club-register" replace />
      } />

      {/* LEADERBOARD - Same as home */}
      <Route path='/leaderboard' element={
        !has_ended && token ? <Leaderboard /> : <Navigate to="/club-register" replace />
      } />

      {/* CLUB REGISTER - Always accessible */}
      <Route path='/club-register' element={<ClubRegister />} />

      {/* CATCH ALL - Everyone goes to club-register */}
      <Route path='*' element={
        <Navigate to="/club-register" replace />
      } />
    </Routes>
  );
}

export default App
