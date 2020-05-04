
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Keyboard,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';
import NavBarButton from '../../components/buttons/NavBarButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Touchable from 'react-native-platform-touchable';
import { NavigationActions } from 'react-navigation';
import iPhoneSize from '../../helpers/utils';

const loginPhoto = require('../../img/loginphoto_blurred.png');
const androidbackIcon = require('../../img/android_back_black.png');
const iosbackIcon = require('../../img/ios_back_black.png');
const chevRightIcon = require('../../img/right_chevron.png');

let headingTextSize = 30;
let termsTextSize = 17;
if (iPhoneSize() === 'small') {
  headingTextSize = 26;
  termsTextSize = 16;
}

export default class CreateJobCategory extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      category: null,
    };

    this.edited = false;

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
    this.getList();
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.getParam('edit')){
      navigation.state.params.onEditJobCategoryClose( this.edited, this.state.category,);
    }
  }


  onItemPressed = (navigation, {item}) => {

    var category = {
      title : item.title,
      image : item.image.uri,
    }

    setTimeout(function () {
      this.setState({
        category: category,
      }, () => {
        if (this.props.navigation.getParam('edit')) {
          this.edited = true,
          navigation.goBack();
        }
        else {
          navigation.navigate('CreateJobDescrip', {
            category: category,
          });
        }
      })
     
    }.bind(this), 50);

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
    return <Text style={styles.heading}>What's the category of the job?</Text>
  };
  
  renderFlatListView() {
    return (
        <View  style={{ backgroundColor: 'white', paddingHorizontal: 5, borderBottomWidth: 0, borderTopWidth: 0, marginTop: 70, }}>

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

  renderBackButton() {
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
                  this.props.navigation.dispatch(NavigationActions.back())
            }
        >

        <Image
            style={{ 
              height: 25,
              width: 25,
            }}
            source={Platform.OS === 'android' ? androidbackIcon : iosbackIcon}
          />
        
        
        </TouchableOpacity>
    )
  }

  render() {
    return (

      <View style={{ backgroundColor: 'white', display: 'flex', flex: 1, }}>

          {this.renderBackButton()}

          {this.renderFlatListView()}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: headingTextSize,
    fontWeight: '700',
    marginVertical: 20,
    color: colors.greyBlack,
    paddingTop: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

