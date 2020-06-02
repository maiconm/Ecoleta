import express from 'express';
import knex from './database/connection';

const routes = express.Router();

routes.get('/items', async (request, response) => {
  const items = await <Promise<any>>knex('items').select('*');
  
  const serializedItems = items.map(
    ({title, image}: {title: string, image: string}) => (
      {title, image_url: `http://localhost:3333/uploads/${image}`}
    )
  );

  response.json(serializedItems);
});

export default routes;