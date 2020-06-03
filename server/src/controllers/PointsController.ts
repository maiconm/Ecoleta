import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = `${items}`
      .split(',')
      .map(item => +item.trim());

    const points = await <Promise<any>>knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', `${city}`)
      .where('uf', `${uf}`)
      .distinct()
      .select('points.*');

    console.log({city, uf, items});

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await <Promise<any>>knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'point not found' });
    }

    const items = await <Promise<any>>knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({point, items});
  }

  async create(request: Request, response: Response) {
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
  
    const point = {
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    }

    const insertedIds = await <Promise<any>>trx('points').insert(point);
  
    const point_id = insertedIds[0];
  
    const pointItems = items.map((item_id: number) => ({
      item_id,
      point_id
    }))
    await <Promise<any>>trx('point_items').insert(pointItems)
  
    await <Promise<void>>trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;