// Importamos los hooks y el componente Navigate.
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSingleOffice from "../hooks/useSingleOffice";
import BookAnOfficePage from "./BookAnOfficePage";
// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la función toast.
import toast from "react-hot-toast";

// Importamos el carrusel de fotos
import Carrusel from "../components/CarruselFotosOfi";

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
          <Carrusel images={office.photos}></Carrusel>
        }
        <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
          <li>
            <strong>{office.name}</strong>
          </li>

          <li>{office.address}</li>
          <li>Capacidad: {office.capacity}</li>

          <li>€{office.price}</li>
          <li>{office.workspace}</li>
          <li>{office.description}</li>

          <li>Horario de Apertura: {office.opening}</li>
          <li>Horario de Cierre: {office.closing}</li>
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
