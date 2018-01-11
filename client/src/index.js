import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userLoggedIn } from './actions/auth'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

if (localStorage.alohomoraLog) {
  const user = {
    user: JSON.parse(localStorage.alohomoraLog),
    token: localStorage.alohomoraToken
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
