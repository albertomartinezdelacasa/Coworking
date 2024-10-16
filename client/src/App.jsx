import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import '/App.css';

// Importamos los componentes

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import UserProfilePage from './pages/UserProfilePage';
import ActivateUserPage from './pages/ActivateuserPage';
<<<<<<< Updated upstream
import BookingsListPage from './pages/BookingsListPage';

import AddOfficeAdminPage from './pages/AddOfficeAdminPage';
import OfficeDetailsPage from './pages/OfficeDetailsPage';
=======

import AddOfficeAdminPage from './pages/AddOfficeAdminPage';
import OfficesListPage from './pages/OfficesListPage';
import OfficeDetails from './pages/OfiiceDetailsPage';
>>>>>>> Stashed changes
import BookAnOfficePage from './pages/BookAnOfficePage';
import RecoverPassPage from './pages/RecoverPassPage';
import ResetPassPage from './pages/ResetPassPage';

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
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/users/bookings/:idBooking'
          element={<BookingDetailsPage />}
        />
        <Route path='/office/create' element={<AddOfficeAdminPage />} />
        <Route path='/users/profile' element={<UserProfilePage />} />
        <Route
          path='/users/activate/:registrationCode'
          element={<ActivateUserPage />}
        />
        <Route path='/booking/:idOffice' element={<BookAnOfficePage />} />
        <Route path='/office/list' element={<OfficesListPage />} />
        <Route path='/office/details/:idOffice' element={<OfficeDetails />} />
        <Route path='/users/password/recover' element={<RecoverPassPage />} />
        <Route
          path='/users/password/reset/:recoverPassCode'
          element={<ResetPassPage />}
        />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
