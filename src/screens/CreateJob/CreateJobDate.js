
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
import NavBarButton from '../../components/buttons/NavBarButton';
import CalendarViewModal from '../../components/CalendarViewModal'

import { NavigationActions } from 'react-navigation';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet } from 'react-native';
import iPhoneSize from '../../helpers/utils';

const loginPhoto = require('../../img/loginphoto_blurred.png');
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

export default class CreateJobDate extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: 
    navigation.getParam('edit') ? null: 
    <NavBarButton
      handleButtonPress={() => 
      {
        navigation.navigate('CreateJobPreference',
        {
            category: navigation.getParam('category'),
            title: navigation.getParam('title'),
            descrip: navigation.getParam('descrip'),
            location: navigation.getParam('location'),
            jobtype: navigation.getParam('jobtype'),
            salary: navigation.getParam('salary'),
            currency: navigation.getParam('currency'),
            rates: navigation.getParam('rates'),
            payment: navigation.getParam('payment'),
        })
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
      validDate: false,
      formValid: true,
      date: null,
      loadingVisible: false,
      jobtype: null,
      showCalendar: false,
      validCommitment: false,
      commitment: null,
      commitmentlist : [
        {
          label: '1 month and above',
          value: '1 month and above',
        },
        {
          label: '2 months and above',
          value: '2 months and above',
        },
        {
          label: '3 months and above',
          value: '3 months and above',
        },
        {
          label: '4 months and above',
          value: '4 months and above',
        },
        {
          label: '5 months and above',
          value: '5 months and above',
        },
        {
          label: '6 months and above',
          value: '6 months and above',
        },
        {
          label: '1 year and above',
          value: '1 year and above',
        },
        {
          label: '2 year and above',
          value: '2 year and above',
        },
      ],
      validDaysPerWeek: false,
      daysperweek: null, 
      daysperweeklist : [
        {
          label: '1 day per week',
          value: '1 day per week',
        },
        {
          label: '2 days per week',
          value: '2 days per week',
        },
        {
          label: '3 days per week',
          value: '3 days per week',
        },
        {
          label: '4 days per week',
          value: '4 days per week',
        },
        {
          label: '5 days per week',
          value: '5 days per week',
        },
        {
          label: '6 days per week',
          value: '6 days per week',
        },
        {
          label: '7 days per week',
          value: '7 days per week',
        },
      ],
    };

    this.edited = false,

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.datechange = this.datechange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  
  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.getParam('edit')){
      navigation.state.params.onEditJobDateClose(true, this.state.date, this.state.commitment, this.state.daysperweek, this.state.jobtype);
    }
  }

  componentWillMount() {

    const { navigation } = this.props;
   
    const edit = navigation.getParam('edit');
    const date = navigation.getParam('date');
    const commitment = navigation.getParam('commitment');
    const daysperweek = navigation.getParam('daysperweek');
    const jobtype = navigation.getParam('jobtype');

    this.setState({ 
      jobtype,
      date,
      commitment,
      daysperweek,
      validDate: date ? true : false,
      validCommitment: commitment ? true : false,
      validDaysPerWeek: daysperweek ? true : false,
    });
  }

  handleNextButton() {
    Keyboard.dismiss();
    
    const { navigation } = this.props;
    const { navigate } = navigation;

    const { date, commitment, daysperweek } = this.state;

    const edit = navigation.getParam('edit');

    const category = navigation.getParam('category');
    const title = navigation.getParam('title');
    const descrip = navigation.getParam('descrip');
    const location = navigation.getParam('location');
    const jobtype = navigation.getParam('jobtype');
    const salary = navigation.getParam('salary');
    const currency = navigation.getParam('currency');
    const rates = navigation.getParam('rates');
    const payment = navigation.getParam('payment');

    if (edit) {
      this.edited = true,
      navigation.goBack();
      return;
    }

    navigate('CreateJobPreference', {
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
    });
    

  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }


  datechange(date, finalstartdate) {

    var date = {
      date: date,
      startingdate: parseInt(finalstartdate, 10),
    }

    this.setState({  
      date: date, 
    }, () => {
      if (date && finalstartdate) {
        this.setState({ 
          validDate: true,
        });
      } 
      else {
        this.setState({ 
          validDate: false,
        });
      }  
    })
    
  }


  toggleNextButtonState() {
    const { validCommitment, validDaysPerWeek, jobtype, validDate } = this.state;
    if (jobtype === 'Part Time (Short Term)') {
      if (validDate) {
        return false;
      }
    }
    else {
      if (validCommitment && validDaysPerWeek) {
        return false;
      }
    }
    return true;
  }

  onDatePressed = () => {
    this.setState({
      showCalendar: true,
    })
  }

  onDateRemovedPressed = () => {
    
    this.setState({  
      date: null,
      validDate: false,
    })
  }

  onCommitmentRemoved = () => {
    this.setState({  
      commitment: null,
      validCommitment: false,
    })
  }

  onDaysPerWeekRemoved = () => {
    this.setState({  
      daysperweek: null,
      validDaysPerWeek: false,
    })
  }

  dismissCalendar = (finaldate, finalstartdate) => {
    if (typeof(finaldate) === 'string') {
        this.datechange(finaldate, finalstartdate);
    }
    this.setState({
      showCalendar: false,
    })
  }

  renderDate(date) {

    return(

      <View
        style={{flexDirection: 'row'}}>

        <TouchableOpacity 
          style={{  flex:1, marginVertical:20 , borderBottomColor: 'grey', borderBottomWidth: 1, marginRight: 10,}}
          onPress={this.onDatePressed.bind(this)}
        >

          <Text style={{ lineHeight: 25, fontWeight: '400', color: date? colors.greyBlack : 'grey', fontSize: 15, paddingBottom: 20}}>
            {date ?  date.date : 'Tap to select date'}
          </Text>

        </TouchableOpacity>

        <TouchableOpacity 
          style={{  marginVertical:20 ,}}
          onPress={this.onDateRemovedPressed.bind(this)}
        >

          <Image
            style={{ alignSelf: 'center', justifyContent:'center', marginRight: 5, marginTop: 5, height: 15, width: 15, opacity: 0.5}}
            source={closeIcon}
          />

        </TouchableOpacity>

      </View>
         
    )
 
  }

  renderFullTimeCommitment(commitment, commitmentlist) {
    return (

      <View>

      <Text style={{ fontWeight: '700', color: colors.greyBlack, fontSize: 14, marginBottom: 20,}}>
        COMMITMENT
      </Text>

      <View
        style={{flexDirection: 'row'}}>

        <TouchableOpacity 
          style={{  flex:1, marginVertical:20 , borderBottomColor: 'grey', borderBottomWidth: 1, marginRight: 10,}}
        >

          <RNPickerSelect
            items={commitmentlist}
            placeholder={{
              label: "",
              value: ""
            }}
            onValueChange={(value) => {
                this.setState({
                  commitment: value,
                  validCommitment: true,
                });
            }}
          >

            <Text style={{ fontWeight: '400', color: commitment ? colors.greyBlack : 'grey', fontSize: 15, paddingBottom: 20}}>
              {commitment ? commitment : 'Exp: 3 months and above' }
            </Text>

          </RNPickerSelect>

        </TouchableOpacity>

        <TouchableOpacity 
          style={{  marginVertical:20 ,}}
          onPress={this.onCommitmentRemoved.bind(this)}
        >

          <Image
            style={{ alignSelf: 'center', justifyContent:'center', marginRight: 5, marginTop: 5, height: 15, width: 15, opacity: 0.5}}
            source={closeIcon}
          />

        </TouchableOpacity>

      </View>

      </View>
    )
  }

  renderFullTimeDaysPerWeek(daysperweek, daysperweeklist) {
    return (

      <View>

      <Text style={{ fontWeight: '700', color: colors.greyBlack, fontSize: 14, marginBottom: 20, marginTop: 20}}>
        DAYS PER WEEK
      </Text>

      <View
        style={{flexDirection: 'row'}}>

        <TouchableOpacity 
          style={{  flex:1, marginVertical:20 , borderBottomColor: 'grey', borderBottomWidth: 1, marginRight: 10,}}
        >

          <RNPickerSelect
            items={daysperweeklist}
            placeholder={{
              label: "",
              value: ""
            }}
            onValueChange={(value) => {
                this.setState({
                  daysperweek: value,
                  validDaysPerWeek: true,
                });
            }}
          >

            <Text style={{ fontWeight: '400', color: daysperweek ? colors.greyBlack : 'grey', fontSize: 15, paddingBottom: 20}}>
              {daysperweek ? daysperweek : 'Exp: 5 days' }
            </Text>

          </RNPickerSelect>

        </TouchableOpacity>

        <TouchableOpacity 
          style={{  marginVertical:20 ,}}
          onPress={this.onDaysPerWeekRemoved.bind(this)}
        >

          <Image
            style={{ alignSelf: 'center', justifyContent:'center', marginRight: 5, marginTop: 5, height: 15, width: 15, opacity: 0.5}}
            source={closeIcon}
          />

        </TouchableOpacity>

      </View>

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
      formValid, loadingVisible, validDate, date, jobtype, showCalendar, 
      commitment, commitmentlist, daysperweek, daysperweeklist
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
              {jobtype === 'Part Time (Short Term)' ? 'When is the job?' : 'Commitment required and Work days?' }
            </Text>

            {jobtype === 'Part Time (Short Term)' ? this.renderDate(date) : null}

            {jobtype === 'Part Time (Short Term)' ? null : this.renderFullTimeCommitment(commitment, commitmentlist)}

            {jobtype === 'Part Time (Short Term)' ? null : this.renderFullTimeDaysPerWeek(daysperweek, daysperweeklist)}

            <CalendarViewModal
              animationType="fade"
              calendarmodalVisible={showCalendar}
              handleOnClosePress={this.dismissCalendar.bind(this)}
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

