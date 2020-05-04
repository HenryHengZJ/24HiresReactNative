
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
  Alert,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import ReadMore from 'react-native-read-more-text';
import ImageViewer from 'react-native-image-zoom-viewer';
import ActionSheet from 'react-native-actionsheet'
import axios from 'axios';
import Moment from 'moment';

import Notification from '../components/Notification';
import HireRejectView from '../components/HireRejectView';
import Loader from '../components/Loader';
import colors from '../styles/colors';
import apis from '../styles/apis';
import ActionCreators from '../redux/actions';


const verificationIcon = require('../img/profile_verification.png');
const languageIcon = require('../img/profile_language.png');
const eduIcon = require('../img/profile_education.png');
const workIcon = require('../img/profile_work.png');
const locationIcon = require('../img/location3.png');
const starIcon = require('../img/star_rating.png');

const androidblackBackIcon = require('../img/android_back_black.png');
const androidwhiteBackIcon = require('../img/android_back_white.png');
const iosblackBackIcon = require('../img/ios_back_black.png');
const ioswhiteBackIcon = require('../img/ios_back_white.png');
const moreBlackIcon = require('../img/ellipsis_black.png');
const moreWhiteIcon = require('../img/ellipsis_white.png');

const closeIcon = require('../img/close-button.png');

const userprofimagedefault = require('../img/defaultProfilePhoto.png');
const usercoverimagedefault = require('../img/defaultCoverPhoto.png');
const internetIcon = require('../img/wifi.png');

const navigateToEditProfile = NavigationActions.navigate({
  routeName: 'EditProfile',
});

const navigateToAllReview = NavigationActions.navigate({
  routeName: 'AllReview',
});

const navigateToAllWorkExp = NavigationActions.navigate({
  routeName: 'AllWorkExp',
});

const SLIDE_IN_DOWN_KEYFRAMES = {
  from: { translateY: -50 },
  to: { translateY: 0 },
};

const SLIDE_IN_UP_KEYFRAMES = {
  from: { translateY: 0 },
  to: { translateY: -80 },
};

class OtherUserProfile extends Component {
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
      formValid: false,
      showProfileImage: false,
      showCoverImage: false,

      jwt: null,
      ownuserid: null,
      ownuserName: null,

      userid: null,
      error: null,
      userName: null,
      userProfileImage: null,
      userCoverImage: null,
      userLocation: null,
      userAbout: null,
      userNumOfWorkExp: null,
      userWorkTitle1: null,
      userWorkTitle2: null,
      userWorkTitle3: null,
      userWorkCompany1: null,
      userWorkCompany2: null,
      userWorkCompany3: null,
      userWorkPeriod1: null,
      userWorkPeriod2: null,
      userWorkPeriod3: null,
      userWorkCategory1: null,
      userWorkCategory2: null,
      userWorkCategory3: null,
      userEducation: null,
      userLanguage: null,
      userLinkedAccount: null,
      userVerifiedInfo: 'Email Address',
      userNumOfReviews: null,
      userReviewerName: null,
      userReviewerDate: null,
      userReviewerImage: null, 
      userReviewerMesage: null,
      userOnline: null,
      userLastOnlineTime: null,
      coverimageBroken: false,
      profimageBroken: false,

      internetStatus: false,

