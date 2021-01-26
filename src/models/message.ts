import mongoose from 'mongoose';

interface MessageAttrs {
    _id: string;
    users: Array<{}>;
};

interface MessageModel extends mongoose.Model<MessageDoc>{
    build(attrs: MessageAttrs): MessageDoc;
};

interface MessageDoc extends mongoose.Document{
    _id: string;
    users: Array<{}>;
    createdAt: string;
    updatedAt: string;
};

const contentSchema = new mongoose.Schema({
    ismy : Boolean,
    message : String,
    image : String,
    isImage : Boolean
},{ timestamps: true });


const receiverSchema = new mongoose.Schema({
    _id : String,
    messages : [contentSchema]
});


const messageSchema = new mongoose.Schema({
    _id : String,
    users : [receiverSchema]
});


const Message = mongoose.model<MessageDoc, MessageModel>('Message', messageSchema);

export { Message };