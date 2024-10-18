// Importamos los hooks y el componente Navigate.
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSingleOffice from '../hooks/useSingleOffice';
import BookAnOfficePage from './BookAnOfficePage';
// Importamos el contexto.
import { AuthContext } from '../contexts/AuthContext';

// Importamos la función toast.
import toast from 'react-hot-toast';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const OfficeDetailsPage = () => {
  // Obtenemos los path params necesarios.
  const { idOffice } = useParams();
  //Recibimos los datos del usuario.
  const { authToken, authUser } = useContext(AuthContext);

  // Obtenemos la oficina.
  const { office, updateOfficeState } = useSingleOffice(idOffice);

  const navigate = useNavigate();

  const sendToBooking = async (e) => {
    try {
      e.preventDefault();
      navigate(`/booking/${idOffice}`);
    } catch (err) {
      toast(err.message);
    }
  };
  return (
    office && (
      <main>
        <h2>{office.name}</h2>
        {
          // Fotos de la oficina.
          office.photos.map((photo) => {
            return (
              <img
                src={`${VITE_API_URL}/${photo.name}`}
                key={photo.id}
                alt='Foto de la oficina'
              />
            );
          })
        }
        <ul>
          <li>
            <h2>{office.address}</h2>
          </li>
          <li>Tipo: {office.workspace}</li>
          <li>Capacidad: {office.capacity}</li>
          <li>Precio: {office.price}</li>
          <li>{office.description}</li>
          <li>Valoracion: {parseFloat(office.votesAvg).toFixed(2)}⭐</li>
          <li>De {office.totalVotes} votos</li>
        </ul>
        <button onClick={sendToBooking}>Reservar oficina</button>
      </main>
    )
  );
};

