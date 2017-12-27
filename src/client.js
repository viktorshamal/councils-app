import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";

import { createStore, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import {
  groups as groupsReducers,
  auth as authReducer,
  auth0 as auth0Reducer
} from './reducers'

const client = new ApolloClient({
  link: createHttpLink({
    uri: "http://localhost:60000/simple/v1/cjbmhx6xj000f01017jpsysx8"
  }),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
})

const store = createStore(
  combineReducers({
    groups: groupsReducers,
    auth: authReducer,
    auth0: auth0Reducer
  }),
  {},
  compose(
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
)

hydrate(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
