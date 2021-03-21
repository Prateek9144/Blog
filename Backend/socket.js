let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};

// mongoose
//   .connect("mongodb+srv://Prateek:Prateek9144@cluster0.bo9ad.mongodb.net/feed")
//   .then((result) => {
//     const http = require("http").Server(app);
//     http.listen(8080);
//     const io = require("./socket").init(http);
//     io.on("connection", (socket) => {
//       console.log("A user connected");
//       socket.on("disconnect", () => {
//         console.log("A user disconnected");
//       });
//     });
//   });
