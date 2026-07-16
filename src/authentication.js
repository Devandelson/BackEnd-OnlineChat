import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export function generateToken(user, typeToken, time) {
    const { name } = user;
    const secretKey = typeToken === 'token' ? process.env.token : process.env.refreshToken;
    const newToken = jwt.sign({ name }, secretKey, { expiresIn: time });
    return newToken;
}

export function middlewareToken(token, refreshToken, res) {
    const isProduction = process.env.environment === 'production';
    
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 15 * 60 * 1000 // 🕒 15 Minutos
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 🕒 1 Día
    });

    return true;
}

export function validToken(req, res, next) {
    const token = req.cookies.accessToken;
    const isProduction = process.env.environment === 'production';
    
    if (!token) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No ha iniciado sesión.', status: false });
        }

        try {
            const user = jwt.verify(refreshToken, process.env.refreshToken);
            const payload = { name: user.name };

            const newToken = generateToken(payload, 'token', '15m'); 
            
            res.cookie('accessToken', newToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'strict' : 'lax',
                maxAge: 15 * 60 * 1000
            });

            req.user = user;
            return next();
        } catch (error) {
            return res.status(400).json({ message: 'No tiene autorización', status: false });
        }
    } else {
        try {
            const user = jwt.verify(token, process.env.token);
            req.user = user;
            return next();
        } catch (error) {
            res.clearCookie('accessToken');
            return res.status(401).json({ message: 'Token expirado, reintente para refrescar.', status: false });
        }
    }
}