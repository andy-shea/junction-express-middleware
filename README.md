# Junction Express Middleware
**Requirements:** Node.js 6+

Express middleware to automatically setup/flush junction pre/post request-response cycle

## Install

```npm install junction-express-middleware --save```

## Example

```
import {junctionProvider, junctionFlush, setData} from 'junction-express-middleware';

app.use(junctionProvider);

// ... add normal routes
function someFunctionCalledInRoute(req, res, next) {
  const service = req.junction.get(FooService);
  service.asyncTaskReturningSomethingOfValue().then(setData(res, next)).catch(next);
}

// flush modifications and return JSON of whatever is stored in res.locals.data
// if res.locals.data is a function then it will return the result of that function call
app.use(junctionFlush);
```

## Licence

[MIT](./LICENSE)
