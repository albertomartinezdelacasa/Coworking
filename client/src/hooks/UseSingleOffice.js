// Importamos los hooks.
import { useEffect, useState } from "react";

// Importamos la función toast.
import toast from "react-hot-toast";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el hook.
const useSingleOffice = (idOffice) => {
    // Declaramos una variable en el State que permita almacenar la info de la oficina.
    const [office, setOffice] = useState(null);

    // Obtenemos la oficina cuando se monta el componente.
    useEffect(() => {
        // Solicitamos la oficina al servidor.
        const fetchOffice = async () => {
            try {
                // Obtenemos una respuesta del servidor.
                const res = await fetch(
                    `${VITE_API_URL}/api/offices/${idOffice}`
                );

                // Obtenemos el body.
                const body = await res.json();

                // Si hay algún error lo lanzamos.
                if (body.status === "error") {
                    throw new Error(body.message);
                }

                // Almacenamos la oficina.
                setOffice(body.data.office);
            } catch (err) {
                toast.error(err.message, {
                    id: "OfficeDetails",
                });
            }
        };

        // Llamamos a la función anterior.
        fetchOffice();
    }, [idOffice]);

    const updateOfficeState = (
        name,
        price,
        description,
        address,
        workspace,
        capacity,
        photos
    ) => {
        setOffice({
            ...office,
            name: name || office.name,
            price: price || office.price,
            description: description || office.description,
            address: address || office.address,
            workspace: workspace || office.workspace,
            capacity: capacity || office.capacity,
            photos: photos || office.photos,
        });
    };

    // Actualizamos la media de votos de la entrada en el State.
    /*   const updateEntryVotes = (votesAvg) => {
    setBooking({
      ...booking,
      votes: votesAvg,
    });
  };
 */

    // Retornamos las variables y funciones necesarias.
    return {
        office,
        updateOfficeState,
    };
};

export default useSingleOffice;
