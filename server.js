// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inicializar variables
const app = express();

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./routes/app')
var adminRoutes = require('./routes/admin')

//var usuarioRoutes = require('./routes/usuario')


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/quizAppDB', (err, res) => {

  if(err) throw err;

  console.log('Base de datos online');

});

// Rutas
app.use('/', appRoutes);
app.use('/admin', adminRoutes);


// Escuchando peticiones
app.listen(3000, () => {
    console.log('Escuchando peticiones en el puerto 3000');
});