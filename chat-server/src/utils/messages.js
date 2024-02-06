const generateMessage = (username, message, type) => {
    return {
        username,
        message,
        type,
        created_at: new Date()
    };
};

/* const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    };
}; */

module.exports = {
    generateMessage,
    // generateLocationMessage
};