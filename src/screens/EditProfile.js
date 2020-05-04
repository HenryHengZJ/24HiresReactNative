
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
  TextInput, 
  Alert,
  AlertIOS,
  Keyboard,
  NativeModules,
  NetInfo,
  AsyncStorage,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import colors from '../styles/colors';
import apis from '../styles/apis';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'
import Moment from 'moment';
import axios from 'axios';

var ImagePicker = NativeModules.ImageCropPicker;

const chevLeftIcon = require('../img/left_chevron.png');
const chevRightIcon = require('../img/right_chevron.png');
const questionIcon = require('../img/question_mark.png');
const cameraIcon = require('../img/photograph.png');

const androidblackBackIcon = require('../img/android_back_black.png');
const androidwhiteBackIcon = require('../img/android_back_white.png');
const iosblackBackIcon = require('../img/ios_back_black.png');
const ioswhiteBackIcon = require('../img/ios_back_white.png');
const saveBlackIcon = require('../img/tick_circle_black.png');
const saveWhiteIcon = require('../img/tick_circle_white.png');

const internetIcon = require('../img/wifi.png');

const userprofimagedefault = require('../img/defaultProfilePhoto.png');
const usercoverimagedefault = require('../img/defaultCoverPhoto.png');


const SLIDE_IN_DOWN_KEYFRAMES = {
  from: { translateY: -50 },
  to: { translateY: 0 },
};

const SLIDE_IN_UP_KEYFRAMES = {
  from: { translateY: 0 },
  to: { translateY: -80 },
};

class EditProfile extends Component {


  static navigationOptions = ({ navigation }) => ({
    header:null,
    
  });

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      errortype: "",
      loadingVisible: true,
      saveloadingVisible: false,
      measures: 0,
      header: false,
      animation: '',
      firstopen: true,
      genderlist : [
        {
          label: 'Male',
          value: 'Male',
        },
        {
          label: 'Female',
          value: 'Female',
        },
      ],

      showProfileImage: false,
      showCoverImage: false,

      userid: null,
      error: null,
      userName: null,
      userProfileImage: null,
      userCoverImage: null,
      userNewProfileImage: null,
      userNewCoverImage: null,
      userLocation: null,
      userAbout: null,
      userGender: null,
      userBirthDate: null,
      userEmail: null,
      userNumOfWorkExp: 0,
      userWorkArray: [],
      userEducation: null,
      userLanguage: null,
      userLinkedAccount: null,
      userVerifiedInfo: 'Email Address',

      coverimageBroken: false,
      profimageBroken: false,

