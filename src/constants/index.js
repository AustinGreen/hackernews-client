import { sortBy } from 'lodash';

export const DEFAULT_QUERY = 'Tesla';
export const DEFAULT_PAGE = 0;
export const DEFAULT_HPP = '15';

export const PATH_BASE = 'https://hn.algolia.com/api/v1';
export const PATH_SEARCH = '/search';
export const PARAM_SEARCH = 'query=';
export const PARAM_PAGE = 'page=';
export const PARAM_HPP = 'hitsPerPage=';
export const PARAM_FRONT_PAGE = 'tags=front_page';
// http://hn.algolia.com/api/v1/search?tags=front_page for front page
export const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};
