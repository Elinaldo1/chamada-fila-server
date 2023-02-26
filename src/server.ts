import { server } from './http';
import './websocket';




// app.use(express.static(path.join(__dirname, '..',  'public')));

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => console.log('Server is listening on port 3333'));