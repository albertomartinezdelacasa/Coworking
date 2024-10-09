// Importamos los hooks y el componente Navigate.
import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useSingleOffice from '../hooks/useSingleOffice';


//TODO: HACER EL HOOK PARA LAS OFICINAS.

// Importamos el contexto.
import { AuthContext } from '../contexts/AuthContext';

// Importamos la función toast.
import toast from 'react-hot-toast';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const OfficeDetails = () => {
    // Importamos el token.
    const { authToken, authUser, authUserLoading } = useContext(AuthContext);

    // Importamos la función navigate.
    const navigate = useNavigate();

    // Obtenemos los path params necesarios.
    const { OfficeId } = useParams();

    // Obtenemos el producto.
    const { office, updateOfficeState } = useSingleOffice(OfficeId);

    // Declaramos una variable en el State para almacenar el valor de cada input.
    const [OfficeName, setOfficeName] = useState('');
    const [OfficePrice, setOfficePrice] = useState(0);
    const [OfficeDescription, setOfficeDescription] = useState('');
    const [OfficeAddress, setOfficeAddress] = useState('');
    const [OfficeWorkspace, setOfficeWorkspace] = useState();
    const [OfficeCapacity, setOfficeCapacity] = useState(0);
    // Variable que indicará si estamos editando el formulario.
    const [isEditing, setIsEditing] = useState(false);

    // Variable que indicará si el fetch está en curso o ha terminado.
    const [loading, setLoading] = useState(false);

    // Mediante este useEffect modificamos el nombre y el precio del producto cuando
    // haya terminado el fetch al servidor y tengamos la info del producto.
    useEffect(() => {
        // Si existe el producto, modificamos los datos del State.
        if (office) {
            setOfficeName(office.name);
            setOfficePrice(office.price);
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
            const res = await fetch(
                `${VITE_API_URL}/api/offices/${officeId}`,
                {
                    method: 'put',
                    headers: {
                        Authorization: authToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: OfficeName,
                        price: OfficePrice,
                    }),
                }
            );

            // Obtenemos el body.
            const body = await res.json();

            // Si hay algún error lo lanzamos.
            if (body.status === 'error') {
                throw new Error(body.message);
            }

            // Obtenemos el nombre y el precio asignados por destructuring.
            const { name, price, description, address, workspace, capacity   } = body.data.office;

            // Actualizamos la info del producto en el State.
            updateOfficeState(name, price, description, address, workspace, capacity);

            // Indicamos que la edición ha terminado.
            setIsEditing(false);

            // Mostramos un mensaje satisfactorio al usuario.
            toast.success(body.message, {
                id: 'officeDetails',
            });
        } catch (err) {
            toast.error(err.message, {
                id: 'officeDetails',
            });
        } finally {
            // Indicamos que ha finalizado el fetch.
            setLoading(false);
        }
    };

    // Función que maneja el evento de click del botón de borrar producto.
    const handleDeleteOffice = async () => {
        try {
            // Si el usuario NO confirma que desea eliminar finalizamos la función.
            if (!confirm('¿Estás seguro de que deseas eliminar la oficina?')) {
                return;
            }

            // Obtenemos la respuesta del servidor.
            const res = await fetch(
                `${VITE_API_URL}/api/offices/${OfficeId}`,
                {
                    method: 'delete',
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

            // Redirigimos a la página pricipal.
            navigate('/');

            // Mostramos un mensaje satisfactorio al usuario.
            toast.success(body.message, {
                id: 'officeDetails',
            });
        } catch (err) {
            toast.error(err.message, {
                id: 'officeDetails',
            });
        }
    };

    // Si aún no se han cargado los datos del usuario no retornamos nada.
    if (authUserLoading) {
        return <></>;
    }

    // Ahora que el fetch de usuarios ya ha terminado, si NO estamos logueados
    // redirigimos a la página de login.
    if (!authUser || authUser.role !== 'admin') {
        return <Navigate to='/login' />;
    }

    return (
        office && (
            <main>
                <h2>Página de la oficina</h2>

                {
                    // Fotos del producto.
                    office.photos.map((photo) => {
                        return (
                            <img
                                src={`${VITE_API_URL}/${office.photos[0].name}`}
                                key={photo.id}
                                alt='Foto del producto'
                            />
                        );
                    })
                }

                <p>Autor: {authUser.email}</p>

                <form onSubmit={handleUpdateOffice}>
                    <label htmlFor='name'>Nombre:</label>
                    <input
                        type='text'
                        id='name'
                        value={OfficeName}
                        onChange={(e) => setOfficeName(e.target.value)}
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor='price'>Precio:</label>
                    <input
                        type='number'
                        id='price'
                        value={OfficePrice}
                        onChange={(e) => setOfficePrice(e.target.value)}
                        min='0'
                        max='9999999'
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor='description'>Descripción:</label>
                    <input
                        type='text'
                        id='description'
                        value={OfficeDescription}
                        onChange={(e) => setOfficeDescription(e.target.value)}
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor='address'>Dirección:</label>
                    <input
                        type='text'
                        id='address'
                        value={OfficeAddress}
                        onChange={(e) => setOfficeAddress(e.target.value)}
                        readOnly={!isEditing}
                        required
                    />

                    <label htmlFor='workspace'>Espacio de trabajo:</label>
                    <input
                        type='text'
                        id='workspace'
                        value={OfficeWorkspace}
                        onChange={(e) => setOfficeWorkspace(e.target.value)}
                        readOnly={!isEditing}
                        required
                    />  

                    <label htmlFor='capacity'>Capacidad:</label>
                    <input
                        type='number'
                        id='capacity'
                        value={OfficeCapacity}
                        onChange={(e) => setOfficeCapacity(e.target.value)}
                        min='0'
                        max='9999999'
                        readOnly={!isEditing}
                        required
                    />  
                    
                    {/* Si estamos haciendo un fetch o NO estamos editando deshabilitamos el botón. */}
                    <button disabled={loading || !isEditing}>
                        Actualizar producto
                    </button>
                </form>

                {/* Botón para habilitar o deshabilitar el modo edición. */}
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancelar edición' : 'Editar producto'}
                </button>

                {
                    // Botón para eliminar el producto. */
                    authUser?.id === office.userId && (
                        <button onClick={() => handleDeleteOffice()}>
                            Eliminar oficina
                        </button>
                    )
                }
            </main>
        )
    );
};

export default OfficeDetails;
