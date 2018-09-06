import junction from 'junction-orm';

export function junctionProvider(entityManagerOrEntities, mapper) {
  const entityManager = mapper ? junction(entityManagerOrConfig, mapper) : entityManagerOrEntities;
  return (req, res, next) => {
    req.junction = entityManager.session();
    next();
  };
}

export async function junctionFlush(req, res, next) {
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

export function setStatus(res, next, status = 204) {
  res.status(status);
  next();
}

export function setData(res, next, data, status = 200) {
  res.status(status).locals.data = data;
  next();
}
