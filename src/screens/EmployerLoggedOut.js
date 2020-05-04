import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Slider,
  Image,
  Platform,
  Animated,
  Easing,
  TouchableOpacity,
  ImageBackground,
  Linking,
  StatusBar,
  AsyncStorage,
} from 'react-native';

import LottieView from 'lottie-react-native';
import colors from '../styles/colors';
import Touchable from 'react-native-platform-touchable'; 
import RNExitApp from 'react-native-exit-app';
import Icon from 'react-native-vector-icons/FontAwesome';
import RoundedButton from '../components/buttons/RoundedButton';
import { NavigationActions, StackActions } from 'react-navigation';
import transparentHeaderStyle from '../styles/navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import NavBarButton from '../components/buttons/NavBarButton';

const closeIcon = require('../img/close-button.png');
``
const loginPhoto = require('../img/loginphoto_blurred.png');

const corporateIcon = require('../img/corporatelogin.png');

const headhunterIcon = require('../img/headhunterlogin.png');

const navigateToTabsAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ 
      routeName: 'EmployerLoggedInTabNavigator',
      params: {
        type: ''
      }
    })
  ] 
})


class EmployerLoggedOut extends React.Component {

  static navigationOptions = ({ navigation }) => ({

    headerStyle: {transparentHeaderStyle},
    headerTransparent: true,
    headerTintColor: colors.white,
   
  });
  
  constructor(props) {
	super(props);

	this.state = {
      type: null,
    };
  }
  

  onLoginPressed = async(navigation, type) => {
    try {
      await AsyncStorage.setItem('role', 'employer');
      navigation.dispatch(navigateToTabsAction);
    } catch (error) {
      
    }
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
                RNExitApp.exitApp()
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
    return (

    <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

    <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />

      <View style={{ flex: 1,}}>

        {this.renderCloseButton()}

        <View style={{flex: 1, alignSelf:'center', justifyContent: 'center', alignItems: 'center'}}>

            <Image
              style={{ marginBottom: 20, alignSelf:'center', marginTop:0, height: 60, width: 60 }}
              source={headhunterIcon}
            />
            <Text
                style={{ marginBottom: 20, marginHorizontal: 20, fontSize: 15, lineHeight: 30, alignSelf:'center', textAlign: 'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: 'white'  }}
            > Login as </Text>

            <View
              style={{marginHorizontal: 20,}}>
              <RoundedButton
                text="HeadHunter"
                textColor={colors.white}
                background={colors.themeblue}
                //icon={<Icon name="facebook" size={20} style={styles.facebookButtonIcon} />}
                handleOnPress={this.onLoginPressed.bind(this, this.props.navigation, 'HeadHunter')}
              />
            </View>

            <Image
              style={{ marginTop: 40, marginBottom: 20, alignSelf:'center',  height: 60, width: 60 }}
              source={corporateIcon}
            />
            <Text
                style={{ marginBottom: 20, marginHorizontal: 20, fontSize: 15, lineHeight: 30, alignSelf:'center', textAlign: 'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: 'white'  }}
            > Login as </Text>

            <View
              style={{marginHorizontal: 20,}}>
              <RoundedButton
                text="Corporate Recruiter"
                textColor={colors.white}
                background={'rgba(0,0,0,0.5)'}
                handleOnPress={this.onLoginPressed.bind(this, this.props.navigation, 'Recruiter')}
              />
            </View>

        </View>

      </View>

      </ImageBackground>
    );
  }
}

export default EmployerLoggedOut;

const styles = StyleSheet.create({
  facebookButtonIcon: {
    color: colors.white,
    position: 'relative',
    left: 20,
    zIndex: 8,
  },
});
