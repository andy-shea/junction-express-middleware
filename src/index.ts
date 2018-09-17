import junction from 'junction-orm';
import EntityManager from 'junction-orm/lib/EntityManager';
import {Entity, EntityType} from 'junction-orm/lib/Entity';
import {Mapper} from 'junction-orm/lib/mapper/Mapper';
import {NextFunction, Request, Response} from 'express';

export function junctionProvider(
  entityManagerOrEntities: EntityManager | EntityType<Entity>[],
  mapper: Mapper
) {
  const entityManager = mapper
    ? junction(entityManagerOrEntities as EntityType<Entity>[], mapper)
    : entityManagerOrEntities as EntityManager;
  return (req: Request, res: Response, next: NextFunction) => {
    req.junction = entityManager.session();
    next();
  };
}

export async function junctionFlush(req: Request, res: Response, next: NextFunction) {
  const {locals, statusCode} = res;
  if (!Object.prototype.hasOwnProperty.call(locals, 'data') && statusCode !== 204) {
    return next(); // continue to initial page load render
  }
  const {data} = locals;
  await req.junction.flush();
  res.format({
    json: async () => res.json(typeof data === 'function' ? await data() : data)
  });
}

export function setStatus(res: Response, next: NextFunction, status = 204) {
  res.status(status);
  next();
}

export function setData(res: Response, next: NextFunction, data: any, status = 200) {
  res.status(status).locals.data = data;
  next();
}
