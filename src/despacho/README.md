# 🚀 Backend Architecture: Modalidades & Módulos

Este repositorio contiene la lógica central de la API, estructurada de forma modular para garantizar escalabilidad y facilidad de mantenimiento. El proyecto está desarrollado íntegramente con **TypeScript**, siguiendo un patrón de capas (Layered Architecture).

---

## 📂 Estructura del Proyecto

La organización de los archivos sigue una separación de responsabilidades clara, dividiendo la lógica de negocio, el acceso a datos y los puntos de entrada:

| Directorio         | Descripción                                                    |
| :----------------- | :------------------------------------------------------------- |
| **`controllers/`** | Orquestadores de la petición. Manejan `req` y `res`.           |
| **`interfaces/`**  | Contratos de TypeScript y definiciones de tipos.               |
| **`models/`**      | Definición de esquemas y entidades de la base de datos.        |
| **`routes/`**      | Definición de rutas y asignación de middlewares/controladores. |
| **`services/`**    | El corazón de la app. Contiene la lógica de negocio pesada.    |

---

## 🛠️ Guía de Carpetas y Contenido

A continuación, se detalla qué debe incluirse en cada sección con ejemplos basados en los archivos de la imagen.

### 1. Controllers

Actúan como el puente entre el cliente y el servidor.

- **Qué poner:** Extracción de parámetros de la URL, validación de cuerpo de peticiones y envío de códigos de estado (200, 400, 500).
- **Ejemplo (`modalidades.controllers.ts`):**
  ```typescript
  export const getModalidadById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await ModalidadService.findById(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error interno" });
    }
  };
  ```

### 2. Interfaces

Aseguran que los datos sean consistentes en toda la aplicación.

- **Qué poner:** Definición de objetos `interface` o `type`.
- **Ejemplo (`modulos.interfaces.ts`):**
  ```typescript
  export interface IModulo {
    id: string;
    nombre: string;
    version: number;
    estado: "activo" | "inactivo";
  }
  ```

### 3. Models

Definen cómo lucen tus datos en la base de datos (SQL o NoSQL).

- **Qué poner:** Clases, esquemas de Mongoose, o entidades de TypeORM.
- **Ejemplo (`modalidades.models.ts`):**
  ```typescript
  // Ejemplo si usas una clase o esquema
  export class ModalidadModel {
    static tableName = "modalidades";
    // Definición de campos...
  }
  ```

### 4. Routes

Es el mapa de navegación de tu API.

- **Qué poner:** Verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`) y sus endpoints.
- **Ejemplo (`modulos.routes.ts`):**

  ```typescript
  import { Router } from "express";
  const router = Router();

  router.get("/listado", ModulosController.getAll);
  router.post("/nuevo", ModulosController.create);

  export default router;
  ```

### 5. Services

Aquí es donde se consulta la base de datos o se hacen cálculos.

- **Qué poner:** Funciones `async` que interactúan con los modelos. No conocen nada de `req` o `res`.
- **Ejemplo (`modalidades.services.ts`):**
  ```typescript
  export const findById = async (id: string) => {
    return await ModalidadModel.findOne({ _id: id });
  };
  ```

---

## Flujo de Trabajo Recomendado

Para añadir una nueva funcionalidad (ej. "Usuarios"), sigue este orden de creación para evitar errores de referencia:

1.  **Interface:** Define cómo es el usuario.
2.  **Model:** Crea la tabla/colección.
3.  **Service:** Crea la función para guardar/leer.
4.  **Controller:** Llama al servicio y maneja la respuesta.
5.  **Route:** Expón el endpoint al mundo.

---

> [!IMPORTANT]
> **Nota de estilo:** Todos los archivos deben mantener la nomenclatura `*.tipo.ts` (ej: `.controllers.ts`) para mantener la coherencia visual que se observa en el árbol de archivos actual.
