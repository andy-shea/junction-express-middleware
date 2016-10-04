import junction from 'junction-orm';

export function junctionProvider(entityManagerOrEntities, mapper) {
  const entityManager = mapper ? junction(entityManagerOrConfig, mapper) : entityManagerOrEntities;
  return (req, res, next) => {
    req.junction = entityManager.session();
    next();
  };
}

export function junctionFlush(req, res, next) {
  const {locals, statusCode} = res;
  if (!Object.prototype.hasOwnProperty.call(locals, 'data') && statusCode !== 204) {
    return next(); // continue to initial page load render
  }
  const {data} = locals;
  req.junction.flush()
      .then(() => (typeof data === 'function') ? data() : data)
      .then(value => res.format({json: () => res.json(value)}))
      .catch(next);
}

export function setStatus(res, next, status = 204) {
  return () => {
    res.status(status);
    next();
    return null;
  };
}

export function setData(res, next, status = 200) {
  return data => {
    res.status(status).locals.data = data;
    next();
    return null;
  };
}
