import express from 'express';

const app = express();

app.get('/users', (request, response) => {
  console.log('hello world');
  response.send([
    'Diego',
    'Cleiton',
    'Robson',
    'Jhons'
  ]);
});

app.listen(3333);