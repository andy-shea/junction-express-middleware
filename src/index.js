export function junctionProvider(entityManager) {
  return (req, res, next) => {
    req.junction = entityManager.session();
    next();
  };
}

export function junctionFlush(req, res, next) {
  const {locals: {data}, statusCode} = res;
  if (!data && statusCode !== 204) return next();
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
