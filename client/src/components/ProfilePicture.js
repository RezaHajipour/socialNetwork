function ProfilePicture({ profile_picture_url, onAvatarClick }) {
    return (
        <img
            src={profile_picture_url}
            onClick={onAvatarClick}
            className="profilePicture"
        ></img>
    );
}

export default ProfilePicture;
