
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
  Button,
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import colors from '../styles/colors';
import MapView from "react-native-maps";
import MapContainer from "../components/MapContainer";

const closeIcon = require('../img/close-button.png');
const markerIcon = require('../img/mapview_marker.png');

export default class MapViewContainer extends Component {

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
    const latitudeDelta = navigation.getParam('latitudeDelta');
    const longitudeDelta = navigation.getParam('longitudeDelta');

    const region = {
			latitude: latitude,
			longitude: longitude,
			latitudeDelta: latitudeDelta,
			longitudeDelta: longitudeDelta
    }

    console.log("region2 = " + JSON.stringify(region));

      return (

        <View style={styles.wrapper}>

          {this.renderCloseButton()}

          <View style={{flex:1,
            justifyContent: "center",
            alignItems: "center"}}>

            <MapView
              provider = {Platform.OS == 'android' ? MapView.PROVIDER_GOOGLE : null}
              style = {{...StyleSheet.absoluteFillObject}}
              region = {region}
            >
              <MapView.Marker
                title="gg"
                description="{location.description}"
                coordinate={region}
                >
              </MapView.Marker>
              
            </MapView>
            
          </View>

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

MapViewContainer.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
