
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


import RadioInput from '../../components/form/RadioInput';
import NavBarButton from '../../components/buttons/NavBarButton';
import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';
import NextArrowButton from '../../components/buttons/NextArrowButton';

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

export default class CreateJobPayment extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: 
    navigation.getParam('edit') ? null:
    <NavBarButton
      handleButtonPress={() => navigation.navigate('CreateJobDate',
      {
        category: navigation.getParam('category'),
        title: navigation.getParam('title'),
        descrip: navigation.getParam('descrip'),
        location: navigation.getParam('location'),
        jobtype: navigation.getParam('jobtype'),
        salary: navigation.getParam('salary'),
        currency: navigation.getParam('currency'),
        rates: navigation.getParam('rates'),
      })}
      location="right"
      color={colors.themeblue}
      text="Skip"
    />,
    headerLeft: null,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      payment: '',
      validPayment: false,
    };

    this.edited = false;

    console.disableYellowBox = true;

    this.handleNextButton = this.handleNextButton.bind(this);

  }

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.getParam('edit')){
      navigation.state.params.onEditJobPaymentClose(true, this.state.payment,);
    }
  }

  componentWillMount() {

    const { navigation } = this.props;
   
    const edit = navigation.getParam('edit');
    const payment = navigation.getParam('payment');

    if (edit) {
      this.setState({ 
        payment: payment? payment : '',
        validPayment: payment? true : false,
      });
    }
  }

  handleNextButton() {
    Keyboard.dismiss();
    
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;

    const { payment } = this.state;

    const edit = navigation.getParam('edit');

    const category = navigation.getParam('category');
    const title = navigation.getParam('title');
    const descrip = navigation.getParam('descrip');
    const location = navigation.getParam('location');
    const jobtype = navigation.getParam('jobtype');
    const salary = navigation.getParam('salary');
    const currency = navigation.getParam('currency');
    const rates = navigation.getParam('rates');

    if (edit) {
      this.edited = true,
      navigation.goBack();
      return;
    }

    navigate('CreateJobDate', {
      category: category,
      title: title,
      descrip: descrip,
      location: location,
      jobtype: jobtype,
      salary: salary,
      currency: currency,
      rates: rates,
      payment: payment,
    });

  }

  toggleNextButtonState() {
    const { validPayment } = this.state;
    if (validPayment) {
      return false;
    }
    return true;
  }

  selectPaymentOption = (payment) => {
    this.setState({  
      payment: this.state.payment === payment ? '' : payment, 
      validPayment: this.state.payment === payment ? false : true,
    });
  }


  renderPayment() {
    return (

      <View style={{ marginBottom: 80, marginTop:20, marginLeft:20, marginRight:20,}}>

      <TouchableOpacity
        onPress={() => this.selectPaymentOption('On the Spot')}
        style={{flex: 1, paddingTop: 20}}
        
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack,paddingBottom: 20}}>
            On the Spot
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.payment === 'On the Spot'}
            />
          </View>
        </View>
      </TouchableOpacity>
    
      <TouchableOpacity
        onPress={() => this.selectPaymentOption('1 week after event/task finish')}
        style={{flex: 1, paddingTop: 20}}
        
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack,paddingBottom: 20}}>
            1 week after event/task finish
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.payment === '1 week after event/task finish'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectPaymentOption('2 week after event/task finish')}
        style={{flex: 1, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            2 week after event/task finish
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.payment === '2 week after event/task finish'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectPaymentOption('3 week after event/task finish')}
        style={{flex: 1, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            3 week after event/task finish
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.payment === '3 week after event/task finish'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectPaymentOption('1 month after event/task finish')}
        style={{flex: 1,paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
          1 month after event/task finish
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.payment === '1 month after event/task finish'}
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
      payment
    } = this.state;

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
              When payment will be released?
            </Text>

            {this.renderPayment()}
           
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton}
            disabled={this.toggleNextButtonState()}
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

