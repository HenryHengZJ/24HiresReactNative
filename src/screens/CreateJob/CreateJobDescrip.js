
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
import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';
import InputField from '../../components/form/InputField';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import { NavigationActions } from 'react-navigation';
import { StyleSheet } from 'react-native';
import iPhoneSize from '../../helpers/utils';

const loginPhoto = require('../../img/loginphoto_blurred.png');
const androidbackIcon = require('../../img/android_back_black.png');
const iosbackIcon = require('../../img/ios_back_black.png');

let headingTextSize = 30;
let termsTextSize = 17;
if (iPhoneSize() === 'small') {
  headingTextSize = 26;
  termsTextSize = 16;
}

export default class CreateJobDescrip extends Component {
    static navigationOptions = ({ navigation }) => ({
        header:null,
    
    });

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      validTitle: false,
      title: '',
      descrip: '',
      validDescrip: false,
      loadingVisible: false,
    };

    this.edited = false;

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.titlechange = this.titlechange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.descripchange = this.descripchange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.getParam('edit')){
      navigation.state.params.onEditJobDescripClose( this.edited, this.state.title, this.state.descrip,);
    }
  }

  componentWillMount() {

    const { navigation } = this.props;
   
    const edit = navigation.getParam('edit');
    const title = navigation.getParam('title');
    const descrip = navigation.getParam('descrip');

    
    this.setState({ 
      title: title? title : '',
      descrip:  descrip? descrip : '',
      validTitle: title? true : false,
      validDescrip: descrip? true : false,
    });
    
  }

  handleNextButton() {
    Keyboard.dismiss();
    
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;

    const { title, descrip } = this.state;

    const category = navigation.getParam('category');
    const edit = navigation.getParam('edit');

    if (edit) {
      this.edited = true,
      navigation.goBack();
      return;
    }

    navigate('CreateJobLocation', {
      category: category,
      title: title,
      descrip: descrip,
    });
  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  titlechange(title) {

    this.setState({  title: title, });

    if (title != "") {
      this.setState({ 
        validTitle: true,
      });
    } 
    else {
      this.setState({ 
        validTitle: false,
       });
    }
  }

  descripchange(descrip) {

    this.setState({  descrip: descrip, });

    if (descrip != "") {
      this.setState({ 
        validDescrip: true,
      });
    } 
    else {
      this.setState({ 
        validDescrip: false,
       });
    }
  }

  toggleNextButtonState() {
    const { validDescrip, validTitle } = this.state;
    if (validTitle && validDescrip) {
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
              height: 25,
              width: 25,
            }}
            source={Platform.OS === 'android' ? androidbackIcon : iosbackIcon}
          />
        
        
        </TouchableOpacity>
    )
  }


  render() {
    const {
      formValid, loadingVisible, validDescrip, validTitle, title, descrip
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: 'white' }, styles.wrapper]}
      >
        {this.renderBackButton()}
        <View style={styles.scrollViewWrapper}>
          <ScrollView 
            keyboardShouldPersistTaps='handled'
            style={styles.scrollView}>
            <Text style={styles.loginHeader}>
              What is the job about?
            </Text>
            <InputField
              labelText="TITLE"
              labelTextSize={14}
              labelColor={colors.greyBlack}
              inputType="text"
              textColor={colors.greyBlack}
              inputStyle={{fontSize: 15, lineHeight: 25}}
              borderBottomColor={'grey'}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.titlechange}
              showCheckmark={validTitle}
              multiline={true}
              autoFocus={true}
              value={title}
            />
            <InputField
              labelText="DESCRIPTION"
              labelTextSize={14}
              labelColor={colors.greyBlack}
              inputType="text"
              textColor={colors.greyBlack}
              inputStyle={{fontSize: 15, lineHeight: 25}}
              borderBottomColor={'grey'}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.descripchange}
              showCheckmark={validDescrip}
              multiline={true}
              value={descrip}
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

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
  },
  scrollViewWrapper: {
    marginTop: 70,
    flex: 1,
    padding: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex: 1,
  },
  loginHeader: {
    fontSize: headingTextSize,
    color: colors.greyBlack,
    fontWeight: '500',
    marginBottom: 40,
  },
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

