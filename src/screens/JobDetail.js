
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Modal,
  NetInfo,
  Animated,
  Easing,
  Linking,
  Alert,
  ToastAndroid,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import transparentHeaderStyle from '../styles/navigation';
import NavBarButton from '../components/buttons/NavBarButton';
import Notification from '../components/Notification';
import CalendarViewModal from '../components/CalendarViewModal';
import Loader from '../components/Loader';
import colors from '../styles/colors';
import apis from '../styles/apis';

import * as Animatable from 'react-native-animatable';
import ReadMore from 'react-native-read-more-text';
import Touchable from 'react-native-platform-touchable';
import ImageViewer from 'react-native-image-zoom-viewer';
import ActionSheet from 'react-native-actionsheet'
import axios from 'axios';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import firebase from 'react-native-firebase';
import Share, {ShareSheet, Button} from 'react-native-share';
import ActionCreators from '../redux/actions';

import deviceStorage from '../helpers/deviceStorage';

const wagesIcon = require('../img/wages.png');
const datesIcon = require('../img/dates2.png');
const companyIcon = require('../img/company2.png');
const jobtypeIcon = require('../img/jobtype.png');
const jobpaymentIcon = require('../img/jobpayment.png');
const genderIcon = require('../img/gender1.png');
const locationIcon = require('../img/location2.png');
const savedIcon = require('../img/heart_filled.png');
const saveIcon = require('../img/heart_outline.png');
const shareIcon = require('../img/share2.png');
const infoIcon = require('../img/info.png');

const androidblackBackIcon = require('../img/android_back_black.png');
const androidwhiteBackIcon = require('../img/android_back_white.png');
const iosblackBackIcon = require('../img/ios_back_black.png');
const ioswhiteBackIcon = require('../img/ios_back_white.png');
const moreBlackIcon = require('../img/ellipsis_black.png');
const moreWhiteIcon = require('../img/ellipsis_white.png');

const userimagedefault = require('../img/defaultProfilePhoto.png');
const errorImg = require('../img/gender1.png');
const internetIcon = require('../img/wifi.png');

const chefIcon = require('../img/chef_background.jpg');

const navigateToOtherUserProfile = NavigationActions.navigate({
  routeName: 'OtherUserProfile',
});

const SLIDE_IN_DOWN_KEYFRAMES = {
  from: { translateY: -50 },
  to: { translateY: 0 },
};

const SLIDE_IN_UP_KEYFRAMES = {
  from: { translateY: 0 },
  to: { translateY: -80 },
};

const images = [{
  // Simplest usage.
  url: 'http://graph.facebook.com/1811964245493623/picture?type=large&width=1080',
  // You can pass props to <Image />.
  props: {
      // headers: ...
  },
  freeHeight: true 
}]

class JobDetail extends Component {
  static navigationOptions = ({ navigation })=> {
    const { params = {} } = navigation.state;
    return {
      header: null,
    /*headerStyle: {transparentHeaderStyle},
    headerTransparent: true,
    headerTintColor: colors.white,
    title: "Job Details",
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 17,
      color: colors.greyBlack,
    },
    headerLeft:
    <TouchableOpacity 
      
        style={{marginLeft: 20,}}
        onPress={() => navigation.goBack() } >

        <Image
            style={{ height: 30, width: 30,}}
            source={Platform.OS === 'android' ? androidwhiteBackIcon : ioswhiteBackIcon}
        />
    
    </TouchableOpacity>,
    headerRight:
    <TouchableOpacity 
        style={{marginRight: 20,}}
        onPress={() => navigation.state.params.handleHeaderPressed() } >

        <Image
            style={{ height: 30, width: 30,}}
            source={moreWhiteIcon}
        />
    
    </TouchableOpacity>*/
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      showAppliedNotification: false,
      errortype: "",
      loadingVisible: true,
      isLoading: false,
      measures: 0,
      header: false,
      animation: '',
      firstopen: true,
      categorybannerlist: null,
      showImage: false,
      userid: null,
      ownuserName: null,

      error: null,
      totalapplicants: 0,
      _id: null,
      category: null,
      categoryimage: null,
      jobtype: null,
      commitment: null,
      daysperweek: null,
      payment: null,
      title: null,
      currency: null,
      rate: null,
      wages: null,
      date: null,
      company: null,
      gender: null,
      createdAt: null,
      descrip: null,
      address: null,
      longitude: null,
      latitude: null,
      jobownerUid: null,
      jobownerName: null,
      jobownerImage: null,
      imageBroken: false,
      jobowneronline: null,

      status: false,

      internetStatus: false,

      progress: new Animated.Value(0),

      jwt: null,
    };

  }

