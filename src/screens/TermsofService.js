import React, { Component } from 'react';
import { WebView } from 'react-native';
import colors from '../styles/colors';

export default class TermsofService extends Component {
 
  static navigationOptions = ({ navigation }) => ({
    title: "Terms of Use",
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 17,
      color: colors.greyBlack,
    }
  });
  
  render() {
    return (
      <WebView
        source={{uri: 'https://24hires.com/terms-of-use/'}}
        style={{marginTop: 0}}
      />
    );
  }
}