import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import { Divider, Form, Label, Button, Header, Menu } from 'semantic-ui-react'

import './style.scss'
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Submit from './components/Submit.jsx';
import EntryList from './components/EntryList.jsx';
import CommentList from './components/CommentList.jsx';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      entries: [],
      auth: true
    }
  }

  componentDidMount() {
    this.getEntries()
    .then(data => this.setState({entries: data.data}));
  }

  getEntries(){
    return axios.get('/entries');
  }

  getEntry(entryid){
    return axios.get(`/entry?id=${entryid}`);
  }

  getComments(entryid){
    return axios.get('/comments', {
      params: {
        entryid: entryid
      }
    });
  }

  isURL(str){
    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)){
      return true;
    }else{
      return false;
    }
  }

  postEntry(title, url){
    if(isURL(url)){
      if(url.slice(0, 4) !== 'http'){
        url = '//' + url;
      }
      axios.post('/entries', {
        title: title,
        url: url
      }).then((res) => {console.log(res.data)});
    }
  }

  postComment(text, entryid){
    return axios.post('/comments', {
      text: text,
      entryid: entryid
    });
  }

  // checks if a user is who they say they are (verifies username & password)
  authenticate(url) {
    return axios.post(url, { username: this.state.username, password: this.state.password })
    // .then((res) => {console.log('authenticate: ', res.data)});
  }

  usernameChange(input) {
    this.setState({
      username: input.target.value
    });
  }

  passwordChange(input) {
    this.setState({
      password: input.target.value
    });
  }

  authorize() {
    axios.get('/submit').then((res) => {
      this.isAuthorized(res.data);
    });
  }

  isAuthorized(res) {
    console.log('isAuthorized: ', res)
    this.setState({
      auth: res
    });
  }

  render() {
  	return (
      <div>
        <Switch>
          <Route exact path="/" render={(props) => (
            <Home {...props}
              data = {this.state.entries}
              authenticate={this.authenticate.bind(this)}
              authorize={this.authorize.bind(this)}
            />
          )}/>
          <Route exact path="/login" render={(props) => (
            <Login {...props} 
              authenticate={this.authenticate.bind(this)}
              usernameChange={this.usernameChange.bind(this)}
              passwordChange={this.passwordChange.bind(this)}
            />
          )}/> 
          <Route exact path="/submit" render={(props) => (
            this.state.auth === true
            ? <Submit {...props} 
              postEntry={this.postEntry.bind(this)}
            />
            : <Redirect to='/login' />
          )}/> 
          <Route exact path="/thread/:id" render={(props) => (
            <CommentList {...props}
              getComments={this.getComments.bind(this)}
              postComment={this.postComment.bind(this)}
              getEntry={this.getEntry.bind(this)}
            />
          )}/> 
        </Switch>
      </div>
  	)
  }

}

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('app'))
