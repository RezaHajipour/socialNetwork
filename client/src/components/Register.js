import React from "react";
import { Link } from "react-router-dom";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            password: "",
            email: "",
            error: "",
        };
        this.onInput = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        // console.log("i am clicked", this.state);
        fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ error: data.error });
                    return;
                }
                //reload the page if there isnt error
                window.location.href = "/";
                // console.log("i data", data);
            });
    }
    onInput(e) {
        console.log("input");
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <div className="register-container">
                <div className="register-info">
                    <h2 className="register-info-h2">SOCIAL NETWORK</h2>
                    <img
                        src="/images/logo.png"
                        className="register-info-icon"
                        aria-hidden="true"
                    />
                    <p>CONNECT TO THE WORLD</p>
                </div>
                <form onSubmit={this.onSubmit} className="register-form">
                    <h2 className="register-form-h2">Sign Up</h2>
                    <ul className="register-form-ul">
                        <li>
                            <input
                                className="register-input"
                                type="text"
                                name="first_name"
                                required
                                placeholder="First Name"
                                onInput={this.onInput}
                            />
                        </li>
                        <li>
                            <input
                                className="register-input"
                                type="text"
                                name="last_name"
                                required
                                placeholder="Last Name"
                                onInput={this.onInput}
                            />
                        </li>
                        <li>
                            <input
                                className="register-input"
                                type="email"
                                name="email"
                                required
                                placeholder="Email"
                                onInput={this.onInput}
                            />
                        </li>
                        <li>
                            <input
                                className="register-input"
                                type="password"
                                name="password"
                                required
                                placeholder="Password"
                                onInput={this.onInput}
                            />
                        </li>
                        <li>
                            <button type="submit" className="register-Btn">
                                REGISTER
                            </button>
                        </li>
                        <p className="register-p">
                            Already Registered?&nbsp;
                            <Link to="/login" className="login-here">
                                LOGIN HERE.
                            </Link>
                        </p>
                        {this.state.error && (
                            <p className="error">{this.state.error}</p>
                        )}
                    </ul>
                </form>
            </div>
        );
    }
}

export default Register;
