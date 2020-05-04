
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation';
import { StatusBar, Platform, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import axios from 'axios';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import HomeContainer from '../containers/HomeContainer';
import JobContainer from '../containers/JobContainer';
import TalentContainer from '../containers/TalentContainer';
import EmployerMessageContainer from '../containers/EmployerMessageContainer';
import EmployerProfileContainer from '../containers/EmployerProfileContainer';
import SearchEmployeeContainer from '../containers/SearchEmployeeContainer';
import colors from '../styles/colors';
import apis from '../styles/apis';
import firebase from 'react-native-firebase'
import EmployerJobContainer from './EmployerJobContainer';


class EmployerLoggedInTabNavigator extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    header: null,
  });

  constructor(props) {
		super(props);

		this.state = {
      MainTab_EmployerProfileNotification: false,
      MainTab_EmployerMessageNotification: false,
      MainTab_EmployerJobNotification: false,
      userid: null,
      token: null,
      jwtToken: null,
      applicationTokens: "",
      chatTokens: "",
      anonymous: null,
		};

    this.socket = this.props.getSocket.socket;
    this.onCategoryListClose = this.onCategoryListClose.bind(this);
  }

  fetchNotification = (userid) => {

    var url = apis.GETNotification_BASEURL + '&userid__equals=' + userid;

    axios.get(url)
    .then((response) => {
      var data = response.data;
      if (data.length >= 0){
        this.setState({
            MainTab_EmployerProfileNotification: data[0].MainTab_EmployerProfileNotification ? data[0].MainTab_EmployerProfileNotification : null,
            MainTab_EmployerMessageNotification: data[0].MainTab_EmployerMessageNotification ? data[0].MainTab_EmployerMessageNotification: null,
            MainTab_EmployerJobNotification: data[0].MainTab_EmployerJobNotification ? data[0].MainTab_EmployerJobNotification : null,
        }, () => {
          /*alert('MainTab_EmployerProfileNotification = ' + this.state.MainTab_EmployerProfileNotification + 
                '\n' + 'MainTab_EmployerMessageNotification = ' + this.state.MainTab_EmployerMessageNotification +
                '\n' + 'MainTab_EmployerJobNotification = ' + this.state.MainTab_EmployerJobNotification)*/
        })
      }
    })
    .catch(err => {
        console.log("fetch error" + err);
    });

  }

  componentWillMount() {

    this.setState({
      userid: this.props.getUserid.userid,
      jwtToken: this.props.getJWTToken.jwttoken,
    }, () => {
      this.retrieveToken();
      this.fetchNotification(this.state.userid);
      this.socket.emit('connected', this.state.userid );
      this.socket.emit('monitorMainTab', this.state.userid );
    })

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.isAnonymous) {
          this.setState({
            anonymous: true,
          });
        }
      } 
    });

    this.socket.on('mainchanges', (data) => {
        this.setState({
          MainTab_EmployerProfileNotification: data.MainTab_EmployerProfileNotification,
          MainTab_EmployerMessageNotification: data.MainTab_EmployerMessageNotification,
          MainTab_EmployerJobNotification: data.MainTab_EmployerJobNotification,
        })
    });

    this.socket.on("reconnect", () => {
      this.socket.emit('monitorMainTab', this.state.userid );
      this.fetchNotification(this.state.userid);
    });

  }

  retrieveToken = () => {
    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        this.setState({
          token: fcmToken,
        }, () => {
          this.getExistingToken();
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
        }, () => {
          this.getExistingToken();
        })
      }
    });
  }

  getExistingToken = () => {
    
    const {token, userid, jwtToken} = this.state
    var url = apis.GETToken_BASEURL + "userid__equals=" + userid;
   
    axios.get(url)
      .then((response) => {
        var data = response.data;
        if (data.length > 0) {
          this.setState({
            applicationTokens: data[0].ApplicationTokens === "" ? "" : data[0].ApplicationTokens,
            chatTokens: data[0].ChatTokens === "" ? "" : data[0].ChatTokens,
          }, () => {
            this.updateToken();
          })
        }
      })
      .catch((error) => {
       
      });
  }

  updateToken = () => {
    
    const {token, userid, jwtToken, applicationTokens, chatTokens} = this.state
    var url = apis.PUTToken_BASEURL + "userid=" + userid;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }
    
    axios.put(url, 
      { 
        headers: headers,
        ApplicationTokens: applicationTokens === "" ? "" : token,
        ChatTokens: chatTokens === "" ? "" : token,
      })
      .then((response) => {
        
      })
      .catch((error) => {
       
      });
  }

  onCategoryListClose( categoryName, categorySelected) {
 
    //do nothhing
  }

  render() {
    const {navigation, screenProps} = this.props;
    const {MainTab_EmployerProfileNotification, MainTab_EmployerMessageNotification, MainTab_EmployerJobNotification, userid, anonymous} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#fff",}}>
         <LoggedInTab
            onNavigationStateChange={(prevState, currentState) => {
              if (currentState.index === 0) {
                this.setState({
                  MainTab_EmployerJobNotification: false,
                })
                var jobdata = {
                  userid: userid,
                  notifications: [{MainTab_EmployerJobNotification: false}],
                }
                if (!anonymous) {
                  this.socket.emit('JobTabPressed', jobdata)
                }
              }
              else if (currentState.index === 2) {
                this.setState({
                  MainTab_EmployerMessageNotification: false,
                })
                var messagedata = {
                  userid: userid,
                  notifications: [{MainTab_EmployerMessageNotification: false}],
                }
                if (!anonymous) {
                  this.socket.emit('MessageTabPressed', messagedata)
                } 
              }
              else if (currentState.index === 3) {
                this.setState({
                  MainTab_EmployerProfileNotification: false,
                })
                var profiledata = {
                  userid: userid,
                  notifications: [{MainTab_EmployerProfileNotification: false}],
                }
                if (!anonymous) {
                  this.socket.emit('ProfileTabPressed', profiledata)
                } 
              }
            }}
            screenProps={{ 
              MainTab_EmployerProfileNotification: MainTab_EmployerProfileNotification,
              MainTab_EmployerMessageNotification: MainTab_EmployerMessageNotification,
              MainTab_EmployerJobNotification: MainTab_EmployerJobNotification,
              parentNavigation: navigation,
            }} 
         />

         <TouchableOpacity
              style={{ 
                position: 'absolute',
                bottom: 7,
                borderRadius:25, 
                alignSelf: 'center',
                justifyContent:'center',
                alignItems: 'center',
                height: 50,
                width: 50,
                zIndex: 5,
                backgroundColor: colors.themeblue}}
                onPress={() => navigation.navigate(
                  'CreateJobCategory'
                )}
          >

            <View>

              <Icon
                name={'ios-add-outline'}
                size={35}
                color={colors.white}
              />

            </View>

          </TouchableOpacity>
      </SafeAreaView>
    );
  }

}


