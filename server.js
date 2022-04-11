// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inicializar variables
const app = express();

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./routes/app')
var adminRoutes = require('./routes/admin')
var usuarioSupRoutes = require('./routes/usuarioSupervisor')



// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/quizAppDB', (err, res) => {

  if(err) throw err;

  console.log('Base de datos online');

});

// Rutas
app.use('/', appRoutes);
app.use('/admin', adminRoutes);
app.use('/supervisor', usuarioSupRoutes);


// Escuchando peticiones
app.listen(3000, () => {
    console.log('Escuchando peticiones en el puerto 3000');
});