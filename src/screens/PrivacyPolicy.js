import React, { Component } from 'react';
import { WebView } from 'react-native';
import colors from '../styles/colors';

export default class PrivacyPolicy extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Privacy Policy",
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 17,
      color: colors.greyBlack,
    }
  });
  
  render() {
    return (
      <WebView
        source={{uri: 'https://24hires.com/privacy-policy/'}}
        style={{marginTop: 0}}
      />
    );
  }
}