import { RestMethod } from '../rest';
import { RestEndpoint } from '../server/endpoint';
import { RestExpressServer } from '../server/server';

async function main() {
  const testObject = { reply: 'Hello world!' };
  const endpoint = new RestEndpoint(
    RestMethod.POST,
    '/test/',
    async (req, res) => {
      res.json(testObject);
    },
    true, // Handle uploads
  );
  const server = new RestExpressServer(3000);
  server.addEndpoint(endpoint);
  server.start();
}

main();
