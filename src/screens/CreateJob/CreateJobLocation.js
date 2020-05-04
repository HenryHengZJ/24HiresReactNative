
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
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import RNGooglePlacePicker from 'react-native-google-place-picker';

import { NavigationActions } from 'react-navigation';
import { StyleSheet } from 'react-native';
import iPhoneSize from '../../helpers/utils';


const androidbackIcon = require('../../img/android_back_black.png');
const iosbackIcon = require('../../img/ios_back_black.png');
const chevRightIcon = require('../../img/right_chevron.png');
const closeIcon = require('../../img/close-button_black.png');

let headingTextSize = 30;
let termsTextSize = 17;
if (iPhoneSize() === 'small') {
  headingTextSize = 26;
  termsTextSize = 16;
}

export default class CreateJobLocation extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      validLocation: false,
      formValid: true,
      location: null,
      loadingVisible: false,
    };

    this.edited = false;

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.locationchange = this.locationchange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.getParam('edit')){
      navigation.state.params.onEditJobLocationClose( this.edited, this.state.location,);
    }
  }

  componentWillMount() {

    const { navigation } = this.props;
   
    const edit = navigation.getParam('edit');
    const location = navigation.getParam('location');
    
    this.setState({ 
      location: location? location : '',
      validLocation: location? true : false,
    });
    
  }

  handleNextButton() {
    Keyboard.dismiss();
    
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;

    const { location, } = this.state;

    const edit = navigation.getParam('edit');

    const category = navigation.getParam('category');
    const title = navigation.getParam('title');
    const descrip = navigation.getParam('descrip');

    if (edit) {
      this.edited = true,
      navigation.goBack();
    }
    else {
      navigate('CreateJobType', {
        category: category,
        title: title,
        descrip: descrip,
        location: location,
      });
    }
  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  locationchange(location) {

    this.setState({  
      location: location,
      
    }, () => {
      alert(JSON.stringify(location))
      if (this.state.location) {
        this.setState({ 
          validLocation: true,
        });
      } 
      else {
        this.setState({ 
          validLocation: false,
        });
      }  
    })
  }




  toggleNextButtonState() {
    const { validLocation } = this.state;
    if (validLocation) {
      return false;
    }
    return true;
  }

  onLocationPressed = () => {
   
    RNGooglePlacePicker.show((response) => {
      if (response.didCancel) {
        console.log('User cancelled GooglePlacePicker');
      }
      else if (response.error) {
        console.log('GooglePlacePicker Error: ', response.error);
      }
      else {
        console.log('GooglePlacePicker Picked =' + JSON.stringify(response));
        this.locationchange(response)
      }
    })

  }

  onRemovedPressed = () => {
    this.setState({  
      location: null,
      validLocation:false,
    })
  }

  renderLocation(location) {

    return (
          <View
            style={{flexDirection: 'row'}}>

            <TouchableOpacity 
              style={{  flex:1, marginVertical:20 , borderBottomColor: 'grey', borderBottomWidth: 1, marginRight: 10,}}
              onPress={this.onLocationPressed.bind(this)}
            >

              <Text style={{ fontWeight: '400', color: location? colors.greyBlack : 'grey', fontSize: 15, paddingBottom: 10, lineHeight: 25,}}>
                {location ?  location.name === undefined ? location.address : location.name + ', ' + location.address : 'Tap to select location' }
              </Text>

            </TouchableOpacity>

            <TouchableOpacity 
              style={{  marginVertical:20 ,}}
              onPress={this.onRemovedPressed.bind(this)}
            >

              <Image
                style={{ alignSelf: 'center', justifyContent:'center', marginRight: 5, marginTop: 5, height: 15, width: 15, opacity: 0.5}}
                source={closeIcon}
              />

            </TouchableOpacity>

          </View>

    )
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
      formValid, loadingVisible, validLocation, location,
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
              Where is the job's venue?
            </Text>
            <Text style={{ fontWeight: '700', color: colors.greyBlack, fontSize: 14, marginBottom: 20,}}>
              LOCATION
            </Text>

            {this.renderLocation(location)}
           
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

