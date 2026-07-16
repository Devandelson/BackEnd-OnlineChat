import * as serviceLogin from './IServices.js';

export const SingControl = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Error: no se completaron los datos' });
    }

    const resultServices = await serviceLogin.serviceSing({ name: name, password: password }, res);
    if (resultServices.status) {
        res.status(200).json({
            message: 'Inicio exitoso',
            state: true,
            data: resultServices.data
        });
    } else {
        const { message } = resultServices;
        res.status(401).json({ message: message, state: false });
    }
};

export const register = (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Error: no se completaron los datos' });
    }

    serviceLogin.serviceRegister({ name, password })
    .then(({message, state}) => {
        if (!state) return res.status(400).json({message: message, state: state});
        res.status(200).json({message: message, state: state})
    })
    .catch((error) => {
        res.status(500).json({ message: 'Error al registrar el usuario, intentelo mas tarde.' });
    });
};