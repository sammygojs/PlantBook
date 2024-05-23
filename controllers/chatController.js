/**
 * Initializes socket.io event handlers for managing chat rooms and messages.
 * @param {object} io - The socket.io server instance.
 */
exports.init = function (io) {
  io.sockets.on('connection', function (socket) {
    console.log("try");
    try {
      /**
     * Event handler for creating or joining a chat room.
     * @param {string} room - The room to create or join.
     * @param {string} userId - The ID of the user joining the room.
     */
      socket.on('create or join', function (room, userId) {
        socket.join(room);
        io.sockets.to(room).emit('joined', room, userId);
      });
      /**
      * Event handler for sending chat messages.
      * @param {string} room - The room to send the chat message to.
      * @param {string} userId - The ID of the user sending the chat message.
      * @param {string} chatText - The chat message text.
      */
      socket.on('chat', function (room, userId, chatText) {
        io.sockets.to(room).emit('chat', room, userId, chatText);
      });
      /**
           * Event handler for user disconnection.
           */
      socket.on('disconnect', function () {
        console.log('someone disconnected');
      });
    } catch (e) {
    }
  });
}
