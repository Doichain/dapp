import { Meteor } from "meteor/meteor";
import React, {Component} from "react";

export default class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
        balance: ""
    };
    this.generate = this.generate.bind(this);
    this.generate();
  }

  generate() {
    Meteor.call("doichain.getBalance", (error, bal) => {
      const tmpVal = bal;
      if(!error) {
        this.setState({
          balance: tmpVal
        })
      }
    });
  }

  render() {
    return (this.state.balance)
  }
}
