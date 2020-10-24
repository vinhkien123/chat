var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [],
    users_name = [];
    arrayMessage = [];
    

server.listen(8888);
console.log('app listen on port: 8888')
app.use(express.static(__dirname + '/public'));
app.get('/*', function (req, res) {     
    // res.sendFile(__dirname + '/views/index.html');
    res.send("chạy thành công")
});
io.sockets.on('connection', (socket) => {
    console.log("kết nối thành công");
    socket.on('new user', (name, id) => {
        let flag = true
        users.forEach((user) => {
            if (user.name === name) {
                flag = false
            }
        })
        if (flag) {
            const data = {
                name,
                id: socket.id
            }
            socket.nickname = name
            console.log('login', socket.nickname);
            socket.join(name)
            users.push(data)



        }

        // socket.broadcast.emit('', users)
        io.local.emit('list user', users);

    })
    socket.on('sendMessage', (name, message) => {
        // arrayMessage.push(message)
        // console.log(arrayMessage,"mess");
        const data = {
            status : 1,
            message,
            name,
        }
        io.to(name).emit('message', socket.nickname,data)
    })
    socket.on('openChat', (id) => {
        const user = users.find(item => item.id === id)
        socket.emit('open', user)
    })

    socket.on('disconnect', () => {
        if (!socket.id) return;
        users = users.filter(item => item.id != socket.id)
        console.log("người dùng đã out ", users);
        socket.broadcast.emit("delete user", users)
    })
})
