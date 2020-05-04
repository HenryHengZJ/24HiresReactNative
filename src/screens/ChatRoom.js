import React, { Component } from 'react';
import { 
  Platform,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
  AsyncStorage,
} 
from 'react-native';
import PropTypes from 'prop-types';
import {GiftedChat, Actions, Bubble, SystemMessage, Avatar} from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';
import Touchable from 'react-native-platform-touchable';
import SlackMessage from '../components/ChatComponent/SlackMessage';
import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBarButton from '../components/buttons/NavBarButton';
import ActionSheet from 'react-native-actionsheet';
import apis from '../styles/apis';
import Moment from 'moment';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

const SLIDE_IN_DOWN_KEYFRAMES = {
  from: { translateY: -50 },
  to: { translateY: 0 },
};

const SLIDE_IN_UP_KEYFRAMES = {
  from: { translateY: 0 },
  to: { translateY: -50 },
};

const iosblackBackIcon = require('../img/ios_back_black.png');
const androidblackBackIcon = require('../img/android_back_black.png');


class ChatRoom extends Component {

constructor (props) {
    super(props)

    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: true,
      isLoading: true,
      action: null,
      androidAutoCorrectFix: true,  
      userid: null,
      username: null,
      receiverid: null,
      newChatRoom: null,
      chatroomid: null,
      lasttime: null,
      end: false,
      jwtToken: null,
      loadlimit: 15,
      loadEarliercount: 0,
      isReloading: null,
      userrole: null,
    }

    this.socket = this.props.getSocket.socket;

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    
    this._isAlright = null;
}

static navigationOptions = ({ navigation }) => {

  Moment.locale('en');
  var t = new Date( navigation.getParam('lastonlinetime') );
  var lastseen = Moment(t).fromNow();
  
  return {
    /*headerStyle: {transparentHeaderStyle},
    headerTransparent: true,
    headerTintColor: colors.white,*/
    headerTitle: 
    <View style={{ flexDirection: 'row'}}>
        {navigation.getParam('receiverimg') ? 
        <TouchableOpacity 
          style={{height: 35, width: 35, borderRadius: 35/2}}
          onPress={() => navigation.state.params.handleImagePressed() } >
          <Image
              style={{ height: 35, width: 35, borderRadius: 35/2}}
              source={{uri: navigation.getParam('receiverimg')}}
          />
          {navigation.getParam('online') ? 
          <View
            style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 7, width: 7, borderRadius: 7/2, borderWidth: 1, borderColor: 'white'}}/> : null }

        </TouchableOpacity>
        :
        <TouchableOpacity 
          style={{height: 35, width: 35, borderRadius: 35/2, backgroundColor: '#d7d7d7', alignItems: 'center', alignSelf:'center', justifyContent:'center'}}
          onPress={() => navigation.state.params.handleImagePressed() } >
           <Text style={{alignSelf:'center', alignItems: 'center', justifyContent:'center', textAlign: 'center', color: colors.greyBlack, fontSize: 15, backgroundColor: 'transparent', fontWeight: '500',}}>
            {navigation.getParam('receiverdefaultimg')}</Text>
            {navigation.getParam('online') ? 
            <View
            style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 7, width: 7, borderRadius: 7/2, borderWidth: 1, borderColor: 'white'}}/> : null }

        </TouchableOpacity>
        }
        <View 
          style={{flexDirection: 'column'}}>
          <Text style={{marginLeft: 20,  color: colors.greyBlack, fontSize: 15, fontWeight: '500', alignSelf: 'flex-start'}}>
              {navigation.getParam('receivername')}
          </Text>

          <Text style={{marginLeft: 20,  color: 'grey', fontSize: 13, alignSelf: 'flex-start'}}>
              {navigation.getParam('online') ? 'Online' : 'last seen ' + lastseen}
          </Text>
        </View>
    </View>,
    headerLeft:
    <TouchableOpacity 
      
        style={{marginLeft: 15,}}
        onPress={() => navigation.goBack() } >

        <Image
            style={{ height: 25, width: 25,}}
            source={Platform.OS === 'android' ? androidblackBackIcon : iosblackBackIcon}
        />
    
    </TouchableOpacity>,
    headerRight:
    <TouchableOpacity 
        style={{marginRight: 15,}}
        onPress={() => navigation.state.params.handleHeaderPressed() } >

        <Icon name="ios-information-circle-outline" color={'black'} size={30} />    
    
    </TouchableOpacity>
    };
};

