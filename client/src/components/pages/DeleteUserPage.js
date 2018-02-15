import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar'
import { deleteUser } from '../../actions/deletion'

class DeleteUserPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      data: {},
      open: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    axios.get('/api/admin/users', {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.alohomoraToken
      }
    }).then(({ data }) => {
      var array = []
      var user = JSON.parse(localStorage.alohomoraLog)
      var currentID = user._id
      for (var i = 0; i < data.users.length; i++) {
        if (data.users[i]._id === currentID) {
          //I will do nothing
        } else {
          array.push(data.users[i])
        }
      }
      this.setState({
        users: array
      })
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.deleteUser(this.state.data).then(() => this.props.history.push('/dashboard'))
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        primary
        type='submit'
        className='submitButton'
        label='Delete'
        onClick={this.handleSubmit}
      />
    ];

    return (
      <MuiThemeProvider>
        <div>
          <font face="Roboto">
            <h2>Select a user</h2>
          </font>
          <List>
            {this.state.users.map(user =>
              <ListItem
                key={user._id}
                primaryText={user.name + " " + user.surname}
                rightAvatar={<Avatar>{user.name[0]}</Avatar>}
                onClick={() => {
                  var id2 = user._id.toString()
                  this.setState({
                    data: { ...this.state.data, id: id2 }
                  })
                }}
              />
            )}
          </List>
          <RaisedButton
            primary
            label="Delete"
            onClick={this.handleOpen}
            disabled={!this.state.data.id}
          />
          <Dialog
            title="Deletion"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            Are you sure? The action cannot be undone once it starts. Be careful!
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}

DeleteUserPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  deleteUser: PropTypes.func.isRequired
}

export default connect(null, { deleteUser })(DeleteUserPage)
