import BioEditor from "./BioEditor";

function Profile({
    profile_picture_url,
    first_name,
    last_name,
    bio,
    onBioUpdate,
}) {
    return (
        <section className="profile-container">
            <h1>Profile Picture</h1>{" "}
            <div className="profile-sub-container">
                {profile_picture_url && (
                    <img src={profile_picture_url} className="profile-image" />
                )}
                <div>
                    <h2 className="profile-sub-container-h2">
                        {first_name} {last_name}
                    </h2>

                    <BioEditor
                        bio={bio}
                        onBioUpdate={onBioUpdate}
                        className="profile-bio"
                    />
                </div>
            </div>
        </section>
    );
}

export default Profile;
