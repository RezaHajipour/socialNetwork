import React from "react";

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: "",
        };
    }

    stepOne() {
        return (
            <div>
                <h1>step one</h1>
            </div>
        );
    }
    stepTwo() {
        return (
            <div>
                <h1>step two</h1>
            </div>
        );
    }
    stepThree() {
        return (
            <div>
                <h1>step three</h1>
            </div>
        );
    }
    renderSteps() {
        if (this.state.step === 1) {
            return this.stepOne();
        }
        if (this.state.step === 2) {
            return this.stepOne();
        }
        if (this.state.step === 3) {
            return this.stepOne();
        }
    }
    render() {
        return (
            <div>
                <h1>step1</h1>
                {this.renderSteps()}
            </div>
        );
    }
}

export default ResetPassword;
