import React from 'react';
import { Switch, Route } from 'react-router-dom'

import HomePage from './pages/homepage/HomePage';
import ShopPage from './pages/shoppage/ShopPage';
import Header from './components/header/Header';
import SingInUpPage from './pages/singIn-singUp-page/SingInUpPage';
import { auth, createUserProfileDocument } from './firebase/firebase.utils'
import { connect } from 'react-redux'
import { setCurrentUser } from './redux/user/user.actions'
import './App.css'

class App extends React.Component {
  
  unsubcribeFromAuth = null

  componentDidMount() {
    const {setCurrentUser} = this.props; 

    this.unsubcribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot(snapShot => {
          setCurrentUser ({
              id: snapShot.id,
              ...snapShot.data()
            })
        });
      }
      setCurrentUser(userAuth)
    })
  }
  componentWillUnmount() {
    this.unsubcribeFromAuth()
  }

  render() {
    return (
      <div>
      <Header />
      <Switch>
      <Route exact path='/' component={HomePage}/>
      <Route path='/shop' component={ShopPage}/>
      <Route path='/signin' component={SingInUpPage}/>
      </Switch>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})
export default connect(null, mapDispatchToProps)(App);
