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
        await pool.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        // Creamos la tabla de usuarios.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
           
            )	
        `);

        // Creamos la tabla de entradas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS entries (
                
            )
        `);

        // Creamos la tabla de fotos.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS entryPhotos (
                
            )
        `);

        // Tabla de votos.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS entryVotes (
                
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
