# Usar una imagen base de Node
FROM node:18-alpine

# Setear el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN npm run build

# Exponer el puerto que usa la app (ej: 3000)
EXPOSE 3000

# Ejecutar la aplicación
CMD ["npm", "start"]
