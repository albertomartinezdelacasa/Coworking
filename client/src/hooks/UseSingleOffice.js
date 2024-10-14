// Importamos los hooks.
import { useEffect, useState, useContext } from 'react';

// Importamos el contexto.
import { AuthContext } from '../contexts/AuthContext';

// Importamos la función toast.
import toast from 'react-hot-toast';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el hook.
const useSingleOffice = (idOffice) => {
  // Declaramos una variable en el State que permita almacenar la info de la entrada.
  const [office, setOffice] = useState(null);
  const { authToken } = useContext(AuthContext);
  // Obtenemos la entrada cuando se monta el componente.
  useEffect(() => {
    // Solicitamos la entrada al servidor.
    const fetchOffice = async () => {
      try {
        // Obtenmemos una respuesta del servidor.

        const res = await fetch(
          `${VITE_API_URL}/api/offices/${idOffice}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );


        // Obtenemos el body.
        const body = await res.json();

        // Si hay algún error lo lanzamos.
        if (body.status === 'error') {
          throw new Error(body.message);
        }

        // Almacenamos la entrada.
        setOffice(body.data.office);
      } catch (err) {
        toast.error(err.message, {
          id: 'BookingDetails',
        });
      }
    };

    // Llamamos a la función anterior.
    fetchOffice();
  }, [idOffice]);

  // Actualizamos la media de votos de la entrada en el State.
  /*   const updateEntryVotes = (votesAvg) => {
    setBooking({
      ...booking,
      votes: votesAvg,
    });
  };
 */

  // Retornamos los variables y funciones necesarias.
  return {
    office: office,
  };
};

export default useSingleOffice;
