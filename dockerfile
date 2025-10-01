# Usar la imagen oficial de Node.js como base
FROM node:18-alpine

# Crear y establecer el directorio de trabajo en /app
WORKDIR /opt/app

# Copiar los archivos de tu aplicación al contenedor
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que se ejecuta tu aplicación Express
EXPOSE 4000

# Comando para ejecutar tu aplicación cuando se inicie el contenedor
CMD [ "npm", "run",  "dev" ]