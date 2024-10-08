// Importamos los hooks.
import { useEffect, useState } from "react";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el hook.
const useBookings = () => {
  // Declaramos en el State un array de bookings vacío.
  const [bookings, setBookings] = useState([]);

  // Con la ayuda de "useEffect" hacemos un fetch al servidor para buscar los bookings cuando se monta el componente.
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Obtenemos la respuesta.
        const res = await fetch(`${VITE_API_URL}/api/bookings`);

        // Obtenemos el body.
        const body = await res.json();

        // Establecemos los bookings en el State.
        setBookings(body.data.bookings);
      } catch (err) {
        alert(err.message);
      }
    };

    // Llamamos a la función anterior.
    fetchBookings();
  }, []);

  // Retornamos las variables y funciones que nos interesan.
  return { bookings };
};

export default useBookings;
