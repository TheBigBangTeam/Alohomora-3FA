import React from 'react'

const EditUser = (props) => {
  console.log(props)
  return (
    <p>Editing user with id {props.match.params.id}</p>
  )
}

export default EditUser