{
  /* <section>{office && <p>{office.name}</p>}</section>; */
}
/*
const OfficeDetailsOLD = () => {
    // Importamos el token.
    const { authToken, authUser} = useContext(AuthContext);

    // Importamos la función navigate.
    const navigate = useNavigate();


    // Declaramos variables en el State para almacenar el valor de cada input.
    const [officeName, setOfficeName] = useState("");
    const [officePrice, setOfficePrice] = useState(0);
    const [officeDescription, setOfficeDescription] = useState("");
    const [officeAddress, setOfficeAddress] = useState("");
    const [officeWorkspace, setOfficeWorkspace] = useState("");
    const [officeCapacity, setOfficeCapacity] = useState(0);
    // Variable que indicará si estamos editando el formulario.
    const [isEditing, setIsEditing] = useState(false);

    // Variable que indicará si el fetch está en curso o ha terminado.
    const [loading, setLoading] = useState(false);

    // Mediante este useEffect modificamos los datos de la oficina cuando
    // haya terminado el fetch al servidor y tengamos la info de la oficina.
    useEffect(() => {
        // Si existe la oficina, modificamos los datos del State.
        if (office) {
            setOfficeName(office.name);
            setOfficePrice(office.price);
            setOfficeDescription(office.description);
            setOfficeAddress(office.address);
            setOfficeWorkspace(office.workspace);
            setOfficeCapacity(office.capacity);
        }
    }, [office]);

    // Función que maneja el envío del formulario.
    const handleUpdateOffice = async (e) => {
        try {
            // Prevenimos el comportamiento por defecto.
            e.preventDefault();

            // Indicamos que vamos a empezar el fetch.
            setLoading(true);

            // Obtenemos una respuesta del servidor.
            const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`, {
                method: "PUT ",
                headers: {
                    Authorization: authToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: officeName,
                    price: officePrice,
                    description: officeDescription,
                    address: officeAddress,
                    workspace: officeWorkspace,
                    capacity: officeCapacity,
                }),
            });

            // Obtenemos el body.
            const body = await res.json();

            // Si hay algún error lo lanzamos.
            if (body.status === "error") {
                throw new Error(body.message);
            }

            // Obtenemos los datos actualizados de la oficina por destructuring.
            const {
                name,
                price,
                description,
                address,
                workspace,
                capacity,
                photos,
            } = body.data.office;

            // Actualizamos la info de la oficina en el State.
            updateOfficeState(
                name,
                price,
                description,
                address,
                workspace,
                capacity,
                photos // Asegúrate de incluir todas las propiedades necesarias
            );

            // Indicamos que la edición ha terminado.
            setIsEditing(false);

            // Mostramos un mensaje satisfactorio al usuario.
            toast.success(body.message, {
                id: "officeDetails",
            });
        } catch (err) {
            toast.error(err.message, {
                id: "officeDetails",
            });
        } finally {
            // Indicamos que ha finalizado el fetch.
            setLoading(false);
        }
    };

    // Función que maneja el evento de click del botón de borrar oficina.
    const handleDeleteOffice = async () => {
        try {
            // Si el usuario NO confirma que desea eliminar finalizamos la función.
            if (!confirm("¿Estás seguro de que deseas eliminar la oficina?")) {
                return;
            }

            // Obtenemos la respuesta del servidor.
            const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`, {
                method: "DELETE",
                headers: {
                    Authorization: authToken,
                },
            });

            // Obtenemos el body.
            const body = await res.json();

            // Si hay algún error lo lanzamos.
            if (body.status === "error") {
                throw new Error(body.message);
            }

            // Redirigimos a la página principal.
            navigate("/");

            // Mostramos un mensaje satisfactorio al usuario.
            toast.success(body.message, {
                id: "officeDetails",
            });
        } catch (err) {
            toast.error(err.message, {
                id: "officeDetails",
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
        office && (
            <main>
                <h2>Página de la oficina</h2>

                {
                    // Fotos de la oficina.
                    office.photos.map((photo) => {
                        return (
                            <img
                                src={`${VITE_API_URL}/${photo.name}`}
                                key={photo.id}
                                alt="Foto de la oficina"
                            />
                        );
                    })
                }

                <p>Autor: {authUser.email}</p>

                <form onSubmit={handleUpdateOffice}>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={officeName}
                        onChange={(e) => setOfficeName(e.target.value)}
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor="price">Precio:</label>
                    <input
                        type="number"
                        id="price"
                        value={officePrice}
                        onChange={(e) => setOfficePrice(Number(e.target.value))}
                        min="0"
                        max="9999999"
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor="description">Descripción:</label>
                    <input
                        type="text"
                        id="description"
                        value={officeDescription}
                        onChange={(e) => setOfficeDescription(e.target.value)}
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor="address">Dirección:</label>
                    <input
                        type="text"
                        id="address"
                        value={officeAddress}
                        onChange={(e) => setOfficeAddress(e.target.value)}
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor="workspace">Espacio de trabajo:</label>
                    <input
                        type="text"
                        id="workspace"
                        value={officeWorkspace}
                        onChange={(e) => setOfficeWorkspace(e.target.value)}
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor="capacity">Capacidad:</label>
                    <input
                        type="number"
                        id="capacity"
                        value={officeCapacity}
                        onChange={(e) =>
                            setOfficeCapacity(Number(e.target.value))
                        }
                        min="0"
                        max="9999999"
                        readOnly={!isEditing}
                        required
                    />

                    {/Si estamos haciendo un fetch o NO estamos editando deshabilitamos el botón. }
                    <button disabled={loading || !isEditing}>
                        Actualizar oficina
                    </button>
                </form>

                {Botón para habilitar o deshabilitar el modo edición. }
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancelar edición" : "Editar oficina"}
                </button>

                {
                    // Botón para eliminar la oficina.
                    authUser?.id === office.userId && (
                        <button onClick={handleDeleteOffice}>
                            Eliminar oficina
                        </button>
                    )
                }
            </main>
        )
    );
};
*/

export default OfficeDetailsPage;
