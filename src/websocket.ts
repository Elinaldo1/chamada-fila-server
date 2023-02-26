import { io } from "./http";


interface AllUsers {
    socket_id: string,
    username: string,
    room: string
}

const CHAT_BOOT = 'ChatBot';
let chatRoom = ''; //
let allUsers: AllUsers[] = []; // All users in current chat room

// emit = eniviar informação
// on = escuta/recebe informação

// socket = relacionado a um cliente específico conectado
// io = relacionado a todos os clienes conectados


// 'connection' => assim que o client se conectar cria a conexão
// gerando um socket para o mesmo(representção do cliente dentro do server)
io.on('connection', socket => {


    console.log(`user connected ${socket.id}`);
    
    // ouve o evento join_room vindo do cliente
    socket.on('join_room', data => {
        const { username, room }  = data; // Data sent from client when join_room event emitted

        console.log(data)
        
        socket.join(room); //adciona o user a uma sala

        let _createdtime_ = Date.now(); // data atual

        // Send message to all users currently in the room,
        //  apart from the user that just joined
        socket.to(room).emit('receive_message', {
            message: `${username} entrou na sala`,
            username: CHAT_BOOT,
            _createdtime_
        });

        // Send welcome msg to user that just joined chat only
        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: CHAT_BOOT,
            _createdtime_
        });

        // save the new user to the romm
        chatRoom = room;

        // Verify if the user is already in the room
        const userInRoom = allUsers.find(user => user.username === username && user.room === room); 

        if(userInRoom) {

            // if user is already in the room, just update your socket_id
            userInRoom.socket_id = socket.id;
        }else{
            
            // add user in the global list of users
            allUsers.push({socket_id: socket.id, username, room});
        }


        // return only users in the current room
        const chatRoomUsers = allUsers.filter(user => user.room === room);


        socket.to(room).emit('chatroom_users', chatRoomUsers);

        socket.emit('chatroom_users', chatRoomUsers);



    });

    // ouve o evento send_message vindo do cliente admin(quando envia msgm)
    socket.on('send_message', data => {

        const { message, username, room, _createdtime_ } = data;
        const sendData = {
            message,
            username,
            room,
            _createdtime_
        }
        
        // to() = envia evento para uma sala específica
        // in() = mesma funcionalidade de to()
        
        // envio a message recebida do admin para a fila
        io.in(room).emit('receive_message', sendData);
        
        // código para salvar no banco (controller e service)
    })
    
    // Ouve evento confirm_receive_message vindo do cliente fila(enviado ao receber msg do admin)
    socket.on('confirm_receive_message', data => {
        const { isReceived, username, room, _createdtime_ } = data;
        const sendData = {
            isReceived,
            username,
            room,
            _createdtime_
        }

        // envia a confirmação de recebimento de fila para admin
        socket.to(room).emit('isReceived', sendData);

        // código para salvar no banco (controller e service)
    })
})