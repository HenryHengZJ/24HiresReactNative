/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableHightlight,
  TouchableOpacity,
  ProgressBarAndroid,
  Linking ,
  Alert,
  AsyncStorage,
  Platform,
} from 'react-native';
import { SearchBar, List, ListItem, Avatar } from "react-native-elements";
import colors from '../styles/colors';
import apis from '../styles/apis';
import firebase from 'react-native-firebase'
import axios from 'axios';
import Moment from 'moment';
import deviceStorage from '../helpers/deviceStorage';
import Loader from '../components/Loader';

import {NavigationActions, StackActions} from 'react-navigation';     
import Touchable from 'react-native-platform-touchable'; 
import DeviceInfo from 'react-native-device-info'; 

const userprofimagedefault = require('../img/defaultProfilePhoto.png');

const logOutAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'LoggedOut'})
  ] 
})

const switchProfileAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'EmployerLoggedInTabNavigator'})
  ] 
})

const navigateToPhoneAuth = NavigationActions.navigate({
  routeName: 'PhoneAuth1',
});


const navigateToUserProfile = NavigationActions.navigate({
  routeName: 'UserProfile',
});

const navigateToSettings = NavigationActions.navigate({
  routeName: 'Settings',
});

const navigateToPointsRewards = NavigationActions.navigate({
  routeName: 'PointsRewards',
});

const navigateToHowItWorks = NavigationActions.navigate({
  routeName: 'HowItWorks',
});

const navigateToInviteFriends = NavigationActions.navigate({
  routeName: 'InviteFriends',
});

const apiLevel = DeviceInfo.getAPILevel();
const deviceName = DeviceInfo.getDeviceName();
const model = DeviceInfo.getModel();
const readableVersion = DeviceInfo.getReadableVersion();
const systemVersion = DeviceInfo.getSystemVersion();
const brand = DeviceInfo.getBrand();

export default class ProfileContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      userid: null,
      userName: null,
      userProfileImage: null,
      userNumOfWorkExp: null,
      userEducation: null,
      userLanguage: null,
      imageBroken: false,
      anonymous: null,
      loadingVisible: false,
    };
    console.disableYellowBox = true;

    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.deleteUserid = deviceStorage.deleteUserid.bind(this);

  }

  getList = () => {
    const list = [
      {
        name: 'Points & Rewards',
        avatar_url: require('../img/profile_rewards.png'),
      },
      {
        name: 'Invite Friends',
        avatar_url: require('../img/profile_friends.png'),
      },
      {
        name: 'Switch to Employer',
        avatar_url: require('../img/profile_switch.png'),
      },
      {
        name: 'Settings',
        avatar_url: require('../img/profile_settings.png'),
      },
      {
        name: 'How it Works',
        avatar_url: require('../img/profile_howitworks.png'),
      },
      {
        name: 'Feedback',
        avatar_url: require('../img/profile_feedback.png'),
      },
      {
        name: 'LogOut',
        avatar_url: require('../img/profile_logout.png'),
      },
    ]

    this.setState({
      list: list
    })
    
  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
    this.onTokenRefreshListener && this.onTokenRefreshListener();
 }

  componentWillMount() {
    this.getList()

    this.authFirebaseListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
      
        if (user.isAnonymous) {
          this.setState({
            userid: user.uid,
            anonymous: true,
          }, () => {
            this.fetchUserData();
          });
        }
        else {
          this.setState({
            userid: user.uid,
            anonymous: false,
          }, () => {
            this.fetchUserData();
          });
        }
       
      } else {
        alert("user = null");
      }
    });
  }


  fetchUserData = () => {

    const { userid } = this.state;
  
    var url = apis.GETUser_BASEURL+'&userid__equals='+ userid;

    axios.get(url)
    .then((response) => {

      this.setState({
        userName: response.data[0].name,
        userProfileImage: response.data[0].profileimage,
        userNumOfWorkExp: response.data[0].workexp.length,
        userEducation: response.data[0].education,
        userLanguage: response.data[0].language,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#eeeeee",
          marginLeft: 10,
          marginRight: 10
        }}
      />
    );
  }

  onHeaderPressed = ( userid, anonymous) => {

    if (anonymous === false) {
      setTimeout(function () {
        this.props.screenProps.parentNavigation.navigate({
          routeName: 'UserProfile',
          params: {
              userid: userid,
          },
        })  
      }.bind(this), 50);
    }
    else if (anonymous === true) {
      this.askforLogin();
    }

  }

  askforLogin = () => {

    Alert.alert(
      'Anonymous User',
      'Login with with your social medias or email account for more in apps functionality',
      [
        {text: 'Cancel',
          onPress: () => 
            console.log("Cancel")
          },
        {text: 'Login', 
          onPress: () => 
            this.signOutUser()
          },
      ],
      { cancelable: true },
      { onDismiss: () => {} }
    )

  }

  onItemPressed = (navigation, {index}, anonymous) => {

    if (index === 0) {
      setTimeout(function () {
          firebase.auth().currentUser.unlink(firebase.auth.PhoneAuthProvider.PROVIDER_ID)
        //navigation.dispatch(navigateToPointsRewards);
      }.bind(this), 50)
    }
    else if (index === 1) {
      if (anonymous === true) {
        this.askforLogin();
      }
      else if (anonymous === false) {
        setTimeout(function () {
          navigation.dispatch(navigateToInviteFriends);
        }.bind(this), 50)
      }
    }
    else if (index === 2) {
      if (anonymous === true) {
        this.askforLogin();
      }
      else if (anonymous === false) {
        console.log("switch to employer")
        this.switchProfilePressed(navigation);
      }
    }
    else if (index === 3) {
      if (anonymous === true) {
        this.askforLogin();
      }
      else if (anonymous === false) {
        setTimeout(function () {
          navigation.navigate({
            routeName: 'Settings',
            params: {
                userid: this.state.userid,
            },
          })  
        }.bind(this), 50)
      }
    }
    else if (index === 4) {
      setTimeout(function () {
        navigation.dispatch(navigateToHowItWorks);
      }.bind(this), 50)
    }
    else if (index === 5) {
      if (anonymous === true) {
        this.askforLogin();
      }
      else if (anonymous === false) {
        Linking.openURL("mailto:?to=support@24hires.com&subject=Feedback&body=\n\n\n\n\nSent from " 
        + model + "\n" 
        + "API Level: " +apiLevel + "\n" 
        + "System Version: "+ systemVersion + "\n" 
        + "Application Version: "+ readableVersion + "\n"
        + "UserId: "+ this.state.userid);
      }
    }
    else if (index === 6) {
      this.signOutUser()
    }
  }

  switchProfilePressed = async(navigation) => {
  
    var phoneVerified = firebase.auth().currentUser.phoneNumber;
    if (phoneVerified) {
      try {
        await AsyncStorage.setItem('role', 'employer');
        navigation.dispatch(switchProfileAction);
      } catch (error) {}
    }
    else {
      navigation.dispatch(navigateToPhoneAuth);
    }
  }


  signOutUser = async () => {

    this.setState({loadingVisible: true})

    try {
      await AsyncStorage.removeItem('role');
    }catch (e) {
      console.log(e);
    }

    this.authFirebaseListener && this.authFirebaseListener()
   
    var user = firebase.auth().currentUser;
    if (!user) {
      this.deleteJWT();
      this.deleteUserid();
      this.props.screenProps.parentNavigation.dispatch(logOutAction);
    }
    else {
      if(user.isAnonymous){
        user.delete().then( async() => {
          // User deleted. Redirect to login page...
          try {
            await AsyncStorage.removeItem('finaldata');
            this.deleteJWT();
            this.deleteUserid();
            this.setState({loadingVisible: false})
            this.props.screenProps.parentNavigation.dispatch(logOutAction);
          }catch (e) {
            console.log(e);
          }
        }).catch( async(error) => {
          // An error happened.
          try {
            await firebase.auth().signOut();
            await AsyncStorage.removeItem('finaldata');
            this.deleteJWT();
            this.deleteUserid();
            this.setState({loadingVisible: false})
            this.props.screenProps.parentNavigation.dispatch(logOutAction);
          }catch (e) {
            console.log(e);
          }
        });
      }else{
          //perform logout
          try {
            await firebase.auth().signOut();
            await AsyncStorage.removeItem('finaldata');
            this.deleteJWT();
            this.deleteUserid();
            this.setState({loadingVisible: false})
            this.props.screenProps.parentNavigation.dispatch(logOutAction);
          }catch (e) {
            console.log(e);
          }
      } 
    }
  }


  renderHeader = (userid, username, userimage, imageBroken, totalVal, anonymous) => {

    return (
      
      <Touchable 
        style={{paddingLeft: 25, paddingRight: 25, paddingTop: Platform.OS == 'android' ? 30 : 10 , paddingBottom: 10, }}
        delayPressIn = {50000}
        onPress={this.onHeaderPressed.bind(this, userid, anonymous)}
        background={Touchable.Ripple(colors.ripplegray)}>

        <View style={{ flexDirection: 'column'}}>
        
          <View style={{ flexDirection: 'row'}}>
              
              <View style={{ flex: 1, alignItems: 'center', }}>
                <Image
                  style={{ width:85, height: 85, borderRadius: 85/2, }}
                  source={ imageBroken? userprofimagedefault : (userimage? userimage : userprofimagedefault) }
                  onError={() => this.setState({ imageBroken: true })}
                />
              </View>

              <View style={{ flex: 3, alignItems: 'flex-start',  marginLeft: 20, justifyContent: 'center' }}>

                  <Text style={{ fontSize: 24, color: colors.greyBlack, fontWeight: '700' }}>{anonymous? "Anonymous User" : username}</Text>

                  <Text style={{ color: colors.gray04, paddingTop: 0, fontSize: 15 }}>View and Edit Profile</Text>

              </View>

          </View>

          <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15 }}>

            <Text style={{ paddingTop: 10, paddingBottom: 10, color: colors.greyBlack, fontSize: 15 }}>Profile Completeness</Text>

            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              color="#2196F3"
              progress={totalVal}
            />

            <Text style={{ paddingTop: 10, paddingBottom: 10, color: colors.greyBlack, fontSize: 12 }}>
              {totalVal === 1 ? "Your profile is complete! Well done!" : "Complete your profile to boost up your chance of getting jobs!"}
            </Text>

          </View>

        </View>
        
      </Touchable>
    )
  };

  renderItem = ({ item, index }) => (
    <ListItem
      component={TouchableOpacity}
      underlayColor = 'rgba(174,174,174,0.2)'
      title={<Text style={{ paddingTop: 15, paddingBottom:15, marginLeft: 10, fontSize: 15, color: colors.greyBlack}}>{item.name}</Text>}
      avatar={<Image style={{  marginRight: 10, height:25, width:25, backgroundColor: 'white' }} source={item.avatar_url} />}
     // badge={{ value: 3, textStyle: { color: 'white' }, containerStyle: { backgroundColor: colors.darkOrange} }}
      containerStyle={{  marginLeft:15, marginRight:15, borderBottomWidth: 0 }}
      onPress={this.onItemPressed.bind(this, this.props.screenProps.parentNavigation, {index}, this.state.anonymous)} 
      />  
  )

  render() {

    const {
      userid,
      userName,
      userProfileImage,
      userNumOfWorkExp,
      userEducation,
      userLanguage,
      imageBroken,
      anonymous,
      loadingVisible,
    } = this.state

    var userprofimage = userProfileImage? {uri:userProfileImage} : null;

    var workVal = userNumOfWorkExp > 0 ? 1: 0;
    var eduVal = userEducation ? 1: 0;
    var languageVal = userLanguage ? 1: 0;

    var totalVal = (workVal + eduVal + languageVal) / 3;

    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
      <List  containerStyle={{ backgroundColor: 'white', borderBottomWidth: 0, borderTopWidth: 0 }}>

         <FlatList
            extraData={anonymous}
            keyExtractor={(item) => item.name}
            data={this.state.list}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader(userid, userName, userprofimage, imageBroken, totalVal, anonymous)}
          />
      </List>

      <Loader
        modalVisible={loadingVisible}
        animationType="fade"
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    padding: 50,
  },
});
