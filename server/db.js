const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

let db;
if (process.env.DATABASE_URL) {
    //if  APP is running on heroku
    db = spicedPg(process.env.DATABASE_URL);
} else {
    //if  APP is running locally
    const {
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_NAME,
    } = require("../secrets.json");
    db = spicedPg(
        `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
    );
    console.log(`[db] Connecting to: ${DATABASE_NAME}`);
}

// ***********************************************************************
// **********************------PASSWORD HASH------************************
// ***********************************************************************

const hash = (password) => {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
};

// ***********************************************************************
// **********************------USER------*********************************
// ***********************************************************************

function createUser({ first_name, last_name, email, password }) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                `INSERT INTO users (first_name, last_name, email, password_hash)
        VALUES($1, $2, $3, $4)
        RETURNING *`,
                [first_name, last_name, email, password_hash]
            )
            .then((result) => result.rows[0]);
    });
}
// --------------------------GET USERS BY EMAIL-----------------------------

function getUserByEmail(email) {
    return db
        .query("SELECT * FROM users WHERE email= $1", [email])
        .then((result) => result.rows[0]);
}

// --------------------------GET USERS BY ID-----------------------------

function getUserById(id) {
    return db
        .query("SELECT * FROM users WHERE id= $1", [id])
        .then((result) => result.rows[0]);
}

// --------------------------UPDATE PROFILE PICTURE-----------------------

function updateAvatar({ profile_picture_url, user_id }) {
    return db
        .query("UPDATE users SET profile_picture_url= $1 WHERE id=$2", [
            profile_picture_url,
            user_id,
        ])
        .then((result) => result.rows[0]);
}
// ***********************************************************************
// **********************------LOGIN------********************************
// ***********************************************************************

function login({ email, password }) {
    return getUserByEmail(email).then((foundUser) => {
        if (!foundUser) {
            return null;
        }
        return bcrypt
            .compare(password, foundUser.password_hash)
            .then((match) => {
                if (match) {
                    return foundUser;
                }
                return null;
            });
    });
}

// ***********************************************************************
// **********************------RESET PASSWORD------***********************
// ***********************************************************************

function createPasswordCode({ code, email }) {
    return db
        .query(
            `INSERT INTO password_reset_codes (code, email)
         VALUES ($1,$2) RETURNING * `,
            [code, email]
        )
        .then((result) => result.rows[0]);
}
// ***********************************************************************
// **********************------UPDATE BIO------***************************
// ***********************************************************************

function updateUserBio({ bio, userId }) {
    return db
        .query(
            `UPDATE users
             SET 
             bio=$1
             WHERE
             id =$2
             RETURNING * `,
            [bio, userId]
        )
        .then((result) => result.rows[0]);
}

// ***********************************************************************
// **********************------SEARCH USERS------*************************
// ***********************************************************************

function searchUsers({ query }) {
    return db
        .query(
            `SELECT * FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1`,
            [query + "%"]
        )
        .then((result) => result.rows);
}
// we want to get results for partial name queries, e.g. 'joh' for 'John', etc
// the solution is to write the query like WHERE first_name ILIKE 'Joh%'

// --------------------------GET recent USERS -----------------------------

function getLatestUsers({ limit = 3 }) {
    return db
        .query(`SELECT * FROM users ORDER BY id DESC LIMIT $1`, [limit])
        .then(({ rows }) => rows);
}

// ***********************************************************************
// **********************------FRIENDSHIP------****************************
// ***********************************************************************

function getFriendship({ first_id, second_id }) {
    return db
        .query(
            `SELECT * FROM friendships
            WHERE sender_id = $1 AND recipient_id = $2
            OR sender_id = $2 AND recipient_id = $1;`,
            [first_id, second_id]
        )
        .then(({ rows }) => rows[0]);
}

function requestFriendship({ sender_id, recipient_id }) {
    return db
        .query(
            `INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2) RETURNING *`,
            [sender_id, recipient_id]
        )
        .then(({ rows }) => rows[0]);
}

function acceptFriendship({ sender_id, recipient_id }) {
    return db
        .query(
            `UPDATE friendships SET accepted = true WHERE sender_id = $1 AND recipient_id = $2 RETURNING *`,
            [sender_id, recipient_id]
        )
        .then(({ rows }) => rows[0]);
}

function deleteFriendship({ first_id, second_id }) {
    return db
        .query(
            `DELETE FROM friendships
         WHERE sender_id = $1 AND recipient_id = $2
         OR sender_id = $2 AND recipient_id = $1 RETURNING *`,
            [first_id, second_id]
        )
        .then(({ rows }) => rows[0]);
}

function getFriendships(user_id) {
    return db
        .query(
            `SELECT friendships.accepted, friendships.id AS friendship_id,
users.id AS user_id,
users.first_name, users.last_name, users.profile_picture_url
FROM friendships
JOIN users
ON (
    users.id = friendships.sender_id
    AND friendships.recipient_id = $1)
OR (
    users.id = friendships.recipient_id
    AND friendships.sender_id = $1
    AND accepted = true)`,
            [user_id]
        )
        .then(({ rows }) => rows);
}

// ***********************************************************************
// **********************------CHAT------****************************
// ***********************************************************************

function createChatMessage({ sender_id, text }) {
    return db
        .query(
            `INSERT INTO chat_messages( sender_id, text) VALUES ($1, $2) RETURNING * `,
            [sender_id, text]
        )
        .then((result) => result.rows[0]);
}

function getChatMessages({ limit }) {
    return db
        .query(
            `SELECT chat_messages.*, users.first_name, users.last_name, users.profile_picture_url
            FROM chat_messages
            JOIN users
            ON users.id = chat_messages.sender_id
            ORDER BY chat_messages.id DESC
            LIMIT $1
`,
            [limit]
        )
        .then((result) => result.rows);
}

module.exports = {
    createUser,
    login,
    getUserById,
    getUserByEmail,
    createPasswordCode,
    updateAvatar,
    updateUserBio,
    searchUsers,
    getLatestUsers,
    getFriendship,
    requestFriendship,
    acceptFriendship,
    deleteFriendship,
    getFriendships,
    createChatMessage,
    getChatMessages,
};
