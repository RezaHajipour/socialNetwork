import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FriendshipButton from "./FriendshipButton";

function OtherProfile() {
    const { id } = useParams();
    const [user, setUser] = useState({});
    // console.log("incoming id from params is:", id);

    useEffect(() => {
        // console.log("incoming id inside useEffect is:", id);
        fetch("/api/users/" + id)
            .then((res) => res.json())
            .then((data) => setUser(data));
        // console.log("set user is", setUser);
    }, [id]);

    return (
        <section className="other-profile-container">
            <h1>other profile</h1>
            <img
                src={user.profile_picture_url}
                className="other-profile-image"
            />
            <h1>
                {user.first_name} {user.last_name}
            </h1>
            <p>{user.bio}</p>
            <FriendshipButton id={id} />
        </section>
    );
}

export default OtherProfile;