_dropdown_onSelect(idx, value) {
    if (value === "Delete Chat") {
        alert("Delete Chat", "Are you sure you want to delete the conversation?")
    }
    else if (value === "Block User" ) {
        alert("Block User", "Are you sure you want to block the user?")
    }
}

_storeDate = async () => {
  try {
    await AsyncStorage.setItem('lastsavedtime', new Date());
  } catch (error) {
    // Error saving data
  }
}

_retrieveData = async () => {
  try {
    const olddate = await AsyncStorage.getItem('lastsavedtime');
    if (olddate !== null) {
      var timeOld = new Date(olddate).getTime();
      var timeNew = new Date().getTime();
      var hourDiff = timeNew - timeOld; //in ms
      var secDiff = hourDiff / 1000; //in s
      var minDiff = hourDiff / 60 / 1000; //in minutes
      var hDiff = hourDiff / 3600 / 1000; //in hours
      var humanReadable = {};
      humanReadable.hours = Math.floor(hDiff);
      humanReadable.minutes = minDiff - 60 * humanReadable.hours;
      console.log(humanReadable); //{hours: 0, minutes: 30}
      console.log(minDiff); //{hours: 0, minutes: 30}
      console.log(secDiff); //{hours: 0, minutes: 30}
      console.log((secDiff.toFixed())); //{hours: 0, minutes: 30}
      var secondsDiff = (secDiff.toFixed());
      if (secondsDiff >= 36) {
          alert('Loading')
          this.setState({
            isReloading: true,
          })
      }
    }
   } catch (error) {
    //catch err
   }
}

componentDidMount() {
    this.props.navigation.setParams({ 
      handleHeaderPressed: this.showActionSheet,
      handleImagePressed: this.userPressed,
    });

    
    AppState.addEventListener('change', this._handleAppStateChange);
}

componentWillUnmount() {
    this._isMounted = false;
    this.socket.emit('leave', this.state.chatroomid);
    this.socket.off('message');
    this.socket.off('connect');
   
    AppState.removeEventListener('change', this._handleAppStateChange);
}

_handleAppStateChange = (nextAppState) => {

  if (nextAppState === 'active') {
    //this._retrieveData();
  }
  else if (nextAppState === 'background') {
    //this._storeDate();
  }
}


