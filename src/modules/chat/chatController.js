import * as chatServices from './chatServices.js';

export const getChat = (req, res) => {
    chatServices.getChats().then((data) => {
        res.status(200).json({ data: data, message: 'Operación exitosa.', status: true });
    }).catch((error) => {
        res.status(500).json({ message: error.message, status: false });
    })
}

export const getItemChat = (req, res) => {
    chatServices.getItemChat(req.body).then((data) => {
        res.status(200).json({ data: data, message: 'Operación exitosa.', status: true });
    }).catch((error) => {
        res.status(500).json({ message: error.message });
    })
}

export const editChat = (req, res) => {
    const { nombre_chat, conversaciones } = req.body;
    if (conversaciones == undefined || !Array.isArray(conversaciones) || nombre_chat == undefined) {
        return res.status(400).json({ message: 'Faltaron parametros por completar.',  status: false });
    }

    chatServices.editChat(req.body).then((data) => {
        return res.status(200).json({ data: data, message: 'Operación exitosa.', status: true  });
    }).catch((error) => {
        return res.status(500).json({ message: error, status: true });
    })
}

// ---- HandleManageChat
export const createChat = (req, res) => {
    const { nombre_chat } = req.body;
    if (!nombre_chat || typeof nombre_chat !== 'string' || nombre_chat.trim() === '') {
        return res.status(400).json({ message: 'Falta el nombre del chat.', status: false });
    }
    chatServices.createChat(nombre_chat.trim()).then((data) => {
        return res.status(201).json({ data, message: 'Chat creado correctamente.', status: true });
    }).catch((error) => {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Ya existe un chat con ese nombre.', status: false });
        }
        return res.status(500).json({ message: 'Error al crear el chat.', status: false });
    });
};

export const deleteChat = (req, res) => {
    const { nombre_chat } = req.body;
    if (!nombre_chat) {
        return res.status(400).json({ message: 'Falta el nombre del chat.', status: false });
    }
    chatServices.deleteChat(nombre_chat).then((data) => {
        return res.status(200).json({ data, message: 'Chat eliminado correctamente.', status: true });
    }).catch(() => {
        return res.status(500).json({ message: 'Error al eliminar el chat.', status: false });
    });
};