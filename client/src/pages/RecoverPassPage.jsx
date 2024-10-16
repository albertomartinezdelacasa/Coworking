import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const { VITE_API_URL } = import.meta.env;

const RecoverPassPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${VITE_API_URL}/api/users/password/recover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const body = await res.json();

      if (body.status === "error") {
        throw new Error(body.message);
      }

      toast.success(
        "Se ha enviado un correo con instrucciones para recuperar tu contraseña"
      );
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Enviar correo de recuperación
        </button>
      </form>
    </main>
  );
};

export default RecoverPassPage;