      postkey: null,
      applicantType: null,
      isLoading: false,
    };

    this.hireBtnPressed = this.hireBtnPressed.bind(this);
    this.rejectBtnPressed = this.rejectBtnPressed.bind(this);

  }

  componentWillMount() {
    
    const { navigation } = this.props;

    const userid = navigation.getParam('userid');
    const isApplicant = navigation.getParam('isApplicant');
    const newVal = navigation.getParam('newVal');
    const postkey = navigation.getParam('postkey');
    const applicantType = navigation.getParam('applicantType');

    this.setState({
      userid: userid,
      jwt: this.props.getJWTToken.jwttoken,
      ownuserid: this.props.getUserid.userid,
      formValid: isApplicant ? true : false,
      postkey: postkey? postkey : null,
      applicantType: applicantType? applicantType : null,
    }, () => {
        this.fetchOwnUserData();
        this.fetchUserData();
        if (isApplicant && newVal && applicantType === 'pending') {
          this.updateNewUserData(postkey);
        }
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

  updateNewUserData = (postkey) => {
    const {userid, jwt, ownuserid } = this.state;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    var finalapplicantdata = {
      new: false, 
      status: 'pending'
    }

    var updateapplicanturl = apis.PUTApplicant_BASEURL+'postkey='+postkey +'&userid='+ ownuserid +'&applicantid='+ userid +'&authid='+ ownuserid;

    axios.put(updateapplicanturl, finalapplicantdata,  {headers: headers})
    .then((response) => {
    })
    .catch((error) => {
    });
  }

  fetchUserData = () => {

    const { userid } = this.state;
  
    var url = apis.GETUser_BASEURL+'userid='+ userid;

    axios.get(url)
    .then((response) => {

      console.log("data = " + JSON.stringify(response.data) );

      this.setState({
        error: false,
        userName: response.data[0].name,
        userProfileImage: response.data[0].profileimage,
        userCoverImage: response.data[0].coverimage,
        userLocation: response.data[0].location,
        userAbout: response.data[0].about,
        userNumOfWorkExp: response.data[0].workexp.length,
        userWorkTitle1: response.data[0].workexp.length >=1 ? response.data[0].workexp[0].worktitle : null, 
        userWorkTitle2: response.data[0].workexp.length >=2 ? response.data[0].workexp[1].worktitle : null, 
        userWorkTitle3: response.data[0].workexp.length >=3 ? response.data[0].workexp[2].worktitle : null, 
        userWorkCompany1: response.data[0].workexp.length >=1 ? response.data[0].workexp[0].workcompany : null, 
        userWorkCompany2: response.data[0].workexp.length >=2 ? response.data[0].workexp[1].workcompany : null, 
        userWorkCompany3: response.data[0].workexp.length >=3 ? response.data[0].workexp[2].workcompany : null, 
        userWorkPeriod1: response.data[0].workexp.length >=1 ? response.data[0].workexp[0].worktime : null, 
        userWorkPeriod2: response.data[0].workexp.length >=2 ? response.data[0].workexp[1].worktime : null, 
        userWorkPeriod3: response.data[0].workexp.length >=3 ? response.data[0].workexp[2].worktime : null, 
        userWorkCategory1: response.data[0].workexp.length >=1 ? response.data[0].workexp[0].workcategory : null, 
        userWorkCategory2: response.data[0].workexp.length >=2 ? response.data[0].workexp[1].workcategory : null, 
        userWorkCategory3: response.data[0].workexp.length >=3 ? response.data[0].workexp[2].workcategory : null, 
        userEducation: response.data[0].education,
        userLanguage: response.data[0].language,
        userLinkedAccount: response.data[0].provider,
        userOnline: response.data[0].online,
        userLastOnlineTime: response.data[0].lastonlinetime,
        loadingVisible: false,
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

  fetchReviewData = () => {

    const { jobownerUid } = this.state;

    var url = apis.GETUser_BASEURL+'&userid__equals='+ jobownerUid;

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

  showActionSheet = () => {
    (this.state.error || !this.state.internetStatus) ?  null: this.ActionSheet.show()
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

  rejectBtnPressed() {

    this.setState({
      isLoading: true,
    })

    //Update status to appliedrejected

    const {userid, jwt, postkey, ownuserid } = this.state;

    var finaljobdata = {
      userid: userid, //applicant id
      time: new Date().getTime(),
      postkey: postkey,
      status: "appliedrejected",
    }

    var delpendingdata = {
      applicantid: userid, //applicant id
      status: "delete",
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    var updatejoburl = apis.PUTJobSeekerJobs_BASEURL+'postkey=' + postkey +'&userid='+ userid +'&authid='+ ownuserid;
 
    axios.put(updatejoburl, finaljobdata,  {headers: headers})
    .then((response) => {
      if (response.status === 200) {
        this.updateApplicant('rejected', null, delpendingdata, finaljobdata);
      }
    })
    .catch((error) => {
      this.setState({
        isLoading: false,
      })
    });
  }

  hireBtnPressed() {

    const { setHiredApplicant, setPendingApplicant, setRejectedApplicant } = this.props;
    
    this.setState({
      isLoading: true,
    })

    //Update status to applied

    const {userid, jwt, postkey, ownuserid } = this.state;

    var finaljobdata = {
      userid: userid, //applicant id
      time: new Date().getTime(),
      postkey: postkey,
      status: "hired",
    }

    var delpendingdata = {
      applicantid: userid, //applicant id
      status: "delete",
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    var updatejoburl = apis.PUTJobSeekerJobs_BASEURL+'postkey=' + postkey +'&userid='+ userid +'&authid='+ ownuserid;

    axios.put(updatejoburl, finaljobdata,  {headers: headers})
    .then((response) => {
      if (response.status === 200) {
        this.updateApplicant('hired', finaljobdata, delpendingdata, null);
      }
    })
    .catch((error) => {
      this.setState({
        isLoading: false,
      })
    });
  }

  updateApplicant = (status, hiredjobdata, delpendingdata, rejectedjobdata) => {

    //Update applicant status
    const { setHiredApplicant, setPendingApplicant, setRejectedApplicant } = this.props;

    const {userid, jwt, postkey, ownuserid } = this.state;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt,
    }

    var finalapplicantdata = {
      userid: ownuserid, //Job Owner UID
      time: new Date().getTime(),
      new: false,
      postkey: postkey,
      status: status,
      applicantid: userid, //Applying User UID
    }

    var updateapplicanturl = apis.PUTApplicant_BASEURL+'postkey='+postkey +'&userid='+ ownuserid +'&applicantid='+ userid +'&authid='+ ownuserid;

    axios.put(updateapplicanturl, finalapplicantdata,  {headers: headers})
    .then((response) => {
      if (response.status === 200) {

        if (status === 'hired') {
          setHiredApplicant(hiredjobdata);
        }
        else if (status === 'rejected') {
          setRejectedApplicant(rejectedjobdata);
        }
        setPendingApplicant(delpendingdata);

        this.setState({
          isLoading: false, applicantType: status,
        })
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
          userrole: 'employer',
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


  renderVerifiedInfo(info) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', height: 20, width: 20}}
          source={verificationIcon}
        />

        <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 20, marginRight:20, marginTop: -5,fontSize: 15}}>
            {info}
        </Text>

      </View>

    )
  }

  renderConnectedAccount(account, iconname) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Ionicon name={iconname} size={25} style={{color: colors.gray04}} />

        <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 20, marginRight:20, marginTop: -5,fontSize: 15}}>
            {account ? account: 'Email'}
        </Text>

      </View>

    )
  }

  renderAddLanguage() {
    return(
      <TouchableOpacity style={{
        paddingTop:10, paddingBottom:10,}}
        onPress={() => this.setState({pressCount: this.state.pressCount + 1})}
      >
        <Text style={{ marginLeft:25, marginRight: 25, color: '#008FEE', fontSize: 15}}>
          Add Spoken Languages
        </Text>

      </TouchableOpacity>

    )
  }

  renderLanguages(languages) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', height: 20, width: 20}}
          source={languageIcon}
        />

        <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 20, marginRight:20, marginTop: -5,fontSize: 15}}>
            {languages}
        </Text>

      </View>
    )
  }

  renderAddWorkExp() {
    return(
      <TouchableOpacity style={{
        paddingTop:20, paddingBottom:10,}}
        onPress={() => this.setState({pressCount: this.state.pressCount + 1})}
      >
        <Text style={{ marginLeft: 25, marginRight: 25, color: '#008FEE', fontSize: 15}}>
          Add Work Experience
        </Text>

      </TouchableOpacity>

    )
  }

  renderWorkExp(worktitle, workcompany, workperiod, workcategory, lastitem) {
    return(

      <View 
        style={{flex:1, flexDirection: 'column'}}>

        <View 
            style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:20, flexDirection: 'row'}}>

            <Image
              style={{ marginTop: 5, justifyContent:'center', height: 20, width: 20}}
              source={workIcon}
            />

            <View 
              style={{flex:1, alignItems:'flex-start', justifyContent:'flex-start', flexDirection: 'column'}}>

              <Text numberOfLines={1} style={{color: colors.greyBlack, marginLeft: 20, marginTop: 0, fontSize: 15, fontWeight: '500' }}>
                  {worktitle} 
              </Text>

              <Text numberOfLines={1} style={{color: colors.greyBlack, marginLeft: 20, marginTop: 10, fontSize: 15}}>
                  {workcompany} 
              </Text>

              <Text numberOfLines={1} style={{color: colors.greyBlack, opacity: 0.6, marginLeft: 20, marginTop: 10, fontSize: 15}}>
                  {workperiod} 
              </Text>

              <View
                style={{ 
                    marginBottom: 10,
                    marginTop: 10, 
                    marginLeft: 20,
                    borderColor: colors.greyBlack,
                    borderWidth: 1,
                    borderRadius:25,
                    justifyContent:'center',
                    backgroundColor: 'white'}}
                >

                <View style={{ alignItems:'center', justifyContent:'center'}}>

                  <Text style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 10, paddingRight: 10, color: colors.greyBlack, fontWeight: '500', fontSize: 12}}>
                    {workcategory}
                  </Text>

                </View>

              </View>

            </View>

        </View>

        {lastitem && this.renderSeeAllWorkExp()}

      </View>
    )
  }

  renderSeeAllWorkExp() {
    return (
        <TouchableOpacity style={{
          fontWeight: '700', }}
          onPress={() => this.props.navigation.navigate("AllWorkExp",
          {
            userid: this.state.userid,
          }
        )}
        >
          <Text style={{ paddingTop:20, paddingBottom:10, paddingLeft: 25, paddingRight: 25, color: '#008FEE', fontSize: 15}}>
            See All Work Experiences
          </Text>

        </TouchableOpacity>
    )
  }

  renderAddEdu() {
    return(
      <TouchableOpacity style={{
        paddingTop:10, paddingBottom:15,}}
        onPress={() => this.setState({pressCount: this.state.pressCount + 1})}
      >
        <Text style={{ marginLeft:25, marginRight: 25, color: '#008FEE', fontSize: 15}}>
          Add Education
        </Text>

      </TouchableOpacity>
    )
  }

  renderEdu(education) {
    return(
      <View 
        style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

        <Image
          style={{ justifyContent:'center', height: 25, width: 25}}
          source={eduIcon}
        />

        <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 15, marginRight:20, marginTop: -5, fontSize: 15}}>
            {education}
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
    // ...
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
      userName,
      userProfileImage,
      userCoverImage,
      userLocation,
      userAbout,
      userNumOfWorkExp,
      userWorkTitle1,
      userWorkTitle2,
      userWorkTitle3,
      userWorkCompany1,
      userWorkCompany2,
      userWorkCompany3,
      userWorkPeriod1,
      userWorkPeriod2,
      userWorkPeriod3,
      userWorkCategory1,
      userWorkCategory2,
      userWorkCategory3,
      userEducation,
      userLanguage,
      userLinkedAccount,
      userVerifiedInfo,
      userNumOfReviews,
      userReviewerName,
      userReviewerDate,
      userReviewerImage, 
      userReviewerMesage,
      userOnline,
      coverimageBroken,
      profimageBroken,
      loadingVisible,

      internetStatus,
      isLoading,

    } = this.state
    
    Moment.locale('en');
    var t = new Date( userReviewerDate );
    var userreviewDate = Moment(t).format('DD MMM YY');
    var userprofimage = {uri:userProfileImage};
    var usercoverimage = {uri:userCoverImage};
    var iconname = (!userLinkedAccount || userLinkedAccount === 'email') ? 'ios-mail-outline' : 'logo-'+userLinkedAccount;
    var userConnectedAccount = userLinkedAccount === 'facebook' ? 'Facebook' :  userLinkedAccount === 'google' ? 'Google' : 'Email';

    return (
      <View style={{ backgroundColor:'white', flex:1}}>

        { loadingVisible ? 
          null :
          internetStatus ?
        
        <ScrollView 
          scrollEventThrottle={16}
          onScroll={this.handleScroll.bind(this)}
          style={{backgroundColor:'transparent', flex:1,}}>

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

              
            {userOnline ? 

            <View
              style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 20, width: 20, borderRadius: 20/2, borderWidth: 1, borderColor: 'white'}}/> : null }


            </TouchableOpacity>

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

            </TouchableOpacity>

            {userAbout ? this.renderAbout(userAbout) : null } 


            {loadingVisible ? 

            null:

            <View style={{flex: 1, backgroundColor: 'transparent'}}>

            {!userNumOfWorkExp || userNumOfWorkExp === 0 ? 
            null:
            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
            }

            {userNumOfWorkExp? 
            <Text style={{color: colors.greyBlack, paddingBottom:5, paddingTop:20, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              {userNumOfWorkExp? userNumOfWorkExp : '0'} Work Experiences
            </Text>
            :
            null}


            {userWorkTitle1 && userWorkCompany1 && userWorkPeriod1 && userWorkCategory1? 
            this.renderWorkExp(userWorkTitle1, userWorkCompany1, userWorkPeriod1, userWorkCategory1, userNumOfWorkExp === 1? true: false) : null}

            {userWorkTitle2 && userWorkCompany2 && userWorkPeriod2 && userWorkCategory2? 
            this.renderWorkExp(userWorkTitle2, userWorkCompany2, userWorkPeriod2, userWorkCategory2, userNumOfWorkExp === 2? true: false) : null}

            {userWorkTitle3 && userWorkCompany3 && userWorkPeriod3 && userWorkCategory3? 
            this.renderWorkExp(userWorkTitle3, userWorkCompany3, userWorkPeriod3, userWorkCategory3, userNumOfWorkExp === 3? true: false) : null}

            {userEducation?
            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
            :null
            }

            {userEducation?
            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Education
            </Text>
            :null
            }

            {userEducation?
            this.renderEdu(userEducation)
            :null
            }

            {userLanguage?
            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>
            :null
            }

            {userLanguage?
            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Spoken Languages
            </Text>
            :null
            }

            {userLanguage?
            this.renderLanguages(userLanguage)
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


            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>


            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Verrified Info
            </Text>

            {this.renderVerifiedInfo(userVerifiedInfo)}


            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>

            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingBottom:15, paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Connected Account
            </Text>

            {this.renderConnectedAccount(userConnectedAccount, iconname)}

            
            <View 
              style={{ backgroundColor: 'white', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>

            <View 
            style={{ marginBottom: this.props.navigation.getParam('isApplicant') ? 80 : 0, backgroundColor: 'white', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>

            </View>}

        </ScrollView>

        :

        this.renderNoInternetView()}

        <View 
          style={{  
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,}}>

          <HireRejectView
              showNotification={this.state.formValid}
              firstWord = "Reject"
              secondWord = "Hire"
              applicantType = {this.state.applicantType}
              hireAction = {this.hireBtnPressed}
              rejectAction = {this.rejectBtnPressed}
          />

        </View>

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

        <Loader
          modalVisible={isLoading}
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

OtherUserProfile.propTypes = {
  setHiredApplicant: PropTypes.func.isRequired,
  setRejectedApplicant: PropTypes.func.isRequired,
  setPendingApplicant: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
  getUserid: state.getUserid,
  getSocket: state.getSocket,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OtherUserProfile);


