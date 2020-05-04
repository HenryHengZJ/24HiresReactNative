
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Easing,
  Animated,
} from 'react-native';
import colors from '../styles/colors';

export default class HireRejectView extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
      positionValue: new Animated.Value(-80),
  	};
    this.hireAction = this.hireAction.bind(this);
    this.rejectAction = this.rejectAction.bind(this);
  	this.animateNotification = this.animateNotification.bind(this);
  }

  animateNotification(value) {
  	const { positionValue } = this.state;
    Animated.timing(
      positionValue,
      {
        toValue: value,
        duration: 300,
        velocity: 3,
        tension: 2,
        friction: 8,
        easing: Easing.easeOutBack,
      },
    ).start();
  }

  hireAction() {
    this.props.hireAction();
  }

  rejectAction() {
    this.props.rejectAction();
  }

  render() {
  	const {
      firstWord, secondWord, showNotification, applicantType,
    } = this.props;
    showNotification ? this.animateNotification(0) : this.animateNotification(-80);
  	const { positionValue } = this.state;
  	return (
    <Animated.View style={[{ marginBottom: positionValue }, styles.wrapper]}>

    {applicantType === 'hired' || applicantType === 'rejected' ?

      <View style={styles.errorMessageContainer}>
        <TouchableOpacity
          style={{ 
              borderLeftWidth: 0, 
              borderRightWidth: 0, 
              borderTopWidth: 0,
              borderBottomWidth: 1,
              borderColor: '#dddddd', 
              borderRadius:5,
              shadowColor: '#000',
              shadowOffset: {
                  width: 1,
                  height: 1
              },
              shadowOpacity: 0.4,
              flex:1,
              justifyContent:'center',
              elevation:3,
              backgroundColor: applicantType === 'hired' ? colors.green02 : colors.googlered}}
              disabled={true}
              onPress={() => this.setState({pressCount: this.state.pressCount + 1})}
          >

            <View style={{ alignItems:'center', justifyContent:'center'}}>

              <Text style={{ color: 'white', fontWeight: '500', fontSize: 15}}>
                    {applicantType === 'hired' ? 'Hired' : 'Rejected'}
              </Text>

            </View>

        </TouchableOpacity>

      </View>

      :

      <View style={styles.errorMessageContainer}>

        <TouchableOpacity
          style={{ 
              borderLeftWidth: 0, 
              borderRightWidth: 0, 
              borderTopWidth: 0,
              borderBottomWidth: 1,
              borderColor: '#dddddd', 
              borderRadius:5,
              shadowColor: '#000',
              shadowOffset: {
                  width: 1,
                  height: 1
              },
              shadowOpacity: 0.4,
              marginRight: 7.5,
              flex:1,
              justifyContent:'center',
              elevation:3,
              backgroundColor: colors.googlered}}
              onPress={this.rejectAction}
          >

            <View style={{ alignItems:'center', justifyContent:'center'}}>

              <Text style={{ color: 'white', fontWeight: '500', fontSize: 15}}>
                    {firstWord}
              </Text>

            </View>

        </TouchableOpacity>


        <TouchableOpacity
          style={{ 
              borderLeftWidth: 0, 
              borderRightWidth: 0, 
              borderTopWidth: 0,
              borderBottomWidth: 1,
              borderColor: '#dddddd', 
              borderRadius:5,
              shadowColor: '#000',
              shadowOffset: {
                  width: 1,
                  height: 1
              },
              shadowOpacity: 0.4,
              flex:1,
              marginLeft: 7.5,
              justifyContent:'center',
              elevation:3,
              backgroundColor: colors.themeblue}}
              onPress={this.hireAction}
          >

            <View style={{ alignItems:'center', justifyContent:'center'}}>

              <Text style={{ color: 'white', fontWeight: '500', fontSize: 15}}>
                    {secondWord}
              </Text>

            </View>

        </TouchableOpacity>

      </View>

    }

    </Animated.View>
  	);
  }
}

HireRejectView.propTypes = {
  showNotification: PropTypes.bool.isRequired,
  firstWord: PropTypes.string,
  secondWord: PropTypes.string,
  applicantType: PropTypes.string,
  hireAction: PropTypes.func,
  rejectAction: PropTypes.func,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    height: 80,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  errorText: {
    color: colors.darkOrange,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: colors.greyBlack,
  },
  errorTextBox: {
    flexDirection: 'column',
    marginLeft: 15,
  },
  errorMessageContainer: {
    flexDirection: 'row',
    flex: 1,
    padding: 15,    
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
