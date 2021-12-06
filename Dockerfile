# SELECCIONAMOS LA IMAGEN A USAR PARA CONSTRUIR
FROM node:14-alpine as development

#GENERAR LA RUTA DE TRABAJO
WORKDIR /app

# COPIAR package.json PRIMERO
COPY package*.json ./

# INSTALAR DEPENDENCIA GLOBAL
RUN npm install -g ansi-styles rimraf

# INSTALAR TODAS LAS DEPENDENCIAS
RUN npm install

# COPIAR DE LA CARPETA DEL PROYECTO AL CONTENEDOR
COPY . .

# INICIAR LA HERRAMIENTA
# CMD [ "npm", "run", "start:dev" ]
RUN npm run build 

# SELECCIONAMOS LA IMAGEN A USAR PARA DESPLEGAR
FROM node:14-alpine as production

# VARIABLES DE ENTORNO - TIPO DE AMBIENTE
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

#GENERAR LA RUTA DE TRABAJO
WORKDIR /app

# COPIAR package.json PRIMERO
COPY package*.json ./

# INSTALAR DEPENDENCIA GLOBAL
RUN npm install -g ansi-styles rimraf

# COPIAR DE LA CARPETA DEL PROYECTO AL CONTENEDOR
COPY . .

# COPIAR EL PROYECTO COMPILADO
COPY --from=development /app .

# CORRER EL SERVIDOR
CMD ["node", "dist/main"]