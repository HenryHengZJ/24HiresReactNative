
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

class EditEmployerProfile extends Component {


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

      businesstypelist : [
        {
          label: 'Small Medium Enterprise (SME)',
          value: 'Small Medium Enterprise (SME)',
        },
        {
          label: 'Startup',
          value: 'Startup',
        },
        {
          label: 'Chain or Group',
          value: 'Chain or Group',
        },
      ],
      businesssizelist: [
        { 
          label: '1-10  Employees',
          value: '1-10  Employees',
        },
        {
          label: '11-50  Employees',
          value: '11-50  Employees',
        },
        {
          label: '51-200  Employees',
          value: '51-200  Employees',
        },
        {
          label: '201-500  Employees',
          value: '201-500  Employees',
        },
        {
          label: '501-1000  Employees',
          value: '501-1000  Employees',
        },
        {
          label: '1000+  Employees',
          value: '1000+  Employees',
        },
      ],

      showProfileImage: false,
      showCoverImage: false,

      userid: null,
      error: null,
      userName: null,
      userProfileImage: null,
      userCoverImage: null,
      userCompany: null,
      userAbout: null,
      userLocation: null,
      userBusinessType: null,
      userBusinessSize: null,
      userEmail: null,
      userPhone: null,

      coverimageBroken: false,
      profimageBroken: false,

