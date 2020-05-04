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

const defaultProfPicIcon = require('../img/defaultProfilePhoto.png');
const locationIcon = require('../img/location2.png');
const searchIcon = require('../img/search.png');
const { carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue } = colors;

const navigateToNearbyJob = NavigationActions.navigate({
    routeName: 'NearbyJob',
});

class SearchEmployeeContainer extends Component {

  constructor(props) {
		super(props);

		this.state = {
			data: [],
			page: 1,
            error: null,
            end: false,
            refreshing: false,
            loadlimit: 16,
            lastid: null,
            empty: false,
            city: null,
            filtertxt: 'Filter',
            searchtxt: null,
            progress: new Animated.Value(0),
            userid: null,
            category: null,
            worktime: null,
        };

        this.onLocationListClose = this.onLocationListClose.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
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

  fetchUserData = () => {

    const { loadlimit, page, city, lastid, category, worktime, searchtxt } = this.state;

    console.log("fetchUserData");

    var url = apis.GETUser_BASEURL+'limit='+loadlimit+'&location='+city+ '&sort=_id';

    if (lastid) {
        url = url + '&_id__gt=' + lastid;
    }
    if (category) {
        url = url + '&workexp.workcategory=' + category;
    }
    if (worktime) {

        var worklength = worktime;

        if (worklength.indexOf('+') !== -1) {
            worklength = worklength.replace(' +','');
        }
        url = url + '&workexp.worktime__regex=' + '/^' + worklength + '/i';
    }
    if (searchtxt) {
        url = url + "&name__regex=/^" + searchtxt + '/i';
    }

    axios.get(url)
    .then((response) => {
        var data = response.data; 
        this.setState({
            error: data.error || null,
            end: data.length < loadlimit ? true : false,
            data: page === 1 ? data : [...this.state.data, ...data],
            refreshing: false,
            lastid: data.length === 0 ? null : data[data.length-1]._id,
            empty: data.length === 0 ? lastid ? false : true : false,
        },() => {

            var newdata = [...this.state.data];

            if (newdata.length > 0) {

                for(var i = page === 1 ? newdata.length - 1 : 0; i < data.length; i++) {
                    newdata[i]['imageBroken'] = false 
                }

                this.setState({
                    data: newdata
                })
            }

        })
    })
    .catch((error) => {
        console.log('container err = ' + error);
        this.setState({
            error: true,
        })
    });

  }


  componentWillMount() {
  
    this.loaduserLocation();
    //this.startAnimation();
    this.setState({
        userid: this.props.getUserid.userid,
    }, () => {
        //this.socket.emit('connected', this.state.userid);
    })
   
  }

  loaduserLocation = async() => {
    try {
      const userLocation = await AsyncStorage.getItem('userLocation');
      if (userLocation !== null) {
        this.setState({
          city: userLocation,
        }, () => {
            this.fetchUserData();
        });
      } else {
        this.setState({
            city: 'Penang',
        }, () => {
            this.fetchUserData();
        });
      }
    } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
        this.setState({
            city: 'Penang',
        }, () => {
            this.fetchUserData();
        });
    }
  }

