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
  ScrollView,
  ImageBackground,
  Easing,
  Animated,
  Platform,
} from 'react-native';
import { Avatar, SearchBar, List, ListItem } from "react-native-elements";
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import NavBarButton from '../components/buttons/NavBarButton';
import Touchable from 'react-native-platform-touchable';
import { NavigationActions } from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import Loader from '../components/Loader';
import firebase from 'react-native-firebase'


const emptyIcon = require('../img/nomessage.png');
const loginPhoto = require('../img/loginphoto_blurred.png');


class PhoneAuth1 extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: null,  
        headerStyle: {transparentHeaderStyle},
        headerTransparent: true,
        headerTintColor: colors.white,

    });

    constructor(props) {

        super(props);
        this.state = {
            progress: new Animated.Value(0),
            loadingVisible: false,
        };

    }

    componentDidMount() {
        this.startAnimation();
    }

    startAnimation() {

        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 2500,
            easing: Easing.linear,
        }).start(() => {
            this.setState({
                progress: new Animated.Value(0),
            })    
            //this.startAnimation();
        });
    }

    navigateToPhoneAuth1 = (navigation) => {
        navigation.navigate('PhoneAuth2')
    }

    
    render() {
    return (

        <View style={{ flex: 1, }}>

            <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

            <ScrollView style={styles.scrollView}>

                <Text style={styles.heading}>
                Phone Authentication
                </Text>

                <View style={{ marginTop:150, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>

                    <LottieView 
                    loop={true}
                    style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginTop:-50, marginRight: 10,  height: 100, width: 100 }}
                    source={Platform.OS == 'android' ? "phoneauth.json" : require('../animation/phoneauth.json')}  progress={this.state.progress} />

                    <Text style={styles.description}>
                    To improve our community trustworthy, employers must have verified phone numbers. Your phone number will not be shared with others.
                    </Text>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Touchable 
                    onPress={this.navigateToPhoneAuth1.bind(this, this.props.navigation)}
                    style={styles.nextButton}
                    background={Touchable.Ripple(colors.themeblue)}>
                
                    <Text style={styles.nextButtonText}>
                        Let's Begin
                    </Text>

                </Touchable>
            </View>

            <Loader
                modalVisible={this.state.loadingVisible}
                animationType="fade"
            />

        </ImageBackground>
        
        </View>
        );
        }
    }


export default PhoneAuth1;

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.white,
    paddingLeft: 30,
    marginTop:20,
    textAlign: 'center',
    paddingRight: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.white,
    marginTop:50,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 20,
  },
  nextButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: colors.themeblue,
  },
  nextButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: 80,
    bottom: 20,
    borderTopWidth: 0,
    borderTopColor: colors.gray05,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

