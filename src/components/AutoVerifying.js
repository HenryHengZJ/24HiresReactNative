


import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  StatusBar,
} from 'react-native';
import colors from '../styles/colors';
import LottieView from 'lottie-react-native';

export default class AutoVerifying extends Component {
  constructor(props) {
		super(props);
	
  }

  
  render() {
    const { animationType, modalVisible, handleOnPress, txtmsg } = this.props;
    return (
      <Modal
        animationType={animationType}
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          null;
        }}
      >
        <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/>
        <View style={styles.wrapper}>
          <View style={styles.loaderContainer}>
            
            <Image
              style={{ marginTop:10, alignSelf:'center', alignItems:'center', justifyContent:'center', height: 70, width: 70 }}
              source={require('../img/greenLoader.gif')}
            />

            <Text 
              style={{marginVertical:10, marginHorizontal: 20, textAlign: 'center', color: 'black', fontSize: 15, lineHeight: 25, }}>
              Auto Verifying
            </Text>

          </View>
        </View>
      </Modal>
    );
  }
}

AutoVerifying.propTypes = {
  animationType: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleOnPress: PropTypes.func,
  txtmsg: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    backgroundColor: colors.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    alignSelf: 'center',

  },
  loaderImage: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginTop: 20,
    alignSelf: 'center',
  },
});
