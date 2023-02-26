import { server, app } from './http';
import './websocket';


app.get('/', (req, res) => {
    res.send(
        `(
            <div>
            ${req.protocol}://${req.get('host')}${req.originalUrl}
            <br/>
              <strong>FILA SOJA</strong>
              <br/>
              ${new Date(Date.now())}
            </div>
          )`
    );
})

// app.use(express.static(path.join(__dirname, '..',  'public')));

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => console.log('Server is listening on port 3333'));