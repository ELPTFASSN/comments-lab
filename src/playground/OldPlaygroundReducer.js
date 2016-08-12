import * as types from 'playground/OldPlaygroundActions';

// These files could be moved somewhere else, as config files.
import togglerGroups from 'playground/playgroundOptions';
import comments from 'playground/playgroundComments';
import topics from 'playground/playgroundTopics';

const initialState = {
  customizerIsVisible: false,
  currentSidebarTopic: null,
  pulseAnimation: false,
  pulseTarget: '',
  followedUsers: [],
  blockedUsers: [],
  playground:{},
  wizardSteps: [
    {
      content: 'Do you think users should be able to remain anonymous (using a nickname)?',
      yesLabel: 'Yes',
      noLabel: 'No',
      affectedGroup: 'privacy',
      affectedToggler: 'anonymity'
    },
    {
      content: 'Should rich content (bold, italics, links) be allowed inside comments?',
      yesLabel: 'Yes',
      noLabel: 'No',
      affectedGroup: 'content',
      affectedToggler: 'rich_content'
    }
  ],
  users: [
    {
      nickName: 'bogususer123',
      realName: 'Bogus Jones',
      party: 'republican',
      comments: 1912,
      points: 1244,
      membershipAge: '2 years',
      location: 'Denver, AR',
      education: 'B.S. Computer Science',
      upvoteBalance: 89,
      badges: [
        {
          name: 'Author',
          icon: 'author',
          color: '#777'
        }
      ]
    },
    {
      nickName: 'republicantrout',
      realName: 'Donald Trout',
      party: 'republican',
      comments: 243,
      points: 124,
      membershipAge: '2 years',
      location: 'Portland, OR',
      education: 'Ph. D. Economics',
      upvoteBalance: 42,
      badges: [
        {
          name: 'Author',
          icon: 'author',
          color: '#777'
        },
        {
          name: 'Expert moderator',
          icon: 'moderator',
          color: '#777'
        }
      ]
    },
    {
      nickName: 'satanicverses',
      realName: 'Salmon Rushdie',
      party: 'democrat',
      anonymous: true,
      comments: 110,
      points: 244,
      membershipAge: '1 year',
      location: 'New York, NY',
      education: 'Ph. D. Arts History',
      upvoteBalance: 22,
      badges: [
        {
          name: 'Expert moderator',
          icon: 'moderator',
          color: '#777'
        }
      ]
    },
    {
      nickName: 'nobeyonce',
      realName: 'Tuna Turner',
      comments: 124,
      party: 'democrat',
      points: 124,
      membershipAge: '6 years',
      location: 'Seattle, WA',
      education: 'B.A. Popular music',
      upvoteBalance: 42,
      badges: [
        {
          name: 'Expert moderator',
          icon: 'moderator',
          color: '#777'
        }
      ]
    }
  ]
};

initialState.togglerGroups = togglerGroups;
initialState.comments = comments;
initialState.topics = topics;

// Uses the parents list to traverse the
// comments array recursively
function findComment(comments, parents, i) {
  if (parents && i < (parents.length - 1)) {
    return findComment(comments[parents[i]].replies, parents, i + 1);
  } else {
    return comments[parents[i]];
  }
}

const playground = (state = initialState, action) => {

  switch (action.type) {

  case types.FOLLOW_USER:
    var followedUsersCopy = state.followedUsers.slice();
    followedUsersCopy.push(action.user);
    return Object.assign({}, state, { followedUsers: followedUsersCopy });

  case types.BLOCK_USER:
    var blockedUsersCopy = state.blockedUsers.slice();
    blockedUsersCopy.push(action.user);
    return Object.assign({}, state, { blockedUsers: blockedUsersCopy });

  case types.SHOW_CUSTOMIZER:
    return Object.assign({}, state, { customizerIsVisible: true });

  case types.HIDE_CUSTOMIZER:
    return Object.assign({}, state, { customizerIsVisible: false });

  case types.UPVOTE_COMMENT:
    var commentsCopy = state.comments.slice();
    var repliedComment = findComment(commentsCopy, action.parents, 0);
    if (repliedComment.downvoted) {
      repliedComment.upvoted = false;
      repliedComment.downvoted = false;
      repliedComment.upvotes++;
    } else if (!repliedComment.upvoted) {
      repliedComment.upvoted = true;
      repliedComment.downvoted = false;
      repliedComment.upvotes++;
    }
    return Object.assign({}, state, { comments: commentsCopy });

  case types.DOWNVOTE_COMMENT:
    var commentsCopy = state.comments.slice();
    var repliedComment = findComment(commentsCopy, action.parents, 0);
    if (repliedComment.upvoted) {
      repliedComment.upvoted = false;
      repliedComment.downvoted = false;
      repliedComment.upvotes--;
    } else if (!repliedComment.downvoted) {
      repliedComment.upvoted = false;
      repliedComment.downvoted = true;
      repliedComment.upvotes--;
    }
    return Object.assign({}, state, { comments: commentsCopy });

  case types.LIKE_COMMENT:
    var commentsCopy = state.comments.slice();
    var repliedComment = findComment(commentsCopy, action.parents, 0);
    repliedComment.liked = true;
    repliedComment.likes++;
    return Object.assign({}, state, { comments: commentsCopy });

  case types.UNLIKE_COMMENT:
    var commentsCopy = state.comments.slice();
    var repliedComment = findComment(commentsCopy, action.parents, 0);
    repliedComment.liked = false;
    repliedComment.likes--;
    return Object.assign({}, state, { comments: commentsCopy });

  case types.SET_TOPIC:
    return Object.assign({}, state, { currentSidebarTopic: action.topic });

  case types.SET_TOGGLER:

    var toggleGroupsUpdater = {};
    toggleGroupsUpdater[action.groupIndex] = { togglers: state.togglerGroups[action.groupIndex].togglers };
    toggleGroupsUpdater[action.groupIndex].togglers[action.togglerIndex].status = action.status;

    var animate = false;
    var target = "";
    if (action.status && state.togglerGroups[action.groupIndex].togglers[action.togglerIndex].pulseTarget) {
      animate = true,
      target = state.togglerGroups[action.groupIndex].togglers[action.togglerIndex].pulseTarget;
    }

    return Object.assign({}, state, { toggleGroups: toggleGroupsUpdater, pulseAnimation: animate, pulseTarget: target });

  case types.DELETE_COMMENT:

    var commentsCopy = state.comments.slice();
    var repliedComment = findComment(commentsCopy, action.parents, 0);
    var commentsFilter = commentsCopy.filter(function(item){ return item != repliedComment })

    return Object.assign({}, state, { comments: commentsFilter });

  case types.REPLY_COMMENT:

    var commentsCopy = state.comments.slice();
    var repliedComment = findComment(commentsCopy, action.parents, 0);
    if (!repliedComment.replies) repliedComment.replies = [];
    repliedComment.replies.push(action.comment);

    return Object.assign({}, state, { comments: commentsCopy });

  case types.SEND_COMMENT:
    var commentsCopy = state.comments.slice();
    return Object.assign({}, state, { comments: [ action.comment, ...commentsCopy ] });

  case types.START_PULSATING:
    return Object.assign({}, state, { pulseAnimation: true, pulseTarget: action.target });

  case types.STOP_PULSATING:
    return Object.assign({}, state, { pulseAnimation: true, pulseTarget: action.target });

  default:
    console.log('Not a Playground action:', action.type);
    return state;
  }

  return state;

};

export default playground;
