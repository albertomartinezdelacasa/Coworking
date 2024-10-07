import { Routes, Route } from 'react-router-dom';
// Importamos los componentes
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Register' element={<RegisterPage />} />
        <Route path='/Login' element={<LoginPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
