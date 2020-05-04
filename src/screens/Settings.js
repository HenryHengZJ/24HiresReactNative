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
  SectionList,
  Switch,
  Linking ,
  Platform,
} from 'react-native';
import { SearchBar, List, ListItem, Avatar } from 'react-native-elements';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import Touchable from 'react-native-platform-touchable';
import colors from '../styles/colors';
import apis from '../styles/apis';
import DeviceInfo from 'react-native-device-info'; 
import firebase from 'react-native-firebase'
import deviceStorage from '../helpers/deviceStorage';
import axios from 'axios';

const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon = require('../img/android_back_black.png');

const apiLevel = DeviceInfo.getAPILevel();
const deviceName = DeviceInfo.getDeviceName();
const model = DeviceInfo.getModel();
const readableVersion = DeviceInfo.getReadableVersion();
const systemVersion = DeviceInfo.getSystemVersion();
const brand = DeviceInfo.getBrand();

const logOutAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'LoggedOut'})
  ] 
})

class Settings extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 17,
      color: '#454545',
    },
    headerLeft:
    
    <TouchableOpacity 
      
        style={{marginLeft: 15,}}
        onPress={() => navigation.goBack() } >

        <Image
            style={{ height: 25, width: 25,}}
            source={Platform.OS === 'android' ? androidblackBackIcon : iosblackBackIcon}
        />
    
    </TouchableOpacity>,
  });

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      messageSwitchValue: null,
      applicationSwitchValue: null,
      applicantSwitchValue: null,
      userid: null,
      jwtToken: null,
      token: null,
      isEmployer: false,
    };

    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.deleteUserid = deviceStorage.deleteUserid.bind(this);
    console.disableYellowBox = true;
  }

  getList = () => {
    const {isEmployer} = this.state;
    const list = [
      {
    data: [
      {
        title: 'Messages',
      },
      {
        title: isEmployer ? 'New Applicants' : 'Job Applications',
      },
    ],
      title: 'Push Notifications',
      subtitle: 'Receive instant push notifications on applications and messages',
    },
    {
      data: [
        {
          title: 'Send Feedback',
        },
        {
          title: 'Report Fraud / Bug',
        },        
      ],
      title: 'Feedback',
      subtitle: '',
    },
    {
      data: [
        {
          title: 'Reset Password',
        },
        {
          title: 'Log Out',
        },
      ],
      title: 'Account',
      subtitle: '',
    },
    ];

    this.setState({
      list: list,
    });
  };

  componentDidMount() {
    Linking.addEventListener('url', this._handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL(event) {
    alert(JSON.stringify(event));
  }

  componentWillMount() {
    
    this.retrieveNewToken(); 

    const userid = this.props.navigation.getParam('userid');
    const isEmployer = this.props.navigation.getParam('isEmployer');
   
    this.setState({
      userid: userid,
      jwtToken: this.props.getJWTToken.jwttoken,
      isEmployer: isEmployer ? isEmployer : false,
    }, () => {
      this.getExistingToken();
      this.getList();
    })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '85%',
          backgroundColor: '#eeeeee',
          marginLeft: 30,
          marginRight: 30,
        }}
      />
    );
  };

  onItemPressed = (navigation, {item}) => {

    if (item.title === "Send Feedback") {
      Linking.openURL("mailto:?to=support@24hires.com&subject=Feedback&body=\n\n\n\n\nSent from " 
      + model + "\n" 
      + "API Level: " +apiLevel + "\n" 
      + "System Version: "+ systemVersion + "\n" 
      + "Application Version: "+ readableVersion + "\n"
      + "UserId: "+ this.state.userid);
    }
    else if (item.title === "Report Fraud / Bug") {
      Linking.openURL("mailto:?to=support@24hires.com&subject=Report Fraud / Bug&body=\n\n\n\n\nSent from " 
      + model + "\n" 
      + "API Level: " +apiLevel + "\n" 
      + "System Version: "+ systemVersion + "\n" 
      + "Application Version: "+ readableVersion + "\n"
      + "UserId: "+ this.state.userid);
    }
    else if (item.title === "Reset Password") {
      navigation.navigate("ResetPassword")
    }
    else if (item.title === "Log Out") {
      this.signOutUser(this.props.navigation)
    }
  };

  signOutUser = async (navigation) => {
    console.log("log out")
    try {
        await firebase.auth().signOut();
        this.deleteJWT();
        this.deleteUserid();
        navigation.dispatch(logOutAction);
    } catch (e) {
        console.log(e);
    }
  }

  toggleMessageSwitch = (value) => {
      this.setState({
        messageSwitchValue: value
      }, () => {
        this.updateToken();
      })
  }

  toggleApplicationSwitch = (value) => {
      this.setState({
        applicationSwitchValue: value
      }, () => {
        this.updateToken();
      })
  }

  toggleApplicantSwitch = (value) => {
    this.setState({
      applicantSwitchValue: value
    }, () => {
      this.updateToken();
    })
}


  retrieveNewToken = () => {
    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        this.setState({
          token: fcmToken,
        })
      } else {
        // user doesn't have a device token yet
      } 
    });

    firebase.messaging().onTokenRefresh((token) => {
      if (token) {
        // user has a device token
        this.setState({
          token: token,
        })
      }
    });
  }

  getExistingToken = () => {
    
    const { userid } = this.state
    var url = apis.GETToken_BASEURL + "userid__equals=" + userid;

    axios.get(url)
      .then((response) => {
        var data = response.data;
        if (data.length > 0) {
          this.setState({
            messageSwitchValue: data[0].ChatTokens === "" ? false : true,
            applicationSwitchValue: data[0].ApplicationTokens === "" ? false : true,
            applicantSwitchValue: data[0].ApplicantTokens === "" ? false : true,
          })
        }
        else {
          this.setState({
            messageSwitchValue: false ,
            applicationSwitchValue: false,
            applicantSwitchValue: false,
          })
        }
      })
      .catch((error) => {
        this.setState({
          messageSwitchValue: false ,
          applicationSwitchValue: false,
          applicantSwitchValue: false,
        })
      });
  }

  updateToken = () => {
    
    const {token, userid, jwtToken, applicationSwitchValue, messageSwitchValue, applicantSwitchValue, isEmployer} = this.state
    var url = apis.PUTToken_BASEURL + "userid=" + userid;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var finaldata;

    if (isEmployer) {
      finaldata = {
        ChatTokens: messageSwitchValue? token : '',
        ApplicantTokens: applicantSwitchValue? token : '',
      }
    }
    else {
      finaldata = {
        ApplicationTokens: applicationSwitchValue? token : '',
        ChatTokens: messageSwitchValue? token : '',
      }
    }

    axios.put(url, finaldata,  {headers: headers})
    .then((response) => {
      
    })
    .catch((error) => {
      
    });
  }


  renderSectionHeader = ({ section }) => (
    <View style={{ backgroundColor: 'white' }}>
      <Text
        style={{
          paddingTop: 20,
          fontWeight: '500',
          paddingLeft: 30,
          paddingRight: 20,
          fontSize: 18,
          color: colors.greyBlack,
        }}>
        {section.title}
      </Text>

      {section.subtitle === "" ? 
        null 
        :
        <Text
        style={{
          paddingTop:10,
          paddingLeft: 30,
          paddingRight: 30,
          lineHeight: 25,
          opacity: 0.6,
          color: colors.greyBlack,
          fontSize: 15,
        }}>
        {section.subtitle}
        </Text>
      }

      <View
        style={{
          height: 1,
          width: '85%',
          backgroundColor: '#eeeeee',
          marginLeft: 30,
          marginRight: 30,
          marginTop:20,
          
        }}
      />

    </View>
  );

  renderItem = ({ item, index }) => (

    <Touchable 
        delayPressIn = {Platform.OS == 'android' ? 50000 : null}
        onPress={item.title === "Messages" || item.title === "Job Applications" || item.title === "New Applicants" ? null: this.onItemPressed.bind(this, this.props.navigation, {item})}
        background={item.title === "Messages" || item.title === "Job Applications" || item.title === "New Applicants" ? Touchable.Ripple('white') : Touchable.Ripple('#d7d9db')}>

    <View
      style={{marginLeft: 30, marginRight: 30, borderBottomWidth: 0, flexDirection: 'row'}}>
      
        <Text
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            fontSize: 15,
            color: colors.greyBlack,
            flex: 1,
          }}>
          {item.title}
        </Text>

        {item.title === "Messages" || item.title === "Job Applications" || item.title === "New Applicants" ? 
        <Switch
          style={{justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}
          thumbTintColor={'green'}
          tintColor={colors.lightGray}
          onValueChange = {item.title === "Messages"? this.toggleMessageSwitch : item.title === "Job Applications"? this.toggleApplicationSwitch : this.toggleApplicantSwitch}
          value = {item.title === "Messages"? this.state.messageSwitchValue : item.title === "Job Applications"? this.state.applicationSwitchValue : this.state.applicantSwitchValue}/>
        : 
        null
        }  
      
      
    </View>

    </Touchable>
    
 
  );

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <List
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            borderTopWidth: 0,
            paddingTop:0,
            marginTop:0,
          }}>
          <SectionList
            keyExtractor={item => item.title}
            renderSectionHeader={this.renderSectionHeader}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            sections={this.state.list}
          />
        </List>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(Settings);
