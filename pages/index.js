import React from "react";

export default class extends React.Component {
  static async getInitialProps() {
    return new Promise(res => {
      setTimeout(() => {
        res({ name: "You" });
      }, 1000);
    });
  }
  static get defaultProps() {
    return { name: "World" };
  }
  render() {
    return <>Hello, {this.props.name}!</>;
  }
}
