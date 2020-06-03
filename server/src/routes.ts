import express from 'express';
import knex from './database/connection';

const routes = express.Router();

routes.get('/items', async (request, response) => {
  const items = await <Promise<any>>knex('items').select('*');
  
  const serializedItems = items.map(
    ({id, title, image}: {id: number, title: string, image: string}) => (
      {
        id,
        title,
        image_url: `http://localhost:3333/uploads/${image}`
      }
    )
  );

  response.json(serializedItems);
});

routes.post('/points', async (request, response) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items
  } = request.body;

  const trx = await knex.transaction();

  const insertedIds = await <Promise<any>>trx('points').insert({
    image: 'image-fake',
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  });

  const point_id = insertedIds[0];

  const pointItems = items.map((item_id: number) => ({
    item_id,
    point_id
  }))
  await <Promise<any>>trx('point_items').insert(pointItems)

  return response.json({ success: true });
});

export default routes;