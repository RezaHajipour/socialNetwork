import React from "react";
import Register from "./Register";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class Welcome extends React.Component {
    render() {
        return (
            <div className="welcome">
                <h2>WELCOME TO SOCIAL NETWORK!</h2>
                <Router>
                    <Switch>
                        <Route path="/" exact>
                            <Register />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/reset-password">
                            <ResetPassword />
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default Welcome;
