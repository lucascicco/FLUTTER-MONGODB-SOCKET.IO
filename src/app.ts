import express from 'express';
import * as bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

import helmet from 'helmet';
import routes from './routes';

class App {
  app: any;
  
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(bodyParser.json());

    this.app.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app;
