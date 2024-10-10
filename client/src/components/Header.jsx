/* import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <NavLink to='/'>Home</NavLink>
      {' | '}
      <NavLink to='/Register'>Registrarse</NavLink>
      {' | '}
      <NavLink to='/Login'>Iniciar sesión</NavLink>
    </header>
  );
};
export default Header;
 */

import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import useUser from '../hooks/useUser';
const { VITE_API_URL } = import.meta.env;

const Header = () => {
  const { authToken, authLogout } = useContext(AuthContext);
  const { user, setUser } = useUser();
  return (
    <header>
      <NavLink to='/'>Home</NavLink>
      {' | '}
      {!authToken ? (
        <>
          <NavLink to='/Register'>Registrarse</NavLink>
          {' | '}
          <NavLink to='/Login'>Iniciar sesión</NavLink>
        </>
      ) : (
        <>
          <NavLink to='/'>Reserva tu espacio</NavLink>
          {' | '}
          <NavLink to='/'>Publica tu oficina</NavLink>
          {' | '}
          <NavLink to='/'>Acerca de nosotros</NavLink>
          <div>
            {authToken.avatar ? (
              <img
                src={`${VITE_API_URL}/${authToken.avatar}`}
                alt={`profile picture ${authToken.username}`}
              />
            ) : (
              <img
                src='/default-avatar.png'
                alt={`profile picture ${authToken.username}`}
              />
            )}
          </div>
          <button
            onClick={() => {
              authLogout();
              setUser(null);
            }}
          >
            Logout
          </button>
        </>
      )}
    </header>
  );
};

export default Header;
