import React from 'react';
import BaseComponent from './BaseComponent.js';

export default class Item extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { keys } = this.props;

    const renderedKeys = keys.map(key => (
      <div classNames="key-wrapper" key={key.key}>
        <div classNames="key">
          <span classNames="name">{key.name}</span>
          <span classNames="value">{key.json?this.renderJson(key.value):key.value}</span>
        </div>
      </div>
    ))

    return (
      <div classNames="item">
        {renderedKeys}
      </div>
    );
  }

  renderJson(jkey) {
    if(jkey === undefined) return null;
    const json = JSON.parse(jkey);
    return (
      <pre>{JSON.stringify(json, undefined, 4)}</pre>
    )
  }
}

Item.propTypes = {
  keys: React.PropTypes.array
};
