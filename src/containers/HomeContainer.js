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
  DeviceEventEmitter,
  BackHandler,
  AsyncStorage,
} from "react-native";
import { PropTypes } from 'prop-types';
import { connect } from "react-redux";
import colors from '../styles/colors';
//import ActionCreators from '../redux/actions';
import * as Animatable from "react-native-animatable";
import { SearchBar, List, ListItem } from "react-native-elements";
import FlatListVerticalRow from "../components/HomeTab/FlatListVerticalRow";
import Icon from 'react-native-vector-icons/FontAwesome'
import Category from '../components/HomeTab/Category'
import Tag from '../components/HomeTab/Tag'
import RoundedButton from '../components/buttons/RoundedButton';
import LottieView from 'lottie-react-native';
import apis from '../styles/apis';
import transparentHeaderStyle from '../styles/navigation';
import deviceStorage from '../helpers/deviceStorage';
import { NavigationActions } from 'react-navigation';
import ActionButton from 'react-native-action-button';
import Touchable from 'react-native-platform-touchable';
import Moment from 'moment';
import axios from 'axios';

const { height, width } = Dimensions.get('window')

const navigateToNearbyJob = NavigationActions.navigate({
    routeName: 'NearbyJob',
});

class HomeContainer extends Component {

  constructor(props) {
		super(props);

		this.state = {
			data: [],
			page: 1,
            error: null,
            end: false,
            refreshing: false,
            loadlimit: 15,
            lasttime: null,
            empty: false,
            city: null,
            filtertxt: 'Filter',
            searchtxt: null,
            progress: new Animated.Value(0),
            userid: null,
        };

        this.onLocationListClose = this.onLocationListClose.bind(this);
        this.onSearchViewClose = this.onSearchViewClose.bind(this);
        this.onFilterClose = this.onFilterClose.bind(this);

        this.socket = this.props.getSocket.socket;
       
        console.disableYellowBox = true;
  }
  
