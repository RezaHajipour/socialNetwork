import { useEffect, useState } from "react";

function FriendshipButton({ id }) {
    const [buttonText, setButtonText] = useState("...");
    // three questions
    const [existing, setExisting] = useState(false);
    const [incoming, setIncoming] = useState(false);
    const [accepted, setAccepted] = useState(false);

    // decide what's in the initial state
    useEffect(() => {
        // fetch /api/friendships/:id
        // update the three questions based on the response
        fetch("/api/friendships/" + id)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setExisting(false);
                    setIncoming(false);
                    setAccepted(false);
                    return;
                }
                setExisting(true);
                setIncoming(id == data.sender_id);
                setAccepted(data.accepted);
            });
    }, [id]);

    useEffect(() => {
        // update the button text depending on the three questions
        console.log({ existing, incoming, accepted });
        if (!existing) {
            setButtonText("SEND FRIENDREQUEST");
            return;
        }

        if (accepted) {
            setButtonText("UNFRIEND");
            return;
        }
        if (incoming) {
            setButtonText("ACCEPT FRIENDREQUEST");
            return;
        }
        setButtonText("CANCLE");
    }, [existing, incoming, accepted]);

    // handle the click
    function onClick() {
        // if the friendship is not existing, perform the right fetch call
        // if the friendship is incoming and not yet accepted, perform the right fetch call
        // else, perform the right fetch call
        if (!existing) {
            // console.log("post");
            fetch("/api/friendships/" + id, { method: "POST" })
                .then((res) => res.json())
                .then(() => {
                    setExisting(true);
                });
            return;
        }
        if (!accepted && incoming) {
            fetch("/api/friendships/" + id, { method: "PUT" })
                .then((res) => res.json())
                .then(() => {
                    setAccepted(true);
                });
            return;
        }
        fetch("/api/friendships/" + id, { method: "DELETE" })
            .then((res) => res.json())
            .then(() => {
                setAccepted(false);
                setIncoming(false);
                setExisting(false);
            });
    }

    return (
        <button className="action" onClick={onClick}>
            {buttonText}
        </button>
    );
}

export default FriendshipButton;
