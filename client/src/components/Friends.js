import { useEffect, useState } from "react";
import ProfilePicture from "./ProfilePicture";

function Friends() {
    const [pending, setPending] = useState([]);
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        fetch("/api/friendships")
            .then((res) => res.json())
            .then((data) => {
                setPending(data.filter((x) => !x.accepted));
                setFriends(data.filter((x) => x.accepted));
            });
    }, []);
    function onAcceptClick(y) {
        // console.log(y);
        fetch("/api/friendships/" + y.user_id, { method: "PUT" })
            .then((res) => res.json())
            .then(() => {
                const newPending = pending.filter(
                    (data) => data.friendship_id !== y.friendship_id
                );
                // console.log("new pending is", newPending);
                setPending(newPending);

                const newFriends = [
                    ...friends,
                    pending.find((x) => x.friendship_id === y.friendship_id),
                ];
                setFriends(newFriends);
            });
    }
    function onUnfriendClick(x) {
        fetch("/api/friendships/" + x.user_id, { method: "DELETE" })
            .then((res) => res.json())
            .then(() => {
                const newFriends = friends.filter(
                    (friend) => friend.friendship_id !== x.friendship_id
                );
                console.log("new friend", newFriends);
                setFriends(newFriends);
            });
    }
    return (
        <div>
            <section className="pending">
                <h1>pending</h1>
                {pending.length ? (
                    <ul>
                        {pending.map((y) => {
                            return (
                                <li key={y.friendship_id}>
                                    {y.first_name} {y.last_name}
                                    <button onClick={() => onAcceptClick(y)}>
                                        accept
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No incomming friend request</p>
                )}
            </section>
            <section className="friends">
                <h1>friends</h1>
                {friends.length ? (
                    <ul>
                        {friends.map((x) => {
                            return (
                                <li key={x.friendship_id}>
                                    <ProfilePicture {...x} />
                                    {x.first_name} {x.last_name}{" "}
                                    <button onClick={() => onUnfriendClick(x)}>
                                        unfriend
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No friends</p>
                )}
            </section>
        </div>
    );
}

export default Friends;
