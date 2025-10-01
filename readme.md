# Back SUGO

## Modelos ER

[Modelo ER][Modelo ER Rol-calendarios] para guardar la data del Rol

![Modelo entidad relación para data de los roles](/docs/images/MER_rol_data.png "Modelo entidad relación para data de los roles")

## Compartir imagen Docker

- Se creo los archivos [dockerfile](dockerfile) y [.dockerignore](.dockerignore) 
- Para crear la imagen ejecutar en la consola `docker build -t nombre-de-tu-imagen:tag .` 
  | `docker build -t sugo_back:1.1 .`
  | Solo cambiar el tag en el docker-compose.yml
- Para correr el contenedor ejecutar `docker run -p [XXXX]:[4000 coincidir con .env] -d nombre-de-tu-imagen` | `docker run -p 4010:4000 -d sugo_back`


## Project Structure
```js
.  
├── package.json  
│
├── requests    (How to use the API: request methods, params, body, etc. )  
│   ├── projects.http  
│   └── tasks.http 
│ 
├── sql ( sequelize methods in sql ) *optional  
│   └── db.sql  
│ 
├── .env  
├── .gitignore  
├── nodemon.json  
├── package.json  
├── tsconfig.json  
├── tslint.json  
│
└── src  
    ├── app1: Cumplimiento
    │    ├── models  
    │    │   ├── Cumpli.model.ts  
    │    │   ├── Cumpli_desc.model.ts
    │    │   └── Desc_jornadas.model.ts
    │    ├── services   
    │    │   ├── (sequelize) *optional
    │    │   └── ...
    │    ├── controllers  
    │    │   ├── cumplimiento.controller.ts  
    │    │   ├── cumpli.controller.ts  
    │    │   ├── cumpli_desc.controller.ts  
    │    │   └── desc_jornadas.controller.ts  
    │    ├── routes
    │    │   ├── cumplimiento.routes.ts
    │    │   ├── cumpli.routes.ts
    │    │   ├── cumpli_desc.routes.ts
    │    │   └── desc_jornadas.routes.ts
    │    └── ...
    │  
    ├── app2: Rol
    │    ├── models  
    │    │   ├── Header.model.ts  
    │    │   └── Servicio.model.ts
    │    ├── services   
    │    │   ├── (sequelize) *optional  
    │    │   └── ...
    │    ├── controllers  
    │    │   ├── rol.controller.ts  
    │    │   ├── header.controller.ts  
    │    │   └── servicio.controller.ts  
    │    ├── routes
    │    │   ├── rol.routes.ts
    │    │   ├── header.routes.ts
    │    │   └── servicio.routes.ts
    │    └── ...
    │  
    ├── appN: ...
    │  
    ├── database  
    │   └── db.connection.ts  
    │  
    ├── utilities    
    │  
    ├── app.ts  
    └── index.ts  
```

> models, controllers, routes, etc. son hijos de apps en src


Ejemplo de link: Para el [cumplimiento][source]:


[source]: src\readme.md

[Modelo ER Rol-calendarios]: https://lucid.app/lucidchart/da9559b8-d591-4532-a12f-860e1e1f3ea2/edit?invitationId=inv_06e93461-0abe-4901-9895-8736fff35815&page=0_0#