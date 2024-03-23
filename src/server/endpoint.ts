import { Request, Response } from 'express';
import { RestMethod } from '../rest';

export interface Endpoint {
  /**
   * The path that the endpoint listens on
   */
  path: string;

  /**
   * Whether or not this endpoint handles a file upload
   */
  handlesFileUpload: boolean;

  /**
   * Invoke the endpoint on the request and return any values in the response
   */
  invoke(req: Request, res: Response): Promise<void>;
}

// Multer

export class RestEndpoint implements Endpoint {
  readonly method: RestMethod;
  readonly handlesFileUpload: boolean;
  private invokeAction: (req: Request, res: Response) => Promise<void>;

  constructor(
    method: RestMethod,
    public path: string,
    invokeAction: (req: Request, res: Response) => Promise<void>,
    handlesFileUpload: boolean = false,
  ) {
    this.method = method;
    this.invokeAction = invokeAction;
    this.handlesFileUpload = handlesFileUpload;
  }

  async invoke(req: Request, res: Response): Promise<void> {
    this.invokeAction(req, res);
  }
}
