const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// 创建一个 HTTP 服务器来包裹 Express
const server = http.createServer(app);
// 初始化 Socket.io 并允许跨域
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => console.log(`服务器运行在端口 ${PORT}`));

// 监听连接事件
io.on("connection", (socket) => {
  console.log("新用户加入聊天室");

  // 监听前端发来的 'chat_message' 事件
  socket.on("chat_message", (data) => {
    console.log("收到来自 " + data.user + " 的消息: " + data.text);
    // 转发包含名字的对象
    io.emit("broadcast_message", data);
  });

  socket.on("disconnect", () => {
    console.log("用户离开");
  });
});

server.listen(3000, () =>
  console.log("聊天服务器已启动: http://localhost:3000")
);
