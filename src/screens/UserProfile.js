
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
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import ReadMore from 'react-native-read-more-text';
import ImageViewer from 'react-native-image-zoom-viewer';
import axios from 'axios';
import Moment from 'moment';

import Notification from '../components/Notification';
import HireRejectView from '../components/HireRejectView';
import Loader from '../components/Loader';
import colors from '../styles/colors';
import apis from '../styles/apis';


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
const editBlackIcon = require('../img/edit_black.png');
const editWhiteIcon = require('../img/edit_white.png');

const userprofimagedefault = require('../img/defaultProfilePhoto.png');
const usercoverimagedefault = require('../img/defaultCoverPhoto.png');
const internetIcon = require('../img/wifi.png');

const closeIcon = require('../img/close-button.png');

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

export default class UserProfile extends Component {
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
    }, () => {
        this.fetchUserData();
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
  
    var url = apis.GETUser_BASEURL+'&userid__equals='+ userid;

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

  renderCloseImgButton(imgtype) {
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
              routeName: 'EditProfile',
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


          {userWorkTitle1 && userWorkCompany1 && userWorkPeriod1 && userWorkCategory1 ? 
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

      {this.state.firstopen ? 
        <View style={styles.headerOrginal}>
          {this.renderBackButton("white")}
          {this.renderEditButton("white")}
        </View> 
        :  
        <View style={styles.header}>
          {this.state.header ? 
            <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_DOWN_KEYFRAMES} onAnimationEnd={() => this.setState({firstopen: false})} style={styles.header}>
                {this.renderBackButton("black")}
                {this.renderEditButton("black")}
            </Animatable.View> 
            :  
            <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_UP_KEYFRAMES} 
            onAnimationEnd={() => this.setState({firstopen: true})} style={styles.header}>
                {this.renderBackButton("black")}
                {this.renderEditButton("black")}
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

UserProfile.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};


