import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom"; // Añadí Navigate
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const { VITE_API_URL } = import.meta.env;

const AddOfficeAdmin = () => {
    const { authToken, authUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [workspace, setWorkspace] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [photos, setPhotos] = useState([]);

    if (!authUser || authUser.role !== "admin") {
        return <Navigate to="/*" />;
    }

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

    const handleAddSpace = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("address", address);
            formData.append("workspace", workspace);
            formData.append("capacity", capacity);
            formData.append("price", price);

            for (let i = 0; i < photos.length; i++) {
                formData.append(`photo${i + 1}`, photos[i]);
            }

            const res = await fetch(`${VITE_API_URL}/api/offices`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (data.status === "error") {
                throw new Error(data.message);
            }

            toast.success(data.message, { id: "newOffice" });
            navigate("/");
        } catch (err) {
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

export default AddOfficeAdmin;
