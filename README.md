# TALKYAPP-MONGODB-SOCKET.IO

Back-end criado em Node.js usando TypeScript para desenvolver o código. Esse back-end contém diversos processos, como rotas com o express, autenticação com o middleware configurado com o jwt, conexão com o banco de dados e criação dos schemas pelo mongoose, password hashing para evitar captura da real senha e o socket.io usado para permitir conexão em tempo real dentro do server back-end e externamente com o front-end. 

A aplicação possui apenas dois schemas:
- User
- Message

**User**, possui 7 atributos: email, name, password, sex, about, image_name e path, e conta com um campo virtual "url".

**Message**, possui 2 atributos: _id, users.

Cada "message" salva no banco de dados, é salva com o **_id** do usuário, e os **users**, possui separadamente as messagens já tidas anteriormente com um determinado tipo de usuário.

<hr/>

Back-end created in Node.js using TypeScript to develop the code. This backend contains several processes, such as routes with express, authentication with middleware configured with jwt, connection to the database and creation of schemas by mongoose, password hashing to avoid capturing the real password and the socket.io used to allow connection in real time inside the back-end server and externally with the front-end.

The application has only two schemas:
- User
- Message

**User**, has 7 attributes: email, name, password, sex, about, image_name and path, and has a virtual field "url".

**Message**, has 2 attributes: _id, users.

Each "message" saved in the database, is saved with the **_ id** of the user, and the **users**, separately has the messages previously had with a certain type of user. 

<hr/>

