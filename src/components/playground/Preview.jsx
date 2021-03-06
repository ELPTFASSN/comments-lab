import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import CommentBox from './CommentBox';
import Stream from '../stream/StreamContainer';
import StreamTabs from '../streamTabs/StreamTabsContainer';

import { themes, mediaQueries } from '../../playgroundSettings';

import {Card, CardText, Icon, Button} from 'react-mdl';

@connect(state => state.playground)
@Radium
class Preview extends React.Component {

  constructor(props) {
    super(props);
    this.state = { commentsAreVisible: this.props.togglerGroups.layout.togglers.hiddenbydefault.status };
  }

  onClickToReadClick() {
    this.setState({ commentsAreVisible: true });
  }

  onHideCommentsClick() {
    this.setState({ commentsAreVisible: false });
  }

  render() {
    var guidelines = this.props.togglerGroups['community'].togglers['guidelines'].status ?
      <div style={styles.guidelines}>
        We aim to create a safe and sustainable environment for discussions about technology news.
        <br/>
        <br/>
        That means:
        <ul style={styles.communityNorms}>
          <li>Be supportive of each other</li>
          <li>Criticize ideas, not people</li>
          <li>Flag bad behavior</li>
        </ul>

        <br/>
        <p>If we like your comment, we might feature it within a future article.</p>
        <a href="#">Click here to read our community guidelines and harassment policy.</a>
      </div>
      :
      null;

    const hideComments = this.props.togglerGroups.layout.togglers.hiddenbydefault.status &&
            !this.state.commentsAreVisible;

    return (
      <div style={ styles.preview } id="preview">
        <div style={ styles.previewBar }>
          {
            this.props.togglerGroups.layout.togglers.hiddenbydefault.status &&
            this.state.commentsAreVisible ?
              <Button style={ styles.hideComments } onClick={ this.onHideCommentsClick.bind(this) }>Hide comments</Button>
            : null
          }
        </div>

        {

            <div style={ [styles.sandBox, (hideComments ? {display:'none'}:{})] }>
              {guidelines}
              <CommentBox />
              <StreamTabs />
              <Stream />
            </div>

        }
        {
            hideComments &&
            <Button style={styles.showComments} onClick={ this.onClickToReadClick.bind(this) }>
                <Icon name="comment" /> Show Comments.
            </Button>
        }
      </div>
    );
  }
}

// same as the @connect decorator above
export default Preview;

var styles = {
  preview: {
    background: 'white',
    padding: '0px 40px 40px 40px',
    color: '#3d3d3d',
    minHeight: '500px',
    width:'65%',
    display:'inline-block',
    overflowY: 'auto',
    [mediaQueries.tablet]: {
      'float': 'none',
      width: '100%',
      height: 'auto',
      padding: '20px 20px 120px 20px'
    }
  },
  previewIcon: {
    marginTop: '-10px',
    marginRight: '10px'
  },
  showComments: {
    float:'right'
  },
  sandBoxIntro: {
    padding: '20px',
    color: '#AAA',
    textAlign: 'center',
    fontSize: '11pt'
  },
  previewBar: {
    position: 'relative',
    fontSize: '16pt',
    paddingBottom: '10px'
  },
  previewTitleSpan: {
    fontFamily: themes.default.fontFamily,
    fontWeight: '300',
    fontSize: '24pt'
  },
  hideComments: {
    position: 'absolute',
    right: '0px',
    top: '0px',
    [mediaQueries.mobile]:{
      position:'static',
      float:'right'
    }
  },
  guidelines: {
    width:'90%',
    padding: 10,
    lineHeight: '1.1',
    color: '#222',
    marginBottom: '20px'
  },
  communityNorms: {
    marginLeft:20
  }
};