  componentWillMount() {
        
    this.scrollY = new Animated.Value(0)

    this.startHeaderHeight = 80

    this.endHeaderHeight = 50

    if (Platform.OS == 'android') {
        this.startHeaderHeight = 100 + StatusBar.currentHeight
        this.endHeaderHeight = 70 + StatusBar.currentHeight
    }

    this.animatedHeaderHeight = this.scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [this.startHeaderHeight, this.endHeaderHeight],
        extrapolate: 'clamp'
    })

    this.animatedOpacity = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    })
    this.animatedTagTop = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [-30, 10],
        extrapolate: 'clamp'
    })
    this.animatedMarginTop = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [50, 30],
        extrapolate: 'clamp'
    })
  }

  fetchData = () => {

    const { loadlimit, page, city, lasttime } = this.state;

    console.log("fetchData");

    var url = apis.JOB_BASEURL+'sort=-time&limit='+loadlimit+'&city='+city+'&closed=false';

    if (lasttime) {
        url = url + '&time__lt=' + lasttime;
    }

    console.log('HomeContainer url = ' + url + '\n' + 'userid= ' + this.props.getUserid.userid)

    axios.get(url)
    .then((response) => {
        //alert(response.data.length)
        var data = response.data; 
        this.setState({
            error: data.error || null,
            end: data.length < loadlimit ? true : false,
            data: page === 1 ? data : [...this.state.data, ...data],
            refreshing: false,
            lasttime: data.length === 0 ? null : data[data.length-1].time,
            empty: data.length === 0 ? lasttime ? false : true : false,
        });
    })
    .catch((error) => {
        console.log('container err = ' + error);
        this.setState({
            error: true,
        })
    });

    deviceStorage.saveItem("userLocation", city);

  }


  componentDidMount() {
  
    this.loaduserLocation();
    this.startAnimation();
    this.setState({
        userid: this.props.getUserid.userid,
    }, () => {
        this.socket.emit('connected', this.state.userid);
    })
   
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  updateUserLocation = (city) => {

    var finaldata = {
        location: city,
    }

    var headers = {
    'Content-Type': 'application/json',
    'Authorization': this.props.getJWTToken.jwttoken,
    }

    var updateuserurl = apis.PUTUser_BASEURL +"userid=" + this.props.getUserid.userid;

    axios.put(updateuserurl, finaldata,  {headers: headers})
    .then((response) => {
    })
    .catch((error) => {
    });
  }

  seekUserLocation = () => {
    this.watchID = navigator.geolocation.getCurrentPosition((position) => {
       
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + 'AIzaSyBPspWoYygSRuvn2VnceAO3MBftXxfanBs')
        .then((response) => response.json())
        .then((responseJson) => {
            //alert('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
            var stateName = responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'administrative_area_level_1').length > 0)[0].short_name;
            var cityname = this.checkCityName(stateName);
            this.updateUserLocation(cityname);
        })
        .catch((error) => {
            this.updateUserLocation('Penang');
        });
       
      },
      (err) => {
        console.log(err)
      }
    );
  }

  checkCityName = (cityname) => {
    var city;
    if (cityname.indexOf('Johor') !== -1) {
        city = 'Johor';
    }
    else if (cityname.indexOf('Kedah') !== -1) {
        city = 'Kedah';
    }
    else if (cityname.indexOf('Kelantan') !== -1) {
        city = 'Kelantan';
    }
    else if (cityname.indexOf('Kuala Lumpur') !== -1) {
        city = 'Kuala Lumpur';
    }
    else if (cityname.indexOf('Labuan') !== -1) {
        city = 'Labuan';
    }
    else if (cityname.indexOf('Melacca') !== -1 || cityname.indexOf('Melaka') !== -1) {
        city = 'Melacca';
    }
    else if (cityname.indexOf('Negeri Sembilan') !== -1) {
        city = 'Negeri Sembilan';
    }
    else if (cityname.indexOf('Pahang') !== -1) {
        city = 'Pahang';
    }
    else if (cityname.indexOf('Penang') !== -1 || cityname.indexOf('Pulau Pinang') !== -1) {
        city = 'Penang';
    }
    else if (cityname.indexOf('Perak') !== -1) {
        city = 'Perak';
    }
    else if (cityname.indexOf('Perlis') !== -1) {
        city = 'Perlis';
    }
    else if (cityname.indexOf('Putrajaya') !== -1) {
        city = 'Putrajaya';
    }
    else if (cityname.indexOf('Sabah') !== -1) {
        city = 'Sabah';
    }
    else if (cityname.indexOf('Sarawak') !== -1) {
        city = 'Sarawak';
    }
    else if (cityname.indexOf('Selangor') !== -1) {
        city = 'Selangor';
    }
    else if (cityname.indexOf('Terengganu') !== -1) {
        city = 'Terengganu';
    }
    return city;
  }

  loaduserLocation = async() => {
    try {
      const userLocation = await AsyncStorage.getItem('userLocation');
      if (userLocation !== null) {
        this.setState({
          city: userLocation,
          searchtxt: 'Search 24Hires',
        }, () => {
            this.fetchData();
        });
      } else {
        this.setState({
            city: 'Penang',
            searchtxt: 'Search 24Hires',
        }, () => {
            this.fetchData();
            this.seekUserLocation();
        });
      }
    } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
        this.setState({
            city: 'Penang',
            searchtxt: 'Search 24Hires',
        }, () => {
            this.fetchData();
        });
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

  onLocationListClose( locationName, locationSelected) {
 
    if (locationSelected) {
        this.setState({
            city: locationName,
            data: [],
            page: 1,
            error: null,
            end: false,
            refreshing: false,
            empty: false,
            lasttime: null,
        }, () => {
            this.fetchData();
        });
    } 
  }

  onSearchViewClose( city, searchtxt, category, searchSelected, categorySelected) {

    if (!searchSelected && !categorySelected) {

    }
    else {

        this.props.screenProps.parentNavigation.navigate({
            routeName: 'SearchResult',
            params: {
                searchtxt: searchtxt,
                category: category,
                searchSelected: searchSelected,
                categorySelected: categorySelected,
                city: city,
            },
            key: (Math.random () * 10000).toString(), 
        });    
    } 
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

  onFilterClose(
    filterPressed,
    currencyValueSelected,
    currency, 
    ratesValueSelected, 
    rates, 
    dateselected, 
    startDate, 
    endDate, 
    city, 
    categorySelected,
    category,  
    genderSelected,
    gender, 
    jobtypeSelected,
    jobtype, 
  ) {
      
        if (filterPressed) {
        
            Moment.locale('en');
            var startDateFilter = startDate ? Moment(startDate).format('YYMMDD') : null;
            var endDateFilter = endDate ? Moment(endDate).format('YYMMDD') : null;

            this.props.screenProps.parentNavigation.navigate({
                routeName: 'SearchResult',
                params: {
                    currencyValueSelected: currencyValueSelected,
                    currency: currencyValueSelected? currency : null,

                    ratesValueSelected: ratesValueSelected,
                    rates: ratesValueSelected? rates : null,
        
                    dateselected: dateselected,
                    startDate: dateselected? startDate : null,
                    endDate: dateselected? endDate : null,
                    startDateFilter: dateselected? startDateFilter : null,
                    endDateFilter: dateselected? endDateFilter : null,

                    city:city,
    
                    categorySelected: categorySelected,
                    category: categorySelected? category : null,
        
                    genderSelected: genderSelected,
                    gender: genderSelected? gender : null,
        
                    jobtypeSelected: jobtypeSelected,
                    jobtype: jobtypeSelected? jobtype : null,
                },
                key: (Math.random () * 10000).toString(), 
            });    

        } 
  }

  onFilterPressed = (navigation) => {
    navigation.navigate('FilterJob', { 
        city: this.state.city,
        onFilterClose: this.onFilterClose 
    });
  }

  onNearbyJobPressed = (navigation) => {
    setTimeout(function () {
        navigation.dispatch(navigateToNearbyJob);
     }.bind(this), 50);
  }

  onJobTypePressed = (navigation,jobtype) => {
    setTimeout(function () {

       const {city} = this.state
       navigation.navigate({
            routeName: 'SearchResult',
            params: {
                jobtype,
                searchSelected: false,
                categorySelected: false,
                jobtypeSelected: true,
                city,
            },
            key: (Math.random () * 10000).toString(), 
        });    
    }.bind(this), 50);
    
  }

  onLocationPressed = (navigation) => {
    navigation.navigate('LocationContainer', { onLocationListClose: this.onLocationListClose });
  }

  onSearchPressed = (navigation) => {
    navigation.navigate('SearchView', { 
        city: this.state.city,
        onSearchViewClose: this.onSearchViewClose 
    });
  }

  _renderItem = ({item}) => (
    <FlatListVerticalRow
         itemlist={item}
         handleOnPress={this.onItemPressed.bind(this, this.props.screenProps.parentNavigation, {item})}
    />
  );

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
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

  renderHeader = () => {

    return (
    
    <View style={{ backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>

    
        <Text style={{  color:  colors.greyBlack, fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
            What jobs are you looking for, Zhen?
        </Text>

        <View style={{ height: 135, marginTop: 20  }}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                <Category imageUri={require('../img/home_parttime.jpg')}
                    name="Part Time"
                    rightmargin = "0"
                    handleOnPress={this.onJobTypePressed.bind(this, this.props.screenProps.parentNavigation, "PartTime")}
                />
                <Category imageUri={require('../img/home_fulltime.jpg')}
                    name="Full Time"
                    rightmargin = "0"
                    handleOnPress={this.onJobTypePressed.bind(this, this.props.screenProps.parentNavigation, "FullTime")}
                />
                <Category imageUri={require('../img/home_ezytask.jpg')}
                    name="EzyTask"
                    rightmargin = "0"
                    handleOnPress={this.onJobTypePressed.bind(this, this.props.screenProps.parentNavigation, "EzyTask")}
                />
                <Category imageUri={require('../img/home_internship.jpg')}
                    name="Internship"
                    rightmargin = "20"
                    handleOnPress={this.onJobTypePressed.bind(this, this.props.screenProps.parentNavigation, "Internship")}
                />
            </ScrollView>
        </View>

        
        <Text style={{ paddingTop: 20 , color: colors.greyBlack, fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
            Recent Jobs
        </Text>

    </View>
    );
  };  
  
  handleLoadMore = () => {

    console.log('HomeContainer handleLoadMore')

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
        lasttime: null,
    }, () => {
        this.fetchData();
    });
      
  }

  renderEmptyView(city) {
    return (
    
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>

            <Text style={{  color:  colors.greyBlack, fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                What jobs are you looking for, Zhen?
            </Text>
          
            <View style={{ height: 135, marginTop: 20  }}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <Category imageUri={require('../img/home_parttime.jpg')}
                        name="Part Time"
                        rightmargin = "0"
                    />
                    <Category imageUri={require('../img/home_fulltime.jpg')}
                        name="Full Time"
                        rightmargin = "0"
                    />
                    <Category imageUri={require('../img/home_ezytask.jpg')}
                        name="EzyTask"
                        rightmargin = "0"
                    />
                    <Category imageUri={require('../img/home_internship.jpg')}
                        name="Internship"
                        rightmargin = "20"
                    />
                </ScrollView>
            </View>


            <Text style={{ marginTop: 20 , color: colors.greyBlack, fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                Recent Jobs
            </Text>

            <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
                <LottieView 
                loop={true}
                style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                source={Platform.OS == 'android' ? "empty_box.json" : require('../animation/empty_box.json')} progress={this.state.progress} />
                <Text
                    style={{ marginTop: 0, alignSelf:'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
                >Sorry, it looks like there aren't any jobs available in </Text>
                <TouchableOpacity
                  style={{ 
                    borderLeftWidth: 0.5, 
                    borderRightWidth: 0.5, 
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
                    marginTop:10,
                    alignSelf: 'center',
                    paddingTop:10,
                    paddingBottom:10,
                    paddingLeft:20,
                    paddingRight:20,
                    justifyContent:'center',
                    elevation:3,
                    backgroundColor: '#67B8ED'}}
                    onPress={this.onLocationPressed.bind(this, this.props.screenProps.parentNavigation)}
              >

                <View style={{flexDirection: 'row'}}>

                  <Text style={{ color: 'white', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 15}}>
                        {city.toUpperCase()}
                  </Text>

                  <Icon name="caret-down" size={20} style={{marginLeft: 10}} color={'white'}/>

                </View>

              </TouchableOpacity>

            </View>

        </View>
    );
  };

  renderFlatListView() {
    return (
        <View style={{ flex: 1, backgroundColor: 'white'}}>

            <FlatList
                data={this.state.data}
                keyExtractor={(item) => item._id}
                renderItem={this._renderItem}
            // ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter} 
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                onEndReached={this.handleLoadMore}     
                onEndReachedThreshold={Platform.OS == 'android' ? 0.01 : 0.5}
                
            />
        </View>
    );
  };


  render() {

    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
            <View style={{ backgroundColor: 'white', paddingTop: 20, flex: 1 }}>
                <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#dddddd' }}>
                   
                    <View style={{
                        padding: 10,
                        backgroundColor: 'white',
                        borderTopWidth: 0,
                        borderBottomWidth: 1,
                        borderLeftWidth: 0.5,
                        borderRightWidth: 0.5,
                        borderRadius: 5,
                        borderColor: '#dddddd', 
                        marginHorizontal: 20,
                        shadowOffset: { width: 1, height: 1 },
                        shadowColor: '#000',
                        shadowOpacity: 0.3,
                        elevation: 1,
                        marginTop: Platform.OS == 'android' ? 20 : null
                    }}>

                    
                        <View style={{
                            flexDirection: 'row', }}>

                            <TouchableOpacity
                                disabled={true}
                                style={{ alignSelf:'center',  justifyContent: 'center', alignItems: 'center', marginRight: 10,}}>
                              
                                <Image  style={{ opacity: .5, height: 20, width: 20 }} source={require('../img/search.png')}/> 
                                   
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ flex: 1, padding:5,}}
                                onPress={this.onSearchPressed.bind(this, this.props.screenProps.parentNavigation)}>
                                <Text
                                    style={{  fontWeight: '400', color:  'grey', backgroundColor: 'white' }}
                                >{this.state.searchtxt}
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                   

                    <View
                        style={{ flexDirection: 'row', marginHorizontal: 20, position: 'relative', marginTop: 10, marginBottom: 10 }}
                    >
                        <Image  style={{ alignSelf:'center', marginRight: 10, justifyContent: 'center', height: 20, width: 20 }} source={require('../img/location.png')}/>
                        
                        <TouchableOpacity
                            onPress={this.onLocationPressed.bind(this, this.props.screenProps.parentNavigation)}
                        >
                            <Tag name={this.state.city} valueSet= {true}/>
                        </TouchableOpacity>

                        <Image  style={{ alignSelf:'center', marginRight: 10, marginLeft: 5, justifyContent: 'center', height: 25, width: 25 }} source={require('../img/filter.png')}/>
                        
                        <TouchableOpacity
                            onPress={this.onFilterPressed.bind(this, this.props.screenProps.parentNavigation)}
                        >
                            <Tag name={this.state.filtertxt} />
                        </TouchableOpacity>

                    </View>
                </View>
                
                {!this.state.empty && this.renderFlatListView()}

                {this.state.empty && this.renderEmptyView(this.state.city)}

            </View>

            <TouchableOpacity
                style={{
                    borderLeftWidth: 0.5, 
                    borderRightWidth: 0.5, 
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: '#dddddd', 
                    borderRadius:60/2,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 1,
                        height: 2,
                    },
                    shadowOpacity: 0.5,
                    elevation:4,
                    alignItems:'center',
                    justifyContent:'center',
                    width:60,
                    position: 'absolute',                                          
                    bottom: 25,                                                    
                    right: 20,
                    height:60,
                    backgroundColor:'#fff',
                }}
                //background={Touchable.Ripple(colors.ripplegray)}
                onPress={this.onNearbyJobPressed.bind(this, this.props.screenProps.parentNavigation)}
                >
                <Icon name="map-marker" color={colors.priceblue} size={30} />
            </TouchableOpacity>

        </View>
    );
  }
}

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

HomeContainer.propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
};

const mapStateToProps = state => ({
    getSocket: state.getSocket,
    getUserid: state.getUserid,
    getJWTToken: state.getJWTToken,
  });
  
export default connect(mapStateToProps)(HomeContainer);
