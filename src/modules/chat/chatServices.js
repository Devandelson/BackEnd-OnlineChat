import conex from '../../conex.js';

export const getChats = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM chat';
        conex.query(query).then((result) => {
            resolve(result[0]);
        }).catch((error) => {
            reject(error);
        });
    })
};

export const getItemChat = (nameChat) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM chat WHERE nombre_chat = ?';
        conex.query(query, [nameChat]).then((result) => {
            resolve(result[0]);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const editChat = (body) => {
    return new Promise((resolve, reject) => {
        const { nombre_chat, conversaciones } = body;
        const arrayConversation = JSON.stringify(conversaciones);
        const query = 'UPDATE chat SET conversaciones = ? WHERE nombre_chat = ?';
        conex.query(query, [arrayConversation, nombre_chat]).then((result) => {
            resolve(result[0]);
        }).catch((error) => {
            reject(error);
        });
    })
}

// ---- HandleManageChat
export const createChat = (nombre_chat) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO chat (nombre_chat, conversaciones, estado) VALUES (?, ?, 1)';
        conex.query(query, [nombre_chat, JSON.stringify([])]).then((result) => {
            resolve(result[0]);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const deleteChat = (nombre_chat) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM chat WHERE nombre_chat = ?';
        conex.query(query, [nombre_chat]).then((result) => {
            resolve(result[0]);
        }).catch((error) => {
            reject(error);
        });
    });
};