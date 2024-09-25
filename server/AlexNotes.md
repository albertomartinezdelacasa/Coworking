En points que nos piden:

registro de usuario [`/users/register`]
validacion de usuario [`/users/validate`]
login de usuarios [`/users/login`]
info de usuario [`/users/profile]
cambio de contrasena [`/users/editpassword`]
listado de reservas de un usuario (admin ve todas las reservas) [`/users/spacesBooked`]
detalle de reserva de un usuario ( admin vera todas las reservas )[`/users/spacebookedInfo`]

list incidencias [`/offices/incidentsList`]
listado de todas la incidencias.[`/offices/allIncidents`]

lista equipamiento [`/offices/equipmentList`]
tipo de espacio [`/offices/spaces`]
listado de espacios (con rating de cada uno) [`/offices/spaceRated`]
detalle del espacio [`/offices/spaceInfo`]

creación de un espacio con nombre,descripción,foto,
dirección, capacidad máxima, equipamiento, tipo espacio, precio por
cliente, precio alquiler totalidad espacio, ... (solo administrador) [`/offices/createSpaces`]

resevar uun espacio [`/offices/spaceBooking`]
cancela la reserva [`/offices/cancelSpaceBooking]

valorar el espacio alquilado [`/offices/spaceRating`]
detalle de reserva con list de mensjaes de incidencia [`/offices/spaceIncident`]

mensaje de incidencia donde tambien contesta el admin [`/offices/incidentChat`]
confirmar o rechazar la reservax con envio de email al cliente ( solo admin) [`/offices/bookingAproval`]

# end points de usuarios no registrados (✅) ( ? )

? - **POST** - [`/users/register`] - Crea un nuevo usuario pendiente de activar.
? - **PUT** - [`/users/registerValitadation`] - Registro (con envío e-mail de validación)
? - **GET** - [`/users/homePage`] - visualizar la landing con el listado de espacios

? - \*\* ** - [`/offices/filterSpace`] - filtro de spaces ( name, description, address ..)
? - ** ** - [`/offices/equipmentList`] - equipamiento disponible (mesas, sillas, pantalla, ...)
? - ** \*\* - [`/offices/passwordRecovery`] - Login con enlace de recuperación contraseña

# end points de usuarios registrados (✅) ( ? )

? - **GET** - [`/users/homePage`] - visualizar la landing con el listado de espacios
? - **PUT** - [`/users/profile`] - Gestión del perfil (edición de datos: email,username,name,last,namepassword,avatar)
? - **GET** - [`/users/spaceBooked`] - Listado reservas

? - \*\* ** - [`/offices/filterSpace`] - filtro de spaces ( name, description, address ..)
? - \*\* ** - [`/offices/spaceinfo`] - Acceder a la ficha del espacio con todos los detalles
? - \*\* ** - [`/offices/spaceBooking`] - Reservar (una plaza o todo)
? - \*\* ** - [`/offices/cancelSpaceBooking`] - Cancelar una reserva hasta el día anterior
? - \*\* ** - [`/offices/incidentChat`] - Reporte de incidencia sobre espacio: (Categoría incidencia Descripción)
? - \*\* ** - [`/offices/spaceRating`] - Rating del espacio después de su utilizo (desde 1 a 5)

# end points de usuarios ADMIN (✅) ( ? )

? - **GET** - [`/users/homePage`] - visualizar la landing con el listado de espacios
? - \*\* ** - [`/offices/filterSpace`] - filtro de spaces ( name, description, address ..)
? - \*\* ** - [`/offices/spaceinfo`] - Acceder a la ficha del espacio con todos los detalles
? - **PUT** - [`/users/profile`] - Gestión del perfil (edición de datos: email,username,name,last,namepassword,avatar)

? - **PUT** - [[`/offices/CreateSpaces`]] - La plataforma permitirá introducir la información y actualización necesaria sobre los
espacios de coworking (nombre, descripción, foto, dirección, equipamiento, tipo
espacio, capacidad, precio por persona, precio alquiler totalidad espacio ... ).

? - **GET** - [`/users/spaceBooked`] -Ver el Listado de las reservas
? - \*\* ** - [`/offices/bookingAproval`] -Confirmar o rechazar las reservas (con envío email)
? - \*\* ** - [`/offices/incidentChat`] - Gestion de incidencia sobre espacio:

<!--


----------------------------USUARIO NO REGISTRADO---------------------------------

● Visualizar la landing con el listado de los espacios
● Búsqueda / filtro por:
    ○ palabra (en nombre, descripción, dirección, ... )
    ○ equipamiento disponible (mesas, sillas, pantalla, ...)
    ○ rango de fechas
● Ordenación espacios (rating, precio, capacidad, ...)
● Registro (con envío e-mail de validación)
    ○ e-mail
    ○ username ○ contraseña
● Login con enlace de recuperación contraseña


------------------------------- USUARIO CLIENTE ---------------------------------------

● Visualizar la landing con el listado de los espacios
● Gestión del perfil (edición de datos)
    ○ e-mail
    ○ username
    ○ nombre y apellidos
    ○ contraseña
    ○ avatar

● Búsqueda, filtro y ordenación como un usuario no registrado
● Acceder a la ficha del espacio con todos los detalles
● Reservar (una plaza o todo)
● Listado reservas
● Cancelar una reserva hasta el día anterior

● Reporte de incidencia sobre espacio:
    ○ Categoría incidencia
    ○ Descripción

● Rating del espacio después de su utilizo (desde 1 a 5)


---------------------------------- USUARIO ADMINISTRADOR------------------------------------

● Visualizar la landing con el listado de los espacios
● Búsqueda, filtro y ordenación como un usuario no registrado
● Acceder a la ficha del espacio con todos los detalles

● Gestión del perfil (edición de datos)
    ○ contraseña
    ○ avatar
● La plataforma permitirá introducir la información y actualización necesaria sobre los
    espacios de coworking (nombre, descripción, foto, dirección, equipamiento, tipo
    espacio, capacidad, precio por persona, precio alquiler totalidad espacio ... ).
● Ver el listado de las reservas
● Confirmar o rechazar las reservas (con envío email)
● Gestión incidencias sobre los espacios

(*) El equipo puede añadir y/o modificar los requisitos para personalizar la plataforma y tomar las decisiones adecuadas en las partes en las   cuales no se entra en el detalle.

-->
