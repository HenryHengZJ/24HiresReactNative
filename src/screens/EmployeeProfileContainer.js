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
import colors from '../styles/colors';

import PendingApplicantContainer from '../containers/PendingApplicantContainer';
import HiredApplicantContainer from '../containers/HiredApplicantContainer';
import RejectedApplicantContainer from '../containers/RejectedApplicantContainer';

export default class EmployeeProfileContainer extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Applicants',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 17,
      color: '#454545',
    },
  });

  
  render() {
    const {navigation, screenProps} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#fff",} }>
         <AppTab 
         onNavigationStateChange={null} 
         screenProps={{
            postkey: navigation.getParam('postkey'),
            parentNavigation: navigation, 
            ...screenProps
          }}/>
      </SafeAreaView>
    );
  }
}


const AppTab = createMaterialTopTabNavigator({
  Pending: {screen:PendingApplicantContainer,
		navigationOptions: {
			tabBarLabel: "PENDING",
		}
	},
	Hired: {screen:HiredApplicantContainer,
		navigationOptions: {
			tabBarLabel: "HIRED",
		}
  },
  Rejected: {screen:RejectedApplicantContainer,
		navigationOptions: {
			tabBarLabel: "REJECTED",
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


