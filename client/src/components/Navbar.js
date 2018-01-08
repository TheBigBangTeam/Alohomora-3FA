import React from 'react'
import {NavLink} from 'react-router-dom'

const Navbar = () => (
  <div>
    <NavLink exact to='/' activeClassName='is-active'>Homepage</NavLink>
    <NavLink to='/login' activeClassName='is-active'>Login</NavLink>
    <NavLink to='/license' activeClassName='is-active'>License</NavLink>
    <NavLink to='/contacts' activeClassName='is-active'>Contacts</NavLink>
  </div>
)

export default Navbar
