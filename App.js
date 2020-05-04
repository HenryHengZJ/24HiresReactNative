

import React, { Component } from 'react';
import { 
  StatusBar,   
  BackHandler,
  Platform,
  DeviceEventEmitter,
  AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { Root, configureStore} from './src/navigators/AppNavigator';
import CreateProfileBirthDate from './src/screens/CreateProfile/CreateProfileBirthDate';


StatusBar.setBarStyle('light-content', true);


class App extends Component {

  render() {
    return (
      <Provider store={configureStore({})}>
        <Root />
      </Provider>
       //<CreateProfileBirthDate/>
      );
    }
}

AppRegistry.registerComponent('App', () => App);

export default App;