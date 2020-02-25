import React from "react"
import PropTypes from "prop-types"

class NavItem extends React.Component {
  render () {
    const {
      text,
      onClick,
      active
    } = this.props

    const classes = [
      "item",
      active  ? "active"    : "",
      onClick ? "clickable" : ""
    ].join(" ")

    return (
      <div
        className={classes}
        onClick={onClick}>
        { text }
      </div>
    )
  }
}

NavItem.propTypes ={
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.boolean
}

export default NavItem
