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

    const serializedPoints = points.map((point: any) => ({
      ...point,
      image_url: `http://192.168.0.38:3333/uploads/${point.image}`
    }))

    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await <Promise<any>>knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'point not found' });
    }

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.38:3333/uploads/${point.image}`
    }

    const items = await <Promise<any>>knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({point: serializedPoint, items});
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
      image: request.file.filename,
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
  
    const pointItems = items
      .split(',')
      .map((item: string) => +item.trim())
      .map((item_id: number) => ({
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