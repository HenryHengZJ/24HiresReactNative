
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  ImageBackground,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';
import styles from './styles/FirstLogin';
import RoundedButton from '../../components/buttons/RoundedButton';
import NavBarButton from '../../components/buttons/NavBarButton';

const loginPhoto = require('../../img/loginphoto_blurred.png');

const navigateToLogin = NavigationActions.navigate({
  routeName: 'LogIn',
});

class FirstLogin extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft:null,
          
    headerStyle: {transparentHeaderStyle},
    headerTransparent: true,
    headerTintColor: colors.white,
   
  });


  onSetupPress = (navigation) => {

    navigation.navigate('CreateProfileBirthDate')
              
  }
  
  onSkipPress = (navigation) => {
    
    navigation.navigate('LoggedIn')

  }


  render() {

    return (

      <KeyboardAvoidingView
        style={{display: 'flex', flex: 1, }}
        behavior="padding"
      >

      <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

      <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />

      <ScrollView style={styles.wrapper}>
        <View style={styles.welcomeWrapper}>
         

          <Text style={{fontSize: 30, color: colors.white, fontWeight: '300', marginBottom: 50, marginTop: 80}}>
            Welcome to 24Hires.
          </Text>

          <Text style={{fontSize: 15, lineHeight: 25, color: colors.white, fontWeight: '500', marginBottom: 50,}}>
            Would you like to complete your profile setup before logging in?
          </Text>

          <RoundedButton
            text="Setup Profile"
            textColor={colors.white}
            background={colors.themeblue}
            handleOnPress={this.onSetupPress.bind(this, this.props.navigation)}
            
          />

          <RoundedButton
            text="Proceed to HomePage"
            textColor={colors.white}
            background={'rgba(0,0,0,0.5)'}
            handleOnPress={this.onSkipPress.bind(this, this.props.navigation)}
          />
        

        </View>
      </ScrollView>

      </ImageBackground>

      </KeyboardAvoidingView>

    );
  }
}

export default FirstLogin;