import https from 'https';
import http from 'http';
import { RestMethod } from '../rest';

export enum MimeType {
  JSON = 'application/json',
  RAW = 'application/octet-stream',
  TEXT = 'text/plain',
  NONE = '',
}

type NetworkOptions = {
  hostname: string;
  path: string;
  method: RestMethod;
  port: string;
  headers?: { [key: string]: string | number };
};

interface Network {
  request(
    method: RestMethod,
    url: string,
    mimeType: MimeType,
    body?: string,
    headers?: { [key: string]: string | number },
  ): Promise<string>;
}

export class ForzenNetwork implements Network {
  async request(
    method: RestMethod,
    url: string,
    mimeType: MimeType = MimeType.JSON,
    body?: string,
    headers?: { [key: string]: string | number },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);

      const options: NetworkOptions = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        port: parsedUrl.port,
      };

      // Set headers and body fields
      if (headers && body) {
        options.headers = headers;
        options.headers['Content-Length'] = Buffer.byteLength(body);
      } else if (headers) {
        options.headers = headers;
      } else if (body) {
        if (mimeType != MimeType.NONE) {
          options.headers = {
            'Content-Length': Buffer.byteLength(body),
          };
        } else {
          options.headers = {
            'Content-Type': mimeType,
            'Content-Length': Buffer.byteLength(body),
          };
        }
      }

      let protocol: {
        (
          options: string | https.RequestOptions | URL,
          callback?: ((res: http.IncomingMessage) => void) | undefined,
        ): http.ClientRequest;
        (
          url: string | URL,
          options: https.RequestOptions,
          callback?: ((res: http.IncomingMessage) => void) | undefined,
        ): http.ClientRequest;
      };

      if (parsedUrl.protocol == 'https:') {
        protocol = https.request;
      } else {
        protocol = http.request;
      }

      // Collect the data chunks
      const req = protocol(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (body) {
        req.write(body);
      }
      req.end();
    });
  }
}
