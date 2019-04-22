import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import IconFont from '../../components/IconFont'

class ErrorPage extends Component {

  render () {
    return (
      <div className='error-page'>
        <h1>
          <IconFont name={'404'} className=''/>
          Oops! Can't find your page.
        </h1>
        <div>
          <Link to='/'>Back to Main</Link>
        </div>
      </div>
    )
  }
}

export default ErrorPage