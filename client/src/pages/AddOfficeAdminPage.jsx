// Importación de los hooks useState y useContext de React
import { useState, useContext } from "react";

// Importación de los componentes useNavigate y Navigate de react-router-dom
import { useNavigate, Navigate } from "react-router-dom";

// Importación del contexto de autenticación
import { AuthContext } from "../context/AuthContext";

// Importación de la función toast para mostrar notificaciones
import toast from "react-hot-toast";

// Obtención de la URL de la API desde las variables de entorno
const { VITE_API_URL } = import.meta.env;

// Definición del componente funcional AddOfficeAdmin
const AddOfficeAdmin = () => {
    // Extracción de authToken y authUser del contexto de autenticación
    const { authToken, authUser } = useContext(AuthContext);
    
    // Hook para la navegación programática
    const navigate = useNavigate();

    // Estados para los campos del formulario
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [workspace, setWorkspace] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [photos, setPhotos] = useState([]);

    // Redirección si el usuario no está autenticado o no es admin
    if (!authUser || authUser.role !== "admin") {
        return <Navigate to="/*" />;
    }

    // Función para manejar la selección de archivos
    const handleFile = (e) => {
        // Mueve esta función fuera de handleAddSpace
        const file = Array.from(e.target.files);
        if (file.length <= 5) {
            setPhotos(file);
        } else {
            toast.error("No puedes subir más de 5 fotos");
            e.target.value = null;
        }
    };

    // Función para manejar el envío del formulario
    const handleAddSpace = async (e) => {
        e.preventDefault();
        try {
            // Creación del objeto FormData para enviar los datos
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("address", address);
            formData.append("workspace", workspace);
            formData.append("capacity", capacity);
            formData.append("price", price);

            // Agregar las fotos al FormData
            for (let i = 0; i < photos.length; i++) {
                formData.append(`photo${i + 1}`, photos[i]);
            }

            // Envío de la solicitud POST a la API
            const res = await fetch(`${VITE_API_URL}/api/offices`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });

            // Procesamiento de la respuesta
            const data = await res.json();
            if (data.status === "error") {
                throw new Error(data.message);
            }

            // Mostrar mensaje de éxito y navegar a la página principal
            toast.success(data.message, { id: "newOffice" });
            navigate("/");
        } catch (err) {
            // Mostrar mensaje de error en caso de fallo
            toast.error(err.message, { id: "newOffice" });
        }
    };

    return (
        <main>
            <h2>
                Página de creación de oficinas. SOLO ADMINISTRADOR. SI ERES
                CLIENTE, DISIMULA Y EMPIEZA A ADMINISTRAR
            </h2>
            <form onSubmit={handleAddSpace}>
                <label htmlFor="name">NOMBRE: </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label htmlFor="address">DIRECCIÓN: </label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <label htmlFor="description">DESCRIPCIÓN: </label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <label htmlFor="capacity">CAPACIDAD: </label>
                <input
                    type="text"
                    id="capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                />
                <label htmlFor="workspace">¿Tiene workspace QUE ES WORKSPACEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE?: </label>
                <select
                    id="workspace"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    required
                >
                    <option value="OFFICE">OFFICE</option>
                    <option value="DESK">DESK</option>
                </select>

                <label htmlFor="price">PRECIO: </label>
                <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <label htmlFor="photos">FOTOS:</label>
                <input
                    type="file"
                    id="photos"
                    onChange={handleFile}
                    accept="image/jpeg, image/png"
                    multiple
                    required
                />
                <button type="submit">Crear</button>
            </form>
        </main>
    );
};

// Exportación del componente
export default AddOfficeAdmin;