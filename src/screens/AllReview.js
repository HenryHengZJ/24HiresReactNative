import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { 
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

const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon = require('../img/android_back_black.png');

const navigateToJobDetail = NavigationActions.navigate({
    routeName: 'JobDetail',
});

export default class AllReview extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Reviews",
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 17,
      color: colors.greyBlack,
    },
    headerLeft:
    <TouchableOpacity 
      
        style={{marginLeft: 15,}}
        onPress={() => navigation.goBack() } >

        <Image
            style={{ height: 25, width: 25,}}
            source={Platform.OS === 'android' ? androidblackBackIcon : iosblackBackIcon}
        />
    
    </TouchableOpacity>,

  });
  

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
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {

    const { loadlimit, page } = this.state;

    console.log("fetchData");

    var url;

    if (this.state.lasttime) {
        url = 'http://mongodb.24hires.com:3001/jobapi/alljobs?'+'sort=-time&limit='+loadlimit+'&city=Penang&closed__equals=false&time__lt=' + this.state.lasttime;
    }
    else {
        url = 'http://mongodb.24hires.com:3001/jobapi/alljobs?'+'sort=-time&limit='+loadlimit+'&city=Penang&closed__equals=false';
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

  onItemPressed = (navigation) => {

    console.log("onItemPressed PRESSED");

    setTimeout(function () {
        navigation.dispatch(navigateToJobDetail);
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

  _renderItem = ({item}) => (
    <View 
        style={{flex:1, flexDirection: 'column', paddingVertical: 20, paddingHorizontal: 5}}>
        <View 
          style={{flex:1, paddingLeft: 25, paddingRight:25, paddingTop:10, flexDirection: 'row'}}>

            <TouchableOpacity style={{
              height: 50, width: 50, borderRadius: 25}}
              onPress={() => this.setState({pressCount: this.state.pressCount + 1})}
            >

            <Image
              style={{ height: 50, width: 50, borderRadius: 25}}
              source={{uri:'http://graph.facebook.com/1811964245493623/picture?type=large&width=1080'}}
            />

          </TouchableOpacity>

          <View 
            style={{flex:1, alignItems:'flex-start', justifyContent:'flex-start', flexDirection: 'column'}}>

            <Text numberOfLines={2} style={{color: colors.greyBlack, marginLeft: 20, marginTop: 0, fontSize: 13, fontWeight: '500'}}>
                Steven Chow  
            </Text>

            <Text style={{color: colors.greyBlack, marginLeft: 20, marginTop: 10, fontSize: 13}}>
                Aug 2016
            </Text>

          </View>

        </View>

        <Text style={{color: colors.greyBlack, flex:1, lineHeight: 30, marginLeft: 20, marginRight:20, marginTop: 10, fontSize: 15}}>
          {item.desc}
        </Text>


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


  render() {

    return (
      <View style={{backgroundColor:'white', display: 'flex', flex:1}}>

        <FlatList
          data={this.state.data}
          keyExtractor={(item) => item._id}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter} 
          onEndReached={this.handleLoadMore}     
          onEndReachedThreshold={0.01}
        />

      </View>

    )
  }
}

const styles = StyleSheet.create({
 
});

AllReview.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
