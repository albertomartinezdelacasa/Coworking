// Importación de los hooks useState y useContext de React
import { useState, useContext } from 'react';

// Importación de los componentes useNavigate y Navigate de react-router-dom
import { useNavigate, Navigate } from 'react-router-dom';

// Importación del contexto de autenticación
import { AuthContext } from '../contexts/AuthContext';

// Importación de la función toast para mostrar notificaciones
import toast from 'react-hot-toast';

// Obtención de la URL de la API desde las variables de entorno
const { VITE_API_URL } = import.meta.env;

// Definición del componente funcional AddOfficeAdmin
const AddOfficeAdminPage = () => {
  // Extracción de authToken y authUser del contexto de autenticación
  const { authToken, authUser } = useContext(AuthContext);

  // Hook para la navegación programática
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [opening, setOpening] = useState('');
  const [closing, setClosing] = useState('');
  const [photos, setPhotos] = useState([]);

  // Función para manejar la selección de archivos
  const handleFile = (e) => {
    // Mueve esta función fuera de handleAddSpace
    const file = Array.from(e.target.files);
    if (file.length <= 5) {
      setPhotos(file);
    } else {
      toast.error('No puedes subir más de 5 fotos');
      e.target.value = null;
    }
  };

  // Función para manejar el envío del formulario
  const handleAddSpace = async (e) => {
    try {
      e.preventDefault();

      // esto es por que en SQL solo el formato time te pide 00:00:00,
      //pero el time del form solo 00:00 asi que hay que meter los segundos

      const formattedOpening = opening.length === 5 ? `${opening}:00` : opening;
      const formattedClosing = closing.length === 5 ? `${closing}:00` : closing;

      // Creación del objeto FormData para enviar los datos
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('address', address);
      formData.append('workspace', workspace);
      formData.append('capacity', capacity);
      formData.append('price', price);
      formData.append('opening', formattedOpening);
      formData.append('closing', formattedClosing);

      formData.append('equipments', JSON.stringify([1]));

      // Agregar las fotos al FormData
      for (let i = 0; i < photos.length; i++) {
        formData.append(`photo${i + 1}`, photos[i]);
      }

      // Envío de la solicitud POST a la API
      const res = await fetch(`${VITE_API_URL}/api/office/create`, {
        method: 'POST',
        headers: {
          /*  "Content-Type": "application/json", */
          Authorization: authToken,
        },
        body: formData,
      });

      // Procesamiento de la respuesta
      const body = await res.json();

      if (body.status === 'error') {
        throw new Error(body.message);
      }

      // Mostrar mensaje de éxito y navegar a la página principal
      toast.success(body.message, { id: 'newOffice' });

      navigate('/');
    } catch (err) {
      // Mostrar mensaje de error en caso de fallo
      toast.error(err.message, { id: 'newOffice' });
    }
  };

  /*     // Redirección si el usuario no está autenticado o no es admin
    if (!authUser||authUser.role !== "ADMIN") {
        <Navigate to="/" />;
    } hace falta meter el suthuserloading */

  return (
    <main>
      <h2>Página de creación de oficinas.</h2>
      <form onSubmit={handleAddSpace}>
        <label htmlFor='name'>NOMBRE: </label>
        <input
          type='text'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor='address'>DIRECCIÓN: </label>
        <input
          type='text'
          id='address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <label htmlFor='description'>DESCRIPCIÓN: </label>
        <input
          type='text'
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label htmlFor='capacity'>CAPACIDAD: </label>
        <input
          type='number'
          id='capacity'
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <label htmlFor='workspace'>WORKSPACE: </label>
        <select
          id='workspace'
          value={workspace}
          onChange={(e) => setWorkspace(e.target.value)}
          required
        >
          <option value='OFFICE'>OFFICE</option>
          <option value='DESK'>DESK</option>
        </select>

        <label htmlFor='price'>PRECIO: </label>
        <input
          type='number'
          id='price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <label htmlFor='opening'>Horario de Apertura: </label>
        <select
          id='opening'
          value={opening}
          onChange={(e) => setOpening(e.target.value)}
          required
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
              {`${i.toString().padStart(2, '0')}:00`}
            </option>
          ))}
        </select>
        <label htmlFor='closing'>Horario de Cierre: </label>
        <select
          id='closing'
          value={closing}
          onChange={(e) => setClosing(e.target.value)}
          required
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
              {`${i.toString().padStart(2, '0')}:00`}
            </option>
          ))}
        </select>
        <label htmlFor='photos'>FOTOS:</label>
        <input
          type='file'
          id='photos'
          onChange={handleFile}
          accept='image/jpeg, image/png'
          multiple
          required
        />
        <button type='submit'>Crear</button>
      </form>
    </main>
  );
};

// Exportación del componente
export default AddOfficeAdminPage;