componentWillMount() {
 
  var userid  = this.props.navigation.getParam('userid');
  var username = this.props.navigation.getParam('username');
  var receiverid = this.props.navigation.getParam('receiverid');
  var chatroomid = this.props.navigation.getParam('chatroomid');
  var userrole = this.props.navigation.getParam('userrole');

  this._isMounted = true;
  this.setState({
      userid: userid,
      username: username,
      receiverid: receiverid,
      messages: [],
      chatroomid: chatroomid ? chatroomid : null,
      jwtToken: this.props.getJWTToken.jwttoken,
      userrole: userrole,
    }, () => {

      if (chatroomid) {
        this.roomExisted(chatroomid, this.state.userid, this.state.receiverid, userrole);
      }
      else {
        this.checkChatRoomExists(this.state.userid, this.state.receiverid, this.state.jwtToken, userrole);
      }

      this.socket.on('message', (data) => {
          //alert(JSON.stringify(data) ); 
          this.onReceiveMsg(data);
      });

      this.socket.on("reconnecting", () => {
        this.setState({
          isReloading: true,
        })
      });

      this.socket.on("connect", () => {
        alert("connect ChatRoom");
        this.setState({
          isReloading: false,
        })
        this.socket.emit('join', {chatroomid: chatroomid, userid: userid, receiverid: receiverid, userrole: userrole});
      });


    });
  }

  getList = () => {
    const list = [
      {
        _id: Math.round(Math.random() * 1000000),
        text: "React Native lets you build mobile apps using only JavaScript",
        createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
        user: {
          _id: this.state.receiverid,
          name: "Developer"
        }
      },
      {
        _id: Math.round(Math.random() * 1000000),
        text:
          "It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/",
        createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
        user: {
          _id: this.state.receiverid,
          name: "Developer"
        }
      },
      {
        _id: Math.round(Math.random() * 1000000),
        text: "This is a system message.",
        createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
        system: true
      }
      
    ]


    this.setState(previousState => ({
     
      messages: GiftedChat.append( list, previousState.messages),
      isLoadingEarlier: false,
    }))
    
  }

  roomExisted = (chatroomid, userid, receiverid, userrole) => {
        
    this.setState({
      newChatRoom: false,
      chatroomid: chatroomid,
    }, () => {
      this.socket.emit('join', {chatroomid: chatroomid, userid: userid, receiverid: receiverid, userrole: userrole});
      this.loadMessages(this.state.chatroomid);
    });

  }

  checkChatRoomExists = (userid, receiverid, jwtToken, userrole) => {

    var url = apis.GETChatRoom_BASEURL + 'userid='+ userid + '&receiverid=' + receiverid + '&userrole=' + userrole;
    //var url = apis.GETChatRoom_BASEURL + 'userid='+ userid + '&receiverid=' + receiverid;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    axios.get(url, { headers: headers } )
    .then((response) => {
        if (response.data.length === 0) {
          //ChatRoom doesn't exist
          this.setState({
            newChatRoom: true,
            isLoading: false,
            oldmessages: [],
          })
        }
        else {
          this.setState({
            newChatRoom: false,
            chatroomid: response.data[0].chatroomid,
          }, () => {
            this.socket.emit('join', {chatroomid: this.state.chatroomid, userid: userid, receiverid: receiverid, userrole: userrole});
            this.loadMessages(this.state.chatroomid);
          });
        }
    })
    .catch((error) => {
       // alert(error)
        console.log(error);
    });
  }


  loadMessages = (chatroomid) => {

    const {loadlimit} = this.state;

    var url = apis.GETMessages_BASEURL + 'chatroomid='+ chatroomid + '&limit=' + loadlimit ;

    axios.get(url)
    .then((response) => {
        if (response.data.length === 0) {
          //No messages
          this.setState({
            lasttime: null,
            end: true,
            isLoadingEarlier: false,
            isLoading: false,
            oldmessages: [],
          })
        }
        else {
          console.log(JSON.stringify(response.data))
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, this.getMappedMessages(response.data)),
            lasttime: response.data[response.data.length-1].time,
            end: response.data.length < loadlimit ? true : false,
            isLoadingEarlier: false,
            isLoading: false,
            oldmessages: GiftedChat.append(previousState.messages, this.getMappedMessages(response.data)),
          }))
        }
    })
    .catch((error) => {
        console.log(error);
    });
  }


  loadEarlierMessages = () => {

    const {loadlimit, chatroomid, lasttime} = this.state;

    if (lasttime) {
        var url = apis.GETMessages_BASEURL + 'chatroomid='+ chatroomid + '&limit=' + loadlimit + '&lasttime=' + lasttime;

        axios.get(url)
        .then((response) => {
            if (response.data.length === 0) {
              //No messages..
              this.setState({
                lasttime: null,
                end: true,
                isLoadingEarlier: false,
                loadEarliercount: 0,
              })
            }
            else {
              
              this.setState(previousState => ({
                messages: GiftedChat.append( this.getMappedMessages(response.data), previousState.messages),
                lasttime: response.data[response.data.length-1].time,
                end: response.data.length < loadlimit ? true : false,
                isLoadingEarlier: false,
                loadEarliercount: 0,
              }))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    else {
      this.setState({
        end: true,
        isLoadingEarlier: false,
        loadEarliercount: 0,
      })
    }
  }


  getMappedMessages = (messages) => {
    return messages
      ?
    messages
      .map(({ _id, text, createdAt, userinfo, userid, time}) => {
        return {
          _id,
          text,
          createdAt,
          time,
          user: {
            _id: userid,
            name: userinfo[0].name,
            avatar: null,
          },
        };
      })
    : [];
  };



  onSend(messages = []) {

    const {newChatRoom, userid, username, receiverid, chatroomid, userrole} = this.state;

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages,),
      androidAutoCorrectFix: Platform.OS !== 'android'
    }))

    var receiverrole;

    if (userrole === 'employer') {
      receiverrole = 'jobseeker'
    }
    else if (userrole === 'jobseeker') {
      receiverrole = 'employer'
    }

    var messagesToSaved = {
        text: messages[0].text,
        createdAt: messages[0].createdAt,
        chatroomid: chatroomid,
        user: {_id: userid, name: username, avatar: null},
        time: Date.now(),
        receiverid: receiverid,
        receiverrole: receiverrole,
        userrole: userrole,
    }

    if (newChatRoom) {
      var chatRoomInfo = {
        userid: userid,
        receiverid: receiverid,
        lastmessage: messages[0].text,
        time: Date.now(),
        receiverrole: receiverrole,
        userrole: userrole,
      }
      var chatRoomData = [chatRoomInfo, messagesToSaved];
      this.socket.emit('createChatRoom', chatRoomData);
      //alert(JSON.stringify(chatRoomData))
    }
    else {
      alert(JSON.stringify(messagesToSaved))
      this.socket.emit('message', messagesToSaved);
    }

    Platform.OS === 'android' && (() => this.setState({androidAutoCorrectFix: true}))

    // for demo purpose
   // this.answerDemo(messages);
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'React Native is typing'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              //this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1500);
  }

  onReceiveMsg(data) {
    alert(JSON.stringify(data))
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, data),
      androidAutoCorrectFix: Platform.OS !== 'android'
    }))

    Platform.OS === 'android' && (() => this.setState({androidAutoCorrectFix: true}))
  }

  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }


  renderMessage(props) {
    const { currentMessage: { text: currText } } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return (
      <SlackMessage {...props} messageTextStyle={messageTextStyle} />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
            marginLeft: 10,
            marginBottom: 10,
          },
          right: {
            backgroundColor: colors.priceblue,
            marginRight: 10,
            marginBottom: 10,
          }

        }}
      />
    );
  }


  renderLoadEarlier(props) {

    if (this.state.end === true) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 0,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  renderEmptyView() {
    return(
  
      <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', alignSelf:'center', justifyContent: 'center', }}>
  
        <Text style={{  color:  colors.greyBlack, alignSelf:'center', justifyContent: 'center', fontSize: 17, paddingHorizontal: 20 }}>
            Loading...
        </Text>
  
      </View>
  
    )
  }


  isCloseToTop({ layoutMeasurement, contentOffset, contentSize })
  {
      const paddingToTop = 80;
      return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }

  showActionSheet = () => {
      this.ActionSheet.show()
  }

  userPressed = () => {
    this.props.navigation.navigate({
      routeName: 'OtherUserProfile',
      params: {
          userid: this.state.receiverid,
      },
    })
  }

  onEndReached = () => {

    if (!this.state.end) {
      this.setState({
        isLoadingEarlier: true,
        //loadEarliercount: this.state.loadEarliercount + 1,
      }, () => {

        setTimeout(function () {
      
          this.loadEarlierMessages(); 

        }.bind(this), 500)
        
      });
    }
  } 

handleLoadMore = () => {

  if (!this.state.end) {
    this.setState({
      isLoadingEarlier: true,
      //loadEarliercount: this.state.loadEarliercount + 1,
    }, () => {
      
      this.loadEarlierMessages(); 

    });
  }
}

render() {

  const{end, isLoading} = this.state;

    return (

      <View style={{ backgroundColor:'white', display: 'flex', flex:1}}>
        
        <View>
          {this.state.isReloading === true? 
            <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_DOWN_KEYFRAMES} style={styles.reconnectingheader}>
                <Text style={{ paddingTop:15, alignSelf: 'center', color: 'white'}}> Connecting... </Text>
            </Animatable.View> 

            :

            this.state.isReloading === false?   
           
              <Animatable.View duration={500} delay={2000} useNativeDriver={true} animation={SLIDE_IN_UP_KEYFRAMES} style={styles.reconnectedheader}>
                  <Text style={{paddingTop:15, alignSelf: 'center', color: 'white'}}> Connected </Text>
              </Animatable.View>

            :

            null

          }
        </View>      

        {isLoading? 
          this.renderEmptyView()

          :

        <GiftedChat
          loadEarlier = {true}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.userid,
          }}
          textInputProps={{
            autoCorrect: Platform.OS === 'ios' || this.state.androidAutoCorrectFix
          }}
          renderFooter={this.renderFooter}
          renderBubble={this.renderBubble}
          renderLoadEarlier={this.renderLoadEarlier}
          handleLoadMore={this.handleLoadMore}
        />

        }
        
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={''}
          options={['Delete Chat', 'Block User', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => { /* do something */ }}
        />
     
      </View>
    );
  }

}

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(ChatRoom);

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  reconnectingheader: {
    alignItems: 'center',
    backgroundColor: 'orange',
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:50,
    borderColor: "#CED0CE",
  },
  reconnectedheader: {
    alignItems: 'center',
    backgroundColor: colors.green01,
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:50,
    borderColor: "#CED0CE",
  },
});