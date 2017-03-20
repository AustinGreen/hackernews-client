import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import Button from '../Button';
import { SORTS } from '../../constants';

const Sort = ({ sortKey, activeSortKey, onSort, children, isSortReverse }) => (
  <th onClick={() => onSort(sortKey)} style={{ cursor: 'pointer' }}>
    {sortKey === activeSortKey
      ? <FontAwesome
        name="caret-down"
        className={isSortReverse ? 'fa-rotate-180' : ''}
        style={{ verticalAlign: 'middle' }}
      />
      : ''}
    {children}
  </th>
);

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const {
      list,
      onDismiss,
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <table className="table is-striped">
        <thead className="is-hidden-mobile">
          <tr>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {' '}Title
            </Sort>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {' '}Author
            </Sort>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {' '}Comments
            </Sort>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {' '}Points
            </Sort>
            <th>Archive</th>
          </tr>
        </thead>
        {reverseSortedList.map(item => (
          <tbody>
            <tr key={item.objectID}>
              <td><a href={item.url} rel="noopener noreferrer" target="_blank">{item.title}</a></td>
              <td className="is-hidden-mobile">{item.author}</td>
              <td className="is-hidden-mobile">{item.num_comments}</td>
              <td className="is-hidden-mobile">{item.points}</td>
              <td style={{ verticalAlign: 'middle' }}>
                <Button className="delete" onClick={() => onDismiss(item.objectID)} />
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    );
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    }),
  ).isRequired,
  onDismiss: PropTypes.func,
};

export default Table;