      internetStatus: false,
      editSaved: false,

    };

    this.onLocationListClose = this.onLocationListClose.bind(this);
    this.onWorkExpClose = this.onWorkExpClose.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
   
  }

  componentWillMount() {
    
    const { navigation } = this.props;

    const userid = navigation.getParam('userid');

    this.setState({
      userid: userid,
    }, () => {
        this.loadUserEditedData();
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
    const { navigation } = this.props;
    navigation.state.params.onEditProfileClose(this.state.editSaved);
  }

  onWorkExpClose(index, addnew, worktitletxt, workcompanytxt, worktimetxt, workcategory, workexpPressed) {
 
    if (workexpPressed) {
      if (addnew) {
        var newData = {
          worktitle: worktitletxt,
          workcompany: workcompanytxt,
          worktime: worktimetxt,
          workcategory: workcategory,
        }
        this.setState({
          userWorkArray: [...this.state.userWorkArray, newData],
          userNumOfWorkExp: this.state.userNumOfWorkExp + 1,
        }) 
      }
      else {
        const newArray = [...this.state.userWorkArray];
        newArray[index].worktitle = worktitletxt,
        newArray[index].workcompany = workcompanytxt,
        newArray[index].worktime = worktimetxt,
        newArray[index].workcategory = workcategory,
        this.setState({
          userWorkArray: newArray,
        })  

      }
    } 
  }

  onLocationListClose( locationName, locationSelected) {
 
    if (locationSelected) {
        this.setState({
            userLocation: locationName,
        })  
    } 
  }

  onLocationPressed = (navigation) => {
    {
      Keyboard.dismiss(),
      navigation.navigate('LocationContainer', { onLocationListClose: this.onLocationListClose })
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
        userProfileImage: { uri: response.data[0].profileimage},
        userCoverImage: { uri: response.data[0].coverimage},
        userLocation: response.data[0].location,
        userAbout: response.data[0].about,
        userGender: response.data[0].gender,
        userBirthDate: response.data[0].birth,
        userEmail: response.data[0].email,
        userNumOfWorkExp: response.data[0].workexp.length,
        userWorkArray: response.data[0].workexp.length >=1 ? response.data[0].workexp: [], 
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

  pickSingle(cropit, circular) {
    ImagePicker.openPicker({
      width: 300,
      height: circular ? 300 : 150,
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 0.5,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    }).then(image => {
      console.log('received image', image);
      alert(image.path)
      if (circular) {
        this.setState({
          userProfileImage: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
          userNewProfileImage: true,
        });
      }
      else {
        this.setState({
          userCoverImage: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
          userNewCoverImage: true,
        });
      }
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }


  updateUserProfile = () => {

    this.setState({saveloadingVisible : true});

    const { 
      userid,
      userName,
      userLocation,
      userAbout,
      userGender,
      userBirthDate,
      userEmail,
      userWorkArray,
      userEducation,
      userLanguage,
      userCoverImage,
      userProfileImage,
      userNewProfileImage,
      userNewCoverImage,
    } = this.state;

    var finaldata = {
      name: userName ? userName: null,
      location: userLocation ? userLocation: null,
      about: userAbout ? userAbout: null,
      gender: userGender ? userGender: null,
      birth: userBirthDate ? userBirthDate: null,
      email: userEmail ? userEmail: null,
      workexp: userWorkArray.length === 0 ? null : userWorkArray,
      education: userEducation ? userEducation: null,
      language: userLanguage ? userLanguage: null,
    }

    var jwtToken = this.props.getJWTToken.jwttoken;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var updateuserurl = apis.PUTUser_BASEURL +"userid=" + userid;
    axios.put(updateuserurl, finaldata,  {headers: headers})
      .then((response) => {

        if (response.status === 200) {

          if (userNewProfileImage && userNewCoverImage) {
            this.uploadProfileImgCoverImg();
          }
          else if (userNewProfileImage) {
            this.uploadProfileImg();
          }
          else if (userNewCoverImage) {
            this.uploadCoverImg();
          }
          else if (!userNewProfileImage && !userNewCoverImage) {
            this.setState({ showNotification: false, saveloadingVisible: false, editSaved: true }, () => {
              this.deleteEditedData();
            })
          }
         
        }
        
      })
      .catch((error) => {
        this.setState({ saveloadingVisible: false, showNotification: true });
      });

  }


  handleCloseNotification() {
    this.setState({ showNotification: false });
  }


  loadUserEditedData = async() => {

    try {

      const finaldata = await AsyncStorage.getItem('finaldata');
    
      const finaldataJSON = JSON.parse(finaldata);
      
      if (!finaldata) {
        this.fetchUserData();
      }
      else {
        this.setState({
          userName: finaldataJSON.userName? finaldataJSON.userName : null,
          userLocation: finaldataJSON.userLocation? finaldataJSON.userLocation : null,
          userAbout: finaldataJSON.userAbout? finaldataJSON.userAbout : null,
          userGender: finaldataJSON.userGender? finaldataJSON.userGender : null,
          userBirthDate: finaldataJSON.userBirthDate? finaldataJSON.userBirthDate : null,
          userEmail: finaldataJSON.userEmail? finaldataJSON.userEmail : null,
          userWorkArray: finaldataJSON.userWorkArray === [] ? [] : finaldataJSON.userWorkArray ,
          userNumOfWorkExp: finaldataJSON.userWorkArray === [] ? 0 : finaldataJSON.userWorkArray.length,
          userEducation: finaldataJSON.userEducation? finaldataJSON.userEducation : null,
          userLanguage: finaldataJSON.userLanguage? finaldataJSON.userLanguage : null,
          userCoverImage: finaldataJSON.userCoverImage? {uri: finaldataJSON.userCoverImage} : {},
          userProfileImage: finaldataJSON.userProfileImage? {uri: finaldataJSON.userProfileImage} : {},
          loadingVisible: false,
          error: false,
        });
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }

  }

  deleteEditedData = async() => {
    try{
     
      await AsyncStorage.removeItem('finaldata');

      this.props.navigation.goBack();
    } catch (error) {
      console.log('AsyncStorage Errror: ' + error.message);
    }
  }

  saveEditedDataToAsync = async() => {

    const { 
      userName,
      userLocation,
      userAbout,
      userGender,
      userBirthDate,
      userEmail,
      userWorkArray,
      userEducation,
      userLanguage,
      userCoverImage,
      userProfileImage,
    } = this.state;

    finaldata = {
      userName,
      userLocation,
      userAbout,
      userGender,
      userBirthDate,
      userEmail,
      userWorkArray,
      userEducation,
      userLanguage,
      userCoverImage: userCoverImage.uri ? userCoverImage.uri : null,
      userProfileImage: userProfileImage.uri ? userProfileImage.uri : null,
    }

    try {
      await AsyncStorage.setItem('finaldata', JSON.stringify(finaldata));
   
      this.props.navigation.goBack();
    } catch (error) {
    
      console.log('AsyncStorage Error: ' + error.message);
    }
  }

  uploadProfileImgCoverImg = ()=> {

    var profileimgtype = this.state.userProfileImage.uri.split('.')[1].trim();
    var profileimgname = this.state.userid + '-profileimage' + '-' + new Date().getTime() + '.' + profileimgtype;

    var coverimgtype = this.state.userCoverImage.uri.split('.')[1].trim();
    var coverimgname = this.state.userid  + '-coverimage' + '-' + new Date().getTime() + '.' + coverimgtype;

    let profiledata = new FormData();

    var profileimgdata = {
      uri: this.state.userProfileImage.uri,
      type: 'image/'+profileimgtype,
  	  name: profileimgname
    }

    profiledata.append( 'images', profileimgdata );


    let coverdata = new FormData();

    var coverimgdata = {
      uri: this.state.userCoverImage.uri,
      type: 'image/'+coverimgtype,
  	  name: coverimgname
    }

    coverdata.append( 'images', coverimgdata );

   
    var coverurllink = 'https://s3-ap-southeast-1.amazonaws.com/profilepic1/' + coverimgname;

    var profileurllink = 'https://s3-ap-southeast-1.amazonaws.com/profilepic1/' + profileimgname;

    var headers = {
      'Content-Type': 'multipart/form-data',
    }

    var updateheaders = {
      'Content-Type': 'application/json',
      'Authorization': this.props.getJWTToken.jwttoken,
    }
  
    axios.post('http://24dbs.24hires.com:8081/upload', profiledata,  {headers: headers})
    .then((response) => {
      //success uploaded profile image, next upload cover image
      if (response.status === 200) {

        axios.post('http://24dbs.24hires.com:8081/upload', coverdata,  {headers: headers})
        .then((response) => {
          //success uploaded cover image, next update users db profileimage and coverimage link
          if (response.status === 200) {

            var updateuserurl = apis.PUTUser_BASEURL +"userid=" + this.state.userid;

            axios.put(updateuserurl, {coverimage: coverurllink, profileimage: profileurllink},  {headers: updateheaders})
              .then((response) => {
                if (response.status === 200) {
                  this.setState({ showNotification: false, saveloadingVisible: false, editSaved: true }, () => {
                    this.deleteEditedData();
                  })
                }
                else {
                  this.setState({ saveloadingVisible: false, showNotification: true });
                }
              })
              .catch((error) => {
                this.setState({ saveloadingVisible: false, showNotification: true });
              });

          }
          else {
            this.setState({ saveloadingVisible: false, showNotification: true });
          }

        }).catch((error) => {
          this.setState({ saveloadingVisible: false, showNotification: true });
        });

      }
      else {
        this.setState({ saveloadingVisible: false, showNotification: true });
      }

    }).catch((error) => {
      this.setState({ saveloadingVisible: false, showNotification: true });
    });
  }


  uploadCoverImg = () => {

    var imgtype = this.state.userCoverImage.uri.split('.')[1].trim();
    var name = this.state.userid + '-coverimage' + '-' + new Date().getTime() + '.' + imgtype;
    let data = new FormData();
    var imgdata = {
      uri: this.state.userCoverImage.uri,
      type: 'image/'+imgtype,
  	  name: name
    }
    data.append( 'images', imgdata );

    var urllink = 'https://s3-ap-southeast-1.amazonaws.com/profilepic1/' + name;

    var headers = {
      'Content-Type': 'multipart/form-data',
    }

    var updateheaders = {
      'Content-Type': 'application/json',
      'Authorization': this.props.getJWTToken.jwttoken,
    }
  
    axios.post('http://24dbs.24hires.com:8081/upload', data,  {headers: headers})
    .then((response) => {
      //handle success
      if (response.status === 200) {
        var updateuserurl = apis.PUTUser_BASEURL +"userid=" + this.state.userid;
        axios.put(updateuserurl, {coverimage: urllink},  {headers: updateheaders})
          .then((response) => {
            if (response.status === 200) {
              this.setState({ showNotification: false, saveloadingVisible: false, editSaved: true }, () => {
                this.deleteEditedData();
              })
            }
            else {
              this.setState({ saveloadingVisible: false, showNotification: true });
            }
          })
          .catch((error) => {
            this.setState({ saveloadingVisible: false, showNotification: true });
          });
      }
    }).catch((error) => {
      this.setState({ saveloadingVisible: false, showNotification: true });
    });
    
  }


  uploadProfileImg = () => {

    var imgtype = this.state.userProfileImage.uri.split('.')[1].trim();
    var name = this.state.userid + '-profileimage' + '-' + new Date().getTime() + '.' + imgtype;
    let data = new FormData();
    var imgdata = {
      uri: this.state.userProfileImage.uri,
      type: 'image/'+imgtype,
  	  name: name
    }
    data.append( 'images', imgdata );

    var urllink = 'https://s3-ap-southeast-1.amazonaws.com/profilepic1/' + name;
    
    var headers = {
      'Content-Type': 'multipart/form-data',
    }

    var updateheaders = {
      'Content-Type': 'application/json',
      'Authorization': this.props.getJWTToken.jwttoken,
    }
  
    axios.post('http://24dbs.24hires.com:8081/upload', data,  {headers: headers})
    .then((response) => {
      if (response.status === 200) {
        var updateuserurl = apis.PUTUser_BASEURL +"userid=" + this.state.userid;
        axios.put(updateuserurl, {profileimage: urllink},  {headers: updateheaders})
          .then((response) => {
            if (response.status === 200) {
              this.setState({ showNotification: false, saveloadingVisible: false, editSaved: true }, () => {
                this.deleteEditedData();
              })
            }
            else {
              this.setState({ saveloadingVisible: false, showNotification: true });
            }
          })
          .catch((error) => {
            this.setState({ saveloadingVisible: false, showNotification: true });
          });
      }
    }).catch((error) => {
      this.setState({ saveloadingVisible: false, showNotification: true });
    });
    
  }


  renderNoWorkExp() {
    return (
      <View style={{ marginBottom:20, marginLeft:25, marginRight:25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
        <Text
          style={{ color: 'grey', lineHeight: 30,  marginHorizontal: 10, fontSize: 15}}>
         No Work Experience yet
       </Text>

      </View>
    )
  }


  renderWorkExp(userWorkArray, userNumOfWorkExp) {

    var workarrays = [];

    for(let i = 0; i < userNumOfWorkExp; i++){

      workarrays.push(

      <TouchableOpacity style={{ marginLeft:25, marginRight:25,}}
      onPress={() => 
        {
          Keyboard.dismiss(),
          this.props.navigation.navigate("WorkExp",
            {
              worktitle: userWorkArray[i].worktitle,
              workcompany: userWorkArray[i].workcompany,
              worktime: userWorkArray[i].worktime,
              workcategory: userWorkArray[i].workcategory,
              addnew: false,
              userid: this.state.userid,
              index: i,
              onWorkExpClose: this.onWorkExpClose
              
            },
          )
        }
      }>
        

        <View 
          style={{flex:1, borderWidth: 1, padding:10, borderRadius: 5, borderColor: '#d6d7da', flexDirection: 'column', marginBottom: 10}}>

          <View 
              style={{flex:1, flexDirection: 'row'}}>

              <View 
                style={{flex:1, alignItems:'flex-start', justifyContent:'flex-start', flexDirection: 'column'}}>

                <Text numberOfLines={1} style={{color: colors.greyBlack, marginLeft: 20, marginTop: 0, fontSize: 15, fontWeight: '500' }}>
                    {userWorkArray[i].worktitle} 
                </Text>

                <Text numberOfLines={1} style={{color: colors.greyBlack, marginLeft: 20, marginTop: 10, fontSize: 15}}>
                    {userWorkArray[i].workcompany} 
                </Text>

                <Text numberOfLines={1} style={{color: 'grey', opacity: 0.9, marginLeft: 20, marginTop: 10, fontSize: 15}}>
                    {userWorkArray[i].worktime} 
                </Text>

                <View
                style={{ 
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
                      {userWorkArray[i].workcategory}
                    </Text>

                  </View>

                </View>

              </View>
              
              <Image
                style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
                source={chevRightIcon}
              />

          </View>
          
        </View>
      
      </TouchableOpacity>
      )
    }

    return(

      <View style={{marginBottom: 10}}>

      {workarrays}

      </View>

    )
  }

  renderAbout(about) {
    return (
      <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
        <TextInput 
            lineHeight= {30}
            underlineColorAndroid='rgba(0,0,0,0)' 
            multiline={true} 
            placeholder="Tell more about yourself"
            placeholderTextColor="grey"
            onChangeText={(value) => this.setState({userAbout: value})}
            value={about}
            style={{ padding: 0, color: colors.greyBlack,   marginHorizontal: 10, fontSize: 15}}>
         </TextInput>

      </View>
    )
  }
  
  renderEmail(email) {
    return (
      <View style={{  marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
        <TextInput 
            underlineColorAndroid='rgba(0,0,0,0)' 
            placeholder="Enter your work email here"
            placeholderTextColor="grey"
            onChangeText={(value) => this.setState({userEmail: value})}
            value={email}
            style={{ padding: 0, color: colors.greyBlack,  marginHorizontal: 10, fontSize: 15}}>
         </TextInput>

      </View>
    )
  }
  
  renderLocation(location) {
    return (
      <TouchableOpacity style={{  marginVertical:20 ,marginHorizontal: 25,}}
        onPress={this.onLocationPressed.bind(this, this.props.navigation)}
      >
        <View style={{ flex:1, borderWidth: 1, padding:10, borderRadius: 5, borderColor: '#d6d7da', flexDirection: 'row'}}>
          {location != "" ? 
          <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 15}}>
                {location}
          </Text>
          :
          <Text style={{ flex:1, lineHeight: 30,  color: 'grey', marginHorizontal: 10, fontSize: 15}}>
                Pick your location
          </Text>
          }
          
          <Image
            style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5}}  
            source={chevRightIcon}
          />
  
        </View>
      </TouchableOpacity>
    )
  }
  
  renderGender(gender) {
    return (
      <TouchableOpacity style={{  marginVertical:20 ,marginHorizontal: 25,}}
        onPress={() => Keyboard.dismiss()}
      >
        <RNPickerSelect
            items={this.state.genderlist}
            placeholder={{
              label: "",
              value: ""
            }}
            onValueChange={(value) => {
                this.setState({
                  userGender: value,
                });
            }}
        >
          <View style={{ flex:1, borderWidth: 1, padding:10, borderRadius: 5, borderColor: '#d6d7da', flexDirection: 'row'}}>
            
            {gender != "" ? 
            <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 15}}>
                {gender}
            </Text>
            :
            <Text style={{  flex:1, lineHeight: 30,  color: 'grey', marginHorizontal: 10, fontSize: 15}}>
                Choose your gender
            </Text>
            }
            
            <Image
              style={{ justifyContent:'center', marginRight: 5, alignSelf:'center',  height: 20, width: 20, opacity: 0.5,}}
              source={chevRightIcon}
            />
    
          </View>
        </RNPickerSelect>
      </TouchableOpacity>
    )
  }
  
  renderBirthDate(birthdate) {

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
      <TouchableOpacity style={{  marginVertical:20 ,marginHorizontal: 25, }}
        onPress={() => this.setState({pressCount: this.state.pressCount + 1})}
      >
        <View style={{ flex:1, borderWidth: 1, padding:7, borderRadius: 5, borderColor: '#d6d7da', flexDirection: 'row'}}>
        
          
          <DatePicker
            customStyles={customStyles}
            style={{flex: 1}}
            date={birthdate}
            mode="date"
            placeholder="Select your birth date"
            format="DD MMM YYYY"
            minDate={minDate}
            maxDate={maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconSource={null}
            onDateChange={(date) => {this.setState({userBirthDate: date});}}
          />
          
 
          <Image
            style={{ justifyContent:'center', marginRight: 5, alignSelf:'center',  height: 20, width: 20, opacity: 0.5, }}
            source={chevRightIcon}
          />
  
        </View>
      </TouchableOpacity>
    )
  }
  
  
  renderEducation(education) {
    return (
      <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
          <TextInput 
              underlineColorAndroid='rgba(0,0,0,0)' 
              multiline={true} 
              placeholder="Add your educations"
              placeholderTextColor="grey"
              onChangeText={(value) => this.setState({userEducation: value})}
              value={education}
              style={{ padding: 0, color: colors.greyBlack,  marginHorizontal: 10, fontSize: 15}}>
           </TextInput>

      </View>
    )
  }
  
  
  renderLanguages(languages) {
    return (
      <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
        <TextInput 
            underlineColorAndroid='rgba(0,0,0,0)' 
            multiline={true} 
            placeholder="Add your spoken languages"
            placeholderTextColor="grey"
            onChangeText={(value) => this.setState({userLanguage: value})}
            value={languages}
            style={{ padding: 0, color: colors.greyBlack, marginHorizontal: 10, fontSize: 15}}>
         </TextInput>
       
      </View>
    )
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
            onPress={() => 

              Platform.OS === 'android' ? 

              Alert.alert(
                'Save Draft',
                'Do you want to save your draft before going back to previous screen?',
                [
                  {text: 'Back Without Saving',
                    onPress: () => 
                      {this.deleteEditedData()}, style: 'cancel'
                  },
                  {text: 'Save', 
                    onPress: () => 
                      {this.saveEditedDataToAsync()}
                  },
                ],
                { cancelable: true },
                { onDismiss: () => {} }
              )

              :
              
              AlertIOS.alert(
              'Save Draft',
              'Do you want to save your draft before going back to previous screen?',
              [
                {
                  text: 'Back Without Saving',
                  onPress: () => {this.deleteEditedData()}, 
                  style: 'destructive'
                },
                {
                  text: 'Save', 
                  onPress: () => {this.saveEditedDataToAsync()},
                  style: 'default'
                },
                {
                  text: 'Cancel', 
                  onPress: () => {null},
                  style: 'cancel'
                },
              ],
             
            )

          }
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

  renderSaveButton(btncolor) {
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
            onPress={() => this.updateUserProfile()}
        >

        {btncolor === "white" ? 
        <Image
            style={{ 
              height: 25,
              width: 25,
            }}
            source={saveWhiteIcon}
          />
        :
        <Image
            style={{ 
              height: 25,
              width: 25,
            }}
            source={saveBlackIcon}
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
      userGender,
      userBirthDate,
      userEmail,
      userNumOfWorkExp,
      userWorkArray,
      userEducation,
      userLanguage,

      coverimageBroken,
      profimageBroken,
      loadingVisible,
      saveloadingVisible,
      showNotification,

      internetStatus,

    } = this.state
    
 
    return (
      <KeyboardAvoidingView style={{ backgroundColor:'white', flex:1}}>

        { loadingVisible ? 
        null :
        internetStatus ?

        <ScrollView 
          keyboardShouldPersistTaps='handled'
          scrollEventThrottle={16}
          onScroll={this.handleScroll.bind(this)}
          style={{backgroundColor:'transparent', flex:1}}>

            <Image
              style={{ height: 150, width: '100%'}}
              source={ coverimageBroken? usercoverimagedefault : (userCoverImage.uri ? userCoverImage : usercoverimagedefault) }
              onError={() => this.setState({ coverimageBroken: true })}
            />

            <View
              style={{ backgroundColor:'black', opacity: 0.3, position: 'absolute',  top: 0, height: 150, width: '100%', zIndex: 10,}}
            />

            <TouchableOpacity style={{ alignItems:'center', position: 'absolute',  right: 20, top: 90, height: 40, width: 40, zIndex: 15,   }}
                onPress={() => 
                  {
                    Keyboard.dismiss(),
                    this.pickSingle(true, false)
                  }
                }
              >

              <View
              style={{ alignItems:'center', alignSelf: 'center', justifyContent: 'center', backgroundColor:'transparent', height: 40, width: 40, borderRadius: 40/2, borderWidth: 1, borderColor: 'white', zIndex: 15,  }}
              >

                <Image
                  style={{ height: 20, width: 20, zIndex: 15, alignSelf: 'center', justifyContent: 'center'}}
                  source={cameraIcon}
                />

              </View>

            </TouchableOpacity>


            <View 
              style={{marginTop:50, alignSelf:'center', marginLeft:20, marginRight:20, }}
              onLayout={({nativeEvent}) => {
                this.setState({
                  measures: nativeEvent.layout.y
                })
              }}>

              <TextInput 
                  underlineColorAndroid='grey' 
                  placeholder=""
                  placeholderTextColor="grey"
                  style={{ paddingBottom: 20, marginHorizontal: 10, color: colors.greyBlack, textAlign:'center', alignSelf:'center', fontWeight: '700', fontSize: 24}}>
              {userName? userName: ''}
              </TextInput>

            </View>

            <Image
              style={{ position: 'absolute',  top: 80, height: 100, width: 100, 
              borderRadius: 50, zIndex: 5, alignSelf:'center'}}
              source={ profimageBroken? userprofimagedefault : (userProfileImage.uri? userProfileImage : userprofimagedefault) }
              onError={() => this.setState({ profimageBroken: true })}
            />
            
            <View
              style={{ backgroundColor:'black', opacity: 0.3, position: 'absolute',  top: 80, height: 100, width: 100, 
              borderRadius: 50, zIndex: 10, alignSelf:'center'}}
            />

            <TouchableOpacity style={{  alignSelf:'center', alignItems:'center', position: 'absolute', top: 110, height: 40, width: 40, zIndex: 15,   }}
                onPress={() => 
                  {
                    Keyboard.dismiss(),
                    this.pickSingle(true, true)
                  }
                }
              >

              <View
              style={{ alignItems:'center', alignSelf: 'center', justifyContent: 'center', backgroundColor:'transparent', height: 40, width: 40, borderRadius: 40/2, borderWidth: 1, borderColor: 'white', zIndex: 15,  }}
              >

                <Image
                  style={{ height: 20, width: 20, zIndex: 15, alignSelf: 'center', justifyContent: 'center'}}
                  source={cameraIcon}
                />

              </View>

            </TouchableOpacity>
            
           
            
            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              About
            </Text>

            {this.renderAbout(userAbout)}
            
            <Text style={{color: colors.greyBlack, paddingTop:0, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Location
            </Text>

            {this.renderLocation(userLocation? userLocation : '')}

            
            <View style={{ flex:1, flexDirection: 'row'}}>
              <Text style={{color: colors.greyBlack, paddingTop:0, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
                Gender
              </Text>

              <TouchableOpacity style={{ height: 20, width: 20,  }}
                onPress={() => 
                  {
                    Keyboard.dismiss(),
                    Alert.alert("Optional","This is an optional field. Your info will not be shared with others")
                  }
                }
              >

                <Image
                  style={{ opacity: 0.5, justifyContent:'center', alignSelf:'center', height: 20, width: 20,  borderRadius: 20/2, }}
                  source={questionIcon}
                />

              </TouchableOpacity>
            
      
            </View>

            {this.renderGender(userGender? userGender : '')}
            
            <View style={{ flex:1, flexDirection: 'row'}}>
              <Text style={{color: colors.greyBlack, paddingTop:0, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
                Birth Date
              </Text>

              <TouchableOpacity style={{ height: 20, width: 20,  }}
                onPress={() => 
                  {
                    Keyboard.dismiss(),
                    Alert.alert("Optional","This is an optional field. Your info will not be shared with others")
                  }
                }
              >

                <Image
                  style={{ opacity: 0.5, justifyContent:'center', alignSelf:'center', height: 20, width: 20,  borderRadius: 20/2, }}
                  source={questionIcon}
                />

              </TouchableOpacity>
              
      
            </View>
            
            {this.renderBirthDate(userBirthDate)}
            
            
           <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Email
            </Text>

            {this.renderEmail(userEmail)}
            
            
            <View style={{ flex:1, flexDirection: 'row'}}>
              <Text style={{color: colors.greyBlack, flex:1, paddingTop:0, fontWeight: '500', paddingLeft:25, paddingRight:25, paddingBottom: 20, fontSize: 18}}>
                Work Experience
              </Text>


              <TouchableOpacity style={{ paddingLeft:25, paddingRight: 25, }}
                onPress={() => 
                  {
                    Keyboard.dismiss(),
                    this.props.navigation.navigate("WorkExp",
                      {
                        worktitle: "",
                        workcompany: "",
                        worktime: "",
                        addnew: true,
                        userid: this.state.userid,
                        onWorkExpClose: this.onWorkExpClose
                      }
                    )
                  }
                }
              >
                <Text style={{  color: colors.priceblue, fontSize: 15}}>
                  Add New Experience
                </Text>

              </TouchableOpacity>
            
            </View>
            
            {userNumOfWorkExp > 0 ? this.renderWorkExp( userWorkArray, userNumOfWorkExp ) : this.renderNoWorkExp()}

            
   
            <Text style={{ color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Education
            </Text>

            {this.renderEducation(userEducation)}

            
            <Text style={{ color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Spoken Languages
            </Text>

            {this.renderLanguages(userLanguage)}
            

            <View 
              style={{ backgroundColor: 'white', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>

        </ScrollView>

        :

        this.renderNoInternetView()}

        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />

        <Loader
          modalVisible={saveloadingVisible}
          animationType="fade"
        />

        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, marginTop: showNotification ? 10 : 0 }}>
            <Notification
              showNotification={showNotification}
              handleCloseNotification={this.handleCloseNotification}
              type="Error"
              firstLine = {"Unfortunately, some errors occured."}
              secondLine="Please try again."
            />
        </View>

        {this.state.firstopen ? 
          <View style={styles.headerOrginal}>
            {this.renderBackButton("white")}
            {this.renderSaveButton("white")}
          </View> 
          :  
          <View style={styles.header1}>
            {this.state.header ? 
              <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_DOWN_KEYFRAMES} onAnimationEnd={() => this.setState({firstopen: false})} style={styles.header}>
                  {this.renderBackButton("black")}
                  {this.renderSaveButton("black")}
              </Animatable.View> 
              :  
              <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_UP_KEYFRAMES} 
              onAnimationEnd={() => this.setState({firstopen: true})} style={styles.header}>
                  {this.renderBackButton("black")}
                  {this.renderSaveButton("black")}
              </Animatable.View>
            }
          </View>
        }

      </KeyboardAvoidingView >

    )
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
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  placeholderText: {
    fontSize: 15,
    color: 'grey',
  },
  dateText:{
    color: colors.greyBlack,
    fontSize: 15,
    justifyContent: 'flex-start',
  }
});

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
    zIndex:1,
    height:70,
    borderBottomWidth: 1,
    borderColor: "#CED0CE",
  },
  header1: {
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

EditProfile.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
  getUserid: state.getUserid,
});

export default connect(mapStateToProps)(EditProfile);


