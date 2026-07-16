import { Router } from 'express'
const mainRoute = Router();

// middleware
import { validToken } from './authentication.js';

// routes
import loginRoute from './modules/login/IRoute.js';
import chatRoute from './modules/chat/chatRouter.js';

mainRoute.get('/', (req, res) => {
    res.json({ message: 'Hola klk' });
})

mainRoute.use('/login', loginRoute);
mainRoute.use('/chat', validToken, chatRoute);


export default mainRoute;