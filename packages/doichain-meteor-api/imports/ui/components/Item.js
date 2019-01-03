import React from 'react';
import BaseComponent from './BaseComponent.js';
import ImageElement from './ImageElement.js';
import PropTypes from 'prop-types';

export default class Item extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { keys } = this.props;

    const renderedKeys = keys.map(key => (
      <div className="key-wrapper" key={key.key}>
        <div className="key">
          <span className="name">{key.name}</span>
          <span className="value">{
            key.json?this.renderJson(key.value):(key.image? <ImageElement src={key.value}/>:key.value)
            }

            </span>
          
        </div>
      </div>
    ))

    return (
      <div className="item">
        {renderedKeys}
      </div>
    );
  }

  renderJson(jkey) {
    if(jkey === undefined || jkey==null || jkey.length==0) return (<pre>{undefined}</pre>);
    const json = JSON.parse(jkey);
    return (
      <pre>{JSON.stringify(json, undefined, 4)}</pre>
    )
  }
}

Item.propTypes = {
  keys: PropTypes.array
};
