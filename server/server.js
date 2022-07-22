const { Server } = require("http");
const express = require("express");
const app = express();
const server = Server(app);
const socketCreator = require("socket.io");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const {
    createUser,
    login,
    getUserByEmail,
    getUserById,
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
} = require("./db");
const cryptoRandomString = require("crypto-random-string");
const uploader = require("./uplaoder");
const { Bucket, s3upload } = require("./s3");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieSessionMiddleware);
// ***********************************************************************
// **********************------REGISTER------*****************************
// ***********************************************************************
app.post("/api/users", function (req, res) {
    createUser(req.body)
        .then((user) => {
            req.session.user_id = user.id;
            res.json(user);
        })
        .catch((error) => {
            console.log("post api users", error);
            if (error.constraint == "users_email_key") {
                res.statusCode = 400;
                res.json({ error: "email duplicated" });
                return;
            }
            res.statusCode = 500;
            res.json({ error: "generic error" });
        });
});

app.get("/api/users/me", async function (req, res) {
    const user = await getUserById(req.session.user_id);
    if (!user) {
        res.json(null);
        return;
    }
    res.json(user);
});

// ***********************************************************************
// **********************------LOGIN------********************************
// ***********************************************************************

app.post("/api/login", function (req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        res.statusCode = 401;
        res.render("login", {
            title: "Login",
            error: "please write your email and password",
        });
        return;
    }
    login(req.body)
        .then((user) => {
            req.session.user_id = user.id;
            res.json(user);
        })
        .catch((error) => {
            console.log("login post:", error);
            if (error.constraint == "users_email_key") {
                res.statusCode = 400;
                res.json({ error: "wrong credentials" });
                return;
            }
            res.statusCode = 500;
            res.json({ error: "wrong credentials" });
        });
});

// ***********************************************************************
// **********************------logout------***********************
// ***********************************************************************
app.post("/api/logout", function (req, res) {
    req.session = null;
    res.json({ success: true });
});
// ***********************************************************************
// **********************------RESET PASSWORD------***********************
// ***********************************************************************
app.post("/api/password/reset", function (req, res) {
    const { email } = req.body;
    if (!email) {
        res.statusCode = 400;
        res.json({
            error: "please write correct email",
        });
        return;
    }
    getUserByEmail(email)
        .then((user) => {
            if (!user) {
                res.statusCode = 400;
                res.json({
                    error: " email not existing",
                });
                return;
            }
            const code = cryptoRandomString({ length: 6 });
            console.log("user in reset", code, email);
            createPasswordCode({ code, email }).then(() => {
                sendEmail({ code, email });
                res.json({
                    message: "please write the code we sent it to your email",
                });
            });
        })
        .catch((error) => {
            console.log("password reset post:", error);
            if (error.constraint == "users_email_key") {
                res.statusCode = 400;
                res.json({ error: "wrong email" });
                return;
            }
            res.statusCode = 500;
            res.json({ error: "wrong email" });
        });
});
// ***********************************************************************
// **********************-----------PROFILE PICTURE---------**************
// ***********************************************************************
app.post(
    "/api/users/me/picture",
    uploader.single("profile_picture"),
    s3upload,
    async (req, res) => {
        const profile_picture_url = `https://s3.amazonaws.com/${Bucket}/${req.file.filename}`;

        await updateAvatar({
            profile_picture_url,
            user_id: req.session.user_id,
        });
        res.json({ profile_picture_url });
        // see what we did for the imageboard project
        // remember: the user_id is inside the session!
        // update the right user, and send the profile_picture_url back to the client
    }
);

// ***********************************************************************
// **********************------UPDATE BIO------***************************
// ***********************************************************************

app.put("/api/users/me/bio", function (req, res) {
    // console.log(req.body);
    updateUserBio({ bio: req.body.bio, userId: req.session.user_id })
        .then((user) => {
            req.session.user_id = user.id;
            res.json(user);
        })
        .catch((error) => {
            console.log("edit bio:", error);
            if (error.constraint == "users_email_key") {
                res.statusCode = 400;
                res.json({ error: "email duplicated" });
                return;
            }
            res.statusCode = 500;
            res.json({ error: "generic error" });
        });
});

// ***********************************************************************
// **********************------SEARCH USERS------*************************
// ***********************************************************************

app.get("/api/users/search?", async function (req, res) {
    const users = await searchUsers(req.query);
    if (!users) {
        res.json({
            error: "No user  matches with your search",
        });
        return;
    }
    res.json(users);
});

// --------------------------GET RECENT USERS -----------------------------

app.get("/api/users/recent", async function (req, res) {
    const recentUsers = await getLatestUsers(req.query);
    // if (!recentUsers) {
    //     res.json(null);
    //     return;
    // }
    res.json(recentUsers);
});
// ***********************************************************************
// **********************------OTHER PROFILE------*************************
// ***********************************************************************
app.get("/api/users/:user_id", async function (req, res) {
    console.log(req.params);
    const user = await getUserById(req.params.user_id);
    console.log(user);
    if (!user) {
        res.status(404);
        res.json({
            error: "user not found",
        });
        return;
    }
    res.json(user);
});

// ***********************************************************************
// **********************------friendship------*************************
// ***********************************************************************
app.get("/api/friendships/:target_id", async (req, res) => {
    const friendship = await getFriendship({
        first_id: req.session.user_id,
        second_id: req.params.target_id,
    });
    if (!friendship) {
        res.status(404).json({
            error: "no friendship",
        });
        return;
    }
    res.json(friendship);
});

app.post("/api/friendships/:target_id", async (req, res) => {
    const request_friendship = await requestFriendship({
        sender_id: req.session.user_id,
        recipient_id: req.params.target_id,
    });
    res.json(request_friendship);
});

app.put("/api/friendships/:target_id", async (req, res) => {
    const accept_friendship = await acceptFriendship({
        recipient_id: req.session.user_id,
        sender_id: req.params.target_id,
    });
    res.json(accept_friendship);
});

app.delete("/api/friendships/:target_id", async (req, res) => {
    const delete_friendship = await deleteFriendship({
        first_id: req.session.user_id,
        second_id: req.params.target_id,
    });
    res.json(delete_friendship);
});

// ***********************************************************************
// **********------GET ALL FRIENDSHIPS FROM SPECEFIC USER ------**********
// ***********************************************************************

app.get("/api/friendships", async (req, res) => {
    try {
        const friendships = await getFriendships(req.session.user_id);
        res.json(friendships);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "problem with friendships",
        });
    }
});

// ***********************************************************************
// ******************************------CHAT ------************************
// ***********************************************************************
const io = socketCreator(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

io.use((socket, next) =>
    cookieSessionMiddleware(socket.request, socket.request.res, next)
);
io.on("connection", async (socket) => {
    // console.log("socket id is:", socket.id);
    const { user_id } = socket.request.session;
    // console.log("user Id", user_id);
    const chatMessages = await getChatMessages({ limit: 5 });
    // console.log("prevMessage", prevMessages);
    socket.emit("recentMessages", chatMessages);

    socket.on("sendMessage", async (text) => {
        // console.log("sendMessages", text);
        const sender = await getUserById(user_id);
        // console.log("sender", sender);
        const message = await createChatMessage({
            sender_id: user_id,
            text,
        });

        io.emit("newMessage", {
            first_name: sender.first_name,
            last_name: sender.last_name,
            profile_picture_url: sender.profile_picture_url,
            ...message,
        });
    });
});
// ***********************************************************************
// ***********************************************************************
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

function sendEmail({ code, email }) {
    console.log("sending email to: ....,", code, email);
}
