// Importamos los hooks.
import { useEffect, useState } from 'react';
//importamos la funcion toast
import toast from 'react-hot-toast';
//Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const useAnOffice = (idOffice) => {
  const [oficina, setOficina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOficina = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`);
        //Obtenemos el body.
        const body = await res.json();

        if (body.status === 'error') {
          throw new Error(body.message);
        }
        setOficina(body.data.offices);
        setLoading(false);
      } catch (err) {
        toast.error(err.message, {
          id: 'officeDetails',
        });
        setLoading(false);
      }
    };
    //LLamamos a la funcion anterior.
    fetchOficina();
  }, [idOffice]);
  return {
    oficina,
    loading,
  };
};

export default useAnOffice;
