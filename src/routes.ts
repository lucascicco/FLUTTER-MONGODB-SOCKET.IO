import { Router } from  'express';
import { body } from 'express-validator';

import multer from 'multer';
import multerConfig from './services/multer';

import authMiddleware from './middlewares/auth';

import userController from './controllers/user';
import chartsController from './controllers/message';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/user/signup', upload.single('file'), [
    body('email')
      .trim()
      .isEmail()
      .withMessage('É necessário um email válido'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('A senha precisa ter entre 4 a 20 dígitos'),
    body('name').trim().isLength({ min: 4, max: 15}).withMessage('O nome precisa ter entre 4 a 15 dígitos'),
    body('sex').isIn(['male','female']).withMessage('Defina o seu sexo'),
    body('about').isLength({ min: 1}).withMessage('Preencha seu "sobre"'),
  ], userController.store);

routes.post('/user/signin', upload.single('file'), [
    body('email')
      .trim()
      .isEmail()
      .withMessage('É necessário um email válido'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Senha é obrigatória')
], userController.signIn);

routes.get('/user/shuffle', authMiddleware, userController.shuffle);
routes.get('/user/userinfo', authMiddleware, userController.getInfo);
routes.post('/message/fetchmessage', authMiddleware, chartsController.fetchMessage);

export default routes;
