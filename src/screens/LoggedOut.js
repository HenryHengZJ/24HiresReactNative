
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  ImageBackground,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { GoogleSignin } from 'react-native-google-signin';
import RNExitApp from 'react-native-exit-app';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';

import colors from '../styles/colors';
import apis from '../styles/apis';
import transparentHeaderStyle from '../styles/navigation';
import styles from './styles/LoggedOut';
import firebase from 'react-native-firebase';
import deviceStorage from '../helpers/deviceStorage';
import Loader from '../components/Loader';
import RoundedButton from '../components/buttons/RoundedButton';
import NavBarButton from '../components/buttons/NavBarButton';
import Notification from '../components/Notification';

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
  LoginButton,
  LoginManager,
} = FBSDK;

const appsLogo = require('../img/splash_logo.png');
const loginPhoto = require('../img/loginphoto.png');

const navigateToLogin = NavigationActions.navigate({
  routeName: 'LogIn',
});

const navigateToLoggedIn = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'LoggedIn'})
  ] 
})

class LoggedOut extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavBarButton 
                  handleButtonPress={() => 
                    navigation.dispatch(navigateToLogin)
                  } 
                  location="right" color={colors.white} text="Log In" />,
    headerLeft: <NavBarButton 
                  handleButtonPress={() => 
                    RNExitApp.exitApp()
                  } 
                  location="left" icon={<MaterialIcon name="clear" color={colors.white} size={25} />} />,
          
    headerStyle: {transparentHeaderStyle},
    headerTransparent: true,
    headerTintColor: colors.white,
   
  });

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      errortype: "",
      loadingVisible: false,
    };

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
  }

  componentDidMount() {
    GoogleSignin.configure({
      iosClientId: '848133085531-lb8e5k8lulv3tb63c8baegd2bg8g560v.apps.googleusercontent.com', //only for IOS
    })
    .then((currentUser) => {
      console.log("iOS GoogleSignin");
    })
  }

  onFacebookPress = (navigation) => {

    this.setState({ loadingVisible: true });
  
    console.log("onFacebookPress PRESSED");
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithReadPermissions(['email','public_profile'])
      .then((result) => {
        if (result.isCancelled) {
          this.setState({ loadingVisible: false });
          return Promise.reject(new Error('User cancelled request'));
        } else {
          //alert('Login success with permissions: ' +result.grantedPermissions.toString());
          return AccessToken.getCurrentAccessToken();
        }
      })
      .then(data => {
          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
          return firebase.auth().signInWithCredential(credential);
      })
      .then((currentUser) => {
          console.log("Facebook Login with user : " + JSON.stringify(currentUser.toJSON()));
          currentUser.getIdToken().then((data) => {
            var jwturl = apis.AUTH_BASEURL+data;
            axios.get(jwturl)
            .then((response) => {
              deviceStorage.saveItem("jwttoken", response.data.jwt);
              deviceStorage.saveItem("userid", currentUser.uid);
              this.props.setJWT(response.data.jwt)
              this.props.setUID(currentUser.uid)
             
              this.checkUserExist(currentUser, response.data.jwt)
             
            })
            .catch((error) => {
              //alert("onFacebookPress2" + error)
              this.setState({ showNotification: true, loadingVisible: false, errortype: "facebook" });
            });
          });

      })
      .catch((error) => {
        alert("onFacebookPress1" + error)

          this.setState({ showNotification: true, loadingVisible: false,  errortype: "facebook"});
      });
  }
  

  onGooglePress = (navigation) => {

    console.log("onGooglePress PRESSED");

    this.setState({ loadingVisible: true });
 
    // Attempt a login using the Google login dialog asking for default permissions.
      GoogleSignin.signIn()
      .then(data => {
          const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
          return firebase.auth().signInWithCredential(credential);
      })
      .then((currentUser) => {
          console.log("Google Login with user : " + JSON.stringify(currentUser.toJSON()));
          currentUser.getIdToken().then((data) => {
            var jwturl = apis.AUTH_BASEURL+data;
            axios.get(jwturl)
            .then((response) => {
              deviceStorage.saveItem("jwttoken", response.data.jwt);
              deviceStorage.saveItem("userid", currentUser.uid);
              this.props.setJWT(response.data.jwt)
              this.props.setUID(currentUser.uid)
             
              this.checkUserExist(currentUser, response.data.jwt)
             
            })
            .catch((error) => {
             // alert("GoogleSignin2" + error)
             // Linking.openURL("mailto:?to=support@24hires.com&subject=Feedback&body=\n\n\n\n\nSent from " + jwturl + "\n" );
              this.setState({ showNotification: true, loadingVisible: false, errortype: "google" });
            });
          });
      })
      .catch((error) => {
        alert("GoogleSignin1" + error)
          this.setState({ showNotification: true, loadingVisible: false,  errortype: "google"});
      });
  }

  onSkipPress = (navigation) => {
    //alert('Create Account button pressed');
    this.setState({ loadingVisible: true });
    firebase.auth().signInAnonymously()
    .catch((error) => {
        alert("onSkipPress" + error)
        this.setState({ showNotification: true, loadingVisible: false,  errortype: ""});
    });
  }

  componentWillMount() {

    const { setJWT, setUID, navigation } = this.props;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Detect anonymous user sign in.
        var isAnonymous = user.isAnonymous;
     
        if (isAnonymous) {

          user.getIdToken().then((data) => {
          var jwturl = apis.AUTH_BASEURL+data;
          axios.get(jwturl)
            .then((response) => {
              deviceStorage.saveItem("jwttoken", response.data.jwt);
              deviceStorage.saveItem("userid", user.uid);
              setJWT(response.data.jwt)
              setUID(user.uid)
              this.setState({ 
                loadingVisible: false 
              }, () => {
                navigation.dispatch(navigateToLoggedIn)
              }); 
            })
            .catch((error) => {
              this.setState({ showNotification: true, loadingVisible: false, errortype: "" });
            });
          });
        }
      } 
    });
  }

  
  handleCloseNotification() {
    this.setState({ showNotification: false });
  }

  checkUserExist = (user, jwtToken) => {

    const { navigation } = this.props;

    var userid = user.uid;
    
    var url = apis.GETUser_BASEURL+'&userid__equals='+ userid;

    axios.get(url)
    .then((response) => {
      //if user exists
      if (response.data.length > 0) {
        this.setState({ 
          loadingVisible: false 
        }, () => {
          navigation.dispatch(navigateToLoggedIn)
        })
      }
      //if user not exists
      else {
        this.postAccount(user, jwtToken);
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({ 
        loadingVisible: false , showNotification: true
      }); 
      
    });
  
  }

  postAccount = (user, jwtToken) => {

    const { navigation } = this.props;

    var usersocialId = user.providerData[0].uid;
    var usersocialEmail = user.providerData[0].email
    var usersocialName = user.providerData[0].displayName
    var usersocialProviderId = user.providerData[0].providerId
    var usersocialPhotoUrl =  user.providerData[0].photoURL
    var profilepicurl;

    if (usersocialProviderId.indexOf("facebook") >= 0) {
      usersocialProviderId = "facebook"
      profilepicurl = "https://graph.facebook.com/" + usersocialId + "/picture?type=large&width=1080";
    }
    else if (usersocialProviderId.indexOf("google") >= 0) {
      usersocialProviderId = "Google"
      profilepicurl = usersocialPhotoUrl.replace(/s96-c/,"/s300-c/");                    
    }

    var userfirebaseId = user.uid;

    var userAcc = {
      userid: userfirebaseId,
      name: usersocialName,
      email: usersocialEmail,
      provider: usersocialProviderId,
      profileimage: profilepicurl,
    };

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var createuserurl = apis.GETUser_BASEURL + "userid=" + userfirebaseId;
    axios.post(createuserurl, userAcc, { headers: headers } )
    .then((response) => {
      console.log(response);
      if (response.status === 201) {
        this.setState({ 
          loadingVisible: false 
        }, () => {
          navigation.dispatch(navigateToLoggedIn)
        })
      }
    })
    .catch((error) => {
      this.setState({ loadingVisible: false, showNotification: true });
    });
  }


  render() {

    const { navigate } = this.props.navigation;

    const {
      showNotification,
      errortype,
      loadingVisible,
    } = this.state;

    const notificationMarginTop = showNotification ? 10 : 0;
    
    return (

      <KeyboardAvoidingView
        style={{display: 'flex', flex: 1, }}
        behavior="padding"
      >

      <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

      <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />

      <ScrollView style={styles.wrapper}>
        <View style={styles.welcomeWrapper}>
          <Image
            source={appsLogo}
            style={styles.logo}
          />

          <Text style={styles.welcomeText}>
            Welcome to 24Hires.
          </Text>

          <RoundedButton
            text="Continue with Facebook"
            textColor={colors.white}
            background={colors.facebookblue}
            icon={<Icon name="facebook" size={20} style={styles.facebookButtonIcon} />}
            handleOnPress={this.onFacebookPress.bind(this, this.props.navigation)}
            
          />

          <RoundedButton
            text="Continue with Google"
            textColor={colors.white}
            background={colors.googlered}
            icon={<Icon name="google-plus" size={20} style={styles.googleButtonIcon} />}
            handleOnPress={this.onGooglePress.bind(this, this.props.navigation)}
          />

          <RoundedButton
            text="Skip"
            textColor={colors.white}
            background={'rgba(0,0,0,0.5)'}
            handleOnPress={this.onSkipPress.bind(this, this.props.navigation)}
          />
        
          <View style={styles.termsAndConditions}>
            <Text style={styles.termsText}>
              By tapping Continue or Create Account,
            </Text>
            <Text style={styles.termsText}>
              {" I agree to 24Hires's "}
            </Text>
            <TouchableOpacity 
              onPress={() => this.props.navigation.navigate("TermsofService")}
              style={styles.linkButton}>
              <Text style={styles.termsText}>
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>
               {" and "}
            </Text>
            <TouchableOpacity 
              onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
              style={styles.linkButton}>
              <Text style={styles.termsText}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              .
            </Text>
          </View>

        </View>
      </ScrollView>

      <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />

      <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine = {(errortype == "facebook") ? "Facebook Login Error" : (errortype == "google") ? "Google Login Error" : "These credentials don't look right."}
            secondLine="Please try again."
          />
      </View>

      </ImageBackground>

      </KeyboardAvoidingView>

    );
  }
}

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

LoggedOut.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoggedOut);