import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'

class LogsInfo extends Component {
    render(){
        var id = this.props.id
        var user = this.props.user
        var device = this.props.device
        var description = this.props.description
        return(
            <div>
                {id ? 
                    <TextField
                        disabled={false}
                        underlineShow={false}
                        defaultValue={"ID: "+id} 
                        fullWidth={true}
                    /> : null
                }
                <Divider />
                {user ?
                    <TextField
                        disabled={false}
                        underlineShow={false}
                        defaultValue={"User: "+user}
                        fullWidth={true}
                    /> : null
                }
                <Divider />
                {device ?
                    <TextField
                        disabled={false}
                        underlineShow={false}
                        defaultValue={"Device: "+device}
                        fullWidth={true}
                    /> : null
                }
                <Divider />
                {description ?
                    <TextField
                        disabled={false}
                        underlineShow={false}
                        defaultValue={"Description: "+description} 
                        fullWidth={true}
                    /> : null
                }
            </div>
        )
    }
}

export default LogsInfo