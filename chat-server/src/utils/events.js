const eventUsers = [];

const joinEvent = ({ id, user_id, event_id }) => {
    // Clean the data
    user_id = user_id.trim().toLowerCase();
    event_id = event_id.trim().toLowerCase();

    // Validate the data
    if (!user_id || !event_id) {
        return {
            error: "user_id and event are required!"
        };
    }
    // console.warn('eventUsers => ', eventUsers);
    // Check for existing user
    const existingUser = eventUsers.find(user => {
        return user.event_id === event_id && user.user_id === user_id;
    });
    // console.warn('existingUser => ', existingUser);

    // Validate user_id
    if (existingUser) {
        return {
            error: "user_id is in use!"
        };
    }
    // Store user
    const data = { id, user_id, event_id };
    eventUsers.push(data);
    return { data };
};

const leaveEvent = id => {
    const index = eventUsers.findIndex(user => user.id === id);
    if (index !== -1) {
        return eventUsers.splice(index, 1)[0];
    }
};

const getJoinedUser = id => {
    return eventUsers.find(user => user.id === id);
};

const getJoinedUsers = event_id => {
    event_id = event_id.trim().toLowerCase();
    return eventUsers.filter(user => user.event_id === event_id);
};

module.exports = {
    joinEvent,
    leaveEvent,
    getJoinedUser,
    getJoinedUsers
};