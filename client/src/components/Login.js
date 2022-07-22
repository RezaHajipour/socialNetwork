import React from "react";
import { Link } from "react-router-dom";

class Login extends React.Component {
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
        console.log("i am clicked", this.state);
        fetch("/api/login", {
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
            <div className="login-container">
                <form onSubmit={this.onSubmit} className="login-form">
                    <h2 className="login-form-h2">Login</h2>
                    <ul className="login-form-ul">
                        <li>
                            <input
                                className="login-input"
                                type="email"
                                name="email"
                                required
                                placeholder="Email"
                                onInput={this.onInput}
                            />
                        </li>
                        <li>
                            <input
                                className="login-input"
                                type="password"
                                name="password"
                                required
                                placeholder="Password"
                                onInput={this.onInput}
                            />
                        </li>
                        <li>
                            <button type="submit" className="login-Btn">
                                LOGIN
                            </button>
                        </li>
                        <p className="login-p">Don't have an account yet?</p>

                        <p className="login-p2">
                            <Link to="/" className="register-here">
                                REGISTER HERE.
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

export default Login;
