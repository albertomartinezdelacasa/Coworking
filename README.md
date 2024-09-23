# Coworking
Backend
● Creación de proyecto Node y estructura inicial de carpetas del
servidor con Express
● Middleware 404 not found
● Middleware gestión de errores
● Middleware parseo del body de la petición (JSON)
● Middleware upload de files
● Middleware definición directorio recursos estáticos (imágenes, files)
● Middleware: cors
● Middleware verificación de autenticación de usuarios (JWT)
● Creación de la base de datos con datos fijos (tipo de espacio,
equipamiento, categoría incidencia y usuario admin)
● Creación de la conexión del servidor Express con la base de datos
● Endpoint registro de usuarios
● Endpoint validación usuario
● Endpoint login de usuarios
● Endpoint info usuario
● Endpoint cambio contraseña
● Endpoint lista categorias incidencias
● Endpoint lista equipamientos
● Endpoint lista tipo de espacio
● Endpoint creación de un espacio con nombre, descripción, foto,
dirección, capacidad máxima, equipamiento, tipo espacio, precio por
cliente, precio alquiler totalidad espacio, … (solo administrador)
● Endpoint listado espacios (visualizar media rating de cada uno)
● Endpoint detalle del espacio.
● Endpoint para reservar un espacio
● Endpoint para cancelar la reserva de un espacio
● Endpoint para confirmar o rechazar la reserva con envío email al
cliente (solo administrador)
● Endpoint rating del espacio después de su utilizo (1-5)
● Endpoint creación de un mensaje de incidencia sobre un espacio
reservado (el administrador usará este endpoint para contestar a la
incidencia)
● Endpoint listado reservas de un usuario (el administrador verá todas
las reservas)
● Endpoint detalle reserva con listado de los mensajes de incidencia
● Endpoint listado de todas las incidencias (solo administrador)
● Colección de Postman con los endpoints implementados
● Creación de una breve documentación en un fichero README.md.
Esta documentación debe incluir al menos una breve descripción del
proyecto y los pasos para arrancar la plataforma

Extra
● Recuperación contraseña
● Actualización del perfil de usuario
● Actualización servicio/producto
● Filtros y ordenaciones en el listado servicio/producto
● Validar los datos de la petición con Joi