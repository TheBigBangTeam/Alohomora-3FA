import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => (
  <div>
    <h2>404</h2>
    <h3>Sorry, the page you are looking for doesn't exist</h3>
    <Link to='/'>Return home</Link>
  </div>
)

export default NotFound
