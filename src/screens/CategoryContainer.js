import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { 
  Image,
  Text, 
  View, 
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  } 
from 'react-native';
import colors from '../styles/colors';
import { NavigationActions } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';


const navigateToJobDetail = NavigationActions.navigate({
    routeName: 'JobDetail',
});

const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon = require('../img/android_back_black.png');

export default class CategoryContainer extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Select Category",
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

    this.categorySelected = false;
    this.categoryName =  '';

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
      data: list
    })
    
  }

  componentDidMount() {
    //this.fetchData();
    this.getList();
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.state.params.onCategoryListClose(this.categoryName, this.categorySelected);
  }

  onItemPressed = (navigation, {item}) => {
   
    this.categorySelected = true,
    this.categoryName = item.title,
    navigation.goBack();

  }


  _renderItem = ({item}) => (
    <View style={{flex:1}}>
       
       <Touchable 
          style={{padding: 20}}
          onPress={this.onItemPressed.bind(this, this.props.navigation, {item})}
          background={Touchable.Ripple(colors.ripplegray)}    >

        <View
          style={{ flexDirection: 'row' }}>

            <Image
              style={{ marginLeft:5, justifyContent:'center', alignSelf:'center', height: 25, width: 25,}}
              source={item.image}
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

  renderHeader = () => {
    return <Text style={styles.heading}>Select Category</Text>
  };
  
  renderFlatListView() {
    return (
        <View  style={{ backgroundColor: 'white', paddingHorizontal: 5, borderBottomWidth: 0, borderTopWidth: 0 }}>

          <FlatList
              data={this.state.data}
              keyExtractor={(item) => item.title}
              renderItem={this._renderItem}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
            />
        </View>
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

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 20,
    color: colors.greyBlack,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

CategoryContainer.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
