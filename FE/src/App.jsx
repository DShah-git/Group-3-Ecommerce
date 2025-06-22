
import './App.css'
import Navbar from './components/navbar/navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/home.jsx';

function App() {

  return (
    <>
      <div style={{ width: '80vw', margin: '0 auto' }}>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
