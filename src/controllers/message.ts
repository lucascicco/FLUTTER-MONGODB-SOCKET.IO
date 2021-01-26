import { Message } from '../models/message';
import { Request, Response } from "express";

class MessageController {
    async fetchMessage(req: Request , res:  Response) {   
        const {sender, receiver} = req.body;
        
        await Message.find({_id : sender}, {
           users: {
             $elemMatch: {_id : receiver}
           }
         }).then((document: any[])=>{
             if(document.length > 0){
                 if(document[0].users.length > 0){
                     const messages = document[0].users[0].messages;
                     res.send(messages.slice(Math.max(messages.length - 15, 0)));
                 }else{
                     res.send([]);
                 }
             }else{
               res.send([]);
             }

         }).catch((err: any)=>{
             console.log(err);
         })
    }   
}

export default new MessageController();