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
  
} from 'react-native';

import LottieView from 'lottie-react-native';
import colors from '../styles/colors';
import Touchable from 'react-native-platform-touchable'; 
import { NavigationActions, StackActions } from 'react-navigation';

const closeIcon = require('../img/close-button.png');

const loginPhoto = require('../img/loginphoto_blurred.png');

const navigateToLoggedIn = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'LoggedIn'})
    ] 
  })

class UpdateView extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    header:null,
  });
  
  constructor(props) {
	super(props);

	this.state = {
      progress: new Animated.Value(0),
      type: null,
    };
  }
  

  componentDidMount() {
    this.startAnimation();
  }

  componentWillMount() {
    
    const { navigation } = this.props;

    const type = navigation.getParam('type');

    this.setState({
      type: type,
    });

  }

  startAnimation() {
    
    Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
    }).start(() => {
        this.setState({
            progress: new Animated.Value(0),
        })    
        this.startAnimation();
    });
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
                this.props.navigation.goBack()
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

      <View style={{ flex: 1,}}>

        <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',}}>
            <LottieView 
                loop={true}
                style={{ marginBottom: 20, alignSelf:'center', alignItems:'center', justifyContent:'center', marginTop:-50, marginRight: 10,  height: 100, width: 100 }}
                source="bms-rocket.json" progress={this.state.progress} />
            <Text
                style={{ fontSize: 18, marginTop: 0, alignSelf:'center', textAlign: 'center', alignItems:'center', justifyContent:'center', fontWeight: '500', color: 'white'  }}
            >Update 24Hires </Text>
            <Text
                style={{ marginHorizontal: 20, fontSize: 15, lineHeight: 30, marginTop: 15, alignSelf:'center', textAlign: 'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: 'white'  }}
            >A newer and better version of 24Hires is available now! Tap the update button below to enjoy a newer, faster, and better 24Hires! </Text>

        </View>

        <View style={styles.footer}>

            {this.state.type === '2' ?

            null

            :

            <Touchable 
                style={styles.notNowButton}
                onPress={() => this.props.navigation.dispatch(navigateToLoggedIn)}
                background={Touchable.Ripple(colors.ripplegray)}>
            
                <Text style={styles.notNowButtonText}>
                    Not Now
                </Text>

            </Touchable>

            }


            <Touchable 
                style={styles.invFriendsButton}
                onPress={() => Linking.openURL("market://details?id=com.zjheng.jobseed.jobseed")}
                background={Touchable.Ripple(colors.ripplegray)}>
            
                <Text style={styles.invFriendsButtonText}>
                    Update
                </Text>

            </Touchable>
        </View>

      </View>

      </ImageBackground>
    );
  }
}

export default UpdateView;

const styles = StyleSheet.create({
  notNowButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  notNowButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  invFriendsButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: colors.themeblue,
  },
  invFriendsButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    bottom: 20,
    borderTopWidth: 0,
    borderTopColor: colors.gray05,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
