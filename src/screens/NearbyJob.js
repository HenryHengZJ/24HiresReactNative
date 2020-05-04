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
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  FlatList, 
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  PermissionsAndroid ,
} from "react-native";
import { PropTypes } from 'prop-types';
import { connect } from "react-redux";
import colors from '../styles/colors';
//import ActionCreators from '../redux/actions';
import * as Animatable from "react-native-animatable";
import { SearchBar, List, ListItem } from "react-native-elements";
import MapItemRow from "../components/MapItemRow";
import Icon from 'react-native-vector-icons/FontAwesome'
import Category from '../components/HomeTab/Category'
import Tag from '../components/HomeTab/Tag'
import RoundedButton from '../components/buttons/RoundedButton';
import LottieView from 'lottie-react-native';
import apis from '../styles/apis';
import transparentHeaderStyle from '../styles/navigation';
import { NavigationActions } from 'react-navigation';
import MapView from "react-native-maps";
import {requestLocationPermission} from "../helpers/asyncfunc";
import Touchable from 'react-native-platform-touchable';

const closeIcon = require('../img/close-button.png');
const markerIcon = require('../img/mapview_marker.png');


const navigateToJobDetail = NavigationActions.navigate({
    routeName: 'JobDetail',
});


class NearbyJob extends Component {

  static navigationOptions = ({ navigation }) => ({
   
    header: null,
  });

  
  constructor(props) {
		super(props);

		this.state = {
			data: [],
			page: 1,
			seed: 1,
      error: null,
      end: false,
      refreshing: false,
      loadlimit: 20,
      lasttime: "",
      empty: false,
      city: 'Penang',
      progress: new Animated.Value(0),
      mapRegion: null,
      initialRegion: null,
      lastLat: null,
      lastLong: null,
      research: false,
   };

    this.lastTimeout = setTimeout; 

    console.disableYellowBox = true;
  }
  
  async componentWillMount() {
    await requestLocationPermission()
  }

