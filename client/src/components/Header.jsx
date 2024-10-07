import { NavLink } from 'react-router-dom';

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
