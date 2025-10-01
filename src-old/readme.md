## Config de tsconfig.json

(Tambien se puede crear con el comando `tsc --init` [^tsconfig])

En la **raiz** del *proyecto* crear este archivo y colocar: 
```JSON
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "sourceMap": true,
    "outDir": "./dist",
    "strict": false,
    "esModuleInterop": true
  },
  "include": [
    "src",
    "./src/*/.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```


## Config de nodemon.json
El archivo `nodemon.json` es para hacer la configuración necesaria para que se ejecuten los archivos Ts
```JSON
{
    "watch": ["src"],
    "ext": "ts, js",
    "ignore": ["src/**/*.spec.ts"],
    "exec": "tsc && node src/index.js"
}
```
Esta configuración indica que nodemon debe observar la carpeta src en busca de cambios de archivos con extensión .ts y .js. Cuando detecta un cambio, nodemon ejecuta los siguientes comandos:

**tsc**: Compila tu código de *TypeScript* a *JavaScript* utilizando el compilador de TypeScript y almacena los archivos en la carpeta indicada en tsconfig ( `"outDir": "./dist"` ).
node src/index.js: Ejecuta el archivo JavaScript compilado (Si esta en Ts al compilar lo crea en la carpeta dis, por lo que se debe especificar como dist/index.js).


Ten en cuenta que esta configuración asume que tu archivo principal de Node.js se encuentra en src/index.ts y que se compilará a dist/index.js.


## En el package.json los scripts quedan asi:
```JSON
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/index.js",
    "dev": "nodemon"
  },
```
Donde dev inicia a nodemon con la configuracion antes hecha 

## Dependencias
```JSON
"devDependencies": {
    "@types/express": "^4.17.17",
    "@types/pg": "^8.10.2",
    "nodemon": "^3.0.1",
    "tslint": "^6.1.3",
    "typescript": "^5.1.6"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "morgan": "^1.10.0",
    "pg": "^8.11.1",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.32.1"
  }
```


[^tsconfig]: abc