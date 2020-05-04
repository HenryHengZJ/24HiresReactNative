import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { 
  KeyboardAvoidingView ,
  TextInput, 
  Button, 
  Slider,
  ScrollView, 
  Image,
  Text, 
  View, 
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  TouchableHighlight,
  StyleSheet,
  Platform,
  Keyboard,
  FlatList,
  ActivityIndicator,
  } 
from 'react-native';
import colors from '../styles/colors';
import { NavigationActions } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';
import apis from '../styles/apis';

const locationIcon = require('../img/location2.png');
const closeIcon = require('../img/close-button_black.png');
const searchIcon = require('../img/search.png');


const navigateToJobDetail = NavigationActions.navigate({
    routeName: 'JobDetail',
});


export default class SearchView extends Component {

  static navigationOptions = ({ navigation }) => ({
    header:null,
    
  });

  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',    
      data: [],
      categorylist: [],
      page: 1,
      error: null,
      end: false,
      refreshing: false,
      loadlimit: 15,
      lasttime: null,
      empty: false,
      city: null,
      searchtext: "",
    };
    this.lastTimeout = setTimeout; 
    this.editingEnd = this.editingEnd.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.onLocationListClose = this.onLocationListClose.bind(this);

    this.searchSelected = false;
    this.categorySelected = false;
    this.searchtxt =  null;
    this.category = null;

  }
  componentDidMount() {

    const { navigation } = this.props;
    const city = navigation.getParam('city');

    this.setState({
        city,
    }, () => {
        this.getList();
    });

    //this.startAnimation();
    
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.state.params.onSearchViewClose(this.state.city, this.searchtxt, this.category, this.searchSelected, this.categorySelected);
  }

  getList = () => {
    const list = [
      {
        title: 'Barista / Bartender',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/barista.png'},
      },
      {
        title: 'Beauty / Wellness',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/beauty.png'},
      },
       {
        title: 'Chef / Kitchen Helper',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/chef.png'},
      },
      {
        title: 'Event Crew',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/event.png'},
      },
      {
        title: 'Emcee',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/emcee.png'},
      },
      {
        title: 'Education',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/education.png'},
      },
       {
        title: 'Fitness / Gym',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/fitness.png'},
      },
      {
        title: 'Modelling / Shooting',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/modelling.png'},
      },
      {
        title: 'Mascot',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/mascot.png'},
      },
      {
        title: 'Office / Admin',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/officeadmin.png'},
      },
       {
        title: 'Promoter / Sampling',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/promoter.png'},
      },
      {
        title: 'Roadshow',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/roadshow.png'},
      },
      {
        title: 'Roving Team',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/rovingteam.png'},
      },
      {
        title: 'Retail / Consumer',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/retail.png'},
      },
      {
        title: 'Serving',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/serving.png'},
      },
      {
        title: 'Usher / Ambassador',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/usher.png'},
      },
      {
        title: 'Waiter / Waitress',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/waiter.png'},
      },
      {
        title: 'Other',
        image: {uri:'https://s3-ap-southeast-1.amazonaws.com/24hires/categorypicture/other.png'},
      },
    ]

    this.setState({
      categorylist: list
    })
    
  }


  fetchData = () => {

    const { loadlimit, page, city, lasttime, searchtext } = this.state;

    console.log("fetchData");

    var url;

    if (lasttime) {
      url = apis.JOB_BASEURL + "city__equals=" + city + "&sort=-time&limit=" + loadlimit + "&closed__equals=false" + "&lowertitle__regex=/" + searchtext.toLowerCase() + "/i&time__lt="+ lasttime;
    }
    else {
      url = apis.JOB_BASEURL + "city__equals=" + city + "&sort=-time&limit=" + loadlimit + "&closed__equals=false" + "&lowertitle__regex=/" + searchtext.toLowerCase() + "/i";
    }

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
            data: page === 1 ? data : [...this.state.data, ...data],
            refreshing: false,
            lasttime: data.length === 0 ? null : data[data.length-1].time,
            empty: data.length === 0 ? lasttime ? false : true : false,
          });
        })
        .catch(err => {
            console.log("fetch error" + err);
    });

  }

  onLocationListClose( locationName, locationSelected) {

    if (locationSelected) {
        this.setState({
            city: locationName,
        })  
    }
  }

  submitEdit(event) {
    //alert(event.nativeEvent.text)
    this.categorySelected = false,
    this.searchSelected = true,
    this.searchtxt = event.nativeEvent.text,
    this.props.navigation.goBack();
  }

  editingEnd(text) {    
    console.log("editingEnd = " + text)
    clearTimeout(this.lastTimeout);
    this.lastTimeout = setTimeout(() => {this._changeInput(text)} ,750)
  }

  _changeInput(text) {
    this.setState({
      searchtext: text,
      data: [],
      page: 1,
      error: null,
      end: false,
      refreshing: false,
      lasttime: null,
      empty: false,
    })
    console.log("_changeInput = " + text)
    this.fetchData()
  }

  renderCloseButton() {
    return (
      <TouchableOpacity
          style={{ 
            position:'absolute', 
            left:10, 
            top:20, 
            zIndex:10,
            padding:10, 
            height: 50,
            width: 50,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'transparent'}}
            onPress={() => 
              {
                Keyboard.dismiss(),
                this.props.navigation.dispatch(NavigationActions.back())
              }
            }
        >

        <Image
            style={{ 
              height: 15,
              width: 15,
            }}
            source={closeIcon}
          />
        
        
        </TouchableOpacity>
    )
  }

  onItemPressed = (navigation, {item}) => {

    console.log("onItemPressed PRESSED");

    Keyboard.dismiss()

    setTimeout(function () {
      navigation.navigate({
        routeName: 'JobDetail',
        params: {
            _id: item._id,
        },
      });  
    }.bind(this), 50);

  }

  onCategoryItemPressed = (navigation, {item}) => {
    Keyboard.dismiss()
    this.categorySelected = true,
    this.searchSelected = false,
    this.category = item.title,
    navigation.goBack();
  }

  onHeaderPressed = (navigation) => {

    setTimeout(function () {
      navigation.navigate('LocationContainer', { onLocationListClose: this.onLocationListClose });
    }.bind(this), 50);

  }

  handleLoadMore = () => {

    if (!this.state.end) {
        this.setState({
          page: this.state.page + 1,
        
        }, () => {
            this.fetchData();
        });
      }
  }

  _renderCategoryItem = ({item}) => (
    <View style={{flex:1}}>
       
       <Touchable 
          style={{padding: 20}}
          onPress={this.onCategoryItemPressed.bind(this, this.props.navigation, {item})}
          background={Touchable.Ripple(colors.ripplegray)}    >

        <View
          style={{ flexDirection: 'row' }}>

            <Image
              style={{ marginLeft:5, justifyContent:'center', alignSelf:'center', height: 25, width: 25, }}
              source={item.image}
            />

            <Text numberOfLines={1} style={{ marginLeft:20, marginRight:20, color:colors.greyBlack, fontSize: 17}}>
              {item.title}
            </Text>

        </View>

        </Touchable>

      </View>
  )

  _renderItem = ({item}) => (
    <View style={{flex:1}}>
       
       <Touchable 
          style={{padding: 20}}
          onPress={this.onItemPressed.bind(this, this.props.navigation, {item})}
          background={Touchable.Ripple(colors.ripplegray)}    >

        <View
          style={{ flexDirection: 'row' }}>

            <Image
              style={{ marginLeft:5, justifyContent:'center', alignSelf:'center', height: 20, width: 20, opacity: 0.7,}}
              source={searchIcon}
            />

            <Text numberOfLines={1} style={{ marginLeft:20, marginRight:20, color:colors.greyBlack, fontSize: 17}}>
              {item.title}
            </Text>

        </View>

        </Touchable>

      </View>
  )

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "90%",
          backgroundColor: colors.shadowgray,
          alignSelf:'center',
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


  renderCategoryFlatList() {
      return (

        <FlatList
          keyboardShouldPersistTaps='always'
          data={this.state.categorylist}
          keyExtractor={(item) => item.title}
          renderItem={this._renderCategoryItem}
          ItemSeparatorComponent={this.renderSeparator}
          onScrollBeginDrag={() => Keyboard.dismiss()}
        />
    )
  };

  renderSearchFlatList() {
    return (

      <FlatList
        keyboardShouldPersistTaps='always'
        data={this.state.data}
        keyExtractor={(item) => item._id}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={this.renderFooter} 
        onEndReached={this.handleLoadMore}     
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => Keyboard.dismiss()}
      />
    ) 
  };


  render() {

    const { searchtext} = this.state;

    return (
      <KeyboardAvoidingView style={{backgroundColor:'white', display: 'flex', flex:1}}>

        <View 
          style={{ 
            backgroundColor: 'white', 
            paddingTop:80, paddingLeft:30, paddingRight:30, paddingBottom: 20, 
            borderLeftWidth: 0, 
            borderRightWidth: 0, 
            borderTopWidth: 0,
            borderBottomWidth: 1,
            shadowColor: '#000',
            shadowOffset: {
                width: 1,
                height: 5
            },
            shadowRadius: 5,
            shadowOpacity: 0.8,
            borderColor: '#ddd', 
            elevation: 3}}>

          {this.renderCloseButton()}

          <TextInput 
            returnKeyType="search"
            autoFocus={true}
            autoCapitalize={true}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            placeholder="Search 24Hires"
            placeholderTextColor={colors.lightGray}
            onChangeText={this.editingEnd}
            onSubmitEditing={this.submitEdit}
            style={{ color: colors.greyBlack, fontWeight: '500', fontSize: 24}}>
          </TextInput>

        </View>

        <Touchable 
          style={{backgroundColor: colors.shadowgray}}
          onPress={this.onHeaderPressed.bind(this, this.props.navigation)}
          background={Touchable.Ripple(colors.ripplegray)}    >

            <View style={styles.heading}>

            <Image
              style={{ justifyContent:'center', alignSelf:'center', height: 20, width: 20, opacity: 0.7,}}
              source={locationIcon}
            />

            <Text style={{marginLeft: 20, fontSize: 17, fontWeight: '500', color: colors.greyBlack,}}>
              {this.state.city}
            </Text>

          </View>

        </Touchable>

        {searchtext === "" ? this.renderCategoryFlatList() : this.renderSearchFlatList()}

      </KeyboardAvoidingView >

    )
  }
}

const styles = StyleSheet.create({
  heading: {
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 25,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderColor: colors.shadowgray,
    flexDirection: 'row',
   // backgroundColor: colors.shadowgray,
  },
});

SearchView.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
