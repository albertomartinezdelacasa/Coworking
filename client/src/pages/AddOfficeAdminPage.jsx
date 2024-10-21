// // Importación de los hooks useState y useContext de React
// import { useState, useContext } from 'react';

// // Importación de los componentes useNavigate y Navigate de react-router-dom
// import { useNavigate, Navigate } from 'react-router-dom';

// // Importación del contexto de autenticación
// import { AuthContext } from '../contexts/AuthContext';

// // Importación de la función toast para mostrar notificaciones
// import toast from 'react-hot-toast';

// // Obtención de la URL de la API desde las variables de entorno
// const { VITE_API_URL } = import.meta.env;

// // Definición del componente funcional AddOfficeAdmin
// const AddOfficeAdminPage = () => {
//   // Extracción de authToken y authUser del contexto de autenticación
//   const { authToken, authUser, authUserLoading } = useContext(AuthContext);

//   // Verificación del estado de carga y el rol de usuario antes de proceder
//   if (authUserLoading) {
//     return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtiene authUser
//   }

//   if (!authUser || authUser.role !== 'ADMIN') {
//     return <Navigate to='/' />; // Redirigir si no es admin
//   }

//   // Hook para la navegación programática
//   const navigate = useNavigate();

//   // Estados para los campos del formulario
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [address, setAddress] = useState('');
//   const [workspace, setWorkspace] = useState('');
//   const [capacity, setCapacity] = useState('');
//   const [price, setPrice] = useState('');
//   const [opening, setOpening] = useState('');
//   const [closing, setClosing] = useState('');
//   const [photos, setPhotos] = useState([]);

//   // Función para manejar la selección de archivos
//   const handleFile = (e) => {
//     // Mueve esta función fuera de handleAddSpace
//     const file = Array.from(e.target.files);
//     if (file.length <= 5) {
//       setPhotos(file);
//     } else {
//       toast.error('No puedes subir más de 5 fotos');
//       e.target.value = null;
//     }
//   };

//   // Verificación del rol de usuario antes de proceder
//   if (!authUser || authUser.role !== 'ADMIN') {
//     return <Navigate to='/' />; // Redirigir si no es admin
//   }
//   // Función para manejar el envío del formulario
//   const handleAddSpace = async (e) => {
//     try {
//       e.preventDefault();

//       // esto es por que en SQL solo el formato time te pide 00:00:00,
//       //pero el time del form solo 00:00 asi que hay que meter los segundos

//       const formattedOpening = opening.length === 5 ? `${opening}:00` : opening;
//       const formattedClosing = closing.length === 5 ? `${closing}:00` : closing;

//       // Creación del objeto FormData para enviar los datos
//       const formData = new FormData();
//       formData.append('name', name);
//       formData.append('description', description);
//       formData.append('address', address);
//       formData.append('workspace', workspace);
//       formData.append('capacity', capacity);
//       formData.append('price', price);
//       formData.append('opening', formattedOpening);
//       formData.append('closing', formattedClosing);

//       formData.append('equipments', JSON.stringify([1]));

//       // Agregar las fotos al FormData
//       for (let i = 0; i < photos.length; i++) {
//         formData.append(`photo${i + 1}`, photos[i]);
//       }

//       // Envío de la solicitud POST a la API
//       const res = await fetch(`${VITE_API_URL}/api/office/create`, {
//         method: 'POST',
//         headers: {
//           /*  "Content-Type": "application/json", */
//           Authorization: authToken,
//         },
//         body: formData,
//       });

//       // Procesamiento de la respuesta
//       const body = await res.json();

//       if (body.status === 'error') {
//         throw new Error(body.message);
//       }

//       // Mostrar mensaje de éxito y navegar a la página principal
//       toast.success(body.message, { id: 'newOffice' });

//       navigate('/office/list');
//     } catch (err) {
//       // Mostrar mensaje de error en caso de fallo
//       toast.error(err.message, { id: 'newOffice' });
//     }
//   };

//   return (
//     <main>
//       <h2>Página de creación de oficinas.</h2>
//       <form onSubmit={handleAddSpace}>
//         <label htmlFor='name'>NOMBRE: </label>
//         <input
//           type='text'
//           id='name'
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <label htmlFor='address'>DIRECCIÓN: </label>
//         <input
//           type='text'
//           id='address'
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           required
//         />
//         <label htmlFor='description'>DESCRIPCIÓN: </label>
//         <input
//           type='text'
//           id='description'
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//         <label htmlFor='capacity'>CAPACIDAD: </label>
//         <input
//           type='number'
//           id='capacity'
//           value={capacity}
//           onChange={(e) => setCapacity(e.target.value)}
//           required
//         />
//         <label htmlFor='workspace'>WORKSPACE: </label>
//         <select
//           id='workspace'
//           value={workspace}
//           onChange={(e) => setWorkspace(e.target.value)}
//           required
//         >
//           <option value='OFFICE'>OFFICE</option>
//           <option value='DESK'>DESK</option>
//         </select>

