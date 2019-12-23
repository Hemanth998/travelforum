import React, { Component } from 'react'

 class Landing extends Component {
     state = {
         user : localStorage.getItem('token')
     }
    render() {

        let msg = 'You are Logged Out'
        if(this.state.user){
            msg = 'You are Logged IN'
        }
        return (
            <div className="container">
                {msg}

                <h1>Landing</h1>
                
            </div>
        )
    }
}
export default Landing