import React from "react";

class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
        };
        this.onEditBio = this.onEditBio.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onEditBio() {
        // this.setState({ isEditing: true });
        this.setState({ isEditing: !this.state.isEditing });
    }
    onSubmit(event) {
        event.preventDefault();
        const bio = event.target.bioText.value;
        console.log("onSubmit", event.target.bioText.value);
        //save to server
        fetch("/api/users/me/bio", {
            method: "PUT",
            body: JSON.stringify({ bio }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ error: data.error });
                    return;
                }
                console.log(data);
                this.props.onBioUpdate(bio);
                this.onEditBio();
                // window.location.href = "/";
            });

        // i have to notify parent about this changes from here maybe with another function
    }

    render() {
        return (
            <div className="bio-container">
                {this.state.isEditing ? (
                    <div className="edit-bio">
                        <form
                            onSubmit={this.onSubmit}
                            className="edit-bio-form"
                        >
                            <textarea
                                name="bioText"
                                placeholder="describe yourself"
                                defaultValue={this.props.bio}
                                required
                                // onClick={this.onUpdateBio}
                                className="edit-bio-textarea"
                            />
                            <button type="submit" className="edit-bio-update">
                                Update Bio
                            </button>
                            <button
                                type="submit"
                                onClick={this.onEditBio}
                                className="edit-bio-cancle"
                            >
                                Cancle
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="display-bio">
                        <p>{this.props.bio}</p>
                        <button
                            type="submit"
                            onClick={this.onEditBio}
                            className="edit-bio-button"
                        >
                            Edit Bio
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default BioEditor;