  fetchData = () => {

    const { loadlimit, page, lastLat, lastLong } = this.state;

    var url;

    url = apis.GETNearbyJob_BASEURL + "longitude=" + lastLong + "&latitude=" + lastLat + "&radius=" + 5 + "&closed__equals=false";
    
    fetch(url, {
            method: 'GET',
            headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json'
            }
        })
        .then(response => { return response.json();})
        .then(responseData => {return responseData;})
        .then(data => {
          this.setState({
            error: data.error || null,
            end: data.length < loadlimit ? true : false,
            data: page === 1 ? data : [...data],
            refreshing: false,
            lasttime: data.length === 0 ? "" : data[data.length-1].time,
            empty: data.length === 0 ? lasttime ? false : true : false,
            research: false,
          });
        })
        .catch(err => {
            console.log("fetch error" + err);
    });

  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  componentDidMount() {

    //this.startAnimation();

    this.watchID = navigator.geolocation.getCurrentPosition((position) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
      let region = {
        latitude:       position.coords.latitude,
        longitude:      position.coords.longitude,
        latitudeDelta:  0.0922,
        longitudeDelta: 0.0421
      }
      this.onInitialRegionChange(region, region.latitude, region.longitude);
      console.log("position.coords.latitude, = " + position.coords.latitude)
      console.log("position.coords.longitude = " + position.coords.longitude)
     
    });
  }

  onInitialRegionChange(region, lastLat, lastLong) {
    this.setState({
      initialRegion: region,
      mapRegion: region,
      // If there are no new values set the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });

    this.fetchData();

    console.log("onInitialRegionChange lastLat = " + lastLat)
    console.log("onInitialRegionChange lastLong = " + lastLong)
    console.log("onInitialRegionChange mapRegion = " + region)
  }

  onRegionChange(region) {

      this.setState({
        mapRegion: region,
        lastLat: region.latitude || this.state.lastLat,
        lastLong: region.longitude || this.state.lastLong,
       
      });
  
      
      
      console.log("onRegionChange lastLat = " + this.state.lastLat)
      console.log("onRegionChange lastLong = " + this.state.lastLong)
      console.log("onRegionChange mapRegion = " + JSON.stringify(region) )
    

    if (this.state.research) {
      this.fetchData();
    }
  }

  
  startAnimation() {
    
    Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
    }).start(() => {
        this.setState({
            progress: new Animated.Value(0),
        })    
        this.startAnimation();
    });
  }

  onItemPressed = (navigation, {item}) => {

    setTimeout(function () {
      navigation.navigate({
          routeName: 'JobDetail',
          params: {
              _id: item._id,
          },
      });    
    }.bind(this), 50);

  }

  
  _renderItem = ({item, index}) => (
    <MapItemRow
         itemlist={item}
         index={index+1}
         handleOnPress={this.onItemPressed.bind(this, this.props.navigation, {item})}
    />
  );

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  }

  renderFooter = () => {
    if (this.state.end) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 0,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  
  handleLoadMore = () => {

    if (!this.state.end) {
        this.setState({
          page: this.state.page + 1,
        
        }, () => {
            this.fetchData();
        });
      }
  }

  handleRefresh = () => {

    this.setState({
        page: 1,
        refreshing: true,
        lasttime: "",
        end: false,
    }, () => {
        this.fetchData();
    });
      
  }

  renderEmptyView(city) {
    return (

        <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
            <LottieView 
            loop={true}
            style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
            source={Platform.OS == 'android' ? "empty_box.json" : require('../animation/empty_box.json')} progress={this.state.progress} />
            <Text
                style={{ marginTop: 0, alignSelf:'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
            >No jobs found </Text>
          

        </View>
       
    );
  };

  goIndex = (index) => {

    setTimeout(() => { this.flatListRef.scrollToIndex({animated:true , index: (index === this.state.data.length-1) ? index : index + 1, viewPosition: 0.5}) }, 50);
   
  };

  renderFlatListView() {
    return (
        <View style={{ flex: 1, backgroundColor: 'white'}}>

            <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
                data={this.state.data}
                keyExtractor={(item) => item._id}
                renderItem={this._renderItem}
                onScrollToIndexFailed={()=>{}}
            // ItemSeparatorComponent={this.renderSeparator}
                ListFooterComponent={this.renderFooter} 
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                onEndReached={this.handleLoadMore}     
                onEndReachedThreshold={0.01}
                
            />
        </View>
    );
  };

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

    return (
        <View style={{  backgroundColor: 'white', flex: 1 }}>

         {this.renderCloseButton()}

         <View  style = {{ flex: 1, }} >

            <MapView
                provider = {Platform.OS == 'android' ? MapView.PROVIDER_GOOGLE : null}
                style = {{ ...StyleSheet.absoluteFillObject}}
                showsUserLocation={true}
                showsCompass={true}
                onRegionChangeComplete={this.onRegionChange.bind(this)}
                initialRegion={this.state.initialRegion}
                //region={this.state.mapRegion}
              >

              {this.state.data.map((marker, index) => (
                <MapView.Marker
                  coordinate={{
                    latitude: (marker.latitude),
                    longitude: (marker.longitude),
                  }}
                  title={marker.title}
                  description={marker.fulladdress}
                  image={markerIcon}
                  onPress={
                    
                      this.goIndex.bind(this, index)
                    
                  }
                  >
    
                  <View 
                    style={{
                      width: 25,
                      height: 25,
                      alignItems:'center',
                      alignSelf:'center',
                      justifyContent:'center',
                      borderRadius: 25 / 2,
                      marginLeft:11,
                      marginTop:5,
                      backgroundColor: 'white'}}>
    
                      <Text 	
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          fontSize: 15,
                          }}>
                      {index+1}
                      </Text>
                      
                  </View>
    
                </MapView.Marker>
              ))}

            </MapView>
      
          

              <View
              style={{ borderRadius:25, backgroundColor:'white', position:'absolute',  bottom: 20, alignSelf: 'center',}}>

              <Touchable
                disabled={this.state.research ? true : false}
                style={{ 
                    borderLeftWidth: 0, 
                    borderRightWidth: 0, 
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: '#dddddd', 
                    borderRadius:25,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 1,
                        height: 1,
                    },
                    shadowOpacity: 0.3,
                    justifyContent:'center',
                    elevation:2,
                    opacity: this.state.research ? 0.2 : 1.0,
                    backgroundColor: colors.priceblue}}
                    onPress={() => 
                      {
                        this.setState({research: true})
                        this.fetchData();

                      }
                    }
                >

                <View style={{ alignItems:'center', justifyContent:'center'}}>

                  <Text style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, color: 'white', fontWeight: '500', fontSize: 15}}>
                    Redo search in this area
                  </Text>

                </View>

              </Touchable>
            </View>

          </View>

                
          {!this.state.empty && this.renderFlatListView()}

          {this.state.empty && this.renderEmptyView("Penang")}

           
        </View>
    );
  }
}

/*const mapStateToProps = state => ({
  loggedInStatus: state.loggedInStatus,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

HomeContainer.propTypes = {
  logIn: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);*/

export default NearbyJob;

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    backgroundColor: colors.white,
  },
  dropdownIcon: {
    color: colors.white,
    position: 'relative',
    right: 25,
    zIndex: 8,
  },
  buttonContainer: {
    marginTop: 10, 
    marginHorizontal: 100,

  }
});

NearbyJob.propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
  };
