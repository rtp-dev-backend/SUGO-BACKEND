<script src="raphael-min.js"><
<script src="flowchart-latest.js"></script>

# API PARA CARGAR ARCHIVOS

En la presente documentacion se explicara el paso a paso para el desarrollo de una Api que permita cargar archivos desde el sistema a una carpeta especifica. 

***

# Contenido {#contenido-id}

- **Dependencias**
- [**Models**](#models-id)
- [**Controllers**](#controllers-id)
- [**Routes**](#routes-id)
- [**Utilities**](#utilities-id)
- [**Configuraciones en APP**](#app-id)




 ### Dependecias

Para iniciar con el proyecto es necesario instalar las siguientes paqueterias con el comando

`npm install "nombre de la Paqueteria"`

```JSON
"dependencies": {
    "express": "^4.18.2",
    "express-fileupload": "^1.4.0",
    "fs": "^0.0.1-security",
    "joi": "^17.10.0",
    "path": "^0.12.7",
    "sequelize": "^6.32.1"
  }
```
####Descripción de las dependencias

- **Express:** permite estructurar una aplicación de una manera ágil, nos proporciona funcionalidades como el enrutamiento, opciones para gestionar sesiones y cookies, etc.

- **Express-fileupload:** Es un middleware para el marco Express que le proporciona una manera fácil de manejar la carga de archivos.

- **Fs:** Permite interactuar con los archivos del sistema.

- **Joi:** Es un validador de datos basados en esquemas. 

- **Path:** Nos permite trabajar con rutas de archivos dentro del sistema

- **Sequelize:**  Es un ORM[^1] que permite a los usuarios llamar a funciones javascript para interactuar con SQL DB.

***

### Models [^](#contenido-id) {#models-id} 

La importancia de crear el modelo es para tener un control sobre los archivos que se van a cargar al sistema

Se desarrolla un modelo con las siguientes caracteristicas:

| campo | tipo |
| ------ | ------ |
| id | PK |
| path | string |
| nombre | string |
| usuario | string (credencial) |
| createdAt | date |
| updatedAt | date |


```ts
modelohasheader.hasMany(archivos, { /* options */ });
modelohasheader.belongsToMany(archivos, { through: 'rol_headers_files', /* options */ });
```

!!! note ""
    belongsToMany con ayuda de sequelize se crea un modelo para C  entre la asociacion del modelo A y B o tambien se puede crear manualmente 


```ts
//importamos las libreia de sequelize para ingresar los tipos de datos
import { DataTypes } from 'sequelize';
//importamos sugo_sequelize_connection para la conexion a la base de datos 
import { SUGO_sequelize_connection } from './../../database/sugo.connection';

// se crea una interfaz para indicar el tipo de dato valido para cada columna de la tabla
interface Model {
    id: number,
    estatus: boolean,
    nombre: string
}

// creamos una constate con la conexion a la base de datos y con la funcion de sequelize "define".
// declaramos si el tipo de dato ingresado es any o correspodende a la interfaz
export const saveImg = SUGO_sequelize_connection.define<any, Model>(
//Se indica el nombre de la tabla y sus campos
    'save', {
    id: {
        type:dataTypes.INTEGER,
        primarykey: true,
        autoincrement: true,
    }, 
    estatus: {
        type: DataTypes.BOOLEAN,    
    },
    nombre: {
        type: DataTypes.STRING
    }
},
    {
        timestamps: true,
    },
);
```

Una vez creado el modelo se debe cargar a la base de datos, se deben seguir los siguientes pasos:

**1.- Ir al archivo `index.ts`**

**2.- Importar la ruta donde se encuentra el modelo**
```js 
import './Carga_archivos/models/Save.models.js
```
**3.- ejecutar la funcion de sequelize**
```js 
await sequelize.sync({alter: true})
```
crea la tabla en la base de datos en caso de no existir y si existe la tabla actualiza los campos que fueron cambiados

***
### Controllers [^](#contenido-id) {#controllers-id} 

Se desarrollan los controladores con las siguientes caracteristicas:

```ts
//esta libreria funciona para tipar request y response desde express
import { Request, Response } from "express";

//se importa el modelo
import { saveImg } from '../../Cargar_Archivos/models/save.models'

//se importam las librerias necesarias 
import path from 'path'
import ds from 'fs/promises'
import fs from 'fs'

//se manda a llamar "subir archivos" quien contiene toda la logica de cargar de archivos
import subirArchivo from "../../utilities/saveFileInServer";

//Este es un controlador de HTTP que permite la consulta de los archivos guardados mediante FindAll
export const getSavedFiles = async (req: Request, res: Response) => {
    try {
        const save = await saveImg.findAll()
        res.json(save)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};
//Este es un controlador de HTTP que permite la consulta de los archivos guardados por medio de su ID
export const getSavedFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const save = await saveImg.findOne({
            where: { id },
        })
        res.json(save);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
//Este es un controlador de HTTP que permite descargar los archivos previamente cargados por medio de su ID.
export const getDescargaArchivo = async (req: Request, res: Response) => {
    try {
        const consulta = await saveImg.findByPk(req.params.id)
        // __dirname es una palabra reservada que indica la ruta de acceso a los archivos
        const archivoGuardado = path.join(__dirname, '../../../path', 'carpeta', consulta.dataValues.nombre);
        if (fs.existsSync(archivoGuardado)) {
            return res.download(archivoGuardado);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
//Este es un controlador de HTTP que permite guardar los archivos
export const postSave = async (req: Request, res: Response) => {

    const { estatus = 0, mes } = req.body

    const carpeta = mes ? mes : 'aplicacion';

    console.log({ estatus, carpeta })
    try {
        // con ayuda de la constante nombre, respetara el nombre del archivo
        const nombre = req.files.archivo.name;
        //guarda el tiempo en segundos
        const time = new Date().getTime();
        //extensionIndex indica que el nombre del archivo se conservara hasta el ulimo punto registrado
        const extensionIndex = nombre.lastIndexOf('.');
        //la constante nombreSinExtension almacenara el nombre del archivo sin la extension
        const nombreSinExtension = nombre.substring(0, extensionIndex);
        //esta constate permitira arregar una extension validad desde subir archivos
        const extension = nombre.substring(extensionIndex + 1);
        //esta constante reune las constantes anteriores para asignarle el nombre del archivo
        const nombreArchivos = nombreSinExtension + "_" + time + `.${extension}`;
        //aqui se indica la ruta donde se subiera el archivo
        await subirArchivo(req.files, nombreArchivos, '../../../path', carpeta );
        //esta constante permite crear un nuevo registro con un estatus y el nombre del archivo guardado
        const nuevoRegistro = await saveImg.create({
            estatus,
            path: nombreArchivos,
        });

        res.json(nuevoRegistro)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};
//controlador para eliminar los archivos de la base de datos y la carpeta externa
export const deleteSave = async (req: Request, res: Response) => {
    //se crea una constante llamada deleteRegistro y mediante findOne verifica que el Id exista 
    try {
        const { id } = req.params;
        const deleteRegistro = await saveImg.findOne({
            where: {
                id,
            },
        });
        //esta condicion if verifica que el archivo exista, de lo contrario te mandara un mensaje de error
        if (!deleteRegistro) {
            return res.status(404).json({ message: `No existe registro con el ID: ${id} `  });
        }
        //si existe el registro se eliminara de la base de datos con destroy()
        await deleteRegistro.destroy();
        se crea una constante llmada filepath que busca la ruta donde se almacena el archivo y lo elimina 
        const filePath = path.join(__dirname, '../../../../SUGO_backTS_files/Roles_modulos/SEPTIEMBRE', deleteRegistro.nombre);
        
        try {
            await ds.unlink(filePath); // Eliminar el archivo
        } catch (err) {
            console.error(`Error al eliminar el archivo: ${err.message}`);
        }
        res.sendStatus(204);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}
```
***
### Routes [^](#contenido-id) {#routes-id}
**Se crean las rutas para poder realizar las peticiones HTTP**
````TS
//Se importa el metodo Router de la libreria express
import Router from 'express'
//se importan los controladores 
import {  getDescargaArchivo, getSavedFile, getSavedFiles, postSave } from '../../Cargar_Archivos/controllers/save.control';
//Se crea una constante con la funcion Router
const router = Router();

//se crean las rutas correspondientes a los controladores
router.get('/api/rol/saved_file/descargar/:id', getDescargaArchivo)
router.get('/api/rol/saved_file/:id', getSavedFile)
router.get('/api/rol/saved_file', getSavedFiles)
router.post('/api/rol/saved_file', postSave);
router.delete('/api/rol/delete_file/:id', deleteSave)

//se exporta la constante router
export default router;
````
***
### Utilities [^](#contenido-id) {#utilities-id}
**Se crea la funcion FuncsArrays**
````ts
//se importa la libreria path
import path from "path";

//se crea una constate llamada saveFileInserver tipando sus datos
const saveFileInServer = (file, fileName: string, filePath: string, carpeta: string) => {

    // se crea una constante donde indicas las extensiones validas 
    const extensionesValidas = ['xlsx']
    //se retorna una nueva promesa donde archivo que esta dentro de File debe tener un nombre y una extension
    return new Promise((resolve, reject) => {
        const { archivo } = file;
        const nombre = archivo.name.split('.')
        const extension = nombre[nombre.length - 1];

//se crea una condicion donde se valida si la extension ex valida y retorna la extension valida y de lo contrario te manda un error diciendo que la extension no esta permitida 
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida, ${extensionesValidas}`);
        }
    //se crea una constante con el nombre de upLoadPath que es igual a la ruta donde se van almacenar los archivos con ayuda de path en caso de existir un error el sistema te mandara un mensaje.
        const uploadPath = path.join(__dirname, filePath, carpeta, fileName);

        archivo.mv(uploadPath, (err) => {
            if (err) reject(err);

            resolve(fileName);
        });
    });
}

export default saveFileInServer
````
***
### Configuraciones en APP  [^](#contenido-id) {#app-id}

**Se configura ````app.ts ````**

````ts
//Se importan las librerias de express y fileUpload
import fileUpload from 'express-fileupload';
import express from 'express'
````

````ts
//se crea un midleware para validad la cargar de archivos
app.use(fileUpload({

    //almacenará los archivos subidos en archivos temporales en lugar de mantenerlos en la memoria
    useTempFiles : true,

    //ndica la ubicación donde se almacenarán temporalmente los archivos subidos.
    tempFileDir : '/tmp/',

    //Esto permite que se creen automáticamente los directorios necesarios en la ruta especificada en caso de no existir 
    createParentPath: true
}))
````
````ts
//Se importan los routes
import SaveRouter from './Cargar_Archivos/routes/aplicacion.routes'
````
````ts
// se crea un app.use con el nombre que se le asigno a la importacion de los Routes para que el sistema pueda leerlos
app.use(SaveRouter);
````



[^1]: Un ORM (Object Relational Mapping) es un modelo de programación cuya misión es transformar las tablas de una base de datos de forma que las tareas básicas, que realizan los programadores, estén simplificadas. 































