var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var port = process.env.PORT || 3000;

server.listen(port, function(){
  console.log('listening on *:' + port);
});

app.get('/rooms', function(req, res) {
  var roomList = Object.keys(rooms).map(function(key) {
    return rooms[key]
  })
  res.send(roomList)
})

var streams = {}

io.on('connection', function(socket) {

  socket.on('create_stream', function(stream) {
    if (!stream.key) {
      return
    }
    console.log('create stream:', stream)
    var streamKey = stream.key
    streams[streamKey] = stream
    socket.roomKey = streamKey
    socket.join(streamKey)
  })

  socket.on('close_stream', function(streamKey) {
    console.log('close stream:', streamKey)
    delete rooms[streamKey]
  })

  socket.on('disconnect', function() {
    console.log('disconnect:', socket.roomKey)
    if (socket.roomKey) {
      delete streams[socket.roomKey]
    }
  })

  socket.on('join_stream', function(streamKey) {
    console.log('join room:', streamKey)
    socket.join(streamKey)
  })

})

console.log('listening on port', port)