const CustomTabBarIcon = (name, size, notification, left, right) => {
  const icon = ({ tintColor }) => (
    <View style={{ marginRight: right, marginLeft: left,}}>
      <Icon
        name={name}
        size={size}
        color={tintColor}
      />
      {notification? 
        <View style={{ position: 'absolute', right: -10, top: 0, backgroundColor: 'white', borderRadius: 15/2, width: 15, height: 15, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'red', borderRadius: 5, width: 10, height: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}/>
        </View>
        :
        null
      }
    </View>
  );

  icon.propTypes = {
    tintColor: PropTypes.string.isRequired,
  };

  return icon;
};


const LoggedInTab = createBottomTabNavigator({
  Job: {
    screen: EmployerJobContainer,
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: ({ focused, tintColor }) => (
        <Text 
          style={{ fontWeight: '500', marginBottom: 5, fontSize: 10, color: focused ? colors.priceblue : colors.greyBlack, marginRight: 10, alignSelf: 'center', textAlign: 'center' }}> 
          JOB 
        </Text>
      ),
      tabBarIcon: CustomTabBarIcon('ios-briefcase-outline', 27, screenProps.MainTab_EmployerJobNotification, 0, 10 ),
    })
  },
  SearchEmployee: {
    screen: SearchEmployeeContainer,
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: ({ focused, tintColor }) => (
        <Text 
          style={{ fontWeight: '500', marginBottom: 5, fontSize: 10, color: focused ? colors.priceblue : colors.greyBlack, marginRight: 40, alignSelf: 'center', textAlign: 'center' }}> 
          SEARCH 
        </Text>
      ),
      tabBarIcon: CustomTabBarIcon('ios-search-outline', 27, false, 0, 40 ),
    })
  },
  Message: {
    screen: EmployerMessageContainer,
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: ({ focused, tintColor }) => (
        <Text 
          style={{ fontWeight: '500', marginBottom: 5, fontSize: 10, color: focused ? colors.priceblue : colors.greyBlack, marginLeft: 40, alignSelf: 'center', textAlign: 'center' }}> 
          MESSAGE 
        </Text>
      ),
      tabBarIcon: CustomTabBarIcon('ios-chatbubbles-outline', 25, screenProps.MainTab_EmployerMessageNotification, 40, 0, ),
    })
  },
 
  EmployerProfileContainer: {
    screen: EmployerProfileContainer,
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: ({ focused, tintColor }) => (
        <Text 
          style={{ fontWeight: '500', marginBottom: 5, fontSize: 10, color: focused ? colors.priceblue : colors.greyBlack, marginLeft: 10, alignSelf: 'center', textAlign: 'center' }}> 
          PROFILE 
        </Text>
      ),
      tabBarIcon: CustomTabBarIcon('ios-contact-outline', 25, screenProps.MainTab_EmployerProfileNotification, 10, 0),
    })
  },
}, {
  tabBarOptions: {
    labelStyle: {
      fontWeight: '600',
      marginBottom: 5,
    },
    activeTintColor: colors.priceblue,
    inactiveTintColor: colors.greyBlack,
    style: {
      backgroundColor: 'white',
    },
  },
  tabBarPosition: 'bottom',
});

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(EmployerLoggedInTabNavigator);


