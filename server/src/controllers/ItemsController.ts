import { Request, Response } from "express";
import knex from '../database/connection';

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await <Promise<any>>knex('items').select('*');
    
    const serializedItems = items.map(
      ({id, title, image}: {id: number, title: string, image: string}) => (
        {
          id,
          title,
          image_url: `http://192.168.0.38:3333/uploads/${image}`
        }
      )
    );
  
    response.json(serializedItems);
  }
}

export default ItemsController;