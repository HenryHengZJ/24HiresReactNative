
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
import styles from './styles/CreateProfileLanguage';
import { NavigationActions } from 'react-navigation';
import apis from '../../styles/apis';
import axios from 'axios';   

const loginPhoto = require('../../img/loginphoto_blurred.png');
const androidbackIcon = require('../../img/android_back_white.png');
const iosbackIcon = require('../../img/ios_back_white.png');

class CreateProfileLanguage extends Component {
  static navigationOptions = ({ navigation })=> {
    const { params = {} } = navigation.state;
    return {
    headerRight: <NavBarButton
      handleButtonPress={() =>  navigation.state.params.handleHeaderPressed()}
      location="right"
      color={colors.white}
      text="Skip & Finish"
    />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      validLanguage: false,
      language: '',
      loadingVisible: false,
    };

    console.disableYellowBox = true;

    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  componentDidMount() {
    var finaldata = {
      birth: this.props.navigation.getParam('birth'),
      workexp: this.props.navigation.getParam('workexp'),
      education: this.props.navigation.getParam('education'),
    };
    this.props.navigation.setParams({ handleHeaderPressed: this.skipFinishPressed.bind(this, finaldata) });
  }

  handleNextButton = (navigation, birth, workexp, education ) => {
    
    Keyboard.dismiss();
    this.setState({ loadingVisible: true });
    const { logIn } = this.props;
    const { navigate } = navigation;

    const { language } = this.state;

    var finaldata = {
      birth: birth,
      workexp: workexp,
      education: education,
      language: language,
    }

    this.getUserDocumentId(finaldata);

  }

  skipFinishPressed = (finaldata) => {

    Keyboard.dismiss();
    this.setState({ loadingVisible: true });
    this.updateUserProfile(finaldata);
  }

  updateUserProfile = (finaldata) => {

    var userid = this.props.getUserid.userid
    var jwtToken = this.props.getJWTToken.jwttoken;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var updateuserurl = apis.PUTUser_BASEURL + "userid="+ userid;
    axios.put(updateuserurl, finaldata , { headers: headers } )
      .then((response) => {

        if (response.status === 200) {
          this.setState({ showNotification: false, loadingVisible: false }, () => {
            this.props.navigation.navigate('LoggedIn');
          });
        }
        
      })
      .catch((error) => {
       
        this.setState({ loadingVisible: false, showNotification: true });
      });

  }


  handleLanguageChange(language) {

    this.setState({  language: language, });

    if (language != "") {
      this.setState({ 
        validLanguage: true,
      });
    } 
    else {
      this.setState({ 
        validLanguage: false,
       });
    }
  }

 
  toggleNextButtonState() {
    const { validLanguage } = this.state;
    if (validLanguage) {
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
      showNotification, loadingVisible, validLanguage,
    } = this.state;
    
    const { navigation } = this.props;
    const birth = navigation.getParam('birth');
    const workexp = navigation.getParam('workexp');
    const education = navigation.getParam('education');

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
              What languages do you speak and know?
            </Text>
            <InputField
              labelText="LANGUAGES"
              labelTextSize={14}
              labelColor={colors.white}
              inputType="text"
              textColor={colors.white}
              borderBottomColor={colors.white}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleLanguageChange}
              showCheckmark={false}
              multiline={true}
            />

          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton.bind(this, 
              this.props.navigation, 
              birth,
              workexp,
              education,)}
            disabled={this.toggleNextButtonState()}
          />
        </View>

        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />

        
        </ImageBackground>

      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
  getUserid: state.getUserid,
});

CreateProfileLanguage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps)(CreateProfileLanguage);
