
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  BackHandler,
  Animated,
  Platform,
  StatusBar,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  NetInfo,
  Modal,
  Linking ,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import ReadMore from 'react-native-read-more-text';
import ImageViewer from 'react-native-image-zoom-viewer';
import axios from 'axios';
import Moment from 'moment';
import Touchable from 'react-native-platform-touchable';
import ActionSheet from 'react-native-actionsheet'

import Loader from '../components/Loader';
import colors from '../styles/colors';
import apis from '../styles/apis';


const verificationIcon = require('../img/profile_verification.png');
const companyIcon = require('../img/company2.png');
const businesstypeIcon = require('../img/employer_businesstype.png');
const sizeIcon = require('../img/employer_size.png');
const emailIcon = require('../img/employer_email.png');
const phoneIcon = require('../img/employer_phone.png');

const locationIcon = require('../img/location3.png');
const starIcon = require('../img/star_rating.png');

const androidblackBackIcon = require('../img/android_back_black.png');
const androidwhiteBackIcon = require('../img/android_back_white.png');
const iosblackBackIcon = require('../img/ios_back_black.png');
const ioswhiteBackIcon = require('../img/ios_back_white.png');
const editBlackIcon = require('../img/edit_black.png');
const editWhiteIcon = require('../img/edit_white.png');
const moreBlackIcon = require('../img/ellipsis_black.png');
const moreWhiteIcon = require('../img/ellipsis_white.png');

const closeIcon = require('../img/close-button.png');

const userprofimagedefault = require('../img/defaultProfilePhoto.png');
const usercoverimagedefault = require('../img/defaultCoverPhoto.png');
const internetIcon = require('../img/wifi.png');

const navigateToAllReview = NavigationActions.navigate({
  routeName: 'AllReview',
});

const SLIDE_IN_DOWN_KEYFRAMES = {
  from: { translateY: -50 },
  to: { translateY: 0 },
};

const SLIDE_IN_UP_KEYFRAMES = {
  from: { translateY: 0 },
  to: { translateY: -80 },
};

class EmployerUserProfile extends Component {
  static navigationOptions = ({ navigation }) => ({
    header:null,
    
  });

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      errortype: "",
      loadingVisible: true,
      measures: 0,
      header: false,
      animation: '',
      firstopen: true,

      showProfileImage: false,
      showCoverImage: false,

      userid: null,
      ownuserid: null,
      ownuserName: null,
      jwt: null,
      error: null,
      userName: null,
      userProfileImage: null,
      userCoverImage: null,
      userLocation: null,
      userAbout: null,
      company: null,
      businesstype: null,
      size: null,
      email: null,
      phone: null,
      userOnline: null,
      userLastOnlineTime: null,
      userVerifiedInfo: 'Phone Verification',

      userNumOfReviews: null,
      userReviewerName: null,
      userReviewerDate: null,
      userReviewerImage: null, 
      userReviewerMesage: null,

      userNumOfPostedJobs: 0,
      userPostedJobsArray: [],

      coverimageBroken: false,
      profimageBroken: false,

