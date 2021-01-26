import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { User } from '../models/user';
import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { Password } from '../services/password';

class UserController {
  async store(req: Request , res:  Response) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {      
      return res.status(400).json({
        message: 'Validação incorreta'
      })
    }

    const { originalname: image_name, filename: path } = req.file;

    const { email, password, name, about, sex,} = req.body;

    const existingUser = await User.findOne({
      email
    });

    if(existingUser){
      return res.status(400).json({
        message: 'Usuário já existente'
      });
    }

    const user = User.build({
      name,
      email, 
      sex,
      password,
      about,
      image_name,
      path,
    });

    await user.save();

    return res.status(200).send({
        message: true 
    });
  }

  async signIn(req: Request , res:  Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação incorreta'
      });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: 'Conta inexistente'
      })
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    
    if (!passwordsMatch) {
      return res.status(400).json({
        message: 'Senha incorreta'
      })
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
      },
      process.env.APP_SECRET!, {
        expiresIn: process.env.EXPIRES_DATE!
      }
    );

    res.status(200).send({
      message: passwordsMatch,
      token: userJwt
    });
  }  

  async getInfo(req: Request , res:  Response) {
    const user = await User.findById(req.userId);
    
    const { _id , name, sex, email, about, url } = user;

    return res.status(200).send({
      _id,
      name,
      email,
      about,
      sex,
      url
    });
  }

  async shuffle(req: Request , res:  Response){
    await User.aggregate([
      {
        $sample: { size: 10 }
      } ,{
        $match: {
          _id: {
            $nin: [new ObjectId(req.userId)]
          }
        }
      }
    ], (err: any, docs: any) => {
      docs.forEach((e: { password: any; __v: any; path: string; url: string;}) => {
        delete e.password
        delete e.__v
        e.url = `${process.env.APP_URL}/files/${e.path}`
      });

      return res.status(200).send(docs);
    });
  }
};

export default new UserController();


