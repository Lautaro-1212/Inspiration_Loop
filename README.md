# Requisitos minomos

- Node: v24.18.0

- NPM: 11.16.0

# Objetivo

Crear una apliacion que inspirar a la gente que esta en el area creativa, o simplemente pasar el rato.

# Como se dividieron las tareas: 

- Lauty:

Backend, creación de la base de datos, conecciones del frontend con el backend y documentacion.

- Marcos: 

Frontend, creacion de las plantillas, busqueda de assets e iconos y funcionalidades de cada pantalla.

# Esquema de diagrama de base de datos: 

<img src="docs/esquemaDeBasesDeDatos.png" alt="Esquema de bases de datos" width="600">

ACLARACION: Se usa INTREGRER o TEXT, ya que la base de datos usada es SQLite, y los tipos son distintos.

# Croquies de cada pantalla:

Pantalla de Inicio

<img src="docs/pantallaInicio.png" alt="Pantalla de inicio" width="400" height="600">

Pantalla crear

<img src="docs/pantallaCrear.png" alt="Pantalla de crear" width="400" height="600">

Pantalla buscar

<img src="docs/pantallaBuscar.png" alt="Pantalla de buscar" width="400" height="600">

Pantalla perfil

<img src="docs/pantallaPerfil.png" alt="Pantalla de perfil" width="400" height="600">

## ¿ Como poder usar el back desde cualquier dispostivo ?

1) Primero instalar cloudflare desde esta pagina: 

https://try.cloudflare.com/#install

2) Luego de eso lavantar el back en un terminal de esta manera: 

```bash
Inspiration_Loop/backend/node app.js
```

3) Y en otra terminal abrir el tunel con el cloudflar:

```bash
cloudflared tunnel --url http://localhost:3000 2>&1 | grep --line-buffered -o 'https://[^ ]*trycloudflare.com'
```