      internetStatus: false,
    };

    this.onEditProfileClose = this.onEditProfileClose.bind(this);
  
  }

  componentWillMount() {
    
    const { navigation } = this.props;

    const userid = navigation.getParam('userid');

    this.setState({
        userid: userid,
        jwt: this.props.getJWTToken.jwttoken,
        ownuserid: this.props.getUserid.userid,
    }, () => {
        this.fetchOwnUserData();
        this.fetchUserData();
        this.fetchPostedJobsData();
        //this.fetchReviewData();
    });

  }


  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ internetStatus: isConnected }); }
    );
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ internetStatus: isConnected });
    console.log(`is connected: ${this.state.internetStatus}`);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  onEditProfileClose( editSaved ) {
 
    if (editSaved) {
        this.setState({
            loadingVisible: true,
        }, () => {
          this.fetchUserData();
        });
    } 
  }

  fetchUserData = () => {

    const { userid } = this.state;
  
    var url = apis.GETEmployer_BASEURL+'userid='+ userid;

    axios.get(url)
    .then((response) => {

      this.setState({
        error: false,
        userName: response.data[0].name,
        userProfileImage: response.data[0].employerdetails[0].profileimage,
        userCoverImage: response.data[0].employerdetails[0].coverimage,
        userLocation: response.data[0].location,
        userAbout: response.data[0].about,
        company: response.data[0].company,
        businesstype: response.data[0].businesstype,
        size: response.data[0].size,
        email: response.data[0].email,
        phone: response.data[0].phone,
        loadingVisible: false,
        userOnline: response.data[0].employerdetails[0].online,
        userLastOnlineTime: response.data[0].employerdetails[0].lastonlinetime,
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

  fetchOwnUserData = () => {

    const { ownuserid } = this.state;
  
    var url = apis.GETUser_BASEURL+'userid='+ ownuserid;

    axios.get(url)
    .then((response) => {
      this.setState({
        ownuserName: response.data[0].name,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  fetchPostedJobsData = () => {

    const { userid } = this.state;

    var url = apis.JOB_BASEURL+'sort=-time&limit='+3+'&userid='+ userid ;

    axios.get(url)
    .then((response) => {
      this.setState({
        userNumOfPostedJobs: response.headers['x-total-count'],
        userPostedJobsArray: response.data.length > 0 ? response.data : [], 
      }, () => {
        //alert('userPostedJobsArray ' + JSON.stringify(this.state.userPostedJobsArray))
      })
    })
    .catch((error) => {
     // alert(error)
    });

  }

  fetchReviewData = () => {

    const { userid } = this.state;

    var url = apis.GETUser_BASEURL+'&userid__equals='+ userid;

    axios.get(url)
    .then((response) => {
      console.log("data = " + JSON.stringify(response.data) );
      this.setState({
        userNumOfReviews: response.data.length,
        userReviewerName: response.data.length >=1 ? response.data[0].name : null, 
        userReviewerDate: response.data.length >=1 ? response.data[0].time : null, 
        userReviewerImage: response.data.length >=1 ? response.data[0].profileimage : null, 
        userReviewerMesage: response.data.length >=1 ? response.data[0].message : null, 
      })
    })
    .catch((error) => {
      console.log(error);
    });

  }

  onJobPressed = (_id) => {
    setTimeout(function () {
      this.props.navigation.navigate({
        routeName: 'JobDetail',
        params: {
          _id: _id,
        },
      });   
    }.bind(this), 50);
  }

  renderVerifiedInfo(info) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', alignSelf: 'center',  height: 25, width: 25}}
          source={verificationIcon}
        />

        <Text style={{ justifyContent:'center', alignSelf: 'center', color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 20, marginRight:20, fontSize: 15}}>
            {info}
        </Text>

      </View>

    )
  }

  renderPhone(phone) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', alignSelf: 'center',  height: 25, width: 25}}
          source={phoneIcon}
        />

        <Text style={{ justifyContent: 'center', alignSelf: 'center', color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 15, marginRight:20, fontSize: 15}}>
            {phone}
        </Text>

      </View>
    )
  }

  renderEmail(email) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', alignSelf: 'center', height: 25, width: 25}}
          source={emailIcon}
        />

        <Text style={{ justifyContent: 'center', alignSelf: 'center',  color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 15, marginRight:20, fontSize: 15}}>
            {email}
        </Text>

      </View>
    )
  }

  renderSize(size) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', alignSelf: 'center', height: 25, width: 25}}
          source={sizeIcon}
        />

        <Text style={{ justifyContent:'center', alignSelf: 'center', color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 15, marginRight:20, fontSize: 15}}>
            {size}
        </Text>

      </View>
    )
  }

  renderBusinessType(businesstype) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', alignSelf: 'center',  height: 25, width: 25}}
          source={businesstypeIcon}
        />

        <Text style={{ justifyContent:'center', alignSelf: 'center',  color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 15, marginRight:20, fontSize: 15}}>
            {businesstype}
        </Text>

      </View>
    )
  }

  renderCompany(company) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', alignSelf: 'center',  height: 25, width: 25}}
          source={companyIcon}
        />

        <Text style={{ justifyContent:'center', alignSelf: 'center',  color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 15, marginRight:20, fontSize: 15}}>
            {company}
        </Text>

      </View>
    )
  }

  renderReview(userReviewerName, userreviewDate, userReviewerImage, userReviewerMesage) {
    return(

      <View 
        style={{flex:1, flexDirection: 'column'}}>
        <View 
          style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

          <Image
            style={{ height: 50, width: 50, borderRadius: 25}}
            source={{uri:userReviewerImage}}
          />

          <View 
            style={{flex:1, alignItems:'flex-start', justifyContent:'flex-start', flexDirection: 'column'}}>

            <Text numberOfLines={2} style={{color: colors.greyBlack, marginLeft: 20, marginTop: 0, fontSize: 13, fontWeight: '500'}}>
                {userReviewerName}
            </Text>

            <Text style={{color: colors.greyBlack, marginLeft: 20, marginTop: 10, fontSize: 13}}>
                {userreviewDate}
            </Text>

          </View>

        </View>

        <Text style={{color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 25, marginRight:25, marginTop: 10, fontSize: 15}}>
          {userReviewerMesage}
        </Text>

        <TouchableOpacity style={{
          fontWeight: '700', }}
          onPress={() => this.props.navigation.dispatch(navigateToAllReview)}
        >
          <Text style={{ paddingTop:20, paddingBottom:10, paddingLeft:25, paddingRight: 25, color: '#008FEE', fontSize: 15}}>
            See All Reviews
          </Text>

        </TouchableOpacity>

      </View>
    )
  }

  renderPostedJobs(userPostedJobsArray, userNumOfPostedJobs) {

    var jobarrays = [];

    for(let i = 0; i < userPostedJobsArray.length; i++){

      jobarrays.push(

        <View
        style={{flex:1, flexDirection: 'column'}}>
        
          <Touchable 
          //delayPressIn = {5000}
          onPress={this.onJobPressed.bind(this, userPostedJobsArray[i]._id)}
          background={Touchable.Ripple(colors.ripplegray)}>
     
              <View style={{ marginLeft: 10, marginTop: 10, marginBottom: 20, marginRight: 10, flexDirection: 'row', width: '100%', }}>
                  <View style={{  marginTop: 5, width:60, height: 60, marginLeft: 5, marginRight: 10, alignItems: 'center'}}>
                      <Image
                          style={{ width:40, height: 40, }}
                          source={{uri: userPostedJobsArray[i].categoryimage}} />
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start',  paddingLeft: 10, paddingBottom: 7 }}>

                      <View style={{ flex: 1, flexDirection: 'row'}}>

                          <View style={{ flex: 1, flexDirection: 'column'}}>

                              <Text numberOfLines={1} style={{ color: colors.darkOrange, fontSize: 13, fontWeight: 'bold' }}>
                              {userPostedJobsArray[i].category}</Text>

                              <Text numberOfLines={1} style={{ paddingTop: 5, color: '#454545', fontSize: 15, fontWeight: 'bold' }}>
                              {userPostedJobsArray[i].title}</Text>

                              <Text numberOfLines={3} style={{ paddingTop: 5, fontSize: 13, color: colors.greyBlack, opacity: 0.9 }}>
                              {userPostedJobsArray[i].desc}</Text>

                          </View>

                      </View>

                  </View>

              </View>
              
          </Touchable>

          {i === userPostedJobsArray.length -1 && this.renderSeeAllWorkExp()}

        </View>

      )
    }

    return(

      <View style={{marginBottom: 10}}>

      {jobarrays}

      </View>

    )
  }

  renderSeeAllWorkExp() {
    return (
        <TouchableOpacity style={{
          fontWeight: '700', }}
          onPress={() => this.props.navigation.navigate("AllPostedJobs",
          {
            userid: this.state.userid,
          }
        )}
        >
          <Text style={{ paddingTop:20, paddingBottom:10, paddingLeft: 25, paddingRight: 25, color: '#008FEE', fontSize: 15}}>
            See All Posted Jobs
          </Text>

        </TouchableOpacity>
    )
  }

  renderAbout(userAbout) {
    console.log(userAbout)
    return (

      <View style={{ marginHorizontal: 25 }}>

      <ReadMore
        numberOfLines={3}
        renderTruncatedFooter={this._renderTruncatedFooter}
        renderRevealedFooter={this._renderRevealedFooter}
        onReady={this._handleTextReady}>
        <Text style={{ color: colors.greyBlack, lineHeight: 30, fontSize: 15}}>
             {userAbout? userAbout : null}
        </Text>
      </ReadMore>

      </View>

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
    // ..
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

  UserReportPressed = (index) => {
    
    const { userid, ownuserid, jwt } = this.state;

    var options = ['Offensive or Inappropriate', 'Spam', 'Fraud', 'Irrelevant', 'Cancel'];

    var url = apis.POSTUserReport_BASEURL+'userid='+ ownuserid;

    var reportdata = {
      userid : ownuserid,
      reportedid : userid,
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
        console.log(error);
      });
    }
  }

  showActionSheet = () => {
    (this.state.error || !this.state.internetStatus) ?  null: this.ActionSheet.show()
  }

  chatPressed = (navigation) => {
    if (this.state.ownuserName && this.state.userName) {
      var receiverdefaultimg;
      receiverdefaultimg= this.setAvatarName(this.state.userName);
     
      navigation.push(
        'ChatRoom',
        {
          userid: this.state.ownuserid,
          username: this.state.ownuserName,
          receiverid: this.state.userid,
          receivername: this.state.userName,
          receiverimg: this.state.userProfileImage,
          receiverdefaultimg: receiverdefaultimg,
          userrole: 'jobseeker',
          online: this.state.userOnline,
          lastonlinetime: this.state.userLastOnlineTime
        },
      )
    }  
  }

  setAvatarName = (userName) => {
    
    var avatarName;
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      avatarName = '';
    }

    return avatarName;
  }

  renderCloseImgButton() {
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
              this.setState({ 
                showProfileImage: imgtype = 'profileimg' ? false : true,
                showCoverImage: imgtype = 'coverimg' ? false : true,
              })
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

  renderEditButton(btncolor) {
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
            onPress={() =>  this.props.navigation.navigate({
              routeName: 'EditEmployerProfile',
              params: {
                userid: this.state.userid,
                onEditProfileClose: this.onEditProfileClose
              },
            })}
        >

        {btncolor === "white" ? 
        <Image
            style={{ 
              height: 20,
              width: 20,
            }}
            source={editWhiteIcon}
          />
        :
        <Image
            style={{ 
              height: 20,
              width: 20,
            }}
            source={editBlackIcon}
          />
        }
        </TouchableOpacity>
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
                  borderColor: '#ddd', 
                  borderRadius:25,
                  shadowColor: '#000',
                  shadowOffset: {
                      width: 1,
                      height: 3,
                  },
                  shadowRadius: 25,
                  shadowOpacity: 0.8,
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
 
render() {

  const {
    ownuserid, 
    userid,
    userName,
    userProfileImage,
    userCoverImage,
    userLocation,
    userAbout,
    company,
    businesstype,
    size,
    email,
    phone,
    userOnline,
    userVerifiedInfo,

    userNumOfReviews,
    userReviewerName,
    userReviewerDate,
    userReviewerImage, 
    userReviewerMesage,

    userNumOfPostedJobs,
    userPostedJobsArray,

    coverimageBroken,
    profimageBroken,
    loadingVisible,

    internetStatus,

  } = this.state
  
  Moment.locale('en');
  var t = new Date( userReviewerDate );
  var userreviewDate = Moment(t).format('DD MMM YY');
  var userprofimage = {uri:userProfileImage};
  var usercoverimage = {uri:userCoverImage};
  const edited = this.props.navigation.getParam('edited');
 
  return (
    <View style={{ backgroundColor:'white', flex:1}}>

      { loadingVisible ? 
        null :
        internetStatus ?
      
      <ScrollView 
        scrollEventThrottle={16}
        onScroll={this.handleScroll.bind(this)}
        style={{backgroundColor:'transparent', }}>

          <TouchableOpacity
            activeOpacity= { userCoverImage ? 0.4 : 1.0}
            style={{ height: 150, width: '100%'}}
              onPress={() => 
                userCoverImage ?
                this.setState({
                  showCoverImage: true,
                })
                : null
            }
          >                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

            <Image
              style={{ height: 150, width: '100%'}}
              source={ coverimageBroken? usercoverimagedefault : (userCoverImage? usercoverimage : usercoverimagedefault) }
              onError={() => this.setState({ coverimageBroken: true })}
            />
          
          </TouchableOpacity>

          <View 
            style={{marginTop:50, alignSelf:'center', marginLeft:20, marginRight:20}}
            onLayout={({nativeEvent}) => {
              this.setState({
                measures: nativeEvent.layout.y
              })
            }}>

            <Text numberOfLines={2}  style={{color: colors.greyBlack, textAlign:'center', alignSelf:'center', fontWeight: '700', fontSize: 24}}>
              {userName? userName : null}
            </Text>

          </View>

          <View style={{ flex:1, justifyContent:'center', alignItems: 'center', alignSelf: 'center', padding: 10, marginHorizontal:5, flexDirection: 'row' }}>

              <View 
              style={{  alignItems: 'center', justifyContent:'center', flex:1, alignSelf: 'center', padding: 15,flexDirection: 'row'}}>

                <Image
                  style={{ justifyContent:'center', marginLeft: 20, height: 20, width: 20}}
                  source={locationIcon}
                />

                <Text numberOfLines={2} style={{ marginLeft:15, marginRight:15, color: colors.greyBlack, fontSize: 15}}>
                    {userLocation? userLocation : 'Somewhere on earth'}
                </Text>

              </View>

              <View 
              style={{ alignItems: 'center', justifyContent:'center', flex:1, alignSelf: 'center', padding: 15,flexDirection: 'row'}}>

                <Image
                  style={{ justifyContent:'center', marginLeft: 20, height: 20, width: 20}}
                  source={starIcon}
                />

                <Text style={{ marginLeft:15, marginRight:15, color: colors.greyBlack, fontSize: 15}}>
                    {userNumOfReviews? userNumOfReviews : '0'} reviews
                </Text>

              </View>

          </View>

          <TouchableOpacity
            activeOpacity= { userProfileImage ? 0.4 : 1.0}
            style={{ 
              position: 'absolute',  top: 80, height: 100, width: 100, 
              borderRadius: 50, zIndex: 5, alignItems: 'center', alignSelf:'center'
              }}
              onPress={() => 
                userProfileImage ?
                this.setState({
                  showProfileImage: true,
                })
                : null
              }
            >

            <Image
              style={{ height: 100, width: 100, borderRadius: 50, }}
              source={ profimageBroken? userprofimagedefault : (userProfileImage? userprofimage : userprofimagedefault) }
              onError={() => this.setState({ profimageBroken: true })}
            />

            {!this.props.navigation.getParam('edited') && userOnline ? 

            <View
              style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 20, width: 20, borderRadius: 20/2, borderWidth: 1, borderColor: 'white'}}/> : null }


          </TouchableOpacity>

          {edited || (ownuserid === userid) ? null :

          <TouchableOpacity
              style={{ 
                marginBottom: 15, 
                borderRadius:25, 
                paddingTop:10,
                paddingBottom:10,
                paddingLeft: 20,
                paddingRight: 20,
                alignSelf: 'center',
                justifyContent:'center',
                elevation:3,
                shadowColor: '#000',
                shadowOffset: {
                    width: 1,
                    height: 3
                },
                shadowRadius: 3,
                shadowOpacity: 0.8,
                backgroundColor: colors.themeblue}}
                onPress={this.chatPressed.bind(this, this.props.navigation)}
          >

            <View>

              <Text style={{ color: 'white', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 17}}>
                    MESSAGE
              </Text>

            </View>

          </TouchableOpacity> }

          {userAbout ? this.renderAbout(userAbout) : null } 


          {loadingVisible ? 

          null:

          <View style={{flex: 1, backgroundColor: 'transparent'}}>

          {company?
          <View 
            style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
          :null
          }

          {company?
          <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
            Company
          </Text>
          :null
          }

          {company?
          this.renderCompany(company)
          :null
          }

          {businesstype?
          <View 
            style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
          :null
          }

          {businesstype?
          <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
            Business Type
          </Text>
          :null
          }

          {businesstype?
          this.renderBusinessType(businesstype)
          :null
          }
          

          {size?
          <View 
            style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
          :null
          }

          {size?
          <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
            Size
          </Text>
          :null
          }

          {size?
          this.renderSize(size)
          :null
          }


          {email?
          <View 
            style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
          :null
          }

          {email?
          <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
            Work Email
          </Text>
          :null
          }

          {email?
          this.renderEmail(email)
          :null
          }



          {phone?
          <View 
            style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
          :null
          }

          {phone?
          <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
            Work Contact
          </Text>
          :null
          }

          {phone?
          this.renderPhone(phone)
          :null
          }

        
          {!userNumOfReviews || userNumOfReviews === 0 ? 
          null:
          <View 
            style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
          }

          {!userNumOfReviews || userNumOfReviews === 0 ? 
          null:
          <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:10, paddingLeft:25, paddingRight:25, fontSize: 18}}>
            {userNumOfReviews? userNumOfReviews : '0'} Reviews
          </Text>
          }

          {userReviewerName && userReviewerDate && userReviewerImage && userReviewerMesage ? 
          this.renderReview(userReviewerName, userreviewDate, userReviewerImage, userReviewerMesage)
          :
          null}



          {userNumOfPostedJobs === 0 ? 
          null:
          <View 
            style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
          }

          {userNumOfPostedJobs === 0 ? 
          null:
          <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:10, paddingLeft:25, paddingRight:25, fontSize: 18}}>
            {userNumOfPostedJobs} Jobs Posted
          </Text>
          }

          {userNumOfPostedJobs === 0 ? 
          null:
          this.renderPostedJobs(userPostedJobsArray, userNumOfPostedJobs)
          }



          <View 
            style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>


          <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
            Verified Info
          </Text>

          {this.renderVerifiedInfo(userVerifiedInfo)}

 
          <View 
            style={{ backgroundColor: 'white', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>

          <View 
          style={{ backgroundColor: 'white', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>

          </View>}

      </ScrollView>

      :

      this.renderNoInternetView()}


      <Modal 
        backdropOpacity = {1}
        forceToFront={true}
        visible={this.state.showProfileImage}
        transparent={false}
        onRequestClose={() => this.setState({ showProfileImage: false })}
      >
        <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/>
        {this.renderCloseImgButton('profileimg')}
        <ImageViewer imageUrls={
          [{
            url: userProfileImage,
            freeHeight: true 
          }]
        }/>
      </Modal>

      <Modal 
        backdropOpacity = {1}
        forceToFront={true}
        visible={this.state.showCoverImage}
        transparent={false}
        onRequestClose={() => this.setState({ showCoverImage: false })}
      >
        <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/>
        {this.renderCloseImgButton('coverimg')}
        <ImageViewer imageUrls={
          [{
            url: userCoverImage,
            freeHeight: true 
          }]
        }/>
      </Modal>

      <Loader
        modalVisible={loadingVisible}
        animationType="fade"
      />

      <ActionSheet
        ref={o => this.ActionSheet = o}
        title={''}
        options={['Report User', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        onPress={(index) => { 
          if (index === 0) {
              this.UserActionSheet.show()
          }
        }}
      />

      <ActionSheet
        ref={o => this.UserActionSheet = o}
        title={''}
        options={['Offensive or Inappropriate', 'Spam', 'Fraud', 'Irrelevant', 'Cancel']}
        cancelButtonIndex={4}
        onPress={(index) => { this.UserReportPressed(index) }}
      />

      {this.state.firstopen ? 
        <View style={styles.headerOrginal}>
          {this.renderBackButton("white")}
          {edited ? this.renderEditButton("white") : this.renderMoreButton("white")}
        </View> 
        :  
        <View style={styles.header}>
          {this.state.header ? 
            <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_DOWN_KEYFRAMES} onAnimationEnd={() => this.setState({firstopen: false})} style={styles.header}>
                {this.renderBackButton("black")}
                {edited ? this.renderEditButton("black") : this.renderMoreButton("black")}
            </Animatable.View> 
            :  
            <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_UP_KEYFRAMES} 
            onAnimationEnd={() => this.setState({firstopen: true})} style={styles.header}>
                {this.renderBackButton("black")}
                {edited ? this.renderEditButton("black") : this.renderMoreButton("black")}
            </Animatable.View>
          }
        </View>
      }
      
    </View>
   )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:10,
    height:70,
    borderBottomWidth: 1,
    borderColor: "#CED0CE",
  },
  headerOrginal: {
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
    borderColor: "#CED0CE",
  },
  headerText: {
    color: colors.greyBlack,
    fontSize: 20,
  },

});

EmployerUserProfile.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
  getUserid: state.getUserid,
});

export default connect(mapStateToProps)(EmployerUserProfile);


