import React, { Component, PropTypes } from 'react';

const Search = ({ value, onChange, onSubmit, children, isLoading }) => (
  <form onSubmit={onSubmit} className="field has-addons has-addons-centered">
    <p className="control is-expanded">
      <input className="input" value={value} type="text" placeholder="Search" onChange={onChange} />
    </p>
    <p className="control">
      {isLoading
        ? <button type="submit" className="button is-primary is-loading is-disabled">
          {children}
        </button>
        : <button type="submit" className="button is-primary">
          {children}
        </button>}
    </p>
  </form>
);

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  isLoading: PropTypes.boolValue,
};

export default Search;
