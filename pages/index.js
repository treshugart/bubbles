import React from "react";

export default class extends React.Component {
  static async getInitialProps() {
    return new Promise(res => {
      // Simulates a fetch.
      setTimeout(() => {
        res({ name: "You" });
      }, 1000);
    });
  }
  static get defaultProps() {
    // Could be empty and you could display "Loading..." instead, if you
    // wanted to.
    return { name: "World" };
  }
  render() {
    return <>Hello, {this.props.name}!</>;
  }
}
