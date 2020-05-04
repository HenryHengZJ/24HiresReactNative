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
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import FlatListVerticalRow from "../components/HomeTab/FlatListVerticalRow";
import { Avatar, SearchBar, List, ListItem } from "react-native-elements";
import colors from '../styles/colors';
import Touchable from 'react-native-platform-touchable';

const emptyIcon = require('../img/nomessage.png');
const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon = require('../img/android_back_black.png');

class LocationContainer extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Select Location",
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
    };

    this.locationSelected = false;
    this.locationName =  '';

  }

  getList = () => {
    const list = [
      {
        location: 'Johor',
      },
      {
        location: 'Kedah',
      },
      {
        location: 'Kelantan',
      },
      {
        location: 'Kuala Lumpur',
      },
      {
        location: 'Labuan',
      },
      {
        location: 'Melacca',
      },
      {
        location: 'Negeri Sembilan',
      },
      {
        location: 'Pahang',
      },
      {
        location: 'Penang',
      },
      {
        location: 'Perak',
      },
      {
        location: 'Perlis',
      },
      {
        location: 'Putrajaya',
      },
      {
        location: 'Sabah',
      },
      {
        location: 'Sarawak',
      },
      {
        location: 'Selangor',
      },
      {
        location: 'Terengganu',
      },
      {
        location: 'Limerick',
      },
      
    ]

    this.setState({
      data: list
    })
    
  }

  componentDidMount() {
    //this.fetchData();
    this.getList();
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.state.params.onLocationListClose(this.locationName, this.locationSelected);
  }

  onItemPressed = (navigation, {item}) => {
   
    this.locationSelected = true,
    this.locationName = item.location,
    navigation.goBack();

  }

  _renderItem = ({item}) => (
    <View style={{flex:1}}>
       
       <Touchable 
          style={styles.locationButton}
          onPress={this.onItemPressed.bind(this, this.props.navigation, {item})}
          background={Touchable.Ripple(colors.ripplegray)}    >

        <View
          style={{ flexDirection: 'row' }}>

            <Text numberOfLines={1} style={{ color:colors.greyBlack, fontSize: 17}}>
              {item.location}
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


  renderHeader = () => {
    return <Text style={styles.heading}>Malaysia</Text>
  };


  renderFlatListView() {
    return (
        <List  containerStyle={{ backgroundColor: 'white', paddingHorizontal: 10, borderBottomWidth: 0, borderTopWidth: 0 }}>

          <FlatList
              data={this.state.data}
              keyExtractor={(item) => item.location}
              renderItem={this._renderItem}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
            />
        </List>
    );
  }

  render() {
    return (

      <View style={{ backgroundColor: 'white', display: 'flex', flex: 1 }}>

          {this.renderFlatListView()}
        
      </View>
    );
  }
}

export default LocationContainer;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.greyBlack,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  locationButton: {
    padding: 20,
  },
});