//         <label htmlFor='price'>PRECIO: </label>
//         <input
//           type='number'
//           id='price'
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//         />
//         <label htmlFor='opening'>Horario de Apertura: </label>
//         <input
//           type='time'
//           id='opening'
//           value={opening}
//           onChange={(e) => setOpening(e.target.value)}
//           required
//         />
//         <label htmlFor='closing'>Horario de Cierre: </label>
//         <input
//           type='time'
//           id='closing'
//           value={closing}
//           onChange={(e) => setClosing(e.target.value)}
//           required
//         />
//         <label htmlFor='photos'>FOTOS:</label>
//         <input
//           type='file'
//           id='photos'
//           onChange={handleFile}
//           accept='image/jpeg, image/png'
//           multiple
//           required
//         />
//         <button type='submit'>Crear</button>
//       </form>
//     </main>
//   );
// };

// // Exportación del componente
// export default AddOfficeAdminPage;

// ==============================================//

//-------------------------------------------------//

import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Obtención de la URL de la API desde las variables de entorno
const { VITE_API_URL } = import.meta.env;

const AddOfficeAdminPage = () => {
  const { authToken } = useContext(AuthContext);
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
  const [equipments, setEquipments] = useState([]); // Estado para los equipamientos
  const [selectedEquipments, setSelectedEquipments] = useState([]); // Equipamientos seleccionados

  // Obtener equipamientos al montar el componente
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/equipments`, {
          headers: {
            Authorization: authToken,
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener los equipamientos'); // Manejar error si no es 2xx
        }

        const body = await res.json();
        if (body.status === 'ok') {
          setEquipments(body.data.equipments[0]); // Asegúrate de que esta es la estructura correcta
        } else {
          toast.error(body.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchEquipments();
  }, [authToken]);

  // Función para manejar el envío del formulario
  const handleAddSpace = async (e) => {
    try {
      e.preventDefault();

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

      // Agregar los equipamientos seleccionados al FormData
      formData.append('equipments', JSON.stringify(selectedEquipments));

      // Agregar las fotos al FormData
      for (let i = 0; i < photos.length; i++) {
        formData.append(`photo${i + 1}`, photos[i]);
      }

      // Envío de la solicitud POST a la API
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/office/create`,
        {
          method: 'POST',
          headers: {
            Authorization: authToken,
          },
          body: formData,
        }
      );

      // Procesamiento de la respuesta
      const body = await res.json();

      if (body.status === 'error') {
        throw new Error(body.message);
      }

      // Mostrar mensaje de éxito y navegar a la página principal
      toast.success(body.message);
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Manejo de selección de equipamientos
  const handleEquipmentChange = (e) => {
    const { value, checked } = e.target;
    const id = Number(value); // Asegúrate de convertir el valor a número
    if (checked) {
      setSelectedEquipments((prev) => [...prev, id]); // Añadir el ID como número
    } else {
      setSelectedEquipments((prev) =>
        prev.filter((id) => id !== Number(value))
      ); // Filtrar el ID como número
    }
  };

  // Función para manejar la selección de archivos
  const handleFile = (e) => {
    const file = Array.from(e.target.files);
    if (file) {
      setPhotos(file); // Asigna las fotos seleccionadas al estado
    }
  };

  return (
    <div>
      <h1>Añadir Oficina</h1>
      <form onSubmit={handleAddSpace}>
        <input
          type='text'
          placeholder='Nombre'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type='text'
          placeholder='Descripción'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type='text'
          placeholder='Dirección'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <select
          value={workspace}
          onChange={(e) => setWorkspace(e.target.value)}
          required
        >
          <option value=''>Seleccionar tipo de espacio</option>
          <option value='OFFICE'>Oficina</option>
          <option value='DESK'>Escritorio</option>
        </select>
        <input
          type='number'
          placeholder='Capacidad'
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <input
          type='number'
          placeholder='Precio'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
<<<<<<< HEAD
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
=======
        <input
          type='time'
          value={opening}
          onChange={(e) => setOpening(e.target.value)}
          required
        />
        <input
          type='time'
          value={closing}
          onChange={(e) => setClosing(e.target.value)}
          required
        />
        <input type='file' multiple onChange={handleFile} required />

        <h2>Equipamientos disponibles</h2>
        {Array.isArray(equipments) &&
          equipments.map((equipment) => (
            <div key={equipment.id}>
              <label>
                <input
                  type='checkbox'
                  value={equipment.id} // Valor como número
                  onChange={handleEquipmentChange}
                  checked={selectedEquipments.includes(equipment.id)} // Comparar directamente como número
                />
                {equipment.name}
              </label>
            </div>
          ))}

        <button type='submit'>Crear Oficina</button>
>>>>>>>  equipamientos agregados a AddofficeAdmin page
      </form>
    </div>
  );
};

export default AddOfficeAdminPage;
