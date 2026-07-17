import e, { Router } from "express";
const loginRoute = Router();

// controllers
import * as loginControls from './lController.js';

loginRoute.post('/', loginControls.SingControl);
loginRoute.post('/create', loginControls.register);

loginRoute.get('/logout', (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });

    return res.status(200).json({ message: "Sesión cerrada correctamente", status: true });
});

export default loginRoute;