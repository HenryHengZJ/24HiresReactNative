
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Keyboard,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../redux/actions';
import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';
import InputField from '../../components/form/InputField';
import SignUpButton from '../../components/buttons/SignUpButton';
import Notification from '../../components/Notification';
import VerificationModal from '../../components/VerificationModal';
import Loader from '../../components/Loader';
import NavBarButton from '../../components/buttons/NavBarButton';
import styles from './styles/CreateProfileEmail';
import firebase from 'react-native-firebase';
import {NavigationActions, StackActions} from 'react-navigation';  
import apis from '../../styles/apis';
import axios from 'axios';   

const loginPhoto = require('../../img/loginphoto_blurred.png');

const logOutAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'LoggedOut'})
  ] 
})

class CreateProfileEmail extends Component {
  static navigationOptions = ({ navigation }) => ({
 
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      validEmail: false,
      emailAddress: '',
      password: '',
      validPassword: false,
      loadingVisible: false,
      showVerificationModal: false,
      user: null,
    };
   
    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener() 
 }

  componentWillMount() {

    this.authFirebaseListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.

        if(!user.emailVerified) {

          user.updateProfile({
            displayName: "NewUser",
          }).then(() => {

            user.updateEmail(this.state.emailAddress).then(() => {
              // Update Email successful.
      
              user.updatePassword(this.state.password).then(() => {
                // Update Password successful.
                
              }).catch((error) => {
                // An error happened.
              });
      
            }).catch((error) => {
              // An error happened.
            });

            this.setState(
              { user: user,}
              , () => {
                this.getJWT(user);
            });

          }).catch((error) => {
            // An error happened.
            alert("error 3" + error)
            this.setState({ loadingVisible: false, showNotification: true });
          });

        }
      } 
    });
  }

  handleNextButton = (navigation, firstName, lastName) => {
    Keyboard.dismiss();
    this.setState({ loadingVisible: true });
    const { navigate } = navigation;

    const { emailAddress, password } = this.state;

    var dataToSave = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      password: password,
    }

    this.createAccount(dataToSave);
  }

  createAccount = (dataToSave) => {

    firebase.auth().createUserWithEmailAndPassword(dataToSave.emailAddress, dataToSave.password)
    .catch((error) => {
      alert("error 2" + error)
      this.setState({ showNotification: true, loadingVisible: false,});
    });
  }

  getJWT = (user) => {
    user.getIdToken().then((data) => {
      var jwturl = apis.AUTH_BASEURL+data;
      axios.get(jwturl)
        .then((response) => {
          this.postAccount(user, response.data.jwt);
        })
        .catch((error) => {
          alert("error 3 = " +error)
          this.setState({ showNotification: true, loadingVisible: false, });
        });
    });
  }

  postAccount = (user, jwtToken) => {

    const { navigation } = this.props;
    const firstName = navigation.getParam('firstName');
    const lastName = navigation.getParam('lastName');

    const { emailAddress } = this.state;

    var userAcc = {
      userid: user.uid,
      name: firstName + " " + lastName,
      email: emailAddress,
      provider: "email"
    };

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var createuserurl = apis.GETUser_BASEURL + "userid=" + user.uid;
    axios.post(createuserurl, userAcc, { headers: headers } )
    .then((response) => {
      console.log(response);
      if (response.status === 201) {
        this.sendEmailVerification(user);
      }
    })
    .catch((error) => {
      alert("error 4" + error);
      this.setState({ loadingVisible: false, showNotification: true });
    });
  }

  sendEmailVerification = (user) => {
    user.sendEmailVerification().then(() => {
      // Email sent.
      this.setState({ loadingVisible: false, showVerificationModal: true });

    }).catch((error) => {
      // An error happened.
      alert("error 1" + error)
      this.setState({ loadingVisible: false, showNotification: true });
    });
  }

  onOKPressed = async(navigation) => {

    this.setState({ showVerificationModal: false }, async() => {
      this.authFirebaseListener && this.authFirebaseListener() 
      try {
        await firebase.auth().signOut();
        navigation.dispatch(logOutAction);
      }
      catch (e) {
        console.log(e);
      }
    });
  }


  onResendPressed =(navigation, user) => {
    this.setState(
      { loadingVisible: true, showVerificationModal: false}
      , () => {
        this.sendEmailVerification(user);
    });
  }


  handleCloseNotification() {
    this.setState({ showNotification: false });
  }

  handleEmailChange(email) {
    // eslint-disable-next-line
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({ emailAddress: email });

    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: false });
    }
  }

  handlePasswordChange(password) {
    const { validPassword } = this.state;

    this.setState({ password });

    if (!validPassword) {
      if (password.length > 4) {
        // Password has to be at least 4 characters long
        this.setState({ validPassword: true });
      }
    } else if (password <= 4) {
      this.setState({ validPassword: false });
    }
  }

  toggleNextButtonState() {
    const { validEmail, validPassword } = this.state;
    if (validEmail && validPassword) {
      return false;
    }
    return true;
  }


  render() {
    const {
      showNotification, loadingVisible, validEmail, validPassword, showVerificationModal, user,
    } = this.state;
    const notificationMarginTop = showNotification ? 10 : 0;

    const { navigation } = this.props;
    const firstName = navigation.getParam('firstName');
    const lastName = navigation.getParam('lastName');

    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: 'black' }, styles.wrapper]}
      >

       <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

        <View style={styles.scrollViewWrapper}>
          <ScrollView 
            keyboardShouldPersistTaps='handled'
            style={styles.scrollView}>
            <Text style={styles.loginHeader}>
              Email and Password
            </Text>
            <InputField
              labelText="EMAIL ADDRESS"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleEmailChange}
              showCheckmark={validEmail}
            />
            <InputField
              labelText="PASSWORD"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="password"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handlePasswordChange}
              showCheckmark={validPassword}
            />

          </ScrollView>
          <SignUpButton
            handleNextButton={this.handleNextButton.bind(this, this.props.navigation, firstName, lastName)}
            disabled={this.toggleNextButtonState()}
          />
        </View>
        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />

        <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine = "User already exists"
            secondLine="Please try another email."
          />
        </View>

        <VerificationModal
          modalVisible={showVerificationModal}
          animationType="fade"
          txtmsg={"An email will be sent to your registered email address. Please verify it before logging in."}
          handleOnPress={this.onOKPressed.bind(this, this.props.navigation)}
          handleOnResendPress={this.onResendPressed.bind(this, this.props.navigation, user)}
        />

        </ImageBackground>

      </KeyboardAvoidingView>
    );
  }
}

CreateProfileEmail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default CreateProfileEmail;
