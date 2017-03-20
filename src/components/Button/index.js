import React, { Component, PropTypes } from 'react';

const Button = ({ onClick, className, children }) => (
  <button className={className} onClick={onClick}>{children}</button>
);

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

Button.defaultProps = {
  className: '',
};

export default Button;