  componentWillMount() {

    const { navigation } = this.props;

    const _id = navigation.getParam('_id');

    this.setState({
        _id: _id,
        jwt: this.props.getJWTToken.jwttoken,
        userid: this.props.getUserid.userid,
    }, () => {
        this.getList();
        this.fetchData();
        this.fetchJobStatus();
        this.fetchOwnUserData();
    });
  }

  componentDidMount() {

    this.props.navigation.setParams({ handleHeaderPressed: this.showActionSheet });
    this.startAnimation();
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ internetStatus: isConnected }); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ internetStatus: isConnected });
    console.log(`is connected: ${this.state.internetStatus}`);
  }

  fetchJobStatus = () => {

    const {_id, userid} = this.state;

    var url = apis.GETJobSeekerJobs_BASEURL+'postkey='+_id +'&userid='+ userid + '&limit='+ 1;
  
    axios.get(url)
    .then((response) => {
      var data = response.data[0].paginationdata;
      if (data && data.length > 0) {
        this.setState({
          status: data[0].status,
        })
      }
    })
    .catch((error) => {
    });

  }

  fetchData = () => {

    const { _id } = this.state;

    console.log("fetchData");

    var url = apis.JOB_BASEURL+'&_id='+_id;

    axios.get(url)
    .then((response) => {
      console.log("data = " + JSON.stringify(response.data) );
      this.setState({
        error: false,
        category: response.data[0].category,
        categoryimage: response.data[0].categoryimage,
        jobtype: response.data[0].jobtype,
        commitment:  response.data[0].commitment,
        daysperweek: response.data[0].daysperweek,
        payment: response.data[0].payment,
        title: response.data[0].title,
        wages: response.data[0].wages,
        currency: response.data[0].currency,
        rate: response.data[0].rate,
        date: response.data[0].date,
        company: response.data[0].company,
        gender: response.data[0].gender,
        createdAt: response.data[0].time,
        descrip: response.data[0].desc,
        address: response.data[0].fulladdress,
        longitude: response.data[0].longitude,
        latitude: response.data[0].latitude,
        jobownerUid: response.data[0].userid,
        totalapplicants: response.data[0].totalapplicants,

        loadingVisible: false,
      }, () => {
        this.fetchJobOwnderData();
      });
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        error: true,
        loadingVisible: false,
      })
    });
  }

  fetchJobOwnderData = () => {

    const { jobownerUid } = this.state;

    var url = apis.GETEmployer_BASEURL+'userid='+ jobownerUid;

    axios.get(url)
    .then((response) => {
      console.log("data = " + JSON.stringify(response.data) );
      this.setState({
        jobownerName: response.data[0].name,
        jobownerImage: response.data[0].employerdetails[0].profileimage,
        company: response.data[0].company,
        jobowneronline: response.data[0].employerdetails[0].online,
      })
    })
    .catch((error) => {
      console.log(error);
    });

  }

  fetchOwnUserData = () => {

    const { userid } = this.state;

    var url = apis.GETUser_BASEURL+'userid='+ userid;

    axios.get(url)
    .then((response) => {
      console.log("data = " + JSON.stringify(response.data) );
      this.setState({
        ownuserName: response.data[0].name,
      })
    })
    .catch((error) => {
      console.log(error);
    });

  }

  getList = () => {
    const categorybannerlist = 
      {
        'Barista / Bartender': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/barista_bartendar.jpg',
        'Beauty / Wellness': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/beauty_wellness.jpg',
        'Chef / Kitchen Helper': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/chef.jpg',
        'Event Crew': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/eventcrew.jpg',
        'Emcee': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/emcee.jpg',
        'Education': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/education.jpg',
        'Fitness / Gym': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/fitness_gym.jpg',
        'Modelling / Shooting': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/modelling_shooting.jpg',
        'Mascot': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/mascot.jpg',
        'Office / Admin': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/office_admin.jpg',
        'Promoter / Sampling': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/promoter_sampling.jpg',
        'Roadshow': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/roadshow.jpg',
        'Roving Team': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/roving.jpg',
        'Retail / Consumer': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/retail_consumer.jpg',
        'Serving': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/serving.jpg',
        'Usher / Ambassador': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/usher.jpg',
        'Waiter / Waitress': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/waiter.jpg',
        'Other': 'https://s3-ap-southeast-1.amazonaws.com/24hires/categorybanner/other.jpg',
      };
      
    this.setState({
      categorybannerlist: categorybannerlist
    },() => {
      
    })
    
  }

  getcategorybanner = (category) => {
    var categorybanneruri;
    categorybanneruri = this.state.categorybannerlist[category];
    return categorybanneruri;
  }

  showActionSheet = () => {
    (this.state.error || !this.state.internetStatus) ?  null: this.ActionSheet.show()
  }


  JobReportPressed = (index) => {

    const { jobownerUid, _id, userid, jwt } = this.state;

    var options = ['Offensive or Inappropriate', 'Spam', 'Fraud', 'Irrelevant', 'Cancel'];

    var url = apis.POSTJobReport_BASEURL+'userid='+ userid;

    var reportdata = {
      userid : userid,
      reportedid : jobownerUid,
      jobid: _id,
      time : Date.now(),
      type : options[index]
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    if (index !== 4) {
      axios.post(url, reportdata, { headers: headers } )
      .then((response) => {
        Alert.alert("Report Listing", "Thank you for your feedback. We take abuse seriously and will take appropriate action.")
      })
      .catch((error) => {
      });
    }
  }

  UserReportPressed = (index) => {
    
    const { jobownerUid, _id, userid, jwt } = this.state;

    var options = ['Offensive or Inappropriate', 'Spam', 'Fraud', 'Irrelevant', 'Cancel'];

    var url = apis.POSTUserReport_BASEURL+'userid='+ userid;

    var reportdata = {
      userid : userid,
      reportedid : jobownerUid,
      time : Date.now(),
      type : options[index]
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    if (index !== 4) {

      axios.post(url, reportdata, { headers: headers } )
      .then((response) => {
        Alert.alert("Report Listing", "Thank you for your feedback. We take abuse seriously and will take appropriate action.")
      })
      .catch((error) => {
      });
    }
  }

  shareBtnPressed = () => {

    let shareOptions = {
      title: '',
      message: 'Hey, Check out this job on 24Hires! ',
    };

    this.setState({
      isLoading: true,
    })
    const link = new firebase.links.DynamicLink( 'https://24hires.com/?jobpost=' + this.state._id , 'vh87a.app.goo.gl')
        .android.setPackageName('com.twentyfourhires')
        .ios.setBundleId('com.jobseed.jobseed.zjheng')
        .social.setTitle(this.state.title)
        .social.setImageUrl(this.state.categoryimage)
        .social.setDescriptionText(this.state.descrip);

    firebase.links()
        .createShortDynamicLink(link, 'UNGUESSABLE')
        .then((url) => {
          shareOptions.url = url;
          Share.open(shareOptions);
          this.setState({
            isLoading: false,
          })
        });
  }

  saveBtnPressed = () => {

    const { setSavedJob } = this.props;
   
    const {userid, jwt, _id, status } = this.state;

    var finaldata = {
      userid: userid, //own userid
      time: new Date().getTime(),
      postkey: _id,
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    var updateurl = apis.PUTJobSeekerJobs_BASEURL+'postkey='+_id +'&userid='+ userid +'&authid='+ userid;
    var deleteurl = apis.DELETEJobSeekerJobs_BASEURL+'postkey='+_id +'&userid='+ userid +'&authid='+ userid;
  
    if (status === 'saved') {

      finaldata.status = "delete"

      this.setState({
        status: null,
      })

      axios.delete(deleteurl, {headers: headers})
      .then((response) => {  
      //  alert(JSON.stringify(response))
        setSavedJob(finaldata);
      })
      .catch((error) => {
     //   alert(error)
      });

      ToastAndroid.show('Job unsaved!', ToastAndroid.SHORT);

    }
    else {

      finaldata.status = "saved"

      this.setState({
        status: 'saved',
      })

      axios.put(updateurl, finaldata,  {headers: headers})
      .then((response) => {
        //alert(JSON.stringify(response));
        setSavedJob(finaldata);
      })
      .catch((error) => {
     //   alert(error)
      });

      ToastAndroid.show('Job successfully saved!', ToastAndroid.SHORT);

    }

  }

  applyBtnPressed = () => {

    const { setAppliedJob, setSavedJob } = this.props;

    this.setState({
      isLoading: true,
    })

    //Update status to applied

    const {userid, jwt, _id, status, jobownerUid } = this.state;

    var savedjobdata = {
      userid: userid,  //own userid
      time: new Date().getTime(),
      postkey: _id,
      status: "delete",
    }

    var finaljobdata = {
      userid: userid,
      time: new Date().getTime(),
      postkey: _id,
      status: "applied",
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    var updatejoburl = apis.PUTJobSeekerJobs_BASEURL+'postkey='+_id +'&userid='+ userid +'&authid='+ userid;
 
    axios.put(updatejoburl, finaljobdata,  {headers: headers})
    .then((response) => {
      if (response.status === 200) {
        this.updateApplicant();
        setAppliedJob(finaljobdata);
        setSavedJob(savedjobdata);
      }
    })
    .catch((error) => {
      this.setState({
        isLoading: false,
      })
    });
  }

  updateApplicant = () => {
    //Insert as new pending applicant

    const {userid, jwt, _id, status, jobownerUid } = this.state;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    var finalapplicantdata = {
      userid: jobownerUid, //Job Owner UID
      time: new Date().getTime(),
      new: true,
      postkey: _id,
      status: "pending",
      applicantid: userid, //Applying User UID
    }

    var updateapplicanturl = apis.PUTApplicant_BASEURL+'postkey='+_id +'&userid='+ jobownerUid +'&applicantid='+ userid +'&authid='+ userid;

    axios.put(updateapplicanturl, finalapplicantdata,  {headers: headers})
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          isLoading: false, status: 'applied', totalapplicants: this.state.totalapplicants + 1,
        })
        this.sendPushNotification();
      }
      else {
        this.setState({
          isLoading: false,
        })
      }
      
    })
    .catch((error) => {
      this.setState({
        isLoading: false,
      })
    });
  }

  sendPushNotification = () => {

    const {userid, jobownerUid, ownuserName } = this.state;

    var notificationbody = {
      senderUid: userid,
      ownerName: ownuserName,
      receiverUid: jobownerUid,
      type: 'newapplicant'
    }

    var url = apis.PUSHNotification_BASEURL;

    axios.post(url, notificationbody,  {headers: headers})
    .then((response) => {
      console.log('send push notification success')
    })
    .catch((error) => {
     
    });
  
  }

  renderBackButton(btncolor) {
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
            onPress={() => this.props.navigation.goBack()}
        >

        {btncolor === "white" ? 
        <Image
            style={{ 
              height: 30,
              width: 30,
            }}
            source={Platform.OS == 'android' ? androidwhiteBackIcon : ioswhiteBackIcon }
          />
        :
        <Image
            style={{ 
              height: 30,
              width: 30,
            }}
            source={Platform.OS == 'android' ? androidblackBackIcon : iosblackBackIcon}
          />
        }
        </TouchableOpacity>
    )
  }

  
  renderMoreButton(btncolor) {
    return (
      <TouchableOpacity
          style={{ 
            position:'absolute', 
            right:10, 
            top:20, 
            zIndex:10,
            padding:10, 
            height: 50,
            width: 50,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'transparent'}}
            onPress={this.showActionSheet}
        >

        {btncolor === "white" ? 
        <Image
            style={{ 
              height: 30,
              width: 30,
            }}
            source={moreWhiteIcon}
          />
        :
        <Image
            style={{ 
              height: 30,
              width: 30,
            }}
            source={moreBlackIcon}
          />
        }
        </TouchableOpacity>
    )
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: colors.priceblue, marginTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    );
  }
 
  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: colors.priceblue, marginTop: 5}} onPress={handlePress}>
        Show less
      </Text>
    );
  }
 
  _handleTextReady = () => {
    // ...
  }

  startAnimation() {
    
    Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
    }).start(() => {
        this.setState({
            progress: new Animated.Value(0),
        })    
        this.startAnimation();
    });
  }

  handleScroll(event){
    if (event.nativeEvent.contentOffset.y > this.state.measures) {
      this.setState({
        header: true,
        animation: 'slideInDown',
        firstopen: false
      })
    }
    else {
      this.setState({
        header: false,
        animation: 'slideInUp',
      })
    }

  }

  renderWages(currency, wages, rate) {
    return(
      <View 
        style={{marginLeft: 20, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

        <Image
          style={{ height: 30, width: 30}}
          source={wagesIcon}
        />

        <Text style={{ flex: 1, marginTop:5, marginLeft: 20 , color: colors.greyBlack, fontSize: 15}}>
            {currency ? currency : 'N/A'} {wages ? wages : null} {rate ? rate.replace(/per/, '/') : null}
        </Text>

      </View>
    )
  }

  renderDate(date) {
    return (
      <View 
        style={{marginLeft: 25, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

        <Image
          style={{ height: 25, width: 25}}
          source={datesIcon}
        />

        <Text style={{ alignSelf: 'center', justifyContent: 'center', flex: 1, marginLeft: 20 , color: colors.greyBlack,fontSize: 15}}>
            {date} 
        </Text>

      </View>
    )
  }

  renderJobType(jobtype) {
    return (
      <View 
        style={{marginLeft: 25, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

        <Image
          style={{ height: 25, width: 25}}
          source={jobtypeIcon}
        />

        <Text style={{ alignSelf: 'center', justifyContent: 'center', flex: 1, marginLeft: 20 , color: colors.greyBlack,fontSize: 15}}>
            {jobtype} 
        </Text>

      </View>
    )
  }

  renderCommitment(commitment, daysperweek) {
    return (
      <View 
        style={{marginLeft: 25, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

        <Image
          style={{ height: 25, width: 25}}
          source={datesIcon}
        />

        <Text style={{ alignSelf: 'center', justifyContent: 'center', flex: 1, marginLeft: 20 ,color: colors.greyBlack,fontSize: 15}}>
            {daysperweek} / {commitment} 
        </Text>

      </View>
    )
  }

  renderPayment(payment) {
    return (
      <View 
        style={{marginLeft: 25, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

        <Image
          style={{ height: 25, width: 25}}
          source={jobpaymentIcon}
        />

        <Text style={{ alignSelf: 'center', justifyContent: 'center', flex: 1, marginLeft: 20 , color: colors.greyBlack,fontSize: 15}}>
            {payment} 
        </Text>

      </View>
    )
  }

  renderGender(gender) {
    return (
      <View 
        style={{marginLeft: 25, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

        <Image
          style={{ height: 25, width: 25}}
          source={genderIcon}
        />

        <Text style={{ flex: 1, color: colors.greyBlack, marginLeft: 20 ,fontSize: 15}}>
            {gender && gender !== 'unisex' ? gender : 'No Gender Preference'} 
        </Text>

      </View>
    )
  }

  renderNoInternetView() {
    return (
    
      <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>
         
          <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
              <Image 
                style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                source={internetIcon} />
              <Text
                  style={{ fontSize: 17, marginTop: 20, alignSelf:'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
              >No Internet Connection</Text>
              <TouchableOpacity
                style={{ 
                  borderLeftWidth: 0.5, 
                  borderRightWidth: 0.5, 
                  borderTopWidth: 0,
                  borderBottomWidth: 1,
                  borderColor: '#dddddd', 
                  borderRadius:25,
                  shadowColor: '#000',
                  shadowOffset: {
                      width: 1,
                      height: 1,
                  },
                  shadowOpacity: 0.3,
                  marginTop:20,
                  alignSelf: 'center',
                  paddingTop:10,
                  paddingBottom:10,
                  paddingLeft:20,
                  paddingRight:20,
                  justifyContent:'center',
                  elevation:3,
                  backgroundColor: '#67B8ED'}}
                  onPress={() => 

                    NetInfo.isConnected.fetch().done(
                      (isConnected) => { this.setState({ internetStatus: isConnected }); }
                    )

                  }
            >

              <View style={{flexDirection: 'row'}}>

                <Text style={{ color: 'white', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 15}}>
                      RETRY
                </Text>

              </View>

            </TouchableOpacity>

          </View>

      </View>
  );
}

  renderErrorView() {
    return (
    
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>
           
            <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
                <LottieView 
                  loop={true}
                  style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                  source={Platform.OS == 'android' ? "empty_box.json" : require('../animation/empty_box.json')} progress={this.state.progress} />
                <Text
                    style={{ fontSize: 17, marginTop: 20, alignSelf:'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
                >Oops, item not found</Text>

            </View>

        </View>
    );
  }

  renderJobDetailView(
    showAppliedNotification,
    errortype,
    loadingVisible,
    status,

    error,
    totalapplicants,
    category,
    jobtype,
    commitment,
    daysperweek,
    payment,
    title,
    currency,
    rate,
    wages,
    date,
    company,
    gender,
    createdAt,
    descrip,
    address,
    longitude,
    latitude,
    jobownerUid,
    jobownerName,
    jobownerImage,
    imageBroken,

    createdDate,
    userimage,
    userid,
    jobowneronline,
  ) {
    return (
      <View style={{backgroundColor:'transparent', flex:1}}>
      <ScrollView  
          scrollEventThrottle={16}
          onScroll={this.handleScroll.bind(this)}
          style={{backgroundColor:'transparent', flex:1}}>

          <View>

            <Image
              style={{ height: 200, width: '100%'}}
              source={ {uri: this.getcategorybanner(category) } }
              
            />

            <View 
              onLayout={({nativeEvent}) => {
                this.setState({
                  measures: nativeEvent.layout.y
                })
              }}
              style={{ marginTop:20, marginLeft:20, marginRight:20}}>

              <Text style={{ flex: 1, color: colors.darkOrange, fontWeight: '700', fontSize: 13}}>
                  {category ? category.toUpperCase() : null}
              </Text>

            </View>
            
            <Text style={{ flex: 1, color: colors.greyBlack, fontWeight: '700', marginLeft:20, marginRight:20, marginTop:10, fontSize: 24}}>
                {title ? title : null}
            </Text>

            <View 
              style={{ marginHorizontal: 20, marginTop:20, flexDirection: 'row'}}>

              <TouchableOpacity
                  style={{ 
                    height:50, 
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf:'center',
                    borderRadius: 25, 
                   }}
                    onPress={() => this.props.navigation.navigate({
                      routeName: 'EmployerUserProfile',
                      params: {
                          userid: jobownerUid,
                      },
                    })  
                 }
              >
                <Image
                  style={{ height: 50, width: 50, borderRadius: 25}}
                  source={ imageBroken? userimagedefault : (jobownerImage? userimage : userimagedefault) }
                  onError={() => this.setState({ imageBroken: true })}
                />

                {!jobowneronline ? null :

                <View
                style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 15, width: 15, borderRadius: 15/2, borderWidth: 1, borderColor: 'white'}}/> }

              </TouchableOpacity>

              <Modal 
                backdropOpacity = {1}
                forceToFront={true}
                visible={this.state.showImage}
                transparent={false}
                onRequestClose={() => this.setState({ showImage: false })}
              >
                <ImageViewer imageUrls={images}/>
              </Modal>

              <View 
                style={{marginLeft: 20, marginRight: 20, flexDirection: 'column'}}>

                <Text numberOfLines={1} style={{ marginRight: 150, color: 'grey',fontSize: 13}}>
                    Created at {createdDate? createdDate : null} by
                </Text>

                <Text style={{ color: colors.greyBlack, fontWeight: '500', marginRight: 150, marginTop:10, fontSize: 15}}>
                    {jobownerName} 
                </Text>

                <View 
                  style={{ marginTop:10, flexDirection: 'row'}}>

                  <Image
                    style={{ height: 25, width: 25}}
                    source={companyIcon}
                  />

                  <Text style={{ alignSelf: 'center', justifyContent: 'center', flex: 1, color: colors.greyBlack, marginLeft: 20 ,fontSize: 15}}>
                      {company} 
                  </Text>

                </View>

              </View>


            </View>

            <View 
              style={{ backgroundColor: '#eeeeee', marginLeft: 20, marginRight: 20, marginTop:20, height:1, width: '90%'}}/>

            
            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Details
            </Text>

            {jobtype ? this.renderJobType(jobtype) : null}

            {currency && wages && rate ? this.renderWages(currency, wages, rate) : null}

            {date ? this.renderDate(date) : commitment && daysperweek ? this.renderCommitment(commitment, daysperweek) : null}

            {payment ? this.renderPayment(payment) : null}

            {this.renderGender(gender)}


            <View 
              style={{ backgroundColor: '#eeeeee', marginLeft: 20, marginRight: 20, marginTop:20, height:1, width: '90%'}}/>

            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Description
            </Text>

            <View 
              style={{marginLeft: 25, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

              <Image
                style={{marginTop:5, height: 25, width: 25}}
                source={infoIcon}
              />

              <View 
              style={{marginLeft: 20, marginRight:20, }}>

                <ReadMore
                  
                  renderTruncatedFooter={this._renderTruncatedFooter}
                  renderRevealedFooter={this._renderRevealedFooter}
                  onReady={this._handleTextReady}>
                  <Text style={{ color: colors.greyBlack, lineHeight: 30, fontSize: 15}}>
                      {descrip}
                  </Text>
                </ReadMore>
              </View>

            </View>



            <View 
              style={{ backgroundColor: '#eeeeee', marginLeft: 20, marginRight: 20, marginTop:20, height:1, width: '90%'}}/>
            
            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Address
            </Text>

            <View 
              style={{marginLeft: 25, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

              <Image
                style={{ marginTop:10, height: 25, width: 25}}
                source={locationIcon}
              />

              <Text style={{ color: colors.greyBlack, lineHeight: 30, marginLeft: 20, marginRight:20,fontSize: 15}}>
                  {address ? address : null}
              </Text>

            </View>

            <Touchable 
              background={Touchable.Ripple(colors.ripplegray)}   
              style={{marginTop:20, height: 150, width: '100%'}}
              onPress={() => 

                setTimeout(function () {
                  { 
                    this.props.navigation.navigate("MapView", 
                    {
                      latitude: latitude,
                      longitude: longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421
                      }
                    )
                  }
                }.bind(this), 50)
              }
            >

              <Image
                style={{ height: 150, width: '100%'}}
                source={
                  {uri:'http://maps.google.com/maps/api/staticmap?center='+latitude+','+longitude+'&markers=color:0xff0000%7Clabel:%7C'+latitude+','+longitude+'&zoom=14&size=400x200&key=AIzaSyBPspWoYygSRuvn2VnceAO3MBftXxfanBs'}}
              />
            </Touchable>


            <Image
              style={{ marginBottom: 120, marginTop:20, height: 150, width: '100%'}}
              source={{uri:'https://maps.googleapis.com/maps/api/streetview?size=400x200&location='+latitude+','+longitude+'&fov=90&heading=235&pitch=10&key=AIzaSyBPspWoYygSRuvn2VnceAO3MBftXxfanBs'}}
                
            />


            <Touchable 
                background={Touchable.Ripple(colors.ripplegray)}   
                style={{ position: 'absolute', bottom: 120, height: 150, width: '100%', zIndex: 2}}
                onPress={() => this.props.navigation.navigate("StreetView", {
                  latitude: latitude,
                  longitude: longitude
                })}
            >

              <View 
                style={{ backgroundColor:'black', opacity: 0.5,  height: 150, width: '100%', zIndex: 2}}>
              </View>

            </Touchable>

            <Text style={{ position: 'absolute', bottom: 190, zIndex: 5, color: 'white', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 20}}>
                    STREET VIEW
            </Text>

          </View>

        </ScrollView>

      
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={''}
          options={['Report Listing', 'Report User', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => { 
            if (index === 0) {
                this.JobActionSheet.show()
            }
            else if (index === 1) {
                this.UserActionSheet.show()
            }
          }}
        />

        <ActionSheet
          ref={o => this.JobActionSheet = o}
          title={''}
          options={['Offensive or Inappropriate', 'Spam', 'Fraud', 'Irrelevant', 'Cancel']}
          cancelButtonIndex={4}
          onPress={(index) => { this.JobReportPressed(index) }}
        />

        <ActionSheet
          ref={o => this.UserActionSheet = o}
          title={''}
          options={['Offensive or Inappropriate', 'Spam', 'Fraud', 'Irrelevant', 'Cancel']}
          cancelButtonIndex={4}
          onPress={(index) => { this.UserReportPressed(index) }}
        />

        {userid === jobownerUid ? 

        null :

        <View 
          style={{ 
            position: 'absolute',
            bottom: 0,
            right: 0, 
            left: 0, 
            backgroundColor:'white', 
            height:80, 
            width: '100%', 

            flex:1, 
            flexDirection: 'column'}}>

          <View 
              style={{ backgroundColor: '#eeeeee', height:1, width: '100%'}}/>

          <View 
              style={{ padding:15 , flexDirection: 'row' }}>

              <TouchableOpacity
                style={{ marginTop: 10, marginLeft: 10,  }}
                    onPress={() => { this.shareBtnPressed() }}
                >

                <Image
                  style={{ justifyContent:'center', height: 30, width: 30}}
                  source={shareIcon}
                />

              </TouchableOpacity>

              {!status || status === 'saved' ? 

              <TouchableOpacity
                style={{ marginTop: 10, marginLeft: 20, }}
                    onPress={() => { this.saveBtnPressed() }}
                >

                <Image
                  style={{ justifyContent:'center',height: 30, width: 30}}
                  source={status === 'saved'? savedIcon : saveIcon}
                />

              </TouchableOpacity>

              :

              null}

              <TouchableOpacity
                style={{ 
                    borderRadius:5, 
                    marginLeft: 20, 
                    flex:2,
                    paddingTop:10,
                    paddingBottom:10,
                    paddingLeft:15,
                    paddingRight:15,
                    justifyContent:'center',
                    elevation:3,
                    backgroundColor: 
                      status === 'applied' ?
                      'orange' 
                      :
                      status === 'hired' ?
                      colors.green01
                      :
                      status === 'appliedrejected' ?
                      colors.darkOrange
                      :
                      colors.priceblue
                  }}
                    onPress={() => { this.applyBtnPressed() }}
                >

                  <View style={{ alignItems:'center', justifyContent:'center'}}>

                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 15}}>
                      { status === 'applied' ?
                      'APPLIED' 
                      :
                      status === 'hired' ?
                      'HIRED' 
                      :
                      status === 'appliedrejected' ?
                      'REJECTED' 
                      :
                      'APPLY'  }
                    </Text>

                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 12}}>
                          ({totalapplicants} has applied)
                    </Text>

                  </View>

              </TouchableOpacity>

          
          </View>

        </View>

        }

        {this.state.firstopen ? 
          <View style={styles.transparentheader}>
            {this.renderBackButton("white")}
            {this.renderMoreButton("white")}
          </View> 
          :  
          <View style={styles.header}>
            {this.state.header ? 
              <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_DOWN_KEYFRAMES} onAnimationEnd={() => this.setState({firstopen: false})} style={styles.header}>
                  {this.renderBackButton("black")}
                  {this.renderMoreButton("black")}
              </Animatable.View> 
              :  
              <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_UP_KEYFRAMES} 
              onAnimationEnd={() => this.setState({firstopen: true})} style={styles.header}>
                  {this.renderBackButton("black")}
                  {this.renderMoreButton("black")}
              </Animatable.View>
            }
          </View>
        }
        

      </View>
    );
  }


  render() {

    const { navigate } = this.props.navigation;

    const {
      showAppliedNotification,
      errortype,
      loadingVisible,
      isLoading,
      status,
      userid,

      error,
      totalapplicants,
      category,
      jobtype,
      commitment,
      daysperweek,
      payment,
      title,
      currency,
      rate,
      wages,
      date,
      company,
      gender,
      createdAt,
      descrip,
      address,
      longitude,
      latitude,
      jobownerUid,
      jobownerName,
      jobownerImage,
      imageBroken,
      jobowneronline,

      internetStatus,

    } = this.state;

    Moment.locale('en');
    var t = new Date( createdAt );
    var createdDate = Moment(t).format('DD MMM YY');
    var userimage = {uri:jobownerImage};
    
    return (

      <View style={{backgroundColor:'white', flex:1}}>

         <Loader
          modalVisible={loadingVisible || isLoading}
          animationType="fade"
        />

        { loadingVisible ? 
          null :
          internetStatus ?
          error ? 
          this.renderErrorView()
          :
          this.renderJobDetailView(
          showAppliedNotification,
          errortype,
          loadingVisible,
          status,

          error,
          totalapplicants,
          category,
          jobtype,
          commitment,
          daysperweek,
          payment,
          title,
          currency,
          rate,
          wages,
          date,
          company,
          gender,
          createdAt,
          descrip,
          address,
          longitude,
          latitude,
          jobownerUid,
          jobownerName,
          jobownerImage,
          imageBroken,

          createdDate,
          userimage,
          userid,
          jobowneronline,
        )
        : 
        this.renderNoInternetView()
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  transparentheader: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:70,
  },
  header: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:2,
    height:70,
    borderBottomWidth: 1,
    borderColor: "#CED0CE",
  },
  headerText: {
    color: colors.greyBlack,
    fontSize: 20,
  },

});


JobDetail.propTypes = {
  setUID: PropTypes.func.isRequired,
  setSavedJob: PropTypes.func.isRequired,
  setAppliedJob: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
  getUserid: state.getUserid,
});


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(JobDetail);