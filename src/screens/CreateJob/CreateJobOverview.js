
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
import apis from '../../styles/apis';
import transparentHeaderStyle from '../../styles/navigation';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import PostJobSuccessModal from '../../components/PostJobSuccessModal';
import iPhoneSize from '../../helpers/utils';

import axios from 'axios';
import {NavigationActions, StackActions} from 'react-navigation';  
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

const loginPhoto = require('../../img/loginphoto_blurred.png');
const androidbackIcon = require('../../img/android_back_black.png');
const iosbackIcon = require('../../img/ios_back_black.png');
const chevRightIcon = require('../../img/right_chevron.png');

const wagesIcon = require('../../img/wages.png');
const datesIcon = require('../../img/dates2.png');
const genderIcon = require('../../img/gender1.png');
const infoIcon = require('../../img/info.png');
const categoryIcon = require('../../img/profile_work.png');
const locationIcon = require('../../img/location2.png');
const jobtypeIcon = require('../../img/jobtype.png');
const jobpaymentIcon = require('../../img/jobpayment.png');

let headingTextSize = 30;
let termsTextSize = 17;
if (iPhoneSize() === 'small') {
  headingTextSize = 26;
  termsTextSize = 16;
}

const backtoMain = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'EmployerLoggedInTabNavigator'})
  ] 
})

