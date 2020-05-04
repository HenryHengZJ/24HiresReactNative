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
  TextInput,
} from 'react-native';
import { Avatar, SearchBar, List, ListItem } from "react-native-elements";
import colors from '../styles/colors';
import Touchable from 'react-native-platform-touchable';
import RNPickerSelect from 'react-native-picker-select';
import ActionSheet from 'react-native-actionsheet';
import transparentHeaderStyle from '../styles/navigation';
import Loader from '../components/Loader';
import AutoVerifying from '../components/AutoVerifying';
import firebase from 'react-native-firebase'
import { NavigationActions, StackActions } from 'react-navigation';
import Notification from '../components/Notification';
import deviceStorage from '../helpers/deviceStorage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import { PropTypes } from 'prop-types';
import apis from '../styles/apis';
import axios from 'axios';


const unlockIcon = require('../img/unlock.png');
const loginPhoto = require('../img/loginphoto_blurred.png');
const downarrowIcon = require('../img/dropdown.png');

const navigateToEmployerTabsAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'EmployerLoggedInTabNavigator'})
  ] 
})


class PhoneAuth3 extends Component {

    
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
			code1: null,
      code2: null,
      code3: null,
      code4: null,
      code5: null,
      code6: null,
      confirmResult: null,
      loadingVisible: false,
      showNotification: false,
      verificationId: null,
      autoverifying: false,
      timer: 60,    
    };

    this.onChangeText1 = this.onChangeText1.bind(this);
    this.onChangeText2 = this.onChangeText2.bind(this);
    this.onChangeText3 = this.onChangeText3.bind(this);
    this.onChangeText4 = this.onChangeText4.bind(this);
    this.onChangeText5 = this.onChangeText5.bind(this);
    this.onChangeText6 = this.onChangeText6.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
   
  }

  

  componentWillMount() {

    const { navigation } = this.props;

    const confirmResult = navigation.getParam('confirmResult');
    const verificationId = navigation.getParam('verificationId');
    const timer = navigation.getParam('timer');

    this.setState({confirmResult, verificationId, timer: timer === 0 ? 60 : timer})
    
  }

  componentDidMount() {

    this.interval = setInterval(
      () => this.setState((prevState)=> ({ timer: prevState.timer - 1 })),
      1000
    );

  }

  componentDidUpdate(){
    if(this.state.timer === 0){ 
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    clearInterval(this.state.timer);
    navigation.state.params.onVerifyClose(this.state.timer);
  }


  /*componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
      //  alert('user loggedin' + JSON.stringify(user))
      } 
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }*/

  componentWillReceiveProps(nextProps) {

    if ( nextProps.getAutoVerify.credential ) {
     
      if (this.props.getAutoVerify.credential !== nextProps.getAutoVerify.credential){
        if (nextProps.getAutoVerify.credential) {
          this.setState({ autoverifying: true });
          this.linkCredential(nextProps.getAutoVerify.credential);
        }
      }
    }

  }


  handleCloseNotification() {
    this.setState({ showNotification: false });
  }


  onChangeText1(code) { this.setState({  code1: code, }); this.field2.focus()}

  onChangeText2(code) { this.setState({  code2: code, }); this.field3.focus()}

  onChangeText3(code) { this.setState({  code3: code, }); this.field4.focus()}

  onChangeText4(code) { this.setState({  code4: code, }); this.field5.focus()}

  onChangeText5(code) { this.setState({  code5: code, }); this.field6.focus()}

  onChangeText6(code) { this.setState({  code6: code, }); }
 

  verifycodePressed = () => {
    this.setState({ loadingVisible: true });
    const { confirmResult, verificationId } = this.state;
    var finalcode = this.state.code1 + this.state.code2 + this.state.code3 + this.state.code4 + this.state.code5 + this.state.code6;
    /*if (confirmResult && finalcode.length) {
      confirmResult.confirm(finalcode)
        .then((user) => {
          this.setState({ 
            loadingVisible: false 
          }, () => {
            alert(JSON.stringify(user))
            this.loginToEmployer();
          });
        })
        .catch(error => 
          this.setState({ 
            loadingVisible: false,
            showNotification: true,
          })
        );
    }*/
    if (verificationId && finalcode.length) {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, finalcode);
      this.linkCredential(credential);
    }
  }

  linkCredential = (credential) => {
    firebase.auth().currentUser.linkWithCredential(credential)
    .then((user) => {
      this.fetchUserName(user.uid);
    })
    .catch((error) => {
      this.setState({ loadingVisible: false, showNotification: true, autoverifying: false });
    });
  }

  fetchUserName = (userid) => {

    var url = apis.GETUser_BASEURL+'userid='+ userid;

    axios.get(url)
    .then((response) => {
      this.createEmployerProfile(userid, response.data[0].name, response.data[0].location ? response.data[0].location : null);
    })
    .catch((error) => {
      this.setState({ loadingVisible: false, showNotification: true, autoverifying: false });
    });

  }

  createEmployerProfile = (userid, username, userlocation) => {

    var employerAcc = {
      userid: userid,
      name: username,
      verifiedssm: false
    };

    if (userlocation) {
      employerAcc.location = userlocation;
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.getJWTToken.jwttoken,
    }

    var createemployerurl = apis.PUTEmployer_BASEURL + "userid=" + userid;
    
    axios.put(createemployerurl, employerAcc, { headers: headers } )
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        this.setState({ loadingVisible: false, autoverifying: false});
        deviceStorage.saveItem("userrole", "employer");
        this.props.navigation.dispatch(navigateToEmployerTabsAction)
      }
    })
    .catch((error) => {
      this.setState({ loadingVisible: false, showNotification: true, autoverifying: false });
    });

  }

  resendcodePressed = () => {
    this.props.navigation.goBack();
  }

  focusTheField = (id) => {
      this.inputs[id].focus();
  }

  loginToEmployer = () => {
    deviceStorage.saveItem("userrole", "employer");
    this.props.navigation.dispatch(navigateToEmployerTabsAction)
  }

  render() {

    const notificationMarginTop = this.state.showNotification ? 10 : 0;
   
    return (

      <View style={{ flex: 1, }}>

          <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

          <ScrollView style={styles.scrollView}>

              <Text style={styles.heading}>
              Step 2
              </Text>

              <View style={{ marginTop: 30,}}>

                <Image
                  style={{ marginLeft: 30, height: 70, width: 70 }}
                  source={unlockIcon}
                />
               
                <View 
                style={{flex: 1, marginTop:20, flexDirection: 'column', marginHorizontal:30}}>

                  <Text style={{ fontWeight: '700', color: colors.white, fontSize: 15,  }}>
                    Enter Verification Code
                  </Text>

                  <View 
                    style={{marginTop:20,  flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>

                    <View 
                      style={{borderRadius: 50/2, width: 50, height: 50, borderWidth: 1, borderColor: 'white', marginRight: 5,alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                      <TextInput
                        style={{textAlign: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17}}
                        onChangeText={this.onChangeText1}
                        autoFocus={true}
                        returnKeyType={ 'next' }
                        underlineColorAndroid="transparent"
                        value={this.state.code1}
                        keyboardType={'phone-pad'}
                        maxLength={1}
                      />
                    </View>

                    <View 
                      style={{borderRadius: 50/2, width: 50, height: 50, borderWidth: 1, borderColor: 'white', marginRight: 5,alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                      <TextInput
                        style={{textAlign: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17}}
                        onChangeText={this.onChangeText2}
                        autoFocus={false}
                        ref={field2 => this.field2 = field2}
                        underlineColorAndroid="transparent"
                        value={this.state.code2}
                        keyboardType={'phone-pad'}
                        maxLength={1}
                      />
                    </View>

                    <View 
                      style={{borderRadius: 50/2, width: 50, height: 50, borderWidth: 1, borderColor: 'white', marginRight: 5,alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                      <TextInput
                        style={{textAlign: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17}}
                        onChangeText={this.onChangeText3}
                        autoFocus={false}
                        ref={field3 => this.field3 = field3}
                        underlineColorAndroid="transparent"
                        value={this.state.code3}
                        keyboardType={'phone-pad'}
                        maxLength={1}
                      />
                    </View>

                    <View 
                      style={{borderRadius: 50/2, width: 50, height: 50, borderWidth: 1, borderColor: 'white', marginRight: 5,alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                      <TextInput
                        style={{textAlign: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17}}
                        onChangeText={this.onChangeText4}
                        autoFocus={false}
                        ref={field4 => this.field4 = field4}
                        underlineColorAndroid="transparent"
                        value={this.state.code4}
                        keyboardType={'phone-pad'}
                        maxLength={1}
                      />
                    </View>

                    <View 
                      style={{borderRadius: 50/2, width: 50, height: 50, borderWidth: 1, borderColor: 'white', marginRight: 5,alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                      <TextInput
                        style={{textAlign: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17}}
                        onChangeText={this.onChangeText5}
                        autoFocus={false}
                        ref={field5 => this.field5 = field5}
                        underlineColorAndroid="transparent"
                        value={this.state.code5}
                        keyboardType={'phone-pad'}
                        maxLength={1}
                      />

                    </View>

                    <View 
                      style={{borderRadius: 50/2, width: 50, height: 50, borderWidth: 1, borderColor: 'white', marginRight: 5,alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                      <TextInput
                        style={{textAlign: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17}}
                        onChangeText={this.onChangeText6}
                        autoFocus={false}
                        ref={field6 => this.field6 = field6}
                        underlineColorAndroid="transparent"
                        value={this.state.code6}
                        keyboardType={'phone-pad'}
                        maxLength={1}
                      />

                    </View>

                  </View>

                  <Text style={{ marginTop:20, fontWeight: '700', color: colors.white, fontSize: 15, textAlign:'center', alignSelf: 'center', justifyContent: 'center'}}>
                    {this.state.timer} seconds left
                  </Text>

                </View>

              </View>

          </ScrollView>

          <View style={styles.footer}>
              <Touchable 
                  disabled= {this.state.timer === 0 ? false : true}
                  style={[styles.resendButton, {opacity: this.state.timer === 0 ? 1.0 : 0.5}]}
                  onPress={this.resendcodePressed.bind(this)}
                  background={Touchable.Ripple(colors.themeblue)}>
              
                  <Text style={styles.nextButtonText}>
                      Resend Code
                  </Text>

              </Touchable>

              <Touchable 
                  disabled= {this.state.code1 && this.state.code2 && this.state.code3 && this.state.code4 && this.state.code5 && this.state.code6 ? false : true}
                  style={[styles.nextButton, {opacity: this.state.code1 && this.state.code2 && this.state.code3 && this.state.code4 && this.state.code5 && this.state.code6 ? 1.0 : 0.5}]}
                  onPress={this.verifycodePressed.bind(this)}
                  background={Touchable.Ripple(colors.themeblue)}>
              
                  <Text style={styles.nextButtonText}>
                      Verify Code
                  </Text>

              </Touchable>
          </View>

           <Loader
              modalVisible={this.state.loadingVisible}
              animationType="fade"
          />

          <AutoVerifying
              modalVisible={this.state.autoverifying}
              animationType="fade"
          />

          <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
              <Notification
                showNotification={this.state.showNotification}
                handleCloseNotification={this.handleCloseNotification}
                type="Error"
                firstLine = "Error Verifying Phone Number"
                secondLine="Please try Resend Code again."
              />
          </View>


        </ImageBackground>
        
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  getAutoVerify: state.getAutoVerify,
  getJWTToken: state.getJWTToken,
});


export default connect(mapStateToProps, mapDispatchToProps)(PhoneAuth3);

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
  resendButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    backgroundColor: 'transparent',
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
    fontSize: 15
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
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});



