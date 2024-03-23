import { ForzenNetwork, MimeType } from '../requests/network';
import { RestMethod } from '../rest';
import { RestEndpoint } from '../server/endpoint';
import { RestExpressServer } from '../server/server';

async function main() {
  const testObject = { reply: 'Hello world!' };
  const endpoint = new RestEndpoint(RestMethod.GET, '/test/', async (req, res) => {
    res.json(testObject);
  });
  const server = new RestExpressServer(3000);
  server.addEndpoint(endpoint);
  server.start();

  const result = await new ForzenNetwork().request(
    RestMethod.GET,
    'http://127.0.0.1:3000/test/',
    MimeType.JSON,
  );
  server.stop();

  if (result != JSON.stringify(testObject)) throw 'No match!';
  else console.log("It's a match! " + result);
}

main();
