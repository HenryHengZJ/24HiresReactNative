/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
} from 'react-native';
import { createMaterialTopTabNavigator } from "react-navigation";
import { connect } from 'react-redux';
import colors from '../styles/colors';
import apis from '../styles/apis';
import axios from 'axios';
import HomeContainer from './HomeContainer';
import SavedContainer from './JobTab/SavedContainer';
import AppliedContainer from './JobTab/AppliedContainer';
import HiredContainer from './JobTab/HiredContainer';
import IonIcon from 'react-native-vector-icons/Ionicons'

class JobContainer extends Component {

  constructor(props) {
		super(props);

    this.socket = this.props.getSocket.socket;
  }

  componentWillMount() {
    this.socket.emit('monitorJobSeekerJobs', this.props.getUserid.userid);
    this.socket.on("reconnect", () => {
      //reload socket io listener
      this.socket.emit('monitorJobSeekerJobs', this.props.getUserid.userid);
    });
  }

  render() {
    const {navigation, screenProps} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS == 'android' ? 20 : null} }>
         <AppTab onNavigationStateChange={null} screenProps={{parentNavigation: navigation, ...screenProps}}/>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(JobContainer);


const AppTab = createMaterialTopTabNavigator({
  Saved: {screen:SavedContainer,
		navigationOptions: {
      tabBarLabel: "SAVED",
		}

	},
	Applied: {screen:AppliedContainer,
		navigationOptions: {
      tabBarLabel: "APPLIED",
		}

	},
	Hired: {screen:HiredContainer,
		navigationOptions: {
      tabBarLabel: "HIRED",
		}
	},
}, 
{

	tabBarOptions: {
    labelStyle: {
      fontWeight: '600',
    },
    activeTintColor: colors.themeblue,
    indicatorStyle:{
      backgroundColor: colors.themeblue
    },
    inactiveTintColor: 'grey',
		style:{
			backgroundColor: "#fff"
		}
  },
  tabBarPosition: 'top',
	
})


