import app from "./app";
import mongoose from 'mongoose';
import dotenv from 'dotenv';


class StartServer {
    server = app.listen(3000, () => {
      console.log('Listening on port 3000!');
    });
 

  async start() {
    dotenv.config();

    try{
      await mongoose.connect(process.env.MONGODB!, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
      });
      console.log('connected to mongodb');
    }catch(e){
      console.error(e);
    }

    this.server;
  }
}


export default new StartServer();