      internetStatus: false,
      editSaved: false,

    };

    this.onLocationListClose = this.onLocationListClose.bind(this);
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
  
    var url = apis.GETEmployer_BASEURL+'userid='+ userid;

    axios.get(url)
    .then((response) => {

      console.log("data = " + JSON.stringify(response.data) );

      this.setState({
        error: false,
        userName: response.data[0].name,
        userProfileImage: { uri: response.data[0].employerdetails[0].profileimage},
        userCoverImage:  { uri: response.data[0].employerdetails[0].coverimage},
        userLocation: response.data[0].location,
        userAbout: response.data[0].about,
        userBusinessType: response.data[0].businesstype,
        userBusinessSize: response.data[0].size,
        userEmail: response.data[0].email,
        userCompany: response.data[0].company,
        userPhone: response.data[0].phone,
        
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
      if (circular) {
        this.setState({
          userProfileImage: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        });
      }
      else {
        this.setState({
          userCoverImage: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        });
      }
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }


  updateEmployerProfile = () => {

    const { 
      userid,
      userName,
      userLocation,
      userAbout,
      userBusinessType,
      userBusinessSize,
      userEmail,
   
      userCompany,
      userPhone,
      userCoverImage,
      userProfileImage,
    } = this.state;

    var employerData = {
      name: userName ? userName: null,
      location: userLocation ? userLocation: null,
      about: userAbout ? userAbout: null,
      businesstype: userBusinessType ? userBusinessType: null,
      size: userBusinessSize ? userBusinessSize: null,
      email: userEmail ? userEmail: null,
      company: userCompany ? userCompany: null,
      phone: userPhone ? userPhone: null,
    }

    var jwtToken = this.props.getJWTToken.jwttoken;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var updateuserurl = apis.PUTEmployer_BASEURL +"userid=" + userid;
    axios.put(updateuserurl, employerData,  {headers: headers})
      .then((response) => {

        if (response.status === 200) {
          this.setState({ showNotification: false, saveloadingVisible: false, editSaved: true }, () => {
             this.deleteEditedData()
          });
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

      const employerData = await AsyncStorage.getItem('employerData');
    
      const employerDataJSON = JSON.parse(employerData);
      
      if (!employerData) {
        this.fetchUserData();
      }
      else {
        this.setState({
          userName: employerDataJSON.userName? employerDataJSON.userName : null,
          userLocation: employerDataJSON.userLocation? employerDataJSON.userLocation : null,
          userAbout: employerDataJSON.userAbout? employerDataJSON.userAbout : null,
          userBusinessType: employerDataJSON.userBusinessType? employerDataJSON.userBusinessType : null,
          userBusinessSize: employerDataJSON.userBusinessSize? employerDataJSON.userBusinessSize : null,
          userEmail: employerDataJSON.userEmail? employerDataJSON.userEmail : null,
        
          userCompany: employerDataJSON.userCompany? employerDataJSON.userCompany : null,
          userPhone: employerDataJSON.userPhone? employerDataJSON.userPhone : null,
          userCoverImage: employerDataJSON.userCoverImage? {uri: employerDataJSON.userCoverImage} : {},
          userProfileImage: employerDataJSON.userProfileImage? {uri: employerDataJSON.userProfileImage} : {},
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
      await AsyncStorage.removeItem('employerData');
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
      userBusinessType,
      userBusinessSize,
      userEmail,
  
      userCompany,
      userPhone,
      userCoverImage,
      userProfileImage,
    } = this.state;

    var employerData = {
      userName,
      userLocation,
      userAbout,
      userBusinessType,
      userBusinessSize,
      userEmail,
    
      userCompany,
      userPhone,
      userCoverImage: userCoverImage.uri ? userCoverImage.uri : null,
      userProfileImage: userProfileImage.uri ? userProfileImage.uri : null,
    }

    try {
      await AsyncStorage.setItem('employerData', JSON.stringify(employerData));
   
      this.props.navigation.goBack();
    } catch (error) {
    
      console.log('AsyncStorage Error: ' + error.message);
    }
  }

  uploadImg = () => {
    let data = new FormData();
    data.append('images', {
      uri: this.state.userProfileImage.uri,
    });
    axios.post('http://mongodb.24hires.com:8081/upload', data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    })
    .then((response) => {
      //handle success
      alert(response)
    }).catch((error) => {
      //handle error
      //alert(error)
    });
    
  }

  renderAbout(about) {
    return (
      <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
        <TextInput 
            lineHeight= {30}
            underlineColorAndroid='rgba(0,0,0,0)' 
            multiline={true} 
            placeholder="Tell more about your company"
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
            placeholder="Add your work email (Optional)"
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
  
  renderBusinessType(businesstype) {
    return (
      <TouchableOpacity style={{  marginVertical:20 ,marginHorizontal: 25,}}
        onPress={() => Keyboard.dismiss()}
      >
        <RNPickerSelect
            items={this.state.businesstypelist}
            placeholder={{
              label: "",
              value: ""
            }}
            onValueChange={(value) => {
                this.setState({
                  userBusinessType: value,
                });
            }}
        >
          <View style={{ flex:1, borderWidth: 1, padding:10, borderRadius: 5, borderColor: '#d6d7da', flexDirection: 'row'}}>
            
            {businesstype != "" ? 
            <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 15}}>
                {businesstype}
            </Text>
            :
            <Text style={{  flex:1, lineHeight: 30,  color: 'grey', marginHorizontal: 10, fontSize: 15}}>
                Choose your Business Type
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

  
  renderSizeType(size) {
    return (
      <TouchableOpacity style={{  marginVertical:20 ,marginHorizontal: 25,}}
        onPress={() => Keyboard.dismiss()}
      >
        <RNPickerSelect
            items={this.state.businesssizelist}
            placeholder={{
              label: "",
              value: ""
            }}
            onValueChange={(value) => {
                this.setState({
                  userBusinessSize: value,
                });
            }}
        >
          <View style={{ flex:1, borderWidth: 1, padding:10, borderRadius: 5, borderColor: '#d6d7da', flexDirection: 'row'}}>
            
            {size != "" ? 
            <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 15}}>
                {size}
            </Text>
            :
            <Text style={{  flex:1, lineHeight: 30,  color: 'grey', marginHorizontal: 10, fontSize: 15}}>
                Select your team size
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
  
  
  renderCompany(company) {
    return (
      <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
          <TextInput 
              underlineColorAndroid='rgba(0,0,0,0)' 
              multiline={true} 
              placeholder="Company's name"
              placeholderTextColor="grey"
              onChangeText={(value) => this.setState({userCompany: value})}
              value={company}
              style={{ padding: 0, color: colors.greyBlack,  marginHorizontal: 10, fontSize: 15}}>
           </TextInput>

      </View>
    )
  }
  
  
  renderPhone(phone) {
    return (
      <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
        <TextInput 
            underlineColorAndroid='rgba(0,0,0,0)' 
            multiline={true} 
            placeholder="Add your work contact (Optional)"
            placeholderTextColor="grey"
            onChangeText={(value) => this.setState({userPhone: value})}
            value={phone}
            inputType="number"
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
            onPress={() => this.updateEmployerProfile()}
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
      userCompany,
      userAbout,
      userLocation,
      userBusinessType,
      userBusinessSize,
      userEmail,
      userPhone,

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

            <Text style={{ color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Company
            </Text>

            {this.renderCompany(userCompany)}

            
            <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              About
            </Text>

            {this.renderAbout(userAbout)}

            
            <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Location
            </Text>

            {this.renderLocation(userLocation? userLocation : '')}


            <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Business Type
            </Text>

            {this.renderBusinessType(userBusinessType? userBusinessType : '')}

            
            <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Team Size
            </Text>

            {this.renderSizeType(userBusinessSize? userBusinessSize : '')}
                        

            <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Work Email
            </Text>

            {this.renderEmail(userEmail)}


            <Text style={{ color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Work Contact
            </Text>

            {this.renderPhone(userPhone)}
            

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

const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getUserid: state.getUserid,
  });
  
  export default connect(mapStateToProps)(EditEmployerProfile);


