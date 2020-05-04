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

const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon = require('../img/android_back_black.png');

class PointsRewards extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Points & Rewards',
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
            style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginTop:-50, marginRight: 10,  height: 200, width: 200 }}
            source={Platform.OS == 'android' ? "pointsrewards.json" : require('../animation/pointsrewards.json')}  progress={this.state.progress} />
            <Text
                style={{ fontSize: 18, marginTop: 0, alignSelf:'center', textAlign: 'center', alignItems:'center', justifyContent:'center', fontWeight: '500', color: colors.greyBlack  }}
            >Points & Rewards </Text>
            <Text
                style={{fontSize: 15, marginTop: 15, alignSelf:'center', textAlign: 'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
            >Comings to you soon </Text>
            

        </View>

      </View>
    );
  }
}

export default PointsRewards;
