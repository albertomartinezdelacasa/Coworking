// Añadimos al proceso actual la lista de variables de entorno que figuran en el fichero ".env".
import 'dotenv/config';

// Función que retorna una conexión con la base de datos.
import getPool from './getPool.js';

// Función que genera las tablas.
const main = async () => {
    try {
        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        console.log('Borrando tablas...');

        // Borramos las tablas.
        await pool.query(
            'DROP TABLE IF EXISTS users, offices, bookings, votes',
        );

        console.log('Creando tablas...');

        // Creamos la tabla de usuarios.
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
           id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
           email VARCHAR(255) UNIQUE NOT NULL,
           username VARCHAR(255) UNIQUE NOT NULL,
           password VARCHAR(255) NOT NULL,
           name VARCHAR(255) NOT NULL,
           lastName VARCHAR(255) NOT NULL,
           avatar VARCHAR(255),
           role ENUM('CLIENT', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
           active BOOLEAN DEFAULT FALSE, 
           registrationCode CHAR(30),
           recoverPassCode CHAR (30),
           createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )	
        `);

        // Creamos la tabla de oficinas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offices (
                 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                 name VARCHAR(255) NOT NULL,
                 description VARCHAR(255),
                 photo VARCHAR(255),
                 address VARCHAR(255) NOT NULL,
                 equipment VARCHAR(255), 
                 workspace ENUM ("OFFICE", "DESK"),
                 capacity INT UNSIGNED NOT NULL,
                 totalPrice DECIMAL(10, 2) NOT NULL,
                 ratingAverage DECIMAL(3, 2) DEFAULT 0,
                 totalRatings INT DEFAULT 0,
                 createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Creamos la tabla de Reservas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT ,
                idUser INT UNSIGNED,
                idOffice INT UNSIGNED,
	            checkIn DATETIME NOT NULL,
	            checkOut DATETIME NOT NULL,
                guests INT NOT NULL,
                status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELED') DEFAULT 'PENDING',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (idUser) REFERENCES users(id),
                FOREIGN KEY (idOffice) REFERENCES offices(id)
            )
        `);

        // Tabla de votos.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value TINYINT UNSIGNED NOT NULL,
                idUser INT UNSIGNED NOT NULL,
                idOffice INT UNSIGNED NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (idUser) REFERENCES users(id),
                FOREIGN KEY (idOffice) REFERENCES offices(id)
            ) 
        `);

        console.log('¡Tablas creadas!');

        // Cerramos el proceso con código 0 indicando que todo ha ido bien.
        process.exit(0);
    } catch (err) {
        console.error(err);

        // Cerramos el proceso con código 1 indicando que hubo un error.
        process.exit(1);
    }
};

// Llamamos a la función anterior.
main();
