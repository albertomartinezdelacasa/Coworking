import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
const { VITE_API_URL } = import.meta.env;

const Header = () => {
  const { authUser, authLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Verifica si el usuario está logueado y su rol
  const isLoggedIn = !!authUser;
  const isAdmin = isLoggedIn && authUser.role === "ADMIN";

  return (
    <header>
      <div className="header-top">
        {/* Logo de la empresa */}
        <NavLink to="/">
          <img src="/Logo.png" alt="Logo de la empresa" className="logo" />
        </NavLink>

        {/* Botones de autenticación */}
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <NavLink to="/Register">Registrarse</NavLink>
              {" | "}
              <NavLink to="/Login">Log In</NavLink>
            </>
          ) : (
            <>
              {/* Enlace al perfil del usuario */}
              <NavLink to="/users/profile">
                {authUser.avatar ? (
                  <img
                    src={`${VITE_API_URL}/${authUser.avatar}`}
                    alt={`profile picture ${authUser.username}`}
                    className="profile-picture"
                  />
                ) : (
                  <img
                    src="/default-avatar.png"
                    alt={`profile picture ${authUser.username}`}
                    className="profile-picture"
                  />
                )}
              </NavLink>
              {" | "}
              {/* Botón de cerrar sesión */}
              <button
                onClick={() => {
                  authLogout();
                  navigate("/");
                }}
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>

      {/* Barra de navegación solo si está logueado */}
      {isLoggedIn && (
        <nav className="nav-bar">
          <ul>
            <li>
              <NavLink to="/users/profile">Mi Perfil</NavLink>
            </li>
            {isAdmin ? (
              <>
                <li>
                  <NavLink to="/admin/manage-reservations">
                    Gestionar Reservas
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/manage-spaces">
                    Gestionar Espacios
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/user/my-reservations">Mis Reservas</NavLink>
                </li>
                <li>
                  <NavLink to="/user/make-reservation">Reservar</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