  submitEdit(event) {
    //alert(event.nativeEvent.text)
    var searchtxt = event.nativeEvent.text;
    this.setState({
        page: 1,
        refreshing: true,
        lastid: null,
        data: [],
        searchtxt: searchtxt,
    }, () => {
        this.fetchUserData();
    })
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
            lastid: null,
        }, () => {
            this.fetchUserData();
        });
    } 
  }


  onItemPressed = (navigation, {item}) => {

    setTimeout(function () {
        navigation.navigate({
            routeName: 'OtherUserProfile',
            params: {
                userid: item.userid,
            },
        });    
      }.bind(this), 50);

  }

  onFilterClose(
    filterPressed,
    category,  
    worktimetxt,
  ) {
    if (filterPressed) {
        //Category filter selected
        if (category) {
            this.setState({
                category: category,
            })
        }
        else {
            this.setState({
                category: null,
            })
        }
        //Experience filter selected
        if (worktimetxt !== 'All') {
            this.setState({
                worktime: worktimetxt,
            })
        }
        else {
            this.setState({
                worktime: null,
            })
        }
        this.handleRefresh();
    } 
  }

  onFilterPressed = (navigation) => {

    navigation.navigate('FilterApplicant', { 
        category: this.state.category,
        worktime : this.state.worktime,

        onFilterClose: this.onFilterClose 
    });
  }


  onLocationPressed = (navigation) => {
    navigation.navigate('LocationContainer', { onLocationListClose: this.onLocationListClose });
  }


  setAvatarColor = (userName) => {
    var avatarColor;
    var avatarName;
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      avatarName = '';
    }

    let sumChars = 0;
    for (let i = 0; i < userName.length; i += 1) {
      sumChars += userName.charCodeAt(i);
    }

    // inspired by https://github.com/wbinnssmith/react-user-avatar
    // colors from https://flatuicolors.com/
    const colors = [carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue];

    avatarColor = colors[sumChars % colors.length];

    var returnresult = {
        avatarColor: avatarColor,
        avatarName: avatarName,
    }

    return returnresult;
  }

  errorLoadImg = ({item, index}) => {

    var newdata = [...this.state.data];

    newdata[index]['imageBroken'] = true 

    this.setState({
        data: newdata
    })

  }

  _renderItem = ({item, index}) => (

    <Touchable 
          style = {{
            flex: 1,
            margin: 0,
            minWidth: 170,
            maxWidth: 223,
            height: 200,
            maxHeight:200,
            backgroundColor: '#fff',
            borderColor: '#dddddd',
            borderBottomWidth: 0.5,
            borderTopWidth: 0.5,
            borderLeftWidth: 0.5,
            borderRightWidth: 0.5,
            alignItems: 'center',
            alignSelf: 'center',
            padding: 10,
          }}
          delayPressIn = {5000}
          onPress={this.onItemPressed.bind(this, this.props.screenProps.parentNavigation, {item})}
          background={Touchable.Ripple(colors.ripplegray)}>
     
        <View style={{  flexDirection: 'column', }}>

            {!item.imageBroken ? 

            <View
                style={{ alignSelf:'center', height: 70, width: 70, borderRadius: 35, marginTop: 5,}}>

                <Image
                    style={{alignSelf:'center', height: 70, width: 70, borderRadius: 35,}}
                    source={{uri:item.profileimage}}
                    onError={this.errorLoadImg.bind(this, {item,index})}
                />

                {!item.online ? null :

                <View
                    style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 15, width: 15, borderRadius: 15/2, borderWidth: 1, borderColor: 'white'}}/> }

            </View>
            
            :

            <TouchableOpacity
                disabled={true}
                style={{alignSelf:'center', alignItems: 'center', justifyContent:'center', height: 70, width: 70, borderRadius: 35, marginTop: 5, backgroundColor:  this.setAvatarColor(item.name).avatarColor}}
                accessibilityTraits="image"
            >
               <Text style={{alignSelf:'center', alignItems: 'center', justifyContent:'center', textAlign: 'center', color: 'white', fontSize: 22, backgroundColor: 'transparent', fontWeight: '500',}}>
               {this.setAvatarColor(item.name).avatarName}</Text>

                {!item.online ? null :
                
                    <View
                        style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 15, width: 15, borderRadius: 15/2, borderWidth: 1, borderColor: 'white'}}/> }


            </TouchableOpacity>

            }
            
            <View style={{ flex:1, alignItems: 'center',  paddingHorizontal: 10, paddingVertical: 10, }}>

                <View style={{  flexDirection: 'column'}}>

                    <Text numberOfLines={1} style={{ color: '#454545', fontSize: 15, fontWeight: 'bold', textAlign: 'center',  }}>
                    {item.name}</Text>

                    <View 
                    style={{ alignItems:'center', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 10, marginTop: 5, flexDirection: 'row'}}>
                      <Image  
                      style={{ alignItems:'center', justifyContent: 'center', marginTop: 3, marginRight: 5, height: 15, width: 15, opcaity: 0.5 }} 
                      source={locationIcon}/>
                      <Text numberOfLines={2} style={{  textAlign: 'center', color: colors.greyBlack,  fontSize: 13 }}>
                      {item.location}</Text>
                    </View>

                    <View 
                    style={{ alignItems:'center', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 10, marginTop: 5, flexDirection: 'row'}}>
                      <Text numberOfLines={2} style={{ textAlign: 'center', color: colors.greyBlack, fontSize: 13, opacity: 0.7 }}>
                      {item.workexp ? item.workexp.length > 0 ? item.workexp[0].worktitle + ' at ' + item.workexp[0].workcompany : null : null}
                      </Text>
                    </View>

                </View>

            </View>

        </View>
        
    </Touchable>
  )

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

        
    </View>
    );
  };  
  
  handleLoadMore = () => {

    console.log('SearchEmployeeContainer handleLoadMore')

    if (!this.state.end) {
        this.setState({
          page: this.state.page + 1,
        
        }, () => {
            this.fetchUserData();
        });
      }
  }

  handleRefresh = () => {

    this.setState({
        page: 1,
        refreshing: true,
        lastid: null,
        data: [],
    }, () => {
        this.fetchUserData();
    });
      
  }

  renderEmptyView(city) {
    return (
    
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>

            
            <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
                <LottieView 
                loop={true}
                style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                source={Platform.OS == 'android' ? "empty_box.json" : require('../animation/empty_box.json')} progress={this.state.progress} />
                <Text
                    style={{ paddingHorizontal: 30, marginTop: 0, lineHeight: 25, textAlign: 'center', alignSelf:'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
                >Sorry, it looks like there aren't any potential employees available in </Text>
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
                //extraData={this.state.data}
                data={this.state.data}
                keyExtractor={(item) => item._id}
                renderItem={this._renderItem}
                // ItemSeparatorComponent={this.renderSeparator}
                numColumns={2}
                // ListHeaderComponent={this.renderHeader}
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
                <View style={{ backgroundColor: 'white', borderBottomWidth: 0.5, borderBottomColor: '#dddddd' }}>
                   
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
                              
                                <Image  style={{ opacity: .5, height: 20, width: 20 }} source={searchIcon}/> 
                                   
                            </TouchableOpacity>

                            <TextInput 
                                returnKeyType="search"
                                underlineColorAndroid='rgba(0,0,0,0)' 
                                multiline={false} 
                                placeholder="Search Employees"
                                placeholderTextColor="grey"
                                onChangeText={(value) => this.setState({searchtxt: value})}
                                onSubmitEditing={this.submitEdit}
                                value={this.state.searchtxt ? this.state.searchtxt : null}
                                style={{ flex: 1, padding:0, color: 'black'}}>
                            </TextInput>


                            
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

SearchEmployeeContainer.propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
};

const mapStateToProps = state => ({
    getSocket: state.getSocket,
    getUserid: state.getUserid,
    getJWTToken: state.getJWTToken,
  });
  
export default connect(mapStateToProps)(SearchEmployeeContainer);
