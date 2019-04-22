import React from 'react';
import PropTypes from 'prop-types'

const IconFont = ({ name }) => {

  return (
    <svg className={"icon-font " +name} aria-hidden="true">
        <use xlinkHref={ '#icon-' + name } />
    </svg>
  )
}

IconFont.protoType = {
  name: PropTypes.string.isRequired
}


export default IconFont


