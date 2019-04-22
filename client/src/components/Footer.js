import React from 'react'
import { Icon } from 'antd'

const Footer = () => {
  return (
    <footer>
      <p>
        <span>Made</span>
        <span className="red"> by </span>
        <span> Aaron Jiang @ 2019</span>
      </p>
      <a href="https://github.com/NanJiang327">
        <Icon type="github" className='github'/>
      </a>
    </footer>
  )
}

export default Footer