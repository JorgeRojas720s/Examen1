# Examen 1 
---

Para clonar el proyecto ejecute:

1. Para clonar el proyecto ejecute:
    ```bash
    git clone https://github.com/JorgeRojas720s/Examen1.git
    ```

2. Para instalar todas las dependecias ejecute:
    ```bash
    npm i
    ```

3. Seguidamente podra iniciar el poryecto con el comando:
    ```bash
    npm run dev
    ```

---
### Model Users

```json
{
    "id": "id",
    "username": "username",
    "firstName": "firstName",
    "email": "email@email.com",
    "password": "password",
    "role": "role"
}

```
#### EndPoints

**Post:** Registra un nuevo usuario, mientras no exista un id igual,  
ni tampoco un username igual, y el email tenga el formato solicitado. 
 
    git clone https://github.com/JorgeRojas720s/Examen1.git

**Post:** Autentifica un usuario, generando un token que servirá para todas 
las demás rutas. 
 
    http://localhost:3000/api/users/authenticate

**PUT:** Actualiza un usuario, mientras el username y la constraseña sean correctos. 
 
    http://localhost:3000/api/users/[userId]
    
**GET:** Obtiene todos los usuarios que existen.
 
    http://localhost:3000/api/users

**DELETE:** Elimina un usuario de la base de datos mientras este exista. 
 
    http://localhost:3000/api/users/[userId]

---
### Model Dates

```json
{
   "date": "aaaa-MM-dd",
   "hour": "12",
   "userId": "userId", 
   "description": "description",
   "state": "state"
}

```
#### EndPoints

**Post:** Registra una fecha, mientras el usuario exista,  
que no exista una cita en esa fecha y que no se encuentre en vacaciones. 
 
    http://localhost:3000/api/dates/register

**PUT:** Actualiza una cita, mientras el usuario exista, y no exista una cita en la misma fecha. 
 
    http://localhost:3000/api/dates/[id]
    
**GET:** Obtiene todas las citas existentes.
 
    http://localhost:3000/api/dates

**GET:** Obtiene una cita mediante el id.

    http://localhost:3000/api/dates/[id]
    
**DELETE:** Elimina una cita mediante el id de la cita.

    http://localhost:3000/api/dates/[id]

### Model Vacations

```json
{
    "userId": "userId",
    "startDate": "aaaa-MM-dd",
    "finishDate": " aaaa-MM-dd ",
    "state": "state",
    "comments": "comments"
}

```
---
#### EndPoints

**Post:** Registra una vacación, mientras el usuario exista, y no tenga vacaciones en ese rango. 
 
    http://localhost:3000/api/vacations/register

**PUT:** Actualiza una vacación mientras el usuario exista, y la vacación este en un rango válido. 
 
    http://localhost:3000/api/vacations/[id]
    
**GET:** Obtiene todas las vacaciones existentes.
 
    http://localhost:3000/api/vacations/

**GET:** Obtiene la vacación mediante el id.

    http://localhost:3000/api/vacations/[id]
    
**DELETE:** Elimina una vacación mediante el id de la vacación.

    http://localhost:3000/api/vacations/[id]

<p align="center">
  <img src="https://github.com/JorgeRojas720s/Examen1/assets/110791436/c47650c7-b909-47d4-bd6a-8e7d3b96e603" alt="Descripción de la imagen">
</p>






    
