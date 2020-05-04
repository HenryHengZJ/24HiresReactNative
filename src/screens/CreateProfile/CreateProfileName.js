
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
  Platform,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../redux/actions';
import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';
import InputField from '../../components/form/InputField';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import NavBarButton from '../../components/buttons/NavBarButton';
import styles from './styles/CreateProfileName';
import { NavigationActions } from 'react-navigation';

const loginPhoto = require('../../img/loginphoto_blurred.png');
const androidbackIcon = require('../../img/android_back_white.png');
const iosbackIcon = require('../../img/ios_back_white.png');

class CreateProfileName extends Component {
  static navigationOptions = ({ navigation }) => ({
   
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      validFirstName: false,
      firstName: '',
      lastName: '',
      validLastName: false,
      loadingVisible: false,
    };

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.firstnamechange = this.firstnamechange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.lastnamechange = this.lastnamechange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  handleNextButton() {
    Keyboard.dismiss();
  //  this.setState({ loadingVisible: true });
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;

    const { firstName, lastName } = this.state;

    /*setTimeout(() => {
      if (logIn(emailAddress, password)) {
        this.setState({ formValid: true, loadingVisible: false });
        navigate('LoggedIn');
      } else {
        this.setState({ formValid: false, loadingVisible: false });
      }
    }, 2000);*/

    navigate('CreateProfileEmail', {
      firstName: firstName,
      lastName: lastName,
    });
  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  firstnamechange(firstname) {

    this.setState({  firstName: firstname, });

    if (firstname != "") {
      this.setState({ 
        validFirstName: true,
      });
    } 
    else {
      this.setState({ 
        validFirstName: false,
       });
    }
  }

  lastnamechange(lastname) {

    this.setState({  lastName: lastname, });

    if (lastname != "") {
      this.setState({ 
        validLastName: true,
      });
    } 
    else {
      this.setState({ 
        validLastName: false,
       });
    }
  }

  toggleNextButtonState() {
    const { validLastName, validFirstName } = this.state;
    if (validFirstName && validLastName) {
      return false;
    }
    return true;
  }

  renderBackButton() {
    return (
      <TouchableOpacity
          style={{ 
            position:'absolute', 
            left:10, 
            top:20, 
            zIndex:10,
            padding:10, 
            height: 50,
            width: 50,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'transparent'}}
            onPress={() => 
                  this.props.navigation.dispatch(NavigationActions.back())
            }
        >

        <Image
            style={{ 
              height: 15,
              width: 15,
            }}
            source={Platform.OS === 'android' ? androidbackIcon : iosbackIcon}
          />
        
        
        </TouchableOpacity>
    )
  }

  render() {
    const {
      formValid, loadingVisible, validLastName, validFirstName,
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
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
              What's your name?
            </Text>
            <InputField
              labelText="FIRST NAME"
              labelTextSize={14}
              labelColor={colors.white}
              inputType="text"
              textColor={colors.white}
              borderBottomColor={colors.white}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.firstnamechange}
              showCheckmark={validFirstName}
            />
            <InputField
              labelText="LAST NAME"
              labelTextSize={14}
              labelColor={colors.white}
              inputType="text"
              textColor={colors.white}
              borderBottomColor={colors.white}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.lastnamechange}
              showCheckmark={validLastName}
            />

         
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton}
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
            firstLine = "These credentials don't look right."
            secondLine="Please try again."
          />
        </View>

        </ImageBackground>

      </KeyboardAvoidingView>
    );
  }
}

CreateProfileName.propTypes = {
  logIn: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default CreateProfileName;
