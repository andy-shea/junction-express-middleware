# Junction Express Middleware
**Requirements:** Node.js 6+

Express middleware to automatically setup/flush [Junction](https://github.com/andy-shea/junction-orm) pre/post request-response cycle

## Install

```yarn add junction-express-middleware```

## Example

```
import {junctionProvider, junctionFlush, setData} from 'junction-express-middleware';

app.use(junctionProvider(entityManager));
// or app.use(junctionProvider(entities, mapper)) to have the provider create the entityManager for you before returning the middleware

// ... add normal routes
async function someFunctionCalledInRoute(req, res, next) {
  try {
    const service = req.junction.get(FooService);
    const data = await service.asyncTaskReturningSomethingOfValue();
    setData(res, next, data);
  }
  catch(error) {
    next(error);
  }
}

// flush modifications and return JSON of whatever is stored in res.locals.data
// if res.locals.data is a function then it will return the result of that function call
app.use(junctionFlush);
```

## Licence

[MIT](./LICENSE)
