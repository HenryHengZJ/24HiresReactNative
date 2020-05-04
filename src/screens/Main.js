
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  Animated,
  Image,
  BackHandler,
  DeviceEventEmitter,
  AsyncStorage,
  Linking ,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import { NavigationActions, StackActions } from 'react-navigation';
import SocketIOClient from 'socket.io-client';
import DeviceInfo from 'react-native-device-info'; 

import axios from 'axios';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import firebase from 'react-native-firebase'
import apis from '../styles/apis';
import deviceStorage from '../helpers/deviceStorage';
import LoggedOut from './LoggedOut';
import LoggedInTabNavigator from '../navigators/LoggedInTabNavigator';

/*const navigateToTabsAction = NavigationActions.navigate({
  routeName: 'LoggedIn',
});

const navigateToLoggedOut = NavigationActions.navigate({
  routeName: 'LoggedOut',
});*/

const appsVersion = DeviceInfo.getVersion();
const appsBuildNumber = DeviceInfo.getBuildNumber();

const navigateToTabsAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'LoggedIn'})
  ] 
})

const navigateToEmployerTabsAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'EmployerLoggedInTabNavigator'})
  ] 
})

const navigateToLoggedOut = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'LoggedOut'})
  ] 
})


class Main extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {transparentHeaderStyle},
    headerTransparent: true,
    headerTintColor: colors.white,
   
  });
 
  constructor(props) {
    super(props);
    this.state = {
      springVal: new Animated.Value(0.8),
      fadeVal: new Animated.Value(1),
    };

    console.disableYellowBox = true;
    this.socket = SocketIOClient('http://mongodb.24hires.com:3001');

  }

  spring = (authenticated, update, AndroidUpdateType, userrole) => {
  
    Animated.sequence([
      Animated.spring(this.state.springVal, {
        toValue: 0.6,
        friction: 10,
        tension: 50
      }),
      Animated.parallel([
        Animated.spring(this.state.springVal, {
          toValue: 17.5,
          friction: 70,
          tension: 350
        }),
        Animated.timing(this.state.fadeVal, {
          toValue: 0,
          duration: 200,
        })
      ])
    ]).start(() =>
    {
      this.props.setSocket(this.socket);
      this.authFirebaseListener && this.authFirebaseListener();
      update?  this.props.navigation.navigate({
        routeName: 'UpdateView',
        params: {
          type: AndroidUpdateType,
        },
      })  
      :
      authenticated ? userrole === 'employer' ? this.props.navigation.dispatch(navigateToEmployerTabsAction) : this.props.navigation.dispatch(navigateToTabsAction): this.props.navigation.dispatch(navigateToLoggedOut)
    });
  }


  loadAppVersion = (authenticated, userrole) => {
    var url = apis.GETAppsVersion_BASEURL;

    axios.get(url)
    .then((response) => {

      console.log("data = " + JSON.stringify(response.data) );

      var AndroidUpdateType = response.data[0].AndroidUpdateType;
      var AndroidVersion = response.data[0].AndroidVersion;

     // alert('appsVersion = ' + appsVersion + '\n' + 'appsBuildNumber = ' + appsBuildNumber)

      if (appsVersion == AndroidVersion) {
        //Promot user to update apps
        this.spring(authenticated, true, AndroidUpdateType, userrole);
      }
      else {
        this.spring(authenticated, false, null, userrole);
      }

    })
    .catch((error) => {
      console.log(error);
      this.spring(authenticated, false, null, userrole);
    });
  }


  /*_deleteInitialState = async () => {
    try{
      await AsyncStorage.removeItem('jwttoken')
      .then(
        () => {
          this.spring(true, false, null, null);
        }
      );
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  };*/

  _loadInitialState = async (setJWT, setUID) => {
    try {
      const jwtvalue = await AsyncStorage.getItem('jwttoken');
      const useridvalue = await AsyncStorage.getItem('userid');
      const userrole = await AsyncStorage.getItem('role');
      if (jwtvalue !== null && useridvalue !== null  && userrole !== null) {
       
        setUID(useridvalue);
        setJWT(jwtvalue);
        this.loadAppVersion(true, userrole);
        
      } else {
        this.getNewJWT();
      }
    } catch (error) {
      alert('AsyncStorage Error: ' + error.message);
      this.getNewJWT();
    }
  };

  getNewJWT = () => {
    const { setJWT, setUID, navigation } = this.props;
  
    this.authFirebaseListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userid = user.uid;
        user.getIdToken().then((data) => {
          var jwturl = apis.AUTH_BASEURL+data;
          //Linking.openURL("mailto:?to=support@24hires.com&subject=Feedback&body=\n\n\n\n\nSent from " + jwturl + "\n" );
          axios.get(jwturl)
          .then((response) => {
            deviceStorage.saveItem("jwttoken", response.data.jwt);
            deviceStorage.saveItem("userid", userid);
            deviceStorage.saveItem("userrole", "jobseeker");
            setJWT(response.data.jwt)
            setUID(userid)
            this.loadAppVersion(true, "jobseeker");
          })
          .catch((error) => {
            this.loadAppVersion(false, "jobseeker");
          });
        });
  
      } else {
        this.loadAppVersion(false, "jobseeker");
      }
    });
  }


  componentWillMount() {

    const { setJWT, setUID} = this.props;

    this._loadInitialState(setJWT, setUID).done();

  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
 }

  render() {

      return (

        <View style={styles.wrapper}>

        <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />

          <View style={styles.center}>
            <Animated.Image
              style={{
                height: 180,
                width: 180,
                
                opacity: this.state.fadeVal,
                transform: [{ scale: this.state.springVal }]
                
              }}
              source={require('../img/splash_logo.png')}
            >
             
            </Animated.Image>
          </View>
        </View>

      ); // Render loading/splash screen etc
  

  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingBackgroundStyle: {
    backgroundColor: colors.themeblue,
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.themeblue
  },
  center: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  introText: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold"
  },
  introImage: {
    height: 100,
    width: 100
  }
});

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

Main.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  setSocket: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

