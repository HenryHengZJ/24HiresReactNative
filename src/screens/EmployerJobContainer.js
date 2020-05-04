
import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
} from 'react-native';
import { createMaterialTopTabNavigator } from "react-navigation";
import { connect } from "react-redux";
import colors from '../styles/colors';

import OpenJobContainer from '../containers/OpenJobContainer';
import ClosedJobContainer from '../containers/ClosedJobContainer';


class EmployerJobContainer extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    header: null,
  });

  constructor(props) {
		super(props);
      
    this.socket = this.props.getSocket.socket;

  }

  componentWillMount() {

    this.socket.emit('monitorApplicants', this.props.getUserid.userid);
    this.socket.on("reconnect", () => {
      //reload socket io listener and refresh data
      this.socket.emit('monitorApplicants', this.props.getUserid.userid);
      
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


const AppTab = createMaterialTopTabNavigator({
  Open: {screen:OpenJobContainer,
		navigationOptions: {
			tabBarLabel: "OPEN",
		}
	},
	Closed: {screen:ClosedJobContainer,
		navigationOptions: {
			tabBarLabel: "CLOSED",
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

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(EmployerJobContainer);


