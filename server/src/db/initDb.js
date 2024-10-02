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
            'DROP TABLE IF EXISTS users, offices, equipments, officesEquipments, officePhotos, bookings, votes',
        );

        console.log('Creando tablas...');

        // Creamos la tabla de usuarios.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL ,
                lastName VARCHAR(255)NOT NULL,
                avatar VARCHAR(255),
                role ENUM('CLIENT', 'ADMIN') DEFAULT 'CLIENT',
                active BOOLEAN DEFAULT FALSE, 
                registrationCode CHAR(50),
                recoverPassCode CHAR(50),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `);

        // Creamos la tabla de oficinas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offices (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                description VARCHAR(255),
                address VARCHAR(255) NOT NULL,
                workspace ENUM ("OFFICE", "DESK"),
                capacity INT UNSIGNED NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `);

        // Creamos tabla Equipamientos
        await pool.query(`
            CREATE TABLE IF NOT EXISTS equipments (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
         )
         `);

        //Creamos tabla de Equipamiento de oficina
        await pool.query(`
            CREATE TABLE IF NOT EXISTS officesEquipments (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idOffice INT UNSIGNED,
                    FOREIGN KEY (idOffice) REFERENCES offices(id),
                idEquipment INT UNSIGNED,
                    FOREIGN KEY (idEquipment) REFERENCES equipments(id),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP    
            )
          `);

        // Tabla de fotos.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS officePhotos (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idOffice INT UNSIGNED NOT NULL,
                    FOREIGN KEY(idOffice) REFERENCES offices(id),
                name VARCHAR(100) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Creamos la tabla de Reservas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT ,
                idUser INT UNSIGNED,
                    FOREIGN KEY (idUser) REFERENCES users(id),
                idOffice INT UNSIGNED,
                    FOREIGN KEY (idOffice) REFERENCES offices(id)
                checkIn DATETIME NOT NULL,
                checkOut DATETIME NOT NULL,
                guests INT NOT NULL,
                status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELED') DEFAULT 'PENDING',
                vote TINYINT UNSIGNED,
                comment VARCHAR(255),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP                    
            )
            `);

        console.log('¡Tablas creadas!');

        console.log('Insertando el usuario administrador...');
        await pool.query(
            'INSERT INTO users(email, username, password, name, lastname, role, active) VALUES ("admin@coworking.com", "admin", "admin123", "admin", "coworking", "ADMIN", TRUE)',
        );
        console.log('¡Cuenta de administrador añadida!');

        console.log('Insertamos equipamientos');
        await pool.query(`
            INSERT INTO equipments (name) VALUES
                ("Pizarra"), ("Proyector"), ("Wi-fi")
            )
            `);
        console.log('¡Equipamientos añadidos!');

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
