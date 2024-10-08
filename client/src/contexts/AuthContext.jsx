import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const { VITE_AUTH_TOKEN } = import.meta.env;

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem(VITE_AUTH_TOKEN) || null
  );

  const authLogin = (token) => {
    setAuthToken(token);

    localStorage.setItem(VITE_AUTH_TOKEN, token);
  };

  const authLogout = () => {
    setAuthToken(null);
    localStorage.removeItem(VITE_AUTH_TOKEN);
  };

  return (
    <AuthContext.Provider value={{ authToken, authLogin, authLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
