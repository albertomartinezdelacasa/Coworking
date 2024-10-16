import { Link, useNavigate } from 'react-router-dom';

// importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const Home = () => {
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate('/Register');
  };

  return (
    <main>
      <div className='portada'>
        <div>
          <h1>Bienvenidos a Innovaspace</h1>
          <p> Te acompañamos en todas tus maneras de trabajar. </p>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}

      <div className='mega'>
        <div className='texts'>
          <h2>Explora todas nuestras opciones</h2>
          <a href='/ ruta a todas las officinas '>Ver todas las opciones</a>
        </div>

        {/* <Link to='/listoffice'> */}
        <div className='container'>
          <div className='art'>
            <img src='./fondo.jpg' alt='' />
            <h3>Oficinas Privadas</h3>
            <p>
              Instálate en una oficina totalmente amueblada con acceso a
              servicios profesionales y salas de reuniones, además de
              complementos opcionales.
            </p>
          </div>

          {/* </Link> */}

          {/* <Link to='/listoffice/desk'> */}
          <div className='art'>
            <img src='./fondo.jpg' alt='' />
            <h3>Escritorio Personal</h3>
            <p>
              Instálate en una oficina totalmente amueblada con acceso a
              servicios profesionales y salas de reuniones, además de
              complementos opcionales.
            </p>
          </div>
          {/* </Link> */}
        </div>
      </div>

      <>
        <img src='' alt=' foto de gente chocando las manos' />
        <h1>Busca la oficina que más se adecue para ti.</h1>
        <p>
          Completa el formulario de registro a continuación y comienza a
          disfrutar de nuestros increíbles espacios de trabajo.
        </p>
        <button onClick={handleRegisterClick}>Regístrate</button>
      </>

      <>
        <h1>
          Espacios Flexibles para una Colaboración y Productividad Óptimas
        </h1>
        <p>
          Transforma tu oficina con espacios flexibles que fomentan la
          colaboración y aumentan la productividad. Adáptate rápidamente a los
          cambios y mejora el bienestar de tu equipo con áreas tranquilas y
          amenidades compartidas. ¡Haz de tu oficina un lugar donde todos
          quieran estar!
        </p>
        <a href=''>mas informacion</a>
        <img src='' alt='mujer womanexplaining a los hombres de sala' />
      </>

      <>
        <img
          src=''
          alt='dos tios mirando un ordenador haciendo como que curran solo para foto'
        />
        <h1>Impulsa tu Creatividad y Conexiones Profesionales </h1>
        <p>
          No solo ofrecemos un lugar para trabajar, sino que también fomentamos
          la creatividad y el networking. Rodearte de profesionales de diversas
          industrias puede inspirarte y abrirte a nuevas ideas. Además,
          organizamos eventos y talleres que te permiten ampliar tu red de
          contactos y aprender nuevas habilidades.
        </p>
        <a href=''>mas informacion</a>
      </>

      <h3>Contamos con la confianza de las principales empresas del Mundo</h3>
      <p>
        Desde trabajadores autónomos hasta empresas multinacionales, estamos
        ayudando a nuestros miembros a reimaginar la forma en la que trabajan.
      </p>
      <a href=''>Ver todas las empresas</a>
      <>
        <a href=''>
          <img src='' alt='logo 1' />
        </a>
        <a href=''>
          <img src='' alt='logo 2' />
        </a>
        <a href=''>
          <img src='' alt='logo 3' />
        </a>
        <a href=''>
          <img src='' alt='logo 4' />
        </a>
      </>

      <>
        <h1>Quieres Publicar una Oficina?</h1>
        <p>Contactanos para poder publicar tu espacio coworking</p>
        <a href='mailto:example@example.com'>example@example.com</a>
      </>
    </main>
  );
};
export default Home;