class CreateJobOverview extends Component {
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
      userid: null,
      formValid: false,
      loadingVisible: false,
      showPostJobSuccessModal: false,
      title: null,
      descrip: null,
      category: null,
      location: null,
      jobtype: null,
      salary: null,
      currency: null,
      rates: null,
      payment: null,
      date: null,
      commitment: null,
      daysperweek: null,
      gender: null,
      editJob: false,
      postkey: null,
    };

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    
    this.handleNextButton = this.handleNextButton.bind(this);

    this.onEditJobSalaryClose = this.onEditJobSalaryClose.bind(this);
    this.onEditJobDescripClose = this.onEditJobDescripClose.bind(this);
    this.onEditJobCategoryClose = this.onEditJobCategoryClose.bind(this);
    this.onEditJobLocationClose = this.onEditJobLocationClose.bind(this);
    this.onEditJobTypeClose = this.onEditJobTypeClose.bind(this);
    this.onEditJobPaymentClose = this.onEditJobPaymentClose.bind(this);
    this.onEditJobDateClose = this.onEditJobDateClose.bind(this);
    this.onEditJobPreferenceClose = this.onEditJobPreferenceClose.bind(this);
 
  }

   componentWillMount() {
   
    const { navigation } = this.props;
   
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
    const gender = navigation.getParam('gender');

    const userid = this.props.getUserid.userid;
    const editJob = navigation.getParam('editJob');
    const postkey = navigation.getParam('postkey');

    this.setState({
      title: title,
      descrip: descrip,
      category: category,
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

      userid: userid,
      editJob: editJob,
      postkey: postkey,
    })

  }

  handleNextButton() {
    Keyboard.dismiss();

    this.setState({ loadingVisible: true, });
    
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;

    const { 
      title,
      descrip,
      category,
      location,
      jobtype,
      salary,
      currency,
      rates,
      payment,
      date,
      commitment,
      daysperweek,
      gender,

      userid,
      editJob,
      postkey,
    } = this.state;

    var locationsubstring = location.address.split(', ');
   
    var city = locationsubstring[locationsubstring.length - 2 === -1 ? 0 : locationsubstring.length - 2];

    var cityname = this.checkCityName(city);
  
    var finaldata = {
		    category : category.title,
        categoryimage : category.image,
        city : cityname,
        closed : "false",
        date: date ? date.date : undefined,
        desc : descrip,
        fulladdress : location.name === undefined ? location.address : location.name  + ', ' + location.address,
        latitude : location.latitude,
        longitude : location.longitude,
        lowertitle : title.toLowerCase(),
        postimage : undefined,
        time : new Date().getTime(),
        title : title,
        userid : userid,
        currency : currency,
        rate: rates,
        wages : salary,
        jobtype: jobtype,
        startingdate : date ? date.startingdate : undefined,
        gender: gender ? gender : 'unisex',
        payment: payment,
        commitment: commitment,
        daysperweek: daysperweek,
        location: {type: "Point", coordinates: [location.longitude, location.latitude]}
    }

    //alert(JSON.stringify(finaldata))

    var jwtToken = this.props.getJWTToken.jwttoken;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var postjoburl = apis.JOB_BASEURL + 'userid=' + userid;

    var updatejoburl = apis.UPDATEjob_BASEURL + 'userid=' + userid + '&postkey=' + postkey;

    if (editJob) {
      axios.put(updatejoburl, finaldata,  {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({ loadingVisible: false, showPostJobSuccessModal: true});
        }
        
      })
      .catch((error) => {
        //alert(error)
        this.setState({ loadingVisible: false, formValid: true});
      });
    }
    else {
      axios.post(postjoburl, finaldata,  {headers: headers})
      .then((response) => {

        if (response.status === 201) {
          this.setState({ loadingVisible: false, showPostJobSuccessModal: true});
        }
        
      })
      .catch((error) => {
        //alert(error)
        this.setState({ loadingVisible: false, formValid: true});
      });
    }

  }

  checkCityName = (cityname) => {
    var city;
    if (cityname.indexOf('Johor') !== -1) {
        city = 'Johor';
    }
    else if (cityname.indexOf('Kedah') !== -1) {
        city = 'Kedah';
    }
    else if (cityname.indexOf('Kelantan') !== -1) {
        city = 'Kelantan';
    }
    else if (cityname.indexOf('Kuala Lumpur') !== -1) {
        city = 'Kuala Lumpur';
    }
    else if (cityname.indexOf('Labuan') !== -1) {
        city = 'Labuan';
    }
    else if (cityname.indexOf('Melacca') !== -1 || cityname.indexOf('Melaka') !== -1) {
        city = 'Melacca';
    }
    else if (cityname.indexOf('Negeri Sembilan') !== -1) {
        city = 'Negeri Sembilan';
    }
    else if (cityname.indexOf('Pahang') !== -1) {
        city = 'Pahang';
    }
    else if (cityname.indexOf('Penang') !== -1 || cityname.indexOf('Pulau Pinang') !== -1) {
        city = 'Penang';
    }
    else if (cityname.indexOf('Perak') !== -1) {
        city = 'Perak';
    }
    else if (cityname.indexOf('Perlis') !== -1) {
        city = 'Perlis';
    }
    else if (cityname.indexOf('Putrajaya') !== -1) {
        city = 'Putrajaya';
    }
    else if (cityname.indexOf('Sabah') !== -1) {
        city = 'Sabah';
    }
    else if (cityname.indexOf('Sarawak') !== -1) {
        city = 'Sarawak';
    }
    else if (cityname.indexOf('Selangor') !== -1) {
        city = 'Selangor';
    }
    else if (cityname.indexOf('Terengganu') !== -1) {
        city = 'Terengganu';
    }
    return city;
  }

  handleCloseNotification() {
    this.setState({ formValid: false });
  }

  onEditViewPressed = (navigation, gotoView) => {
      if (gotoView === 'CreateJobDescrip') {
        navigation.push(
            gotoView, 
            { 
                onEditJobDescripClose: this.onEditJobDescripClose,
                edit: true,
                title: this.state.title,
                descrip: this.state.descrip,
            }
        );
      }
      else if (gotoView === 'CreateJobCategory') {
        navigation.push(
            gotoView, 
            { 
                onEditJobCategoryClose: this.onEditJobCategoryClose,
                edit: true,
                category: this.state.category,
            }
        );
      }
      else if (gotoView === 'CreateJobLocation') {
        navigation.push(
            gotoView, 
            { 
                onEditJobLocationClose: this.onEditJobLocationClose,
                edit: true,
                location: this.state.location,
            }
        );
      }
      else if (gotoView === 'CreateJobType') {
        navigation.push(
            gotoView, 
            { 
                onEditJobTypeClose: this.onEditJobTypeClose,
                edit: true,
                jobtype: this.state.jobtype,
            }
        );
      }
      else if (gotoView === 'CreateJobSalary') {
        navigation.push(
            gotoView, 
            { 
                onEditJobSalaryClose: this.onEditJobSalaryClose,
                edit: true,
                salary: this.state.salary,
                currency: this.state.currency,
                rates: this.state.rates,
            }
        );
      }
      else if (gotoView === 'CreateJobPayment') {
        navigation.push(
            gotoView, 
            { 
                onEditJobPaymentClose: this.onEditJobPaymentClose,
                edit: true,
                payment: this.state.payment,
            }
        );
      }
      else if (gotoView === 'CreateJobDate') {
        navigation.push(
            gotoView, 
            { 
                onEditJobDateClose: this.onEditJobDateClose,
                edit: true,
                date: this.state.date,
                commitment: this.state.commitment,
                daysperweek: this.state.daysperweek,
                jobtype: this.state.jobtype,
            }
        );
      }
      else if (gotoView === 'CreateJobPreference') {
        navigation.push(
            gotoView, 
            { 
                onEditJobPreferenceClose: this.onEditJobPreferenceClose,
                edit: true,
                gender: this.state.gender,
            }
        );
      }
    
  }

  onEditJobDescripClose(edited, title, descrip,) {
      if (edited) {
        this.setState({
            title,
            descrip
        })
      }
  }

  onEditJobCategoryClose(edited, category) {
    if (edited) {
      this.setState({
          category
      })
    }
  }

  onEditJobLocationClose(edited, location) {
    if (edited) {
      this.setState({
          location,
      })
    }
  }

  onEditJobTypeClose(edited, jobtype) {
    if (edited) {
      this.setState({
          jobtype,
      })
    }
  }

  onEditJobSalaryClose(edited, salary, currency, rates) {
    if (edited) {
      this.setState({
          salary: salary,
          currency: currency,
          rates: rates,
      })
    }
  }

  onEditJobPaymentClose(edited, payment) {
    if (edited) {
      this.setState({
          payment,
      })
    }
  }

  onEditJobDateClose(edited, date, commitment, daysperweek, jobtype,) {
    if (edited) {
      this.setState({
          date,
          commitment,
          daysperweek,
          jobtype,
      })
    }
  }

  onEditJobPreferenceClose(edited, gender) {
    if (edited) {
      this.setState({
          gender,
      })
    }
  }

  onOKPressed = (navigation) => {

    navigation.dispatch(backtoMain);

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

  renderView(content, nocontent, gotoView, iconname) {
    return (

      <TouchableOpacity 
        style={{ margin:0, paddingBottom: gotoView === 'CreateJobPreference'? 20 : 0}}
        onPress={this.onEditViewPressed.bind(this, this.props.navigation, gotoView)}
      >
     
        <View style={{ flex:1,  paddingTop:20, paddingBottom: 10, flexDirection: 'row'}}>

          <Image
            style={{ justifyContent:'center', marginLeft:  gotoView === 'CreateJobSalary'? 5 : 10, marginRight: 10, alignSelf:'center', height: gotoView === 'CreateJobSalary'? 25 : 20, width: gotoView === 'CreateJobSalary'? 25 : 20, }}
            source={iconname}
          />
         
          {content ?
          <Text style={{  color: colors.greyBlack, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 15}}>
                {content}
          </Text> 
          :
          <Text style={{  color: 'grey', flex:1, lineHeight: 30, marginHorizontal: 10, fontSize: 15}}>
                {nocontent}
          </Text>
          }

          <Image
            style={{ justifyContent:'center', marginLeft: 10, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
            source={chevRightIcon}
          />
 
        </View>

      </TouchableOpacity>
     
    )
  }


  render() {
    const {
      formValid, 
      loadingVisible,
      showPostJobSuccessModal,
      title,
      descrip,
      category,
      location,
      jobtype,
      salary,
      currency,
      rates,
      payment,
      date,
      commitment,
      daysperweek,
      gender,
      editJob,
    } = this.state;
    
    const notificationMarginTop = formValid ? 10 : 0;
    const locationtxt = location ? location.name === undefined ? location.address : location.name + ', ' + location.address : null;
    const salarytxt = salary && currency && rates ? currency + ' ' + salary + ' ' + rates : null;
    const datestxt = commitment && daysperweek ? commitment + ' (' + daysperweek + ') ' : date ? date.date : null;

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
              {editJob ? 'Edit Job' : 'Almost done!'}
            </Text>

            <Text style={{  color: colors.greyBlack, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
              Title
            </Text>

            {this.renderView(title, 'No Title', 'CreateJobDescrip', null)}

            <Text style={{  color: colors.greyBlack, marginTop: 20, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
              Description
            </Text>

            {this.renderView(descrip, 'No Description', 'CreateJobDescrip', infoIcon)}

            <Text style={{  color: colors.greyBlack, marginTop: 20, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
              Category
            </Text>

            {this.renderView(category ? category.title : null, 'No Category', 'CreateJobCategory', categoryIcon)}

            <Text style={{  color: colors.greyBlack, marginTop: 20, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
              Location
            </Text>

            {this.renderView(locationtxt, 'No Location', 'CreateJobLocation', locationIcon)}

            <Text style={{  color: colors.greyBlack, marginTop: 20, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
              Job Type
            </Text>

            {this.renderView(jobtype, 'No Job Type', 'CreateJobType', jobtypeIcon)}

            <Text style={{  color: colors.greyBlack, marginTop: 20, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
              Salary
            </Text>

            {this.renderView(salarytxt, 'No Salary', 'CreateJobSalary', wagesIcon)}

            {jobtype === 'Part Time (Short Term)' ? 

            <View>
            
              <Text style={{  color: colors.greyBlack, marginTop: 20, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
                Payment
              </Text>

              {this.renderView(payment, 'No Payment ', 'CreateJobPayment', jobpaymentIcon)}

            </View>

            : null
            
            }

            <Text style={{  color: colors.greyBlack, marginTop: 20, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
              date
            </Text>

            {this.renderView(datestxt, 'No date Selected' , 'CreateJobDate', datesIcon)}

            <Text style={{  color: colors.greyBlack, marginTop: 20, fontWeight: '500', paddingLeft:10, paddingRight:10, fontSize: 15}}>
              Preference
            </Text>

            {this.renderView(gender, 'No Preference', 'CreateJobPreference', genderIcon)}

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

        <PostJobSuccessModal
          modalVisible={showPostJobSuccessModal}
          animationType="fade"
          txtmsg={this.state.editJob? "Successfully updated job!" : "Successfully posted job! Your job is live now!"}
          handleOnPress={this.onOKPressed.bind(this, this.props.navigation)}
        />

        <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
          <Notification
            showNotification={formValid}
            handleCloseNotification={this.handleCloseNotification}
            type="Failed"
            firstLine = "An error occured"
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
    marginHorizontal: 10,
  },
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
  getUserid: state.getUserid,
});

export default connect(mapStateToProps)(CreateJobOverview);

