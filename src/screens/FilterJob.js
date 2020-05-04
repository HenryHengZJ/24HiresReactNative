
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Slider,
  ScrollView,
  TouchableHighlight,
  BackHandler,
  Animated,
  Platform,
  StatusBar,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  TextInput, 
  Alert,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import transparentHeaderStyle from '../styles/navigation';
import NavBarButton from '../components/buttons/NavBarButton';
import * as Animatable from 'react-native-animatable';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import colors from '../styles/colors';
import Touchable from 'react-native-platform-touchable';
import RadioInput from '../components/form/RadioInput';
import RNPickerSelect from 'react-native-picker-select';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Calendar from 'react-native-calendar-select';
import Moment from 'moment';

const closeIcon = require('../img/close-button_black.png');
const chevRightIcon = require('../img/right_chevron.png');
const dropdownIcon = require('../img/dropdown_black.png');


const navigateToTabsAction = NavigationActions.navigate({
  routeName: 'LoggedIn',
});

const SLIDE_IN_DOWN_KEYFRAMES = {
  from: { translateY: -50 },
  to: { translateY: 0 },
};

const SLIDE_IN_UP_KEYFRAMES = {
  from: { translateY: 0 },
  to: { translateY: -80 },
};

export default class FilterJob extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavBarButton
      handleButtonPress={() => 
        navigation.state.params.handleClearPressed()
      }
      location="right"
      color={colors.greyBlack}
      text="Clear"
    />,
    headerLeft: <NavBarButton 
      handleButtonPress={() => 
        navigation.dispatch(NavigationActions.back())
      } 
      location="left" icon={<MaterialIcon name="clear" color={colors.greyBlack} size={25} />} 
    />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });
  

  constructor(props) {
    super(props);
    this.state = {

      showNotification: false,
      errortype: "",
      loadingVisible: false,
      measures: 0,
      header: false,
      firstopen: true,
      scrollEnabled: true,

      wagestxt: '',
      pricerange: [1, 9999],
      startWages: "",
      endWages: "",
      minWages: 1,
      maxWages: 9999,  
      currencylist : [
        {
          label: 'MYR',
          value: 'MYR',
        },
        {
          label: 'SGD',
          value: 'SGD',
        },
        {
          label: 'USD',
          value: 'USD',
        },
        {
          label: 'EUR',
          value: 'EUR',
        },
        {
          label: 'GBP',
          value: 'GBP',
        },
      ],
      rateslist : [
        {
          label: 'per hour',
          value: 'per hour',
        },
        {
          label: 'per day',
          value: 'per day',
        },
        {
          label: 'per month',
          value: 'per month',
        },
      ],

     
      currency: '',
      rates: '',
      startDate: new Date(),  
      endDate: new Date(),
      startDateText: "",
      endDateText: "",
      city:"",
      category: "",
      gender: '',
      jobtype: '',
      filterPressed: false,
 

      currencyValueSelected: false,
      wagesValueSelected: false,
      ratesValueSelected: false,
      dateselected: false,
      categorySelected: false,
      genderSelected: false,
      jobtypeSelected: false,

    };

    this.selectGenderOption = this.selectGenderOption.bind(this);
    this.selectRatesOption = this.selectRatesOption.bind(this);
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.onLocationListClose = this.onLocationListClose.bind(this);
    this.onCategoryListClose = this.onCategoryListClose.bind(this);
    this.onCurrencyListClose = this.onCurrencyListClose.bind(this);
  }

  componentWillMount() {

    const { navigation } = this.props;

    const currencyValueSelected = navigation.getParam('currencyValueSelected');
    const currency = navigation.getParam('currency');

    const ratesValueSelected = navigation.getParam('ratesValueSelected');
    const rates = navigation.getParam('rates');
    
    const dateselected = navigation.getParam('dateselected');
    const startingDate = navigation.getParam('startDate');
    const endingDate = navigation.getParam('endDate');

    const city = navigation.getParam('city');

    const categorySelected = navigation.getParam('categorySelected');
    const category = navigation.getParam('category');

    const genderSelected = navigation.getParam('genderSelected');
    const gender = navigation.getParam('gender');

    const jobtypeSelected = navigation.getParam('jobtypeSelected');
    const jobtype = navigation.getParam('jobtype');

    Moment.locale('en');
    var startDateText = startingDate ? Moment(startingDate).format('DD MMM YY') : null;
    var endDateText = endingDate ? Moment(endingDate).format('DD MMM YY') : null;


    this.setState({
        currencyValueSelected: currencyValueSelected,
        currency: currencyValueSelected? currency : '',

        ratesValueSelected: ratesValueSelected,
        rates: ratesValueSelected? rates : '',

        dateselected: dateselected,
        startDate: dateselected? startingDate : new Date(),
        endDate: dateselected? endingDate : new Date(),
        startDateText: dateselected? startDateText : '',
        endDateText: dateselected? endDateText : '',

        city: city ,

        categorySelected: categorySelected,
        category: categorySelected? category : '',

        genderSelected: genderSelected,
        gender: genderSelected? gender : '',

        jobtypeSelected: jobtypeSelected,
        jobtype: jobtypeSelected? jobtype : '',

    })
    
  }

  componentWillUnmount() {

    const { navigation } = this.props;
    navigation.state.params.onFilterClose(
    //  this.state.wagesValueSelected, 
    //  this.state.wagesValueSelected ? this.state.pricerange : null, 
      this.state.filterPressed,
      
      this.state.currencyValueSelected,
      this.state.currencyValueSelected ? this.state.currency : null, 

      this.state.ratesValueSelected, 
      this.state.ratesValueSelected ? this.state.rates : null, 

      this.state.dateselected, 
      this.state.dateselected ? this.state.startDate : null, 
      this.state.dateselected ? this.state.endDate : null, 

      this.state.city, 

      this.state.categorySelected,
      this.state.categorySelected ? this.state.category : null,  

      this.state.genderSelected,
      this.state.genderSelected ? this.state.gender : null, 

      this.state.jobtypeSelected,
      this.state.jobtypeSelected ? this.state.jobtype : null, 
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleClearPressed: this.clearFilter,
    })
    
  }

  clearFilter = () => {

    this.setState({
      currencyValueSelected: false,
      currency: '', 

      ratesValueSelected: false,
      rates: '', 

      dateselected: false,
      startDate: new Date(), 
      endDate: new Date(), 
      startDateText: '',
      endDateText: '',

      categorySelected: false,
      category: '', 

      genderSelected: false,
      gender: '', 

      jobtypeSelected: false,
      jobtype: '', 
    })

  }

  multiSliderValuesChange = (values) => {
    //alert(values);
    if (this.state.rates === "All") {
      this.setState({
        pricerange: values,
        scrollEnabled: true,
        startWages: "",
        endWages: "",
        wagesValueSelected: values === [1, 9999] ? false : true,
      });
    }
    else if (this.state.rates === "per hour") {
      this.setState({
        pricerange: values,
        scrollEnabled: true,
        startWages: values[0] === 5 ? "Less than" : "",
        endWages: values[1] === 50 ? "More than" : "",
        wagesValueSelected: true,
      });
    }
    else if (this.state.rates === "per day") {
      this.setState({
        pricerange: values,
        scrollEnabled: true,
        startWages: values[0] === 50 ? "Less than" : "",
        endWages: values[1] === 500 ? "More than" : "",
        wagesValueSelected: true,
      });
    }
    else if (this.state.rates === "per month") {
      this.setState({
        pricerange: values,
        scrollEnabled: true,
        startWages: values[0] === 500 ? "Less than" : "",
        endWages: values[1] === 5000 ? "More than" : "",
        wagesValueSelected: true,
      });
    }
    

    console.log("values = " + values)
  }

  disableScroll = () => this.setState({ scrollEnabled: false });


  ratesChange = (value) => {

    if (value === "All") {
      this.setState({
        rates: value,
        pricerange: [1, 9999],
        minWages: 1,
        maxWages: 9999,
        startWages: "",
        endWages: "",
        ratesValueSelected: false,
      });
    }
    else if (value === "per hour") {
      this.setState({
        rates: value,
        pricerange: [5, 50],
        minWages: 5,
        maxWages: 50,
        startWages: "Less than",
        endWages: "More than",
        ratesValueSelected: true,
      });
    }
    else if (value === "per day") {
      this.setState({
        rates: value,
        pricerange: [50, 500],
        minWages: 50,
        maxWages: 500,
        startWages: "Less than",
        endWages: "More than",
        ratesValueSelected: true,
      });
    }
    else if (value === "per month") {
      this.setState({
        rates: value,
        pricerange: [500, 5000],
        minWages: 500,
        maxWages: 5000,
        startWages: "Less than",
        endWages: "More than",
        ratesValueSelected: true,
      });
    }
  }

  currencyChange = (value) => {
    this.setState({ 
      currency: value,
      currencyValueSelected: value === '' ? false : true,
     });
  }

  selectGenderOption(gender) {
    this.setState({ 
      gender,
      genderSelected: gender === '' ? false : true,
     });
  }

  selectRatesOption(rates) {
    this.setState({ 
      rates,
      ratesValueSelected: rates === '' ? false : true,
     });
  }

  selectJobOption(jobtype) {
    this.setState({ 
      jobtype: jobtype ,
      jobtypeSelected: jobtype === '' ? false : true,
    });
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  confirmDate({startDate, endDate, startMoment, endMoment}) {

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();      
    var startD = d
    var endD = new Date(year, month, day + 14)

    Moment.locale('en');
    var startDateText = Moment(startDate).format('DD MMM YY')
    var endDateText = Moment(endDate).format('DD MMM YY')
    
    this.setState({
      startDate : (startDate === null) ? startD : startDate,
      endDate : (endDate === null) ? endD : endDate,
      startDateText : (startDate === null) ? "" : startDateText,
      endDateText : (endDate === null) ? "" : endDateText,
      dateselected: (startDate === null && endDate === null ) ? false : true,
    });
  }

  onLocationListClose( locationName, locationSelected) {
 
    if (locationSelected) {
        this.setState({
            city: locationName,
            locationSelected: true,
        })  
    } 
  }

  onLocationPressed = (navigation) => {
    navigation.navigate('LocationContainer', { onLocationListClose: this.onLocationListClose });
  }

  onCategoryPressed = (navigation) => {
    navigation.navigate('CategoryContainer', { onCategoryListClose: this.onCategoryListClose });
  }

  onCategoryListClose( categoryName, categorySelected) {
 
    if (categorySelected) {
        this.setState({
          category: categoryName,
          categorySelected: true,
        })  
    } 
  }

  onCurrencyPressed = (navigation) => {
    navigation.navigate('CurrencyContainer', { onCurrencyListClose: this.onCurrencyListClose });
  }

  onCurrencyListClose(currencyName, currencySelected) {

    if (currencySelected) {
      this.setState({
        currency: currencyName,
        currencyValueSelected : true,
      })  
    } 
  }

  renderDatesRange(dates) {

    let customI18n = {
      'w': ['', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      'weekday': ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      'text': {
        'start': 'Start',
        'end': 'End',
        'date': '',
        'save': 'Confirm',
        'clear': 'Reset'
      },
      'date': 'DD / MM'  // date format
    };
    // optional property, too.
    let color = {
      mainColor : 'white',
      subColor : colors.themeblue,
      borderColor : colors.shadowgray
    };

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();      
    var maximumD = new Date(year + 1, month, day)
    var minimumD = new Date(year, month - 1, day)
    var startD = d
    var endD = new Date(year, month, day + 14)


    Moment.locale('en');
    var maximumDate = Moment(maximumD).format('YYYYMMDD')
    var minimumDate = Moment(minimumD).format('YYYYMMDD')
    

    return (
      <TouchableOpacity style={{ margin:20,}}
        onPress={this.openCalendar}
      >
        <View style={{ flex:1,  paddingRight:10, paddingLeft:0, paddingTop:10, paddingBottom: 10, flexDirection: 'row'}}>
        
          {dates != "" ? 
           <Text style={{  color: colors.priceblue, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 17}}>
                {dates}
          </Text>
          :
          <Text style={{  color: colors.greyBlack, flex:1, lineHeight: 30, marginHorizontal: 10, fontSize: 17}}>
                Pick your dates here
          </Text>
          }
          <Calendar
            singleDate={false}
            i18n="en"
            ref={(calendar) => {this.calendar = calendar;}}
            customI18n={customI18n}
            color={color}
            format="YYYYMMDD"
            minDate={minimumDate}
            maxDate={maximumDate}
            startDate={ (this.state.dateselected) ? this.state.startDate :  startD}
            endDate={(this.state.dateselected) ? this.state.endDate :  endD}
            onConfirm={this.confirmDate}
          />
          
 
          <Image
            style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
            source={chevRightIcon}
          />
  
        </View>
      </TouchableOpacity>
    )
  }

  renderRatesPreference() {
    return (

      <View style={{ marginBottom: 20, marginTop:20, marginLeft:20, marginRight:20,}}>
      <TouchableOpacity
        onPress={() => this.selectRatesOption('')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
        
      >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            All
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.rates === ''}
            />
          </View>
        </View>
      </TouchableOpacity>

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

  renderWagesRange(currency, rates) {
    return (
      
        <View style={{ flex:1,  paddingRight:10, paddingLeft:10, paddingTop:10, paddingBottom: 10, flexDirection: 'row'}}>
        
          <TouchableOpacity style={{flex:1,  margin:20,}}
            onPress={() => console.log("Wages Picker Selected")}
          >

              <RNPickerSelect
                  items={this.state.currencylist}
                  placeholder={{}}
                  onValueChange={this.currencyChange}
              >
                <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da', padding:10, flex:1, flexDirection: 'row'}}>
                  <Text style={{  flex:1, marginHorizontal: 10, color: colors.greyBlack, textAlign:'center', lineHeight: 30,fontSize: 15}}>
                    {currency}
                  </Text>

                  <Image
                  style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
                  source={dropdownIcon}
                  />

                </View>
              </RNPickerSelect>

          </TouchableOpacity>

          <TouchableOpacity style={{flex:1,  margin:20,}}
            onPress={() => console.log("Rates Picker Selected")}
          >

            <RNPickerSelect
                items={this.state.rateslist}
                placeholder={{
                  label: 'All',
                  value: 'All',
                }}
                onValueChange={this.ratesChange}
            >
              <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da', padding:10, flex:1, flexDirection: 'row'}}>
                <Text style={{  flex:1, marginHorizontal: 10, color: colors.greyBlack, textAlign:'center', lineHeight: 30,fontSize: 15}}>
                  {rates}
                </Text>

                <Image
                style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
                source={dropdownIcon}
                />

              </View>
            </RNPickerSelect>

          </TouchableOpacity>
  
        </View>
     
    )
  }

  renderCurrency(currency) {
    return (
      <TouchableOpacity style={{ margin:20,}}
        onPress={this.onCurrencyPressed.bind(this, this.props.navigation)}
      >
        <View style={{ flex:1,  paddingRight:10, paddingLeft:0, paddingTop:10, paddingBottom: 10, flexDirection: 'row'}}>
         
          {currency != "" ?
          <Text style={{  color: colors.priceblue, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 17}}>
                {currency}
          </Text> 
          :
          <Text style={{  color: colors.greyBlack, flex:1, lineHeight: 30, marginHorizontal: 10, fontSize: 17}}>
                Select currency here
          </Text>
          }
 
          <Image
            style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
            source={chevRightIcon}
          />
  
        </View>
      </TouchableOpacity>
    )
  }

  renderCategory(category) {
    return (
      <TouchableOpacity style={{ margin:20,}}
        onPress={this.onCategoryPressed.bind(this, this.props.navigation)}
      >
        <View style={{ flex:1,  paddingRight:10, paddingLeft:0, paddingTop:10, paddingBottom: 10, flexDirection: 'row'}}>
        
          {category != "" ? 
           <Text style={{  color: colors.priceblue, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 17}}>
                {category}
          </Text>
          :
          <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30, marginHorizontal: 10, fontSize: 17}}>
                Pick category here
          </Text>
          }
          
 
          <Image
            style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
            source={chevRightIcon}
          />
  
        </View>
      </TouchableOpacity>
    )
  }

  renderLocation(location) {
    return (
      <TouchableOpacity 
        style={{ margin:20,}}
        onPress={this.onLocationPressed.bind(this, this.props.navigation)}
      >
        <View style={{ flex:1,  paddingRight:10, paddingLeft:0, paddingTop:10, paddingBottom: 10, flexDirection: 'row'}}>
        
          {location != "" ? 
           <Text style={{  color: colors.priceblue, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 17}}>
                {location}
          </Text>
          :
          <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30, marginHorizontal: 10, fontSize: 17}}>
                Choose your location
          </Text>
          }
          
 
          <Image
            style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
            source={chevRightIcon}
          />
  
        </View>
      </TouchableOpacity>
    )
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
        onPress={() => this.selectGenderOption('male')}
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
              selected={this.state.gender === 'male'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectGenderOption('female')}
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
              selected={this.state.gender === 'female'}
            />
          </View>
        </View>
      </TouchableOpacity>

      </View>
    )
  }

  renderJobPreference() {
    return (

      <View style={{ marginBottom: 80, marginTop:20, marginLeft:20, marginRight:20,}}>
      <TouchableOpacity
        onPress={() => this.selectJobOption('')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
        
      >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            All
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === ''}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectJobOption('PartTime')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20}}
        
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack,paddingBottom: 20}}>
            Part Time
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'PartTime'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectJobOption('FullTime')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            Full Time
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'FullTime'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectJobOption('EzyTask')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            EzyTask
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'EzyTask'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectJobOption('Internship')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
          Internship
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'Internship'}
            />
          </View>
        </View>
      </TouchableOpacity>

      </View>
    )
  }


  handleScroll(event){
    if (event.nativeEvent.contentOffset.y > this.state.measures) {
      this.setState({
        header: true,
        firstopen: false
      })
    }
    else {
      this.setState({
        header: false,
      })
    }

  }

  renderCloseButton() {
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
            source={closeIcon}
          />
        
        
        </TouchableOpacity>
    )
  }

  renderClearButton() {
    return (
      <TouchableOpacity
          style={{ 
            position:'absolute', 
            right:10, 
            top:20, 
            zIndex:10,
            padding:10, 
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'transparent'}}
            onPress={this.clearFilter.bind(this)}
        >

          <Text style={{ paddingTop:5, textAlign:'center', alignSelf:'center', justifyContent:'center',fontWeight: '500', color: colors.greyBlack, fontSize: 15}}>
            Clear
          </Text>

        </TouchableOpacity>
    )
  }
  
 
  render() {

    return (
      <View style={{ backgroundColor: 'white', flex:1,}}>

        <ScrollView 
          scrollEnabled={this.state.scrollEnabled}
          scrollEventThrottle={16}
          onScroll={this.handleScroll.bind(this)}
          showsVerticalScrollIndicator={false} 
          style={{backgroundColor:'transparent', flex:1,  marginTop: 60,}}>

            <Text style={{ color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, paddingBottom: 20, fontSize: 24}}>
              Filter Jobs
            </Text>

            <View 
              style={{ paddingTop:20,  marginLeft:30, marginRight:30}}
              onLayout={({nativeEvent}) => {
                this.setState({
                  measures: nativeEvent.layout.y
                })
              }}>

              <Text style={{ color: colors.greyBlack, fontWeight: '500', fontSize: 17}}>
                Dates Range
              </Text>

            </View>

            {this.renderDatesRange( (this.state.startDateText === "") ?  "" : this.state.startDateText + " - " + this.state.endDateText)}

            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 20, marginRight: 20, height:1, width: '90%'}}/>
            
            <Text style={{  color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, fontSize: 17}}>
              Pay Rates
            </Text>

            {this.renderRatesPreference()}

            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 20, marginRight: 20, height:1, width: '90%'}}/>
            
            <Text style={{  color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, fontSize: 17}}>
              Currency
            </Text>

            {this.renderCurrency(this.state.currency)}


            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 20, marginRight: 20, height:1, width: '90%'}}/>
            
            <Text style={{  color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, fontSize: 17}}>
              Location
            </Text>

            {this.renderLocation(this.state.city)}

            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 20, marginRight: 20, height:1, width: '90%'}}/>
            
            <Text style={{  color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, fontSize: 17}}>
              Category
            </Text>

            {this.renderCategory(this.state.category)}

            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 20, marginRight: 20, height:1, width: '90%'}}/>
            
            <Text style={{  color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, fontSize: 17}}>
              Gender Preference
            </Text>

            {this.renderGenderPreference()}

             <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 20, marginRight: 20, height:1, width: '90%'}}/>

            <Text style={{  color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, fontSize: 17}}>
              Job Type Preference
            </Text>

            {this.renderJobPreference()}
            

            <View 
              style={{ backgroundColor: 'white', marginLeft: 20, marginTop:20, marginRight: 20, height:1, width: '90%'}}/>

      

        </ScrollView>

        

        
        <View style={styles.footer}>
            <Touchable 
                style={styles.applyFilterButton}
                onPress={() => 
                  this.setState({
                    filterPressed: true,
                  }, () => {
                    setTimeout(function () {
                      this.props.navigation.goBack()
                    }.bind(this), 50)
                  })
                }
                background={Touchable.Ripple(colors.ripplegray)}>
            
                <Text style={styles.applyFilterButtonText}>
                    Apply Filter
                </Text>

            </Touchable>
        </View>

      </View >

    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: colors.themeblue,
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:5,
    height:70,
    borderBottomWidth: 1,
    borderColor: "#CED0CE",
  },
  headerText: {
    color: colors.greyBlack,
    fontSize: 20,
  },
  applyFilterButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: colors.themeblue,
  },
  applyFilterButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: 80,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray05,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

FilterJob.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};


