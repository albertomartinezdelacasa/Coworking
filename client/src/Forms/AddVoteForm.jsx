// Importamos las prop-types.
import PropTypes from 'prop-types';

// Importamos los hooks.
import { useContext, useState } from 'react';

// Importamos el contexto.
import { AuthContext } from '../contexts/AuthContext';

// Importamos la función toast.
import toast from 'react-hot-toast';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const AddVoteForm = ({ idBooking, onVoteSubmit }) => {
  // Obtenemos el token.
  const { authToken } = useContext(AuthContext);

  // Declaramos una variable en el estado para almacenar el valor del input.
  const [vote, setVote] = useState(5);
  const [comment, setComment] = useState('');

  // Función que permite votar una entrada.
  const handleVoteEntry = async (e) => {
    try {
      // Prevenimos el comportamiento por defecto.
      e.preventDefault();

      // Obtenemos una respuesta del servidor.
      const res = await fetch(
        `${VITE_API_URL}/api/bookings/${idBooking}/vote`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
          },
          body: JSON.stringify({
            // Convertimos el valor de tipo String a Number.
            vote: Number(vote),
            comment,
          }),
        }
      );

      // Obtenemos el body.
      const body = await res.json();

      // Si hay algún error lo lanzamos.
      if (body.status === 'error') {
        throw new Error(body.message);
      }

      // Actualizamos la media de votos en el State.
      //updateEntryVotes(body.data.votesAvg);
      onVoteSubmit(vote);
      // Indicamos al usuario que todo ha ido bien.
      toast.success(body.message, {
        id: 'Voto enviado con exito',
      });
    } catch (err) {
      toast.error(err.message, {
        id: 'entryDetails',
      });
    }
  };

  return (
    <form onSubmit={handleVoteEntry}>
      <label htmlFor='vote'>Votar:</label>
      <input
        type='number'
        id='vote'
        value={vote}
        onChange={(e) => setVote(e.target.value)}
        min='1'
        max='5'
        required
      />
      <br />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Deja un comentario (opcional)'
      />
      <br />
      {/* Habilitamos o deshabilitamos el botón en función de si estamos haciendo un fetch o no. */}
      <button type='submit'>Votar</button>
    </form>
  );
};

// Validamos las props.
AddVoteForm.propTypes = {
  idBooking: PropTypes.number.isRequired,
  onVoteSubmit: PropTypes.func.isRequired,
};

export default AddVoteForm;

/* import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const { VITE_API_URL } = import.meta.env;

const AddVoteForm = ({ idBooking, onVoteSubmit }) => {
  const [vote, setVote] = useState(0);
  const [comment, setComment] = useState("");
  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${VITE_API_URL}/api/bookings/${idBooking}/vote`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify({ vote, comment }),
        }
      );

      const body = await res.json();

      if (body.status === "error") {
        throw new Error(body.message);
      }

      toast.success("Voto enviado con éxito");
      onVoteSubmit(vote);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Valora tu experiencia</h3>
      <div>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setVote(value)}
            style={{ backgroundColor: vote === value ? "purple" : "white" }}
          >
            {value}
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deja un comentario (opcional)"
      />
      <button type="submit" disabled={vote === 0}>
        Enviar voto
      </button>
    </form>
  );
};

AddVoteForm.propTypes = {
  idBooking: PropTypes.number.isRequired,
  onVoteSubmit: PropTypes.func.isRequired,
};

export default AddVoteForm; */
