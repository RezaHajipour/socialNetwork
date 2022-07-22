import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App";
// import io from "socket.io-client";

// const socket = io.connect();

// socket.on("recentMessages", (messages) => {
//     console.log("recentMessages", messages);
// });

fetch("/api/users/me")
    .then((res) => res.json())
    .then((data) => {
        // console.log("user", data);
        ReactDOM.render(
            !data ? <Welcome /> : <App />,
            document.querySelector("main")
        );
    });
