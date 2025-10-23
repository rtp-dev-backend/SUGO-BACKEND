import path from 'path';
import fileUpload from 'express-fileupload';
import express from 'express'
import cors from 'cors'
import front from './Front/Routes/sugoFront.routes';
// import cumpli from './Cumplimiento/routes/cumpli.routes';
import Peticion from './PetecionesSwap/routes/Peticiones.routes'
import Modalidad from './General/routes/modalidad_autorizada.routes';
import Rutas from './General/routes/rutas_autorizadas.routes';
import Modulos from './General/routes/Catalogo_modulos.routes'
// import Perido from './General/routes/Catalogo_periodo.routes'
import Rutasxmod from './General/routes/Catalogo_rutasxmodulo.routes'
import Pruebas from './General/routes/Catalogo_Prueba.routes';
import ecosBitacora from './Caseta/Routes/ecosBitacora.routes'
import view_trabajador from './General/routes/view_trabajador.routes'
import pvEstado from './Caseta/Routes/pvEstado.routes'
import pvEcos from './Caseta/Routes/pvEcos.routes'

// & Importar rutas de periodos de rol
import periodosRolRouter from './rol/routes/periodosRol.routes';
import cargaRolRouter from './rol/routes/cargarRol.routes';
import descargarPlantillaRouter from './rol/routes/descargarPlantilla.routes';

const app = express()

//& Middlewares
app.use(cors())
// Para poder leer los JSON del body 
app.use( express.json({ limit: '10mb' }) )

// app.use(express.static(path.join(__dirname, 'web')));

app.use(fileUpload({
//     useTempFiles : true,
//     // tempFileDir : '/tmp/',
//     // createParentPath: true
}))


//& Rutas
// app.use(front)

// app.use(cumpli)
app.use(Peticion)
app.use(Modalidad)
app.use(Rutas)
app.use(Modulos)
// app.use(Perido)
app.use(Rutasxmod)
app.use(Pruebas)


app.use('/api/periodos', periodosRolRouter);
app.use('/api/rol', cargaRolRouter);

// Ruta para descargar plantilla de rol
app.use('/api/rol', descargarPlantillaRouter);

app.use(ecosBitacora);
app.use(view_trabajador);
app.use('/api/caseta/', pvEstado);
app.use('/api/caseta/', pvEcos);






export default app