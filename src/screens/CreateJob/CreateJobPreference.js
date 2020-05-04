
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


import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import RadioInput from '../../components/form/RadioInput';
import NavBarButton from '../../components/buttons/NavBarButton';
import NextArrowButton from '../../components/buttons/NextArrowButton';

import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';

import { NavigationActions } from 'react-navigation';
import { StyleSheet } from 'react-native';
import iPhoneSize from '../../helpers/utils';

const loginPhoto = require('../../img/loginphoto_blurred.png');
const androidbackIcon = require('../../img/android_back_black.png');
const iosbackIcon = require('../../img/ios_back_black.png');
const chevRightIcon = require('../../img/right_chevron.png');

let headingTextSize = 30;
let termsTextSize = 17;
if (iPhoneSize() === 'small') {
  headingTextSize = 26;
  termsTextSize = 16;
}

export default class CreateJobPreference extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerRight: null,
        headerLeft: null,
        headerStyle: transparentHeaderStyle,
        headerTransparent: true,
        headerTintColor: colors.white,
      });

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      gender: '',
      loadingVisible: false,
    };

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.getParam('edit')){
      navigation.state.params.onEditJobPreferenceClose( true, this.state.gender,);
    }
  }

  componentWillMount() {

    const { navigation } = this.props;
   
    const edit = navigation.getParam('edit');
    const gender = navigation.getParam('gender');

    if (edit) {
      this.setState({ 
        gender: gender? gender : '',
      });
    }
  }

  handleNextButton() {
    Keyboard.dismiss();
    
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;

    const { gender } = this.state;
    
    const category = navigation.getParam('category');
    const title = navigation.getParam('title');
    const descrip = navigation.getParam('descrip');
    const location = navigation.getParam('location');
    const jobtype = navigation.getParam('jobtype');
    const salary = navigation.getParam('salary');
    const currency = navigation.getParam('currency');
    const rates = navigation.getParam('rates');
    const payment = navigation.getParam('payment');
    const date = navigation.getParam('date');
    const commitment = navigation.getParam('commitment');
    const daysperweek = navigation.getParam('daysperweek');

    const edit = navigation.getParam('edit');

    if (edit) {
      navigation.goBack();
      return;
    }

   
    navigate('CreateJobOverview', {
        category: category,
        title: title,
        descrip: descrip,
        location: location,
        jobtype: jobtype,
        salary: salary,
        currency: currency,
        rates: rates,
        payment: payment,
        date: date,
        commitment: commitment,
        daysperweek: daysperweek,
        gender: gender,
    });

  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  selectGenderOption(gender) {
    this.setState({ 
      gender,
     });
  }

  renderGenderPreference() {
    return (

      <View style={{ marginBottom: 20, marginTop:20, marginLeft:20, marginRight:20,}}>
      <TouchableOpacity
        onPress={() => this.selectGenderOption('')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
        
      >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            No Preference
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.gender === ''}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectGenderOption('Male')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20}}
        
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack,paddingBottom: 20}}>
            Male
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.gender === 'Male'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectGenderOption('Female')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            Female
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.gender === 'Female'}
            />
          </View>
        </View>
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
            top:30, 
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
      formValid, loadingVisible, validLocation, location
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
              Gender preference for this job?
            </Text>
          
            {this.renderGenderPreference()}
           
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton}
            disabled={false}
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
    marginBottom: 20,
  },
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

