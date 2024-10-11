// Importamos los hooks.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Importamos la función toast.
import toast from 'react-hot-toast';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const ActivateUserPage = () => {
  // Importamos la función navigate.
  const navigate = useNavigate();

  // Obtenemos el código de registro de los path params.
  const { registrationCode } = useParams();

  // Estado para controlar si hay un error.
  const [hasError, setHasError] = useState(false);

  // Validamos al usuario cuando se monta el componente.
  useEffect(() => {
    // Función que valida a un usuario en la base de datos.
    const fetchValidateUser = async () => {
      try {
        // Obtenemos una respuesta del servidor.
        const res = await fetch(
          `${VITE_API_URL}/api/users/activate/${registrationCode}`,
          {
            method: 'PATCH',
          }
        );

        // Traducimos el body.
        const body = await res.json();

        // Si hay algún error lo lanzamos.
        if (body.status === 'error') {
          throw new Error(body.message);
        }

        // Mostramos un mensaje satisfactorio al usuario.
        toast.success(body.message, {
          id: 'validate',
        });

        // Redirigimos a login después de 10 segundos.
        setTimeout(() => {
          navigate('/login');
        }, 10000);
      } catch (err) {
        // En caso de error, mostramos el mensaje de error y actualizamos el estado.
        setHasError(true);
        toast.error(err.message, {
          id: 'validate',
        });
      }
    };

    // Llamamos a la función anterior.
    fetchValidateUser();
  }, [registrationCode, navigate]);

  // Si hay un error, mostramos el mensaje de error en lugar del contenido normal.
  if (hasError) {
    return (
      <main>
        <h1>No ha sido posible activar tu cuenta</h1>
        <p>
          Seguramente esta cuenta ya esta activada. Por favor, si continua el
          problema intenta nuevamente más tarde o contacta con soporte.
        </p>
        <a href='https://chatgpt.com/'>Servicio Tecnico InovaSpace Coworking</a>
      </main>
    );
  }

  return (
    <main>
      <img src='' alt='logo de InovaSace' />
      <h1>Activando tu nuevo perfil</h1>
      <p>
        Enseguida serás redirigido a la página de inicio de sesión. Gracias por
        tu paciencia.
      </p>
      <p> Si lo prefieres pulsa aqui </p>
      <a href='/login'>Login</a>
    </main>
  );
};

export default ActivateUserPage;
