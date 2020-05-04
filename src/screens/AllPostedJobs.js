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
import axios from 'axios';
import apis from '../styles/apis';

const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon = require('../img/android_back_black.png');


export default class AllPostedJobs extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Jobs Posted",
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
      userid: null,
    };
  }

  componentWillMount() {
   
    const { navigation } = this.props;

    const userid = navigation.getParam('userid');

    this.setState({
      userid: userid,
    }, () => {
      this.fetchData();
    });

  }

  fetchData = () => {

    const { loadlimit, page, lasttime, userid } = this.state;

    console.log("fetchData");

    var url = apis.JOB_BASEURL+'sort=-time&limit='+ loadlimit +'&userid='+ userid ;
   
    if (lasttime) {
      url = url + '&time__lt=' + lasttime;
    }

    axios.get(url)
    .then((response) => {
      
      var data = response.data;

      this.setState({
        error: data.error || null,
        end: data.length < loadlimit ? true : false,
        data: page === 1 ? data : [...this.state.data, ...data],
        refreshing: false,
        lasttime: data.length === 0 ? null : data[data.length-1].time,
        empty: data.length === 0 ? lasttime ? false : true : false,
      })
    })
    .catch((error) => {
      console.log(error);
    });

  }

  onItemPressed = ({item}) => {

    setTimeout(function () {
      this.props.navigation.navigate({
        routeName: 'JobDetail',
        params: {
          _id: item._id,
        },
      });   
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
      style={{flex:1, flexDirection: 'column'}}>
      
        <Touchable 
        //delayPressIn = {5000}
        onPress={this.onItemPressed.bind(this, {item})}
        background={Touchable.Ripple(colors.ripplegray)}>
    
            <View style={{ marginLeft: 10, marginTop: 10, marginBottom: 20, marginRight: 10, flexDirection: 'row', width: '100%', }}>
                <View style={{  marginTop: 5, width:60, height: 60, marginLeft: 5, marginRight: 10, alignItems: 'center'}}>
                    <Image
                        style={{ width:40, height: 40, }}
                        source={{uri: item.categoryimage}} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-start',  paddingLeft: 10, paddingBottom: 7 }}>

                    <View style={{ flex: 1, flexDirection: 'row'}}>

                        <View style={{ flex: 1, flexDirection: 'column'}}>

                            <Text numberOfLines={1} style={{ color: colors.darkOrange, fontSize: 13, fontWeight: 'bold' }}>
                            {item.category}</Text>

                            <Text numberOfLines={1} style={{ paddingTop: 5, color: '#454545', fontSize: 15, fontWeight: 'bold' }}>
                            {item.title}</Text>

                            <Text numberOfLines={3} style={{ paddingTop: 5, fontSize: 13, color: colors.greyBlack, opacity: 0.9 }}>
                            {item.desc}</Text>

                        </View>

                    </View>

                </View>

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


  render() {

    return (
      <View style={{backgroundColor:'white', display: 'flex', flex:1, paddingTop:20}}>

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

AllPostedJobs.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
