
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation';
import { StatusBar, Platform, View, SafeAreaView } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import axios from 'axios';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import HomeContainer from '../containers/HomeContainer';
import JobContainer from '../containers/JobContainer';
import TalentContainer from '../containers/TalentContainer';
import MessageContainer from '../containers/MessageContainer';
import ProfileContainer from '../containers/ProfileContainer';
import colors from '../styles/colors';
import apis from '../styles/apis';
import firebase from 'react-native-firebase'


class LoggedInTabNavigator extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    header: null,
  });

  constructor(props) {
		super(props);

		this.state = {
      MainTab_ProfileNotification: false,
      MainTab_MessageNotification: false,
      MainTab_JobNotification: false,
      userid: null,
      token: null,
      jwtToken: null,
      applicationTokens: "",
      chatTokens: "",
      applicantTokens: "",
      anonymous: null,
		};

    this.socket = this.props.getSocket.socket;
  }

  fetchNotification = (userid) => {

    var url = apis.GETNotification_BASEURL + '&userid__equals=' + userid;

    axios.get(url)
    .then((response) => {
      var data = response.data;
      if (data.length >= 0){
        this.setState({
            MainTab_ProfileNotification: data[0].MainTab_ProfileNotification ? data[0].MainTab_ProfileNotification : null,
            MainTab_MessageNotification: data[0].MainTab_MessageNotification ? data[0].MainTab_MessageNotification: null,
            MainTab_JobNotification: data[0].MainTab_JobNotification ? data[0].MainTab_JobNotification : null,
        });
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
      alert(JSON.stringify(data))
        this.setState({
          MainTab_ProfileNotification: data.MainTab_ProfileNotification,
          MainTab_MessageNotification: data.MainTab_MessageNotification,
          MainTab_JobNotification: data.MainTab_JobNotification,
        })
    });

    this.socket.on("reconnect", () => {
      //alert("connect LoggedInTabNavigator");
      this.socket.emit('monitorMainTab', this.state.userid );
      this.socket.emit('connected', this.state.userid );
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
            applicantTokens: data[0].ApplicantTokens === "" ? "" : data[0].ApplicantTokens,
          }, () => {
            this.updateToken();
          })
        }
      })
      .catch((error) => {
       
      });
  }

  updateToken = () => {
    
    const {token, userid, jwtToken, applicationTokens, chatTokens, applicantTokens} = this.state
    var url = apis.PUTToken_BASEURL + "userid=" + userid;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var finaldata = {
      ApplicationTokens:applicationTokens === "" ? "" : token,
      ChatTokens: chatTokens === "" ? "" : token,
      ApplicantTokens: applicantTokens === "" ? "" : token,
    }
    
    axios.put(url, finaldata,  {headers: headers})
      .then((response) => {
        
      })
      .catch((error) => {
       
      });
  }


  render() {
    const {navigation, screenProps} = this.props;
    const {MainTab_ProfileNotification, MainTab_MessageNotification, MainTab_JobNotification, userid, anonymous} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#fff",}}>
         <LoggedInTab
            onNavigationStateChange={(prevState, currentState) => {
              if (currentState.index === 1) {
                this.setState({
                  MainTab_JobNotification: false,
                })
                var jobdata = {
                  userid: userid,
                  notifications: [{MainTab_JobNotification: false}],
                }
                if (!anonymous) {
                  this.socket.emit('JobTabPressed', jobdata)
                }
              }
              else if (currentState.index === 2) {
                this.setState({
                  MainTab_MessageNotification: false,
                })
                var messagedata = {
                  userid: userid,
                  notifications: [{MainTab_MessageNotification: false}],
                }
                if (!anonymous) {
                  this.socket.emit('MessageTabPressed', messagedata)
                }
              }
              else if (currentState.index === 3) {
                this.setState({
                  MainTab_ProfileNotification: false,
                })
                var profiledata = {
                  userid: userid,
                  notifications: [{MainTab_ProfileNotification: false}],
                }
                if (!anonymous) {
                  this.socket.emit('ProfileTabPressed', profiledata)
                } 
              }
            }}
            screenProps={{ 
              MainTab_ProfileNotification: MainTab_ProfileNotification,
              MainTab_MessageNotification: MainTab_MessageNotification,
              MainTab_JobNotification: MainTab_JobNotification,
              parentNavigation: navigation,
            }} 
         />
      </SafeAreaView>
    );
  }

}


const CustomTabBarIcon = (name, size, notification) => {
  const icon = ({ tintColor }) => (
    <View>
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
  Home: {
    screen: HomeContainer,
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: 'HOME',
      tabBarIcon: CustomTabBarIcon('ios-home-outline', 27, false ),
    })
  },
  Job: {
    screen: JobContainer,
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: 'JOB',
      tabBarIcon: CustomTabBarIcon('ios-briefcase-outline', 25, screenProps.MainTab_JobNotification),
    })
  },
  /*Talent: {
    screen: TalentContainer,
    navigationOptions: {
      tabBarLabel: 'TALENT',
      tabBarIcon: CustomTabBarIcon('ios-star-outline', 25),
    },
  },*/
  Message: {
    screen: MessageContainer,
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: 'MESSAGE',
      tabBarIcon: CustomTabBarIcon('ios-chatbubbles-outline', 25, screenProps.MainTab_MessageNotification),
    })
  },
  Profile: {
    screen: ProfileContainer,
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: 'PROFILE',
      tabBarIcon: CustomTabBarIcon('ios-contact-outline', 25, screenProps.MainTab_ProfileNotification),
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
  initialRouteName: 'Home',
  backBehavior: 'Home',
 
});

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(LoggedInTabNavigator);


