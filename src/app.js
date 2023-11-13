import express from 'express';
import http from 'http'
import { Server as socketIo} from 'socket.io'
import handlebars from 'express-handlebars'

import viewsRouter from './routes/views.routes.js'
import { handleSocketEvents } from './routes/views.routes.js'
import { __dirname } from './utils.js'

const app = express();
const server = http.createServer(app);
const io = new socketIo(server);
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  })

  app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');
app.set('io', io)

app.use('/', viewsRouter)
handleSocketEvents(io)
app.use('/static', express.static(`${__dirname}/public`))

io.on('connect', () => {
  console.log('User connected');
});

io.on('disconnect', () => {
  console.log('User disconnected');
});
