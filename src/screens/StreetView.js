
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  Animated,
  Image,
  BackHandler,
  Platform,
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import colors from '../styles/colors';

import StreetViewContainer from "../components/StreetViewContainer";

const closeIcon = require('../img/close-button.png');

export default class StreetView extends Component {

  static navigationOptions = ({ navigation }) => ({
    /*headerStyle: {transparentHeaderStyle},
    headerTransparent: true,
    headerTintColor: colors.white,*/
    header: null,
   
  });


  renderCloseButton() {
    return (
      <TouchableOpacity
          style={{ 
            position:'absolute', 
            left:20, 
            top:30, 
            zIndex:10,
            padding:10, 
            height: 40,
            width: 40,
            borderRadius:20,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
            onPress={() => this.props.navigation.goBack()}
        >

        <Image
            style={{ 
              height: 15,
              width: 15,
            }}
            source={closeIcon }
          />
       
        </TouchableOpacity>
    )
  }

  render() {
   
    const { navigation } = this.props;
    const latitude = navigation.getParam('latitude');
    const longitude = navigation.getParam('longitude');

    const region = {
			latitude: latitude,
			longitude: longitude
    }

      return (

        <View style={styles.wrapper}>

          {this.renderCloseButton()}

          <StreetViewContainer region={region}/>

        </View>

      ); 
  

  }
}

const styles = StyleSheet.create({
  
  wrapper: {
    flex: 1,
    backgroundColor: colors.themeblue
  },
  
});

StreetView.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
