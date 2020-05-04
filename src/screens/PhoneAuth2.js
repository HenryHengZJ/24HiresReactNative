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
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { Avatar, SearchBar, List, ListItem } from "react-native-elements";
import colors from '../styles/colors';
import InputField from '../components/form/InputField';
import Touchable from 'react-native-platform-touchable';
import RNPickerSelect from 'react-native-picker-select';
import ActionSheet from 'react-native-actionsheet';
import transparentHeaderStyle from '../styles/navigation';
import Loader from '../components/Loader';
import firebase from 'react-native-firebase'
import deviceStorage from '../helpers/deviceStorage';
import { NavigationActions, StackActions } from 'react-navigation';
import Notification from '../components/Notification';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import { PropTypes } from 'prop-types';
import apis from '../styles/apis';
import axios from 'axios';


const lockIcon = require('../img/lock.png');
const loginPhoto = require('../img/loginphoto_blurred.png');
const downarrowIcon = require('../img/dropdown.png');

const navigateToEmployerTabsAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'EmployerLoggedInTabNavigator'})
  ] 
})


class PhoneAuth2 extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: null,  
        headerStyle: {transparentHeaderStyle},
        headerTransparent: true,
        headerTintColor: colors.white,

    });

 
   constructor(props) {
    super(props);
    
    this.unsubscribe = null;

		this.state = {
			countrycodetxt: 'MY (+60)',
      countrycode: '+60',
      phoneNum: null,
      items: 
      [
          {
              label: 'MY (+60)',
              value: '+60',
          },
          {
              label: 'SG (+61)',
              value: '+61',
          },
          {
              label: 'IE (+353)',
              value: '+353',
          },
      ],
      confirmResult: null,
      loadingVisible: false,
      showNotification: false,
      timer: 0,
		};

    this.phoneChange = this.phoneChange.bind(this);
    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.deleteUserid = deviceStorage.deleteUserid.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.onVerifyClose = this.onVerifyClose.bind(this);
  }

  handleCloseNotification() {
    this.setState({ showNotification: false });
  }

  
  onVerifyClose(timer) {
    if (timer !== 0)  {
      this.setState({
        timer: timer,
      }, () => {
        this.interval = setInterval(
          () => this.setState((prevState)=> ({ timer: prevState.timer - 1 })),
          1000
        );
      })
    }
  }

  componentDidUpdate(){
    if(this.state.timer === 0){ 
      clearInterval(this.interval);
    }
  }

  
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }


  /*listenUserStatus = () => {

    const {confirmResult} = this.state;

    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        deviceStorage.saveItem("userrole", "employer");
        this.props.navigation.dispatch(navigateToEmployerTabsAction)
      }
      else {
        this.props.navigation
          .navigate({
            routeName: 'PhoneAuth3',
            params: {
              confirmResult: confirmResult,
            }})
          
        if (this.unsubscribe) this.unsubscribe();

      } 
    });
  }*/

  /*componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }*/

  /*signIn = (finalphone) => {

    firebase.auth().signInWithPhoneNumber(finalphone)
      .then(confirmResult => 
        this.setState({ 
          confirmResult, 
          loadingVisible: false 
        }, () => {
          this.listenUserStatus();
        })
        )
      .catch(error => 
        this.setState({ 
          showNotification: true, 
          loadingVisible: false })
        );
  };*/

  verifyPhoneNum = (phoneNumber) => {
    firebase.auth()
    .verifyPhoneNumber(phoneNumber)
    .on('state_changed', (phoneAuthSnapshot) => {
     // alert('phoneAuthSnapshot.state = ' + phoneAuthSnapshot.state);
      switch (phoneAuthSnapshot.state) {
        // ------------------------
        //  IOS AND ANDROID EVENTS
        // ------------------------
        case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
         // alert('code sent');
          // on ios this is the final phone auth state event you'd receive
          // so you'd then ask for user input of the code and build a credential from it
          // as demonstrated in the `signInWithPhoneNumber` example above
          this.setState({
              loadingVisible: false
          });

          this.props.navigation
          .navigate({
            routeName: 'PhoneAuth3',
            params: {
              verificationId: phoneAuthSnapshot.verificationId,
              onVerifyClose: this.onVerifyClose,
              timer: this.state.timer,
            },
          })

          break;

        case firebase.auth.PhoneAuthState.ERROR: // or 'error'
          console.log('verification error');
          //alert(phoneAuthSnapshot.error);
          this.setState({
            loadingVisible: false,
            showNotification: true,
          });
          break;

        // ---------------------
        // ANDROID ONLY EVENTS
        // ---------------------
        case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
          //alert('auto verify on android timed out');
          // proceed with your manual code input flow, same as you would do in
          // CODE_SENT if you were on IOS
          break;
        case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
          // auto verified means the code has also been automatically confirmed as correct/received
          // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
          
          console.log(phoneAuthSnapshot);
          this.setState({
            loadingVisible: false
          });
          // Example usage if handling here and not in optionalCompleteCb:
          const { verificationId, code } = phoneAuthSnapshot;
          //alert('auto verified on android' + '\nverificationId = ' + verificationId  + '\code = ' + code );
          if (verificationId && code) {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

            const { setAutoVerify } = this.props;
            setAutoVerify(credential);

          }
          else {
            this.setState({
              loadingVisible: false,
              showNotification: true,
            });
          }

          break;
      }
    }, (error) => {
      // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
      // the ERROR case in the above observer then there's no need to handle it here
      console.log(error.verificationId);
      this.setState({
        loadingVisible: false,
        showNotification: true,
      });
    }, (phoneAuthSnapshot) => {
      // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
      // depending on the platform. If you've already handled those cases in the observer then
      // there's absolutely no need to handle it here.

      // Platform specific logic:
      // - if this is on IOS then phoneAuthSnapshot.code will always be null
      // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
      //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
      // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
      //   continue with user input logic.
  
    });
  }

  phoneChange(phoneNum) {
    this.setState({  phoneNum: phoneNum, });
  }

  showActionSheet = () => {
    this.ActionSheet.show()
  }

  countrycodetxtPressed = (index) => {
    if (index === 0) {
       this.setState({  countrycodetxt: 'MY (+60)', countrycode: '+60'});
    }
    else if (index === 1) {
       this.setState({  countrycodetxt: 'SG (+61)', countrycode: '+61'});
    }
    else if (index === 2) {
       this.setState({  countrycodetxt: 'IE (+353)', countrycode: '+353'});
    }

  }

  sendcodePressed = () => {
    if (this.state.phoneNum ) {
      this.setState({
          loadingVisible: true
      })
      var phonenumtxt = this.state.phoneNum.substring(1);
      var finalphone = this.state.countrycode + phonenumtxt;
     // this.signOutUser(finalphone);
      this.verifyPhoneNum(finalphone);
     // alert(finalphone)
    }
  }

  /*signOutUser = async (finalphone) => {
    try {
        await firebase.auth().signOut();
        this.deleteJWT();
        this.deleteUserid();
        this.signIn(finalphone);
    } catch (e) {
        this.setState({showNotification: true, loadingVisible: false})
    }
  }*/


  render() {

    const notificationMarginTop = this.state.showNotification ? 10 : 0;
   
    return (

      <View style={{ flex: 1,  display: 'flex', }}  >
     
          <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

          <ScrollView style={styles.scrollView}>

              <Text style={styles.heading}>
              Step 1
              </Text>

              <View style={{ marginTop:30,}}>
                <Image
                  style={{ marginLeft: 30, height: 70, width: 70 }}
                  source={lockIcon}
                />

                <View 
                  style={{flexDirection: 'row', marginTop:30, }}>

                  <View 
                  style={{flexDirection: 'column', marginLeft : 30, marginRight:25}}>


                  <Text style={{ fontWeight: '700', color: colors.white, fontSize: 15,  }}>
                    Phone Number
                  </Text>

                  <TouchableOpacity 
                    style={{  marginTop:27 ,}}
                   onPress={this.showActionSheet}
                  >

                    <View
                      style={{flexDirection: 'row', borderBottomColor: 'white', borderBottomWidth: 1, paddingBottom: 10 }}>

                      <Text style={{ flex: 1, fontWeight: '400', color: colors.white, fontSize: 15, }}>
                        {this.state.countrycodetxt}
                      </Text>

                      <Image
                        style={{ justifyContent:'center', marginHorizontal: 5, alignSelf:'center', height: 10, width: 10, }}
                        source={downarrowIcon}
                      />

                    </View>

                  </TouchableOpacity>

                  </View>


                   <InputField
                    labelText=" "
                    labelTextSize={15}
                    labelColor={colors.white}
                    inputType="number"
                    textColor={colors.white}
                    inputStyle={{fontSize: 16, lineHeight: 25}}
                    borderBottomColor={'white'}
                    customStyle={{ flex: 1, marginRight: 30, }}
                    onChangeText={this.phoneChange}
                    showCheckmark={false}
                    multiline={false}
                    autoFocus={true}
                    placeholder="0164567890"
                    
                  />

                </View>

                {this.state.timer !== 0 ? 

                <Text style={{ marginTop:20, fontWeight: '700', color: colors.white, fontSize: 15, textAlign:'center', alignSelf: 'center', justifyContent: 'center'}}>
                  {this.state.timer} seconds left
                </Text>

                : null }

              </View>

          </ScrollView>

          <View style={styles.footer}>
              <Touchable 
                  disabled= {this.state.timer === 0 && this.state.phoneNum ? false : true}
                  style={[styles.nextButton, {opacity: this.state.timer === 0 && this.state.phoneNum ? 1.0 : 0.5}]}
                  onPress={this.sendcodePressed.bind(this)}
                  background={Touchable.Ripple(colors.themeblue)}>
              
                  <Text style={styles.nextButtonText}>
                      Send Code & Verify
                  </Text>

              </Touchable>
          </View>

          <ActionSheet
            ref={o => this.ActionSheet = o}
            title={''}
            options={['MY (+60)', 'SG (+61)', 'IE (+353)', 'Cancel']}
            cancelButtonIndex={3}
            onPress={(index) => { 
               this.countrycodetxtPressed(index);
            }}
          />

          
          <Loader
              modalVisible={this.state.loadingVisible}
              animationType="fade"
          />

           <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
              <Notification
                showNotification={this.state.showNotification}
                handleCloseNotification={this.handleCloseNotification}
                type="Error"
                firstLine = "Error Verifying Phone Number"
                secondLine="Please try again."
              />
          </View>

        </ImageBackground>
        
      </View>
    );
  }
}


PhoneAuth2.propTypes = {
  setAutoVerify: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  getAutoVerify: state.getAutoVerify,
  getJWTToken: state.getJWTToken,
});


export default connect(mapStateToProps, mapDispatchToProps)(PhoneAuth2);


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
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});



