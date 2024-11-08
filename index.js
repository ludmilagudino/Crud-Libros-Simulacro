import express, { json } from "express";

import { libros } from "./libros.js";

const app = express(); //inicializar app
const port = 3000; //puerto donde se levanta

app.use(json()); //middleware

//-----------------------------RUTAS-------------------------------------------

//GET: Obtener todos los libros
app.get("/libros", (req, res) => {
  res.json(libros);
});

//------------------------------------------------------------------------
//GET:Obtener un libro por id
app.get("/libros/:id", (req, res) => {
  // req.params.id es el parámetro 'id' que se pasa en la URL.
  // Convertimos ese valor a número entero
  const libroId = parseInt(req.params.id, 10);

  // Utilizamos el método 'find()' para buscar el libro en el array 'libros'.
  // 'find()' recorre cada elemento (l) en el array y ejecuta la función de callback,
  // comparando si el 'id' del libro en el array es igual al 'libroId' que recibimos de la URL.
  const libro = libros.find((l) => l.id == libroId);
  if (libro) {
    res.json(libro);
  } else {
    res.status(404).json({ error: "Libro no encontrado" });
  }
});

//------------------------------------------------------------------------
// POST: Crear libro
app.post("/libros", (req, res) => {
  // Datos del libro recibidos en el cuerpo de la solicitud
  const datosLibros = req.body;

  // Obtener el año actual
  const currentYear = new Date().getFullYear();

  // Validación del año de publicación usando typeof
  if (
    typeof datosLibros.anioPublicacion !== "number" ||
    datosLibros.anioPublicacion <= 0 ||
    datosLibros.anioPublicacion >= currentYear
  ) {
    // Si no es un número o está fuera del rango válido, se resonde con un error
    return res.status(400).json({
      error:
        "El año de publicación debe ser un número mayor a 0 y menor al año actual.",
    });
  }

  // Crear el objeto del libro a guardar
  const libroAGuardar = {
    id: libros.length + 1, // ID incremental para el libro
    titulo: datosLibros.titulo,
    autor: datosLibros.autor,
    anioPublicacion: datosLibros.anioPublicacion,
    genero: {
      id: libros.length + 1, // ID incremental para el género
      nombre: datosLibros.genero.nombre,
      codigo: datosLibros.genero.codigo,
    },
  };

  // Agregar el nuevo libro al array `libros`
  libros.push(libroAGuardar);

  // resonder con el libro guardado y estado 201
  res.status(201).json(libroAGuardar);
});

//------------------------------------------------------------------------
// PUT: Actualizar un libro por id
app.put("/libros/:id", (req, res) => {
  // Obtener el id del libro desde la URL
  const libroId = Number(req.params.id);

  // Validaciones del ID
  if (!libroId) {
    return res.send("El id es necesario");
  }

  // Buscar el libro en el array usando el id
  const libroIndex = libros.findIndex((l) => l.id === libroId);

  if (libroIndex === -1) {
    // Si no se encuentra el libro, devolver un error 404
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  // Ahora que el ID es válido y el libro existe, podemos obtener el cuerpo de la solicitud
  const datosActualizados = req.body;

  // Actualizar los campos del libro encontrado con los datos nuevos
  libros[libroIndex] = {
    ...libros[libroIndex], // Mantener los datos anteriores
    ...datosActualizados, // Sobrescribir los campos con los nuevos datos
    id: libroId, // Asegurarse de que el id no se cambie
  };

  // resonder con el libro actualizado y el mensaje de éxito en un solo objeto
  res.status(200).json({
    message: "Libro actualizado exitosamente",
    libroActualizado: libros[libroIndex],
  });
});

//------------------------------------------------------------------------
// DELETE: Eliminar un libro por id
app.delete("/libros/:id", (req, res) => {
  // Obtener el id del libro desde la URL
  const libroId = Number(req.params.id);

  // Buscar el índice del libro en el array
  const libroIndex = libros.findIndex((l) => l.id === libroId);
  if (libroIndex === -1) {
    // Si no se encuentra el libro, devolver un error 404
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  // Eliminar el libro del array
  libros.splice(libroIndex, 1);

  // resonder con un mensaje de éxito
  //204 resUESTA SIN CONTENIDO
  // res.status(204).json({ message: "Libro eliminado exitosamente" });
  res.status(200).json({ message: "Libro eliminado exitosamente" });
});

//----------------------------FIN DE RUTAS-------------------------------------------

app.listen(port, () =>
  console.log(`Aplicacion ejecutandose en http://localhost:${port}`)
);
