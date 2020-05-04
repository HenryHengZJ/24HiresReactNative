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
} from 'react-native';

import LottieView from 'lottie-react-native';
import colors from '../styles/colors';
import Touchable from 'react-native-platform-touchable'; 
import { CostExplorer } from 'aws-sdk';

const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon  = require('../img/android_back_black.png');


class InviteFriends extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Invite Friends',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 17,
      color: '#454545',
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
		
      progress: new Animated.Value(0),
    };

  }
  

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation() {
    
    Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
    }).start(() => {
        this.setState({
            progress: new Animated.Value(0),
        })    
        this.startAnimation();
    });
  }
  
  render() {
    return (

      <View style={{ flex: 1, backgroundColor: 'white' }}>

        <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
            <LottieView 
            loop={true}
            style={{ marginBottom: 20, alignSelf:'center', alignItems:'center', justifyContent:'center', marginTop:-50, marginRight: 10,  height: 100, width: 100 }}
            source={Platform.OS == 'android' ? "invite_friends.json" : require('../animation/invite_friends.json')} progress={this.state.progress} />
            <Text
                style={{ fontSize: 18, marginTop: 0, alignSelf:'center', textAlign: 'center', alignItems:'center', justifyContent:'center', fontWeight: '500', color: colors.greyBlack  }}
            >Invite Friends </Text>
            <Text
                style={{ marginHorizontal: 20, fontSize: 15, lineHeight: 30, marginTop: 15, alignSelf:'center', textAlign: 'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
            >Send invitation link to your friends and get RM5 rewards when they signup for the first time! </Text>

        </View>

        <View style={styles.footer}>
            <Touchable 
                style={styles.invFriendsButton}
                onPress={() => console.log("pressed")}
                background={Touchable.Ripple(colors.ripplegray)}>
            
                <Text style={styles.invFriendsButtonText}>
                    Invite Friends
                </Text>

            </Touchable>
        </View>

      </View>
    );
  }
}

export default InviteFriends;

const styles = StyleSheet.create({
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
    height: 80,
    bottom: 0,
    borderTopWidth: 0,
    borderTopColor: colors.gray05,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
