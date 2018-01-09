import React from 'react'

const Header = (props) => (
  <header>
    <h1>{props.title}</h1>
  </header>
)

Header.defaultProps = {
  title: 'Alohomora App'
}

export default Header
