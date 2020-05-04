
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

import InputField from '../../components/form/InputField';
import NavBarButton from '../../components/buttons/NavBarButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import RadioInput from '../../components/form/RadioInput';
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

export default class CreateJobSalary extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: 
    navigation.getParam('edit') ? null:
    <NavBarButton
      handleButtonPress={() => 
      {
        if (navigation.getParam('jobtype') === 'Part Time (Short Term)') {
          navigation.navigate('CreateJobPayment',
          {
            category: navigation.getParam('category'),
            title: navigation.getParam('title'),
            descrip: navigation.getParam('descrip'),
            location: navigation.getParam('location'),
            jobtype: navigation.getParam('jobtype'),
          })
        }
        else {
          navigation.navigate('CreateJobDate',
          {
            category: navigation.getParam('category'),
            title: navigation.getParam('title'),
            descrip: navigation.getParam('descrip'),
            location: navigation.getParam('location'),
            jobtype: navigation.getParam('jobtype'),
          })
        }
      }}
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
      validSalary: false,
      formValid: true,
      salary: '',
      currency: 'MYR',
      rates: 'per hour',
      loadingVisible: false,
    };

    this.edited = false;

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.salarychange = this.salarychange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.onCurrencyListClose = this.onCurrencyListClose.bind(this);
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.getParam('edit')){
      navigation.state.params.onEditJobSalaryClose( this.edited, this.state.salary, this.state.currency, this.state.rates );
    }
  }

  componentWillMount() {

    const { navigation } = this.props;
   
    const edit = navigation.getParam('edit');
    const salary = navigation.getParam('salary');
    const currency = navigation.getParam('currency');
    const rates = navigation.getParam('rates');

    if (edit) {
      this.setState({ 
        salary: salary,
        currency: currency? currency : 'MYR',
        rates: rates? rates: 'per hour',
        validSalary: salary? true: false,
      });
    }
  }

  handleNextButton() {
    Keyboard.dismiss();
    
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;

    const { salary, currency, rates } = this.state;

    const edit = navigation.getParam('edit');

    const category = navigation.getParam('category');
    const title = navigation.getParam('title');
    const descrip = navigation.getParam('descrip');
    const location = navigation.getParam('location');
    const jobtype = navigation.getParam('jobtype');

    if (edit) {
      this.edited = true,
      navigation.goBack();
      return;
    }

    if (jobtype === 'Part Time (Short Term)') {
        navigate('CreateJobPayment', {
          category: category,
          title: title,
          descrip: descrip,
          location: location,
          jobtype: jobtype,
          salary: salary,
          currency: currency,
          rates: rates,
        });
    }
    else {
        navigate('CreateJobDate', {
          category: category,
          title: title,
          descrip: descrip,
          location: location,
          jobtype: jobtype,
          salary: salary,
          currency: currency,
          rates: rates,
        });
    }

  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  salarychange(salary) {

    this.setState({  salary: salary, });

    if (salary != "" ) {
      this.setState({ 
        validSalary: true,
      });
    } 
    else {
      this.setState({ 
        validSalary: false,
       });
    }
  }


  toggleNextButtonState() {
    const { validSalary } = this.state;
    if (validSalary) {
      return false;
    }
    return true;
  }

  onCurrencyPressed = (navigation) => {
    navigation.navigate('CurrencyContainer', { onCurrencyListClose: this.onCurrencyListClose });
  }

  onCurrencyListClose(currencyName, currencySelected) {

    if (currencySelected) {
      this.setState({
        currency: currencyName,
      })  
    } 
  }

  selectRatesOption = (rates) => {
    this.setState({  rates: rates, });
  }

  renderRatesPreference() {
    return (

      <View style={{ marginBottom: 20, marginTop:20, marginLeft:20, marginRight:20,}}>
  
      <TouchableOpacity
        onPress={() => this.selectRatesOption('per hour')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20}}
        
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack,paddingBottom: 20}}>
            Per Hour
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.rates === 'per hour'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectRatesOption('per day')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            Per Day
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.rates === 'per day'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectRatesOption('per month')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            Per Month
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.rates === 'per month'}
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
      formValid, loadingVisible, validSalary, salary, currency, rates
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
              Salary for the job?
            </Text>
           
            <InputField
              labelText="SALARY"
              labelTextSize={14}
              labelColor={colors.greyBlack}
              inputType="number"
              textColor={colors.greyBlack}
              inputStyle={{fontSize: 15, lineHeight: 25}}
              borderBottomColor={'grey'}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.salarychange}
              showCheckmark={validSalary}
              multiline={false}
              maxLength={7}
              value={this.state.salary}
              autoFocus={true}
            />

           
            <Text style={{ fontWeight: '700', color: colors.greyBlack, fontSize: 14, }}>
              PAY RATE
            </Text>

            {this.renderRatesPreference()}


            <Text style={{ fontWeight: '700', color: colors.greyBlack, fontSize: 14, marginBottom: 20, marginTop : 20}}>
              CURRENCY
            </Text>

            <TouchableOpacity 
              style={{  marginVertical:20 ,}}
              onPress={this.onCurrencyPressed.bind(this, this.props.navigation)}
            >

              <View
                style={{flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 1, paddingBottom: 20 }}>

                 <Text style={{ flex: 1, fontWeight: '400', color: colors.greyBlack, fontSize: 15, }}>
                  {currency === '' ? 'Press to select currency' : currency }
                </Text>

                <Image
                  style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5}}
                  source={chevRightIcon}
                />

              </View>

            </TouchableOpacity>

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

