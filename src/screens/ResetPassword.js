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
import Touchable from 'react-native-platform-touchable';


const closeIcon = require('../img/close-button_black.png');

export default class ResetPassword extends Component {

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
              Reset Password
            </Text>

            <Text style={{  color: colors.greyBlack, paddingLeft:30, paddingRight:30, lineHeight: 25, opacity: 1, fontSize: 15}}>
              A confirmation email will be sent to your email address to reset password.
            </Text>

            <Text style={{  color: colors.greyBlack, marginTop:50, fontWeight: '500', paddingLeft:30, paddingRight:30, fontSize: 17}}>
              Email Address
            </Text>

            <TextInput 
            autoFocus={true}
            keyboardType="email-address"
            numberOfLines={1} 
            underlineColorAndroid='rgba(0,0,0,0.1)'  
            style={{ color: colors.greyBlack, marginTop:20, marginLeft:30, marginRight:30, paddingBottom: 10, fontSize: 15}}/>

        </ScrollView>

        <View 
          style={{ backgroundColor: colors.shadowgray, height:1, width: '100%'}}/>

        <View style={styles.footer}>
            <Touchable 
                background={Touchable.Ripple(colors.ripplegray)}   
                style={styles.applyButton}
                onPress={() => 

                  setTimeout(function () {
                    { //this.props.navigation.navigate("Home")
                      Keyboard.dismiss()
                    }
                    
                  }.bind(this), 50)
                  
                }>
            
                <Text style={styles.ButtonText}>
                    Reset Password
                </Text>

            </Touchable>
        </View>

     
        

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

ResetPassword.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
