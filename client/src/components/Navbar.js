import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <div>
    <Link to='/'>Homepage</Link>
    <Link to='/login'>Login</Link>
    <Link to='/license'>License</Link>
    <Link to='/contacts'>Contacts</Link>
  </div>
)

export default Navbar
