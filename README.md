# forzen-network

## A simple Node network library

### Usage

Example Rest server usage:

```
  const testObject = { reply: 'Hello world!' };
  const endpoint = new RestEndpoint(RestMethod.GET, '/test/', async (req, res) => {
    res.json(testObject);
  });
  const server = new RestExpressServer(3000);
  server.addEndpoint(endpoint);
  server.start();
```

Example network call usage:

```
  const result = await new ForzenNetwork().request(
    RestMethod.GET,
    'http://127.0.0.1:3000/test/',
    MimeType.JSON,
  );
```
