import React from 'react';
import Slider from 'react-slick'; // Importamos el componente Slider
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const Carrusel = ({ images }) => {
  // Configuración del carrusel
  const settings = {
    dots: true, // Muestra los puntos de navegación
    infinite: images.length > 1, // Desactiva "infinite" si hay solo una imagen
    speed: 500, // Velocidad de la transición
    slidesToShow: 1, // Muestra una imagen por vez
    slidesToScroll: 1, // Cambia una imagen por vez
    autoplay: true, // Autoplay para que cambie solo
    autoplaySpeed: 3000, // Cambia cada 3 segundos
  };

  return (
    <Slider {...settings}>
      {images.map((image) => (
        <div key={image.id}>
          <img
            src={`${VITE_API_URL}/${image.name}`}
            key={image.id}
            alt={'Imagen del carrusel'}
            style={{ width: '400px', height: '400px' }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default Carrusel;
