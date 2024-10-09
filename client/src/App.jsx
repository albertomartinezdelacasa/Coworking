import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Importamos los componentes
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ActivateUserPage from './pages/ActivateuserPage';

const App = () => {
  return (
    <>
      <Header />
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 5000,
        }}
      />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Register' element={<RegisterPage />} />
        <Route path='/Login' element={<LoginPage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route
          path='/users/activate/:registrationCode'
          element={<ActivateUserPage />}
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
