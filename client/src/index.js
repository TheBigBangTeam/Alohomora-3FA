import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { BrowserRouter, Route } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './rootReducer'
import { userLoggedIn } from './actions/auth'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

if (localStorage.alohomoraLog) {
  const user = {
    email: localStorage.alohomoraLog
  }
  store.dispatch(userLoggedIn(user))
}

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Route component={App} />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)

registerServiceWorker()
