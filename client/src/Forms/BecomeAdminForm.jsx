import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

const BecomeAdminForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [company, setCompany] = useState('');
  const [contactnum, setContactnum] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminForm = async (e) => {
    // El código para manejar el formulario
  };

  return (
    <form onSubmit={handleAdminForm}>
      <label htmlFor='name'>Nombre*</label>
      <input
        type='text'
        id='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label htmlFor='lastname'>Apellidos*</label>
      <input
        type='text'
        id='lastname'
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        required
      />
      <label htmlFor='company'>Nombre de la Empresa*</label>
      <input
        type='text'
        id='company'
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />
      <label htmlFor='contactnum'>Número de telefono*</label>
      <input
        type='text'
        id='contactnum'
        value={contactnum}
        onChange={(e) => setContactnum(e.target.value)}
        required
      />
      <button disabled={loading}>Enviar</button>
    </form>
  );
};

export default BecomeAdminForm;
