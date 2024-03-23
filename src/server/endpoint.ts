import { Request, Response } from 'express';
import { RestMethod } from '../rest';

export interface Endpoint {
  /**
   * The path that the endpoint listens on
   */
  path: string;

  /**
   * Invoke the endpoint on the request and return any values in the response
   */
  invoke(req: Request, res: Response): Promise<void>;
}

// Multer

export class RestEndpoint implements Endpoint {
  readonly method: RestMethod;
  private invokeAction: (req: Request, res: Response) => Promise<void>;
  constructor(
    method: RestMethod,
    public path: string,
    invokeAction: (req: Request, res: Response) => Promise<void>,
  ) {
    this.method = method;
    this.invokeAction = invokeAction;
  }

  async invoke(req: Request, res: Response): Promise<void> {
    this.invokeAction(req, res);
  }
}
