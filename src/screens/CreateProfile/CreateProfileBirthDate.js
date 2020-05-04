
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
  StyleSheet,
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
import styles from './styles/CreateProfileBirthDate';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';


const loginPhoto = require('../../img/loginphoto_blurred.png');

class CreateProfileBirthDate extends Component {
  static navigationOptions = ({ navigation }) => ({
   
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      validDate: false,
      loadingVisible: false,
      date: "",
    };

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleBirthDateChange = this.handleBirthDateChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }


  handleNextButton = (navigation,) => {
    Keyboard.dismiss();
   // this.setState({ loadingVisible: true });
    const { logIn } = this.props;
    const { navigate } = navigation;

    const { date } = this.state;

    navigate('CreateProfileWorkExperience', {
      birth: date,
    });

  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  handleBirthDateChange= (date) => {

    this.setState({  date: date, });

    if (date != "") {
      this.setState({ 
        validDate: true,
      });
    } 
    else {
      this.setState({ 
        validDate: false,
       });
    }
  }


  toggleNextButtonState() {
    const { validDate } = this.state;
    if (validDate) {
      return false;
    }
    return true;
  }


  render() {
    const {
      formValid, loadingVisible, validDate,
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;

    const { navigation } = this.props;

    var todaydate = new Date();
    var year = todaydate.getFullYear();
    var month = todaydate.getMonth();
    var day = todaydate.getDate();      
    var maximumD = new Date(year -14 , month, day)
    var minimumD = new Date(year - 60, month, day)

    Moment.locale('en');
    var maxDate = Moment(maximumD).format('DD MMM YYYY')
    var minDate = Moment(minimumD).format('DD MMM YYYY')

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
              When is your birthday?
            </Text>

            <Text style={{ fontWeight: '700', color: 'white', fontSize: 15 , marginBottom: 50, lineHeight: 25,}}>
              User has to be above 14 years old in order to work legally. Others won't see your birthday.
            </Text>

            <Text style={{ fontWeight: '700', color: 'white', fontSize: 14 , marginBottom: 20,}}>
              BIRTHDAY
            </Text>

            <View style={{ 
              display: 'flex', 
              flex:1, 
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderTopWidth: 0,
              borderBottomWidth: 1,
              borderColor: 'white',
              flexDirection: 'row',}}>

              <DatePicker
                customStyles={customStyles}
                style={{ flex: 1}}
                date={this.state.date}
                mode="date"
                placeholder="    /    /    "
                format="DD MMM YYYY"
                minDate={minDate}
                maxDate={maxDate}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                iconSource={null}
                onDateChange={this.handleBirthDateChange}
              />

            </View>

          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton.bind(this, 
              this.props.navigation, )}
           
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

const customStyles = StyleSheet.create({
  dateIcon: {
    position: 'absolute',
    left: 0,
    top: 4,
    marginLeft: 0
  },
  dateInput: {
    display: 'flex',
    flex: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'white',
    alignItems: 'flex-start',
  },
  placeholderText: {
    fontSize: 15,
  },
  dateText:{
    color: colors.white,
    fontSize: 14,
    fontWeight: '400',
    justifyContent: 'flex-start',
  }
});

CreateProfileBirthDate.propTypes = {
  logIn: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default CreateProfileBirthDate;
