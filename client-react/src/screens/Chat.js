import React from 'react';
import io from 'socket.io-client';
import Messages from '../components/Messages';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addMessage} from '../Redux/actions';

let socket;
let name;
// let person;


class Chat extends React.Component {
    constructor() {
        super();

        this.sendMessage = this.sendMessage.bind(this);
        this.changeHistory = this.changeHistory.bind(this);
        this.myRef = React.createRef();
        this.myRefScroll = React.createRef();
    }
    
    sendMessage(e) {
      e.preventDefault();
      if (this.myRef.current.value) {
        socket.send({
          message: this.myRef.current.value,
          name: name
        });
        this.myRef.current.value = '';
      }
    }

    changeHistory() {
      this.props.history.push('/');
      window.location.reload();
    }

    componentDidMount() {
        socket = io.connect('http://localhost:4000');
        socket.on('message', (data) => {
            console.log(data);
            this.props.addMessage(data);
            console.log(name);
            this.myRefScroll.current.scrollTop = this.myRefScroll.current.scrollHeight - this.myRefScroll.current.clientHeight;
        });
    }
  
    render() {
      name = this.props.user.name;
      console.log(this.props);
      return (
        <div className='app'>
        <div className='infoBar'>
          <img src={this.props.src} alt='userphoto'></img>
          <p>{this.props.user.name ? this.props.user.name : 'Аноним, авторизуйся'}</p>
          <button className={this.props.user.name ? 'none' : ''} onClick={this.changeHistory}>Авторизация</button>
        </div>
        <div className='box'>
          <span className='name'>Common Chat</span>
          <div className='chat' ref={this.myRefScroll}>
            <Messages data={this.props.messages}/>
          </div>
          <form className='form' onSubmit={this.sendMessage}>
            <input placeholder='Write the message' className='input' ref={this.myRef}/>
            <button type='submit' className='button'>Send</button>
          </form>
        </div>
        </div>
      )
    }
  }


  const mapStateToProps = (state) => {
    return {user: state.user, messages: state.messages, src: state.user.src};
  };

  export default connect(mapStateToProps, {addMessage})(Chat);

  