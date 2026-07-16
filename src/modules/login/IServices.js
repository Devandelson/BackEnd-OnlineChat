import conex from '../../conex.js';
import { generateToken, middlewareToken } from '../../authentication.js';

export const serviceSing = async (userData, res) => {
    let { name, password } = userData;
    name = String(name).trim().toLocaleLowerCase();
    password = String(password);

    const query = 'SELECT * FROM login WHERE LOWER(nombre) = ? AND password = ?';
    
    return conex.query(query, [name, password]).then(async (result) => {
        const rows = result[0];
        if (!rows || rows.length === 0) {
            return { message: 'No se encontraron los datos enviados.', status: false, data: [] };
        }

        const usuarioValido = rows[0];
        const payload = { name: usuarioValido.nombre};
        const infoExport = { name: usuarioValido.nombre, role: usuarioValido.role};

        const token = generateToken(payload, 'token', '15m'); // 15 Minutos
        const refresToken = generateToken(payload, 'refreshToken', '1d'); // 1 Día
        
        middlewareToken(token, refresToken, res);
        
        return { message: 'ok', status: true, data: infoExport };
    }).catch((error) => {
        return { message: 'error', status: false, data: error };
    });
};

export const serviceRegister = (userData) => {
    return new Promise((resolve, reject) => {
        let { name, password } = userData;
        name = String(name).trim().toLocaleLowerCase();
        password = String(password); // 🔐 Respetamos el formato original de la contraseña

        const query = 'SELECT * FROM login WHERE LOWER(nombre) = ?';
        conex.query(query, [name]).then((result) => {
            if (result[0].length > 0) {
                return resolve({ message: 'Ya existe un usuario registrado con ese nombre.', state: false });
            }

            const queryInsert = 'INSERT INTO login (`nombre`, `password`, `role`) VALUES (?, ?, "user")';
            conex.query(queryInsert, [name, password])
                .then(() => {
                    return resolve({ message: 'Usuario registrado correctamente', state: true });
                })
                .catch((error) => reject({ message: error, state: false }));
        }).catch((error) => reject({ message: error, state: false }));
    });
};