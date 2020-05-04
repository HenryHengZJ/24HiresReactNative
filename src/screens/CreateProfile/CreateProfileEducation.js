
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
import styles from './styles/CreateProfileEducation';
import { NavigationActions } from 'react-navigation';

const loginPhoto = require('../../img/loginphoto_blurred.png');
const androidbackIcon = require('../../img/android_back_white.png');
const iosbackIcon = require('../../img/ios_back_white.png');

class CreateProfileEducation extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavBarButton
      handleButtonPress={() => navigation.navigate('CreateProfileLanguage',
      {
        birth: navigation.getParam('birth'),
        workexp: navigation.getParam('workexp'),
      })}
      location="right"
      color={colors.white}
      text="Skip"
    />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      validEducation: false,
      education: '',
      loadingVisible: false,
    };

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleEducationChange = this.handleEducationChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  handleNextButton = (navigation, birth, workexp ) => {
    Keyboard.dismiss();
  //  this.setState({ loadingVisible: true });
    const { logIn } = this.props;
    const { navigate } = navigation;

    const { education } = this.state;

    navigate('CreateProfileLanguage', {
      birth: birth,
      workexp: workexp,
      education: education,
    });

  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  handleEducationChange(education) {

    this.setState({  education: education, });

    if (education != "") {
      this.setState({ 
        validEducation: true,
      });
    } 
    else {
      this.setState({ 
        validEducation: false,
       });
    }
  }

 
  toggleNextButtonState() {
    const { validEducation } = this.state;
    if (validEducation) {
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
      formValid, loadingVisible, validEducation,
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;

    const { navigation } = this.props;
    const birth = navigation.getParam('birth');
    const workexp = navigation.getParam('workexp');

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
              Where's your school and education level?
            </Text>
            <InputField
              labelText="EDUCATION"
              labelTextSize={14}
              labelColor={colors.white}
              inputType="text"
              textColor={colors.white}
              borderBottomColor={colors.white}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleEducationChange}
              showCheckmark={false}
              multiline={true}
            />

          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton.bind(this, 
              this.props.navigation, 
              birth,
              workexp,)}
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


CreateProfileEducation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default CreateProfileEducation;
