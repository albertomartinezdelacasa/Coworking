// Importamos los hooks.
import { useContext, useState } from "react";

// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la función toast.
import toast from "react-hot-toast";
import { Navigate, Link } from "react-router-dom";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const UserProfilePage = () => {
  // Importamos el token.
  const { authToken, authUser, authUpdateAvatarState, authUserLoading } =
    useContext(AuthContext);

  // Creamos una variable en el State por cada input.
  const [avatar, setAvatar] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  // Función que maneja el envío del formulario.
  const handleUpdateAvatar = async (e) => {
    try {
      // Prevenimos el comportamiento por defecto.
      e.preventDefault();

      // Creamos un objeto FormData.
      const formData = new FormData();

      // Agregamos los valores y propiedades.
      formData.append("avatar", avatar);

      // Obtenemos una respuesta del servidor.
      const res = await fetch(`${VITE_API_URL}/api/users/avatar`, {
        method: "put",
        headers: {
          Authorization: authToken,
        },
        body: formData,
      });

      // Obtenemos el body.
      const body = await res.json();

      // Si hay algún error lo lanzamos.
      if (body.status === "error") {
        throw new Error(body.message);
      }

      // Actualizamos la info del avatar en el State del usuario.
      authUpdateAvatarState(body.data.avatar);

      // Mostramos un mensaje satisfactorio al usuario.
      toast.success(body.message, {
        id: "userProfile",
      });
    } catch (err) {
      toast.error(err.message, {
        id: "userProfile",
      });
    }
  };

  // Función que maneja el cambio de contraseña.
  const handleChangePassword = async (e) => {
    try {
      e.preventDefault();

      if (newPassword !== repeatNewPassword) {
        throw new Error("Las nuevas contraseñas no coinciden");
      }

      // Nota: repeatNewPassword no se envía al servidor, solo se usa para verificación en el cliente
      const res = await fetch(`${VITE_API_URL}/api/users/password`, {
        method: "PUT",
        headers: {
          Authorization: authToken,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const body = await res.json();

      if (body.status === "error") {
        throw new Error(body.message);
      }

      toast.success(body.message, {
        id: "passwordChange",
      });

      setCurrentPassword("");
      setNewPassword("");
      setRepeatNewPassword("");
    } catch (err) {
      toast.error(err.message, {
        id: "passwordChange",
      });
    }
  };

  // Si aún no se han cargado los datos del usuario no retornamos nada.
  if (authUserLoading) {
    return <></>;
  }

  // Ahora que el fetch de usuarios ya ha terminado, si NO estamos logueados
  // redirigimos a la página de login.
  if (!authUser) {
    return <Navigate to="/login" />;
  }

  return (
    <main>
      <nav className="horizontal-user-nav">
        <Link to="/reservar">Reservar un espacio</Link>
        <Link to="/mis-reservas">Mis reservas</Link>
        <Link to="/contacto">Contáctanos</Link>
      </nav>

      <h2>Mi Perfil</h2>

      <div>
        {authUser.avatar ? (
          <img
            src={`${VITE_API_URL}/${authUser.avatar}`}
            alt={`Foto de perfil de ${authUser.email}`}
          />
        ) : (
          <p>El usuario no tiene avatar.</p>
        )}

        <p>Email: {authUser.email}</p>
      </div>

      <form onSubmit={handleUpdateAvatar}>
        <label htmlFor="avatar">Actualizar avatar:</label>
        <input
          type="file"
          id="avatar"
          onChange={(e) => setAvatar(e.target.files[0])}
          accept="image/jpeg, image/png"
          required
        />

        <button>Actualizar avatar</button>
      </form>

      <form onSubmit={handleChangePassword}>
        <h3>Cambiar contraseña</h3>
        <label htmlFor="currentPassword">Contraseña actual:</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          placeholder="Ingrese su contraseña actual"
        />

        <label htmlFor="newPassword">Nueva contraseña:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="Ingrese su nueva contraseña"
        />

        <label htmlFor="repeatNewPassword">Repetir nueva contraseña:</label>
        <input
          type="password"
          id="repeatNewPassword"
          value={repeatNewPassword}
          onChange={(e) => setRepeatNewPassword(e.target.value)}
          required
          placeholder="Repita su nueva contraseña"
        />

        <button>Cambiar contraseña</button>
      </form>
    </main>
  );
};

export default UserProfilePage;
