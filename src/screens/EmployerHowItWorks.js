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
  } 
from 'react-native';
import colors from '../styles/colors';
import { NavigationActions } from 'react-navigation';

const closeIcon = require('../img/close-button_black.png');
const firstIcon = require('../img/howjobworks_post.png');
const secondIcon = require('../img/howjobworks_shortlist.png');
const thirdIcon = require('../img/howjobworks_chat.png');
const fourthIcon = require('../img/howjobworks_accept.png');


export default class EmployerHowItWorks extends Component {

  static navigationOptions = ({ navigation }) => ({
    header:null,
    
  });
  

  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',    
    };

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


  render() {

    const offset = (Platform.OS === 'android') ? -180 : 0;

    return (
      <KeyboardAvoidingView style={{backgroundColor:'white', display: 'flex', flex:1}}>

        {this.renderCloseButton()}
      
        <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} style={{backgroundColor:'white', flex:1}}>

            <Text style={{ color: colors.greyBlack, paddingTop:80, fontWeight: '500', paddingLeft:30, paddingRight:30, paddingBottom: 20, fontSize: 24}}>
            How 24Hires Recruiter Works
            </Text>

            <View style={{ marginTop:20, paddingHorizontal: 30, flexDirection: 'row', flex: 1}}>

              <Image
                style={{ height: 80, width: 80, borderRadius: 40}}
                source={firstIcon}
              />

              <Text style={{ flex:1, alignSelf:'center', color: colors.greyBlack, paddingLeft:20, paddingRight:20, lineHeight: 25, opacity: 1, fontSize: 15}}>
                Post job for free! Share your job to other social media sites and groups
              </Text>

            </View>

            <View style={{ marginTop:50, paddingHorizontal: 30, flexDirection: 'row', flex: 1}}>

              
              <Text style={{ flex:1, alignSelf:'center', color: colors.greyBlack, paddingLeft:20, paddingRight:20, lineHeight: 25, opacity: 1, fontSize: 15}}>
                View and Search for ideal candidates
              </Text>

              <Image
                style={{ height: 80, width: 80, borderRadius: 40}}
                source={secondIcon}
              />

            </View>

            <View style={{ marginTop:50, paddingHorizontal: 30, flexDirection: 'row', flex: 1}}>

              <Image
                style={{ height: 80, width: 80, borderRadius: 40}}
                source={thirdIcon}
              />

              <Text style={{ flex:1, alignSelf:'center', color: colors.greyBlack, paddingLeft:20, paddingRight:20, lineHeight: 25, opacity: 1, fontSize: 15}}>
                Chat with potential candidates to get to know them better
              </Text>

            </View>

            <View style={{ marginTop:50, paddingHorizontal: 30, flexDirection: 'row', flex: 1}}>

              
              <Text style={{ flex:1, alignSelf:'center', color: colors.greyBlack, paddingLeft:20, paddingRight:20, lineHeight: 25, opacity: 1, fontSize: 15}}>
                Hire, hire and hire!
              </Text>

              <Image
                style={{ height: 80, width: 80, borderRadius: 40}}
                source={fourthIcon}
              />

            </View>


        </ScrollView>

      </KeyboardAvoidingView >

    )
  }
}

const styles = StyleSheet.create({
  applyButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: '#67B8ED',
  },
  ButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: 80,
    bottom: 0,
    borderTopWidth: 0,
    borderTopColor: '#dadada',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor:'white',
  },
});

EmployerHowItWorks.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
