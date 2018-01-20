import React from 'react';
import { Feed, Comment, Icon, Divider } from 'semantic-ui-react';
import ta from 'time-ago';
import axios from 'axios';
import Linkify from 'react-linkify';

class CommentEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbsUp: 0,
      thumbsDown: 0,
      prestige: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.deleteComment(this.props.comment.id)
    .then(() => {
      console.log('deleted comment');
      this.props.afterDelete();
    });
  }

  upVote() {
    axios.post(`/upVoteComment?user=${this.props.user}&&comment=${this.props.comment.id}&&entry=${this.props.entry}`)
    .then(() => {
      this.getCommentVotes();
    })
  }

  downVote() {
    axios.post(`/downVoteComment?user=${this.props.user}&&comment=${this.props.comment.id}&&entry=${this.props.entry}`)
    .then(() => {
      this.getCommentVotes();
    })
  }

  getCommentVotes() {

    axios.get(`/getCommentVotes?id=${this.props.comment.id}`)
    .then((obj) => {
      const prest = obj.data[0].up_votes + obj.data[0].down_votes
      this.setState({
        thumbsUp: obj.data[0].up_votes,
        thumbsDown: obj.data[0].down_votes,
        prestige: prest
      })
    })
  }

  componentWillReceiveProps(newProps) {
    this.getCommentVotes();
  }

  componentDidMount() {
    this.getCommentVotes();    
  }

  // Renders different versions of the componet depending if a user is logged in
  render () {
    if(this.props.user === this.props.comment.name){
      return (
        <div>
          <Comment>
            <Comment.Content>
              {this.props.onLikedTab ? <span>Comment by </span> : ''}
              <Comment.Author as='a'>{this.props.comment.name}</Comment.Author>
              <Comment.Metadata>
                <div>{ta.ago(this.props.comment.created_at)}</div>
                
                <Icon name='thumbs up' onClick={this.upVote.bind(this)}/>
                {this.state.thumbsUp}
                <Icon name='thumbs down' onClick={this.downVote.bind(this)}/>
                {this.state.thumbsDown}
                
              </Comment.Metadata>
              <Linkify>
                <Comment.Text>{this.props.comment.text}</Comment.Text>
              </Linkify>
              <Comment.Actions>
                <Comment.Action onClick={this.handleClick}>delete</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
          <Divider></Divider>
        </div>
      );
    }
    return (
      <div>
        <Comment>
          <Comment.Content>
            {this.props.onLikedTab ? <span>Comment by </span> : ''}
            <Comment.Author as='a'>{this.props.comment.name}</Comment.Author>
            <Comment.Metadata>
              <div>{ta.ago(this.props.comment.created_at)}</div>
              
              <Icon name='thumbs up' onClick={this.upVote.bind(this)}/>
              {this.state.thumbsUp}
              <Icon name='thumbs down' onClick={this.downVote.bind(this)}/>
              {this.state.thumbsDown}            
              
            </Comment.Metadata>
            <Comment.Text>{this.props.comment.text}</Comment.Text>
            <Comment.Actions></Comment.Actions>
          </Comment.Content>
        </Comment>
        <Divider></Divider>
      </div>
    );
  }
}

export default CommentEntry;
