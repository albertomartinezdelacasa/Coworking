import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import useUser from '../hooks/useUser';
const { VITE_API_URL } = import.meta.env;

const Header = () => {
  const { authUser, authLogout } = useContext(AuthContext);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  return (
    <header>
      <NavLink to='/'>Home</NavLink>
      {' | '}
      {!authUser ? (
        <>
          <NavLink to='/Register'>Registrarse</NavLink>
          {' | '}
          <NavLink to='/Login'>Iniciar sesión</NavLink>
        </>
      ) : (
        <>
          <NavLink to='/'>Mis reservas</NavLink>
          {' | '}
          <NavLink to='/'>Reserva tu espacio</NavLink>
          {' | '}
          <NavLink to='/'>Publica tu oficina</NavLink>
          {' | '}
          <NavLink to='/'>Acerca de nosotros</NavLink>
          <div>
            <NavLink to='/users/profile'>
              {authUser.avatar ? (
                <img
                  src={`${VITE_API_URL}/${authUser.avatar}`}
                  alt={`profile picture ${authUser.username}`}
                />
              ) : (
                <img
                  src='/default-avatar.png'
                  alt={`profile picture ${authUser.username}`}
                />
              )}
            </NavLink>
          </div>
          <button
            onClick={() => {
              authLogout();
              setUser(null);
              navigate('/');
            }}
          >
            Cerrar Sesión
          </button>
        </>
      )}
    </header>
  );
};

export default Header;
