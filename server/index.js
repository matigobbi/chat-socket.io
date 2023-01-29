import express  from "express"
import morgan from "morgan"
import { Server as Socketserver } from "socket.io"
import http from "http"
import cors from "cors"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import router from "./routes/message.js"

//configuration Mongoose 
let url = "mongodb+srv://matigobbi:1h224030@cluster0.nibbd.mongodb.net/chat-channel"

mongoose.Promise = global.Promise

const app = express()
const PORT = 4000

//create the server with module http
const server  = http.createServer(app)

const io = new Socketserver(server,{
  core: {
    origin:"*"
  }
})
//middlewares
app.use(cors())
app.use(morgan("dev"))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use("/api", router)
io.on('connection', (socket) =>{
  //console.log('user connected')
  //console.log(socket.id)

  socket.on('message', (message, nickname) => {

      // broadcast.emit
      socket.broadcast.emit('message', {
          body: message,
          from: nickname
      })
  })
})
//conection to the database
mongoose.connect(url,{useNewUrlParser: true})
.then(() => {
  server.listen(PORT, () => {
    console.log("Server executing on port" , PORT)
  })
})
