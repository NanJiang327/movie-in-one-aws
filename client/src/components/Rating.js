import React from 'react';
import IconFont from './IconFont'

const Rating = ({ rating }) => {
  return (
    <div className="rating" >
      <IconFont name={'star'} />
      <span className="average">
        {rating}
      </span>
      <span className="max">/10</span>
    </div>
  )
}

export default Rating