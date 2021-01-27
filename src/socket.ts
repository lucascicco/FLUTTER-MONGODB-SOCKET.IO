import io from 'socket.io';
import server from './svconfig';
import { Message } from './models/message';
let sio: io.Server = io(server.server); 

var connectedUsers: any[] = [];

sio.on('connection', socket => {

    socket.on('chatID', (data) => {

        let chatID = data.id;

        socket.join(chatID);
        connectedUsers.push(chatID);

        socket.broadcast.emit('onlineUsers', {
            'users': connectedUsers
        });

        socket.on('disconnect', () => {
            //Remove ConnectedUsers
            const index = connectedUsers.indexOf(chatID);
            if (index > -1){
                connectedUsers.splice(index,1);
            }  
            // Leave From Room
            socket.leave(chatID);
            socket.broadcast.emit('onlineUsers', {
                'users': connectedUsers
            });
        })


        socket.on('send_message', message => {
            
            const receiverChatID = message.receiverChatID
            const senderChatID = message.senderChatID
            const content = message.content
            const isImage = message.isImage

            saveMessage(content, senderChatID, receiverChatID, true,isImage);


            socket.in(receiverChatID).emit('receive_message', {
                'content': content,
                'senderChatID': senderChatID,
                'receiverChatID': receiverChatID,
                'isImage' : isImage
            })
            saveMessage(content, receiverChatID, senderChatID, false,isImage);
        })

    });

});

function saveMessage(content: string, sender: string, receiver: string, isMy: boolean ,isImage = false) {
    
    var message = new Message({
        _id: sender,
        users: [{
            _id: receiver,
            messages: {
                ismy: isMy,
                message: content,
                isImage: isImage
            },
        }
        ]
    });
    
    Message.findOne({_id : sender},(err: any, doc: any)=>{ 

        if(!doc){
            message.save();
        }else{
            var receiverIndex = doc.users.findIndex((element: { _id: string; }) => element._id === receiver);

            if(receiverIndex !== undefined && receiverIndex != -1){
                doc.users[receiverIndex].messages.push({ismy: isMy,message: content,isImage : isImage});
                doc.save();
            }else{
                doc.users.push({_id : receiver,messages: {ismy: isMy,message: content,isImage : isImage}});
                doc.save();
            }
        }

    }).catch((err: any)=>{
        console.log(err.message);
    });
}