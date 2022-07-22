import React from "react";
import PicModal from "./PicModal";
import ProfilePicture from "./ProfilePicture";
import Profile from "./Profile";
import FindPeople from "./FindPeople";
import OtherProfile from "./OtherProfile";
import Friends from "./Friends";
import Chat from "./Chat";
import Logout from "./Logout";

import { BrowserRouter, Route, NavLink } from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile_picture_url: "",
            showModal: false,
            first_name: "",
            last_name: "",
            bio: "",
        };

        this.onChangingAvatar = this.onChangingAvatar.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onAvatarClick = this.onAvatarClick.bind(this);
        this.onBioUpdate = this.onBioUpdate.bind(this);
    }
    componentDidMount() {
        fetch("/api/users/me")
            .then((res) => res.json())
            .then((data) => {
                this.setState(data);
            });
    }
    onChangingAvatar(profile_picture_url) {
        this.setState({ showModal: false, profile_picture_url });
    }
    onModalClose() {
        this.setState({ showModal: false });
    }
    onAvatarClick() {
        this.setState({ showModal: true });
    }
    onBioUpdate(bio) {
        this.setState({ bio });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <header className="header">
                        <div className="header-left">
                            <NavLink exact to="/" className="navlink">
                                Home
                            </NavLink>
                            <NavLink to="/find-people" className="navlink">
                                Find People
                            </NavLink>
                            <NavLink to="/friends" className="navlink">
                                Friends
                            </NavLink>
                            <NavLink to="/chat" className="navlink">
                                Chat
                            </NavLink>
                        </div>
                        <div className="header-center">
                            <p>
                                Welcome <strong>{this.state.first_name}</strong>
                            </p>
                        </div>
                        <div className="header-right">
                            <Logout />
                            <ProfilePicture
                                profile_picture_url={
                                    this.state.profile_picture_url
                                }
                                onAvatarClick={this.onAvatarClick}
                            />
                        </div>
                    </header>
                    <section className="profile-section">
                        <Route path="/user/:id">
                            <OtherProfile />
                        </Route>
                        <Route path="/find-people">
                            <FindPeople />
                        </Route>
                        <Route path="/friends">
                            <Friends />
                        </Route>
                        <Route path="/chat">
                            <Chat />
                        </Route>
                        <Route path="/" exact>
                            <Profile
                                {...this.state}
                                onBioUpdate={this.onBioUpdate}
                            />
                        </Route>
                    </section>

                    {this.state.showModal && (
                        <PicModal
                            onModalClose={this.onModalClose}
                            onChangingAvatar={this.onChangingAvatar}
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
