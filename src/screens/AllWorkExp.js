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
import axios from 'axios';

const workIcon = require('../img/profile_work.png');
const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon = require('../img/android_back_black.png');


export default class AllWorkExp extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Work Experiences",
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
      userid: null,
      end: null,
    };
  }

  componentWillMount() {
    
    const { navigation } = this.props;

    const userid = navigation.getParam('userid');

    this.setState({
      userid: userid,
    }, () => {
        this.fetchUserWorkData();
    });

  }

  fetchUserWorkData = () => {

    const { userid } = this.state;
  
    var url = apis.GETUser_BASEURL+'&userid__equals='+ userid;

    axios.get(url)
    .then((response) => {

      console.log("data = " + JSON.stringify(response.data) );

      this.setState({
        data: response.data[0].workexp.length >=1 ? response.data[0].workexp : [], 
        end: true,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }


  _renderItem = ({item}) => (
    <View 
        style={{flex:1, flexDirection: 'column'}}>

        <View 
            style={{flex:1, paddingHorizontal:25, paddingVertical:20, flexDirection: 'row'}}>

            <Image
              style={{ justifyContent:'center', marginTop:5, height: 20, width: 20}}
              source={workIcon}
            />

            <View 
              style={{flex:1, alignItems:'flex-start', justifyContent:'flex-start', flexDirection: 'column'}}>

              <Text numberOfLines={1} style={{color: colors.greyBlack, marginLeft: 20, marginTop: 0, fontSize: 15, fontWeight: '500' }}>
                  {item.worktitle} 
              </Text>

              <Text numberOfLines={1} style={{color: colors.greyBlack, marginLeft: 20, marginTop: 10, fontSize: 15}}>
                  {item.workcompany} 
              </Text>

              <Text numberOfLines={1} style={{color: colors.greyBlack, opacity: 0.9, marginLeft: 20, marginTop: 10, fontSize: 15}}>
                  {item.worktime} 
              </Text>

              <View
                style={{ 
                    marginBottom: 10,
                    marginTop: 10, 
                    marginLeft: 20,
                    borderColor: colors.greyBlack,
                    borderWidth: 1,
                    borderRadius:25,
                    justifyContent:'center',
                    backgroundColor: 'white'}}
                >

                <View style={{ alignItems:'center', justifyContent:'center'}}>

                  <Text style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 10, paddingRight: 10, color: colors.greyBlack, fontWeight: '500', fontSize: 12}}>
                    {item.workcategory}
                  </Text>

                </View>

              </View>

            </View>

        </View>


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
          keyExtractor={(item) => item.worktitle}
          renderItem={this._renderItem}
          ListFooterComponent={this.renderFooter} 
          ItemSeparatorComponent={this.renderSeparator}
        />

      </View>

    )
  }
}


AllWorkExp.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
