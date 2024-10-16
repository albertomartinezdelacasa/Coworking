import { useState, useContext } from "react";
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

export default AddVoteForm;
