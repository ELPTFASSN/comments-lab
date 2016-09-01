'use strict';
// React Core
import React from 'react';
import ReactDOM from 'react-dom';
// React Router
import { browserHistory, Router, Route, Redirect } from 'react-router';
// React Redux
import { Provider } from 'react-redux';
// Redux Devtools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import configureStore from 'store.js';
//import { configXenia, configError } from 'app/AppActions';

// import Dashboard from './containers/Dashboard';
//import Login from 'app/Login';
// import DataExplorer from 'app/DataExplorer';
import NoMatch from 'app/NoMatch';

import Playground from 'app/Playground';
import registerServiceWorker from 'serviceworker!./sw.js';
import ga from 'react-ga';

var store;

import messages from 'i18n/messages'; // Lang does not know where did you get your messages from.

import LangSugar from 'i18n/lang';
window.L = new LangSugar();

window.L.addTranslations(messages['en'], 'en');
window.L.addTranslations(messages['de'], 'de');
window.L.addTranslations(messages['es'], 'es');
window.L.setLocale(window.L.locale);

require('reset.css');
require('global.css');

require('react-select.css');
require('react-datepicker.min.css');

require('../fonts/glyphicons-halflings-regular.woff');

if ('serviceWorker' in navigator && process && process.env.NODE_ENV === 'production') {
  registerServiceWorker({ scope: '/' }).then(() => {}, () => {});
}

import { Lang } from 'i18n/lang';
@Lang
class Root extends React.Component {

  constructor(props){
    super(props);
    ga.initialize(window.googleAnalyticsId, { debug: (process && process.env.NODE_ENV !== 'production') });
    window.addEventListener('error', e => ga.event({
      category: 'JS Error',
      action: e.message,
      label: e.stack
    }));
  }

  logPageView() {
    ga.pageview(this.state.location.pathname);
  }

  render() {

    return (
      <div>
        <Provider store={store}>
          <Router history={browserHistory} onUpdate={ this.logPageView }>
            <Redirect from="/" to="playground" />
            <Route path="playground" component={Playground}/>
            <Route path="*" component={NoMatch} />
            {/*<Route path="explore" component={DataExplorer} />*/}
          </Router>
        </Provider>
      </div>
    );
  }
}

const loadConfig = (route) => {
  return fetch(route).then(res => res.json());
};

store = configureStore({});

ReactDOM.render(<Root/>, document.getElementById('root'));

// prevent browser from navigating backwards if you hit the backspace key
document.addEventListener('keydown', function (e) {
  var doPrevent = false;
  if (e.keyCode === 8) {
    var d = e.srcElement || e.target;
    if ((d.tagName.toUpperCase() === 'INPUT' &&
      (
        d.type.toUpperCase() === 'TEXT' ||
        d.type.toUpperCase() === 'PASSWORD' ||
        d.type.toUpperCase() === 'FILE' ||
        d.type.toUpperCase() === 'EMAIL' ||
        d.type.toUpperCase() === 'SEARCH' ||
        d.type.toUpperCase() === 'DATE' )
      ) || d.tagName.toUpperCase() === 'TEXTAREA') {
      doPrevent = d.readOnly || d.disabled;

    } else {
      doPrevent = true;
    }
  }

  if (doPrevent) {
    e.preventDefault();
  }
});
