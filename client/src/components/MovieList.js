import React from 'react';
import PropTypes from 'prop-types';

import Movie from './Movie';

const MovieList = ({ results, language }) => {
  if (!results) return <div></div>
  let lists = results.map((movie) => {
    return (
      <li key={movie.id}>
        <Movie data={movie} language={language} />
      </li>
    )
  })

  return (
    <ul>
      {lists}
    </ul>
  )
}

MovieList.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object)
};

export default MovieList;