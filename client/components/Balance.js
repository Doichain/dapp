import { Meteor } from "meteor/meteor";
import React, {Component} from "react";

export default class Balance extends Component { //TODO maybe get this information from meta data and then update as soon as a new block comes in
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
