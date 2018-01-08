import React from 'react'
import './styles/header.css'

const Header = () => (
  <header class="header-login-signup">
  <div class="header-limiter">
    <h1><a href="#">Company<span>logo</span></a></h1>
    <nav>
      <a href="#">Home</a>
      <a href="#">Blog</a>
      <a href="#">Pricing</a>
    </nav>
    <ul>
      <li><a href="#">Login</a></li>
      <li><a href="#">Sign up</a></li>
    </ul>
  </div>
  </header>
)

export default Header
