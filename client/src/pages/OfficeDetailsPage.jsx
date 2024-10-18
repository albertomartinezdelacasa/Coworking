// Importamos los hooks y el componente Navigate.
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSingleOffice from "../hooks/useSingleOffice";
import BookAnOfficePage from "./BookAnOfficePage";
// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la función toast.
import toast from "react-hot-toast";

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

    const sendToEditOffice = async (e) => {
        try {
            e.preventDefault();
            navigate(`/office/edit/${idOffice}`);
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
                                alt="Foto de la oficina"
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
                    <li>
                        Valoracion: {parseFloat(office.votesAvg).toFixed(2)}⭐
                    </li>
                    <li>De {office.totalVotes} votos</li>
                </ul>
                <button onClick={sendToBooking}>Reservar oficina</button>
                {authUser.role === "ADMIN" && (
                    <button onClick={sendToEditOffice}>Editar oficina</button>
                )}
            </main>
        )
    );
};

export default OfficeDetailsPage;
