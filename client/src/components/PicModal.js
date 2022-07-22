import React from "react";

class PicModal extends React.Component {
    constructor(props) {
        super(props);
        this.onModalClose = this.onModalClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onModalClose() {
        this.props.onModalClose();
    }
    onSubmit(e) {
        e.preventDefault();
        const file = e.target.avatar.files[0];
        const body = new FormData();

        // use the same name inside the multer middleware!
        body.append("profile_picture", file);

        fetch("/api/users/me/picture", {
            method: "POST",
            body,
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.onChangingAvatar(data.profile_picture_url);
                if (data.error) {
                    return;
                }
                // notify the parent by calling the right prop
                // pass the relevant portion of data to it!
            });
    }
    render() {
        return (
            <div className="PicModal">
                <h1>Want to change your image?</h1>
                <form onSubmit={this.onSubmit}>
                    <input
                        className="avatar"
                        type="file"
                        accept="image/*"
                        name="avatar"
                        id="image"
                        placeholder="Profile Picture"
                        required
                    />
                    <button type="submit">UPLOAD</button>
                </form>

                <button className="modalCloseBtn" onClick={this.onModalClose}>
                    X
                </button>
            </div>
        );
    }
}

export default PicModal;
