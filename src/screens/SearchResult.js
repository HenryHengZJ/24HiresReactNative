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
import { NavigationActions } from 'react-navigation';
import ActionButton from 'react-native-action-button';
import Touchable from 'react-native-platform-touchable';
import Moment from 'moment';

const { height, width } = Dimensions.get('window')

const navigateToJobDetail = NavigationActions.navigate({
    routeName: 'JobDetail',
});

const navigateToNearbyJob = NavigationActions.navigate({
    routeName: 'NearbyJob',
});


class SearchResult extends Component {

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
            loadlimit: 15,
            lasttime: null,
            empty: false,
            filterSet: false,
            progress: new Animated.Value(0),

            city: null,
            filtertxt: null,
            searchtxt: null,
            currency: null,
            rates: null,
            startDate: null,
            endDate: null,
            startDateFilter: null,
            endDateFilter: null,
            category: null,
            gender: null,
            jobtype: null,

            searchSelected: null,
            categorySelected: null,
            jobtypeSelected: null,
            currencyValueSelected: null,
            ratesValueSelected: null, 
            dateselected: null, 
            genderSelected: null,

        };

        this.onLocationListClose = this.onLocationListClose.bind(this);
        this.onSearchViewClose = this.onSearchViewClose.bind(this);
        this.onFilterClose = this.onFilterClose.bind(this);
    
       // console.disableYellowBox = true;
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

    const { searchSelected, searchtxt, loadlimit, page, city, lasttime, currency, rates, startDateFilter, endDateFilter, category, gender, jobtype } = this.state;

    console.log("fetchData");

    var url = apis.JOB_BASEURL+'sort=-time&limit='+loadlimit+'&city='+city+'&closed=false';

    if (searchSelected) {
        url = url + "&lowertitle__regex=/" + searchtxt.toLowerCase() + "/i";
        if (lasttime) {
            url = url + '&time__lt=' + lasttime;
        }
    }
    else {
        if (lasttime) {
            url = url + '&time__lt=' + lasttime;
        }
        if (currency) {
            url = url + '&currency=' + currency;
        }
        if (rates) {
            url = url + '&rate=' + rates;
        }
        if (startDateFilter) {
            url = url + '&startingdate__gte=' + startDateFilter;
        }
        if (endDateFilter) {
            url = url + '&startingdate__lte=' + endDateFilter;
        }
        if (category) {
            url = url + '&category=' + category;
        }
        if (gender) {
            url = url + '&jobsex=' + gender;
        }
        if (jobtype) {
            if (jobtype === 'PartTime') {
                url = url + '&jobtype=' + 'Part Time (Long Term)' + '&jobtype=' + 'Part Time (Short Term)';
            }
            else if (jobtype === 'FullTime') {
                url = url + '&jobtype=' + 'Full Time';
            }
            else {
                url = url + '&jobtype=' + jobtype;
            }
            
        }
    }

    fetch(url, {
            method: 'GET',
            headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json'
            }
        })
        .then(response => { return response.json();})
        .then(responseData => {console.log(responseData); return responseData;})
        .then(data => {
          this.setState({
            error: data.error || null,
            end: data.length < loadlimit ? true : false,
            data: page === 1 ? data : [...this.state.data, ...data],
            refreshing: false,
            lasttime: data.length === 0 ? null : data[data.length-1].time,
            empty: data.length === 0 ? lasttime ? false : true : false,
          });
        })
        .catch(err => {
            console.log("fetch error" + err);
    });

    console.log("fetch empty" + this.state.empty);

  }

  componentDidMount() {

    const { navigation } = this.props;
    const searchtxt = navigation.getParam('searchtxt');
    const category = navigation.getParam('category');
    const jobtype = navigation.getParam('jobtype');
    const city = navigation.getParam('city');
    const currency = navigation.getParam('currency');
    const rates = navigation.getParam('rates');
    const startDate = navigation.getParam('startDate');
    const endDate = navigation.getParam('endDate');
    const startDateFilter = navigation.getParam('startDateFilter');
    const endDateFilter = navigation.getParam('endDateFilter');
    const gender = navigation.getParam('gender');

    const searchSelected = navigation.getParam('searchSelected');
    const currencyValueSelected = navigation.getParam('currencyValueSelected');
    const ratesValueSelected = navigation.getParam('ratesValueSelected');
    const dateselected = navigation.getParam('dateselected');
    const categorySelected = navigation.getParam('categorySelected');
    const genderSelected = navigation.getParam('genderSelected');
    const jobtypeSelected = navigation.getParam('jobtypeSelected');

    this.setState({
        searchtxt,
        category,
        jobtype,
        city,
        currency,
        rates,
        startDate,
        endDate,
        startDateFilter,
        endDateFilter,
        gender,

        searchSelected,
        currencyValueSelected,
        ratesValueSelected,
        dateselected,
        categorySelected,
        genderSelected,
        jobtypeSelected,
        
    }, () => {
        
        this.calFilterCount();
        this.fetchData();
    });

    //this.startAnimation();
    
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
            seed: 1,
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

        if (searchSelected) {
            this.setState({
                
                searchtxt,
                city: city,
                currency: null,
                rates: null,
                startDate: null,
                endDate: null,
                startDateFilter: null,
                endDateFilter: null,
                category: null,
                gender: null,
                jobtype: null,
                lasttime: null,
                
                data: [],
                page: 1,
                seed: 1,
                error: null,
                end: false,
                refreshing: false,
                empty: false,

                searchSelected,
                categorySelected: null,
                jobtypeSelected: null,
                currencyValueSelected: null,
                ratesValueSelected: null, 
                dateselected: null, 
                genderSelected: null,

            }, () => {
                this.calFilterCount();
                this.fetchData();
            });
            return;
        }
        
        /*alert("searchtxt = " + searchtxt + '\n' +
        "searchCategorytxt = " + searchCategorytxt + '\n' +
        "searchJobTypetxt = " + this.state.searchJobTypetxt + '\n' +
        "searchSelected = " + searchSelected + '\n' +
        "categorySelected = " + categorySelected + '\n' +
        "jobTypeSelected = " + this.state.jobTypeSelected + '\n' 
        )*/
    
        this.setState({

            city: city,
            category,
            searchtxt,
            lasttime: null,
           
            data: [],
            page: 1,
            seed: 1,
            error: null,
            end: false,
            refreshing: false,
            empty: false,

            categorySelected,
            searchSelected: null,
           
        }, () => {
            this.calFilterCount();
            this.fetchData();
        });
    }
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
       
            this.setState({
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
    
                data: [],
                page: 1,
                seed: 1,
                error: null,
                end: false,
                refreshing: false,
                empty: false,
                lasttime: null,
    
            }, () => {
                this.calFilterCount();
                this.fetchData();
            });
    
        } 
  }

  calFilterCount = () =>
    {
        var categorySelectedVal = this.state.categorySelected ? 1 : 0;
        var jobtypeSelectedVal = this.state.jobtypeSelected ? 1 : 0;
        var currencyValueSelectedVal = this.state.currencyValueSelected ? 1 : 0;
        var ratesValueSelectedVal = this.state.ratesValueSelected ? 1 : 0;
        var dateselectedVal = this.state.dateselected ? 1 : 0;
        var genderSelectedVal = this.state.genderSelected ? 1 : 0;

        var filterVal = categorySelectedVal + jobtypeSelectedVal 
                        + currencyValueSelectedVal + ratesValueSelectedVal
                        + dateselectedVal + genderSelectedVal;
        var filtertxt = filterVal === 0 ? 'Filter' : 'Filter (' + filterVal + ')';

        this.setState({
            filtertxt,
            filterSet: filterVal > 0 ? true : false,
        })
  
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

  onFilterPressed = (navigation) => {
    navigation.navigate('FilterJob', { 

        currencyValueSelected: this.state.currencyValueSelected,
        currency: this.state.currency, 
  
        ratesValueSelected: this.state.ratesValueSelected, 
        rates: this.state.rates, 
  
        dateselected: this.state.dateselected, 
        startDate: this.state.startDate, 
        endDate: this.state.endDate, 
  
        city: this.state.city, 
  
        categorySelected: this.state.categorySelected,
        category: this.state.category,  
  
        genderSelected: this.state.genderSelected,
        gender: this.state.gender, 
  
        jobtypeSelected: this.state.jobtypeSelected,
        jobtype: this.state.jobtype, 

        onFilterClose: this.onFilterClose 
    });
  }

  onNearbyJobPressed = (navigation) => {
    setTimeout(function () {
        navigation.dispatch(navigateToNearbyJob);
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

  onBackPressed = () => {
    this.props.navigation.goBack();
  }

  _renderItem = ({item}) => (
    <FlatListVerticalRow
         itemlist={item}
         handleOnPress={this.onItemPressed.bind(this, this.props.navigation, {item})}
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
    
    <View style={{ backgroundColor: 'white', paddingTop: 20, paddingBottom: 10  }}>
        
        <Text style={{ marginTop: 0 , color: colors.greyBlack, fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
            Search Result
        </Text>

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
        lasttime: null,

    }, () => {
      
        this.fetchData();
    });
      
  }

  renderEmptyView(searchSelected, searchtxt, city) {
    return (
    
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>

         
            <Text style={{ marginTop: 0 , color: colors.greyBlack, fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                Search Result
            </Text>

            <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
                <LottieView 
                loop={true}
                style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                source={Platform.OS == 'android' ? "empty_box.json" : require('../animation/empty_box.json')}  progress={this.state.progress} />
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
                    onPress={this.onLocationPressed.bind(this, this.props.navigation)}
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
                onEndReachedThreshold={0.01}
                
            />
        </View>
    );
  };


  render() {

    return (
        <View style={{ backgroundColor: 'white', flex: 1, paddingTop: Platform.OS == 'android' ? null : 20}}>
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
                                style={{ alignSelf:'center',  justifyContent: 'center', alignItems: 'center'}}
                                onPress={this.onBackPressed.bind(this, this.props.navigation)}>
                               
                                <Image  style={{ opacity: 1.0, height: 20, width: 20 }} source={require('../img/android_back_black.png')}/>
                                
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ flex: 1, padding:5,}}
                                onPress={this.onSearchPressed.bind(this, this.props.navigation)}>
                                <View style={{ flexDirection: 'row'}}>
                                { !this.state.searchSelected && !this.state.categorySelected && !this.state.jobtypeSelected ? 
                                    (<Text
                                        style={{  marginRight: 10, marginLeft: 10, fontWeight: '400', color: 'grey', backgroundColor: 'white' }}
                                    >Search 24Hires </Text>)
                                    :
                                    null
                                }
                                {this.state.searchtxt ? 
                                    (<Text
                                        style={{  marginRight: 10, marginLeft: 10, fontWeight: '400', color: 'black', backgroundColor: 'white' }}
                                    >{this.state.searchtxt === '' ? 'Search 24Hires' : this.state.searchtxt} </Text>)
                                    :
                                    (<Text
                                        style={{  marginRight: this.state.searchtxt === '' ? 10 : 0, marginLeft: this.state.searchtxt === '' ? 10 : 0, fontWeight: '400', color: 'grey', backgroundColor: 'white' }}
                                    >{this.state.searchtxt === '' ? 'Search 24Hires' : null} </Text>)
                                }
                                {this.state.searchSelected && (this.state.categorySelected || this.state.jobtypeSelected) ? 
                                    (<View
                                        style={{ alignSelf: 'center', justifyContent: 'center', height: 5, width: 5, borderRadius: 5/2, backgroundColor: 'black' }}/>
                                    )
                                    :
                                    null
                                }
                                {this.state.jobtype ? 
                                    (<Text
                                        style={{  marginRight: 10, marginLeft: 10, fontWeight: '400', color: 'black', backgroundColor: 'white' }}
                                    >{this.state.jobtype} </Text>)
                                    :
                                    null
                                }
                                {this.state.categorySelected && this.state.jobtypeSelected ? 
                                    (<View
                                        style={{ alignSelf: 'center', justifyContent: 'center', height: 5, width: 5, borderRadius: 5/2, backgroundColor: 'black' }}/>
                                    )
                                    :
                                    null
                                }
                                {this.state.category ? 
                                    (<Text
                                        style={{  marginRight: 10, marginLeft: 10, fontWeight: '400', color: 'black', backgroundColor: 'white' }}
                                    >{this.state.category} </Text>)
                                    :
                                    null
                                }
                                </View>
                            </TouchableOpacity>

                        </View>


                    </View>
                   

                    <View
                        style={{ flexDirection: 'row', marginHorizontal: 20, position: 'relative', marginTop: 10, marginBottom: 10 }}
                    >
                        <Image  style={{ alignSelf:'center', marginRight: 10, justifyContent: 'center', height: 20, width: 20 }} source={require('../img/location.png')}/>
                        
                        <TouchableOpacity
                            onPress={this.onLocationPressed.bind(this, this.props.navigation)}
                        >
                            <Tag name={this.state.city} valueSet= {true}/>
                        </TouchableOpacity>

                        {this.state.searchSelected ? 
                         null : 
                        <Image  style={{ alignSelf:'center', marginRight: 10, marginLeft: 5, justifyContent: 'center', height: 25, width: 25 }} source={require('../img/filter.png')}/>
                        }

                        {this.state.searchSelected ? 
                         null : 
                        <TouchableOpacity
                            onPress={this.onFilterPressed.bind(this, this.props.navigation)}
                        >
                            <Tag name={this.state.filtertxt} valueSet= {this.state.filterSet}/>
                        </TouchableOpacity> 
                        } 

                    </View>
                </View>
                
                {!this.state.empty && this.renderFlatListView()}

                {this.state.empty && this.renderEmptyView(this.state.searchSelected,this.state.searchtxt,this.state.city)}

            </View>
            
        </View>
    );
  }
}

export default SearchResult;

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
  }
});

SearchResult.propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
  };
