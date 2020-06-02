import express from 'express';

const app = express();

app.use(express.json());

const users = [
  'Diego',
  'Cleiton',
  'Robson',
  'Jhons'
];

app.get('/', (request, response) => {
  const hello ='hello world';
  console.log(hello);
  response.send(hello);
});

app.get('/users/:id', (request, response) => {
  const id = +request.params.id;

  const user = users[id];

  response.json(user);
});

app.get('/users', (request, response) => {
  const search = request.query.search;
  console.log('xxx', search)
  const filteredUsers = search ? users.filter(user => user.includes(`${search}`)) : users
  response.json(filteredUsers);
});

app.post('/users', (request, response) => {
  const { name, email } = request.body
  const user = {
    name,
    email
  };

  return response.json(user);
});

app.listen(3333);