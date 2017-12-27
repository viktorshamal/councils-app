import express from 'express';
import fetch from 'node-fetch'

import App from './App';
import React from 'react';

import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux'
import { ServerStyleSheet } from 'styled-components'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { ApolloClient} from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'

import {
  groups as groupsReducer,
  auth as authReducer,
  auth0 as auth0Reducer
} from './reducers'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', render)

  
async function render(req, res) {
  const context = {};

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: "http://localhost:60000/simple/v1/cjbmhx6xj000f01017jpsysx8",
      fetch: fetch,
      opts: {
        credentials: 'same-origin',
        headers: req.headers
      }
    }),
    cache: new InMemoryCache()
  })

  const store = createStore(
    combineReducers({
      groups: groupsReducer,
      auth: authReducer,
      auth0: auth0Reducer
    }),
    {
      // initial state
      auth: req.user
    }
  )

  const sheet = new ServerStyleSheet()

  const app = sheet.collectStyles(
    <Provider store={store}>
      <ApolloProvider client={client} store={store}>
        <StaticRouter location={req.url} context={{}}>
          <App />
        </StaticRouter>
      </ApolloProvider>
    </Provider>
  )

  const markup = await renderToStringWithData(app)

  const initialState = JSON.stringify(client.extract()).replace(/</g, '\\u003c')

  if (context.url) {
    res.redirect(context.url);
  } else {
    res.status(200).send(
      `<!doctype html>
        <html lang="">
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>Welcome to Razzle</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${assets.client.css
              ? `<link rel="stylesheet" href="${assets.client.css}">`
              : ''}
            ${sheet.getStyleTags()}
            <script>window.__APOLLO_STATE__ = ${initialState}</script>
            ${process.env.NODE_ENV === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`}
        </head>
        <body>
            <div id="root">${markup}</div>
        </body>
    </html>`
    );
  }
}

export default server;
