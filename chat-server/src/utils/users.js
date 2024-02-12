const users = [];

const addUser = ({ id, user_id, room }) => {
    // Clean the data
    user_id = user_id.trim().toLowerCase();
    // room = room.trim().toLowerCase();

    // Validate the data
    console.log(user_id)

    if (!user_id || !room) {
        return {
            error: "user_id and room are required!"
        };
    }

    // Check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.user_id === user_id;
    });

    // Validate user_id
    if (existingUser) {
        return {
            error: "user_id is in use!"
        };
    }


    const user = { id, user_id, room };
    if (!existingUser) {
        users.push(user);
    }
    // Store user
    return { user };
};

const removeUser = id => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = id => {
    return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
    // room = room.trim().toLowerCase();
    console.log(user)
    return users.filter(user => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};