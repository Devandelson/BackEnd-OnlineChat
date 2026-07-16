import { Router } from 'express';
const chatRouter = Router();

// controllers
import * as chatController from './chatController.js';

chatRouter.get('/', (req, res) => {
  res.send('Welcome to the chat API!');
});

chatRouter.get('/chats', chatController.getChat);
chatRouter.get('/itemChat', chatController.getItemChat);
chatRouter.put('/edit', chatController.editChat);
chatRouter.post('/create', chatController.createChat);
chatRouter.delete('/delete', chatController.deleteChat);

export default chatRouter;