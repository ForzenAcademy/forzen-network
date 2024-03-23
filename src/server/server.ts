import { Endpoint, RestEndpoint } from './endpoint';
import { Express } from 'express';
import express from 'express';
import multer from 'multer';
import { Server } from 'http';
import { RestMethod } from '../rest';
import * as fs from 'fs';

const UPLOAD_DIRECTORY = './forzenNetworkUploads/';

export interface RestServer {
  /**
   * Add a new Rest endpoint to this server.
   *
   * @param endpoint The endpoint to add to the server
   */
  addEndpoint(endpoint: Endpoint): void;

  /**
   * Start the server.
   */
  start(): void;

  /**
   * Stop the server.
   */
  stop(): void;
}

export class RestExpressServer implements RestServer {
  private app: Express;
  private port: number;
  private server: Server | null = null;
  private upload = multer({ dest: UPLOAD_DIRECTORY });

  constructor(port: number) {
    this.createUploadDirectory();
    this.port = port;
    this.app = express();
    this.app.use(express.json());
  }

  private createUploadDirectory() {
    try {
      fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
    } catch (error) {
      console.error('Error creating network upload directory:', error);
    }
  }

  addEndpoint(endpoint: RestEndpoint): void {
    switch (endpoint.method) {
      case RestMethod.GET:
        this.app.get(endpoint.path, (req, res) => endpoint.invoke(req, res));
        break;
      case RestMethod.PUT:
        if (endpoint.handlesFileUpload)
          this.app.put(endpoint.path, this.upload.single('file'), (req, res) =>
            endpoint.invoke(req, res),
          );
        else this.app.put(endpoint.path, (req, res) => endpoint.invoke(req, res));
        break;
      case RestMethod.POST:
        if (endpoint.handlesFileUpload)
          this.app.post(endpoint.path, this.upload.single('file'), (req, res) =>
            endpoint.invoke(req, res),
          );
        else this.app.post(endpoint.path, (req, res) => endpoint.invoke(req, res));
        break;
      case RestMethod.DELETE:
        this.app.delete(endpoint.path, (req, res) => endpoint.invoke(req, res));
        break;
      case RestMethod.PATCH:
        this.app.patch(endpoint.path, (req, res) => endpoint.invoke(req, res));
        break;
      case RestMethod.HEAD:
        this.app.head(endpoint.path, (req, res) => endpoint.invoke(req, res));
        break;
      case RestMethod.OPTIONS:
        this.app.options(endpoint.path, (req, res) => endpoint.invoke(req, res));
        break;
      case RestMethod.TRACE:
        this.app.trace(endpoint.path, (req, res) => endpoint.invoke(req, res));
        break;
    }
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  stop() {
    this.server?.close(() => {
      console.log('Server stopped');
    });
  }
}
