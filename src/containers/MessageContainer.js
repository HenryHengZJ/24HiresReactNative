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
} from 'react-native';
import { Avatar, SearchBar, List, ListItem } from "react-native-elements";
import colors from '../styles/colors';
import apis from '../styles/apis';
import Touchable from 'react-native-platform-touchable';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import axios from 'axios';
import Moment from 'moment';

const emptyIcon = require('../img/nomessage.png');

class MessageContainer extends Component {
 
  constructor(props) {
		super(props);

		this.state = {
			data: [],
			page: 1,
      error: null,
      refreshing: false,
      end: false,
      lasttime: null,
      empty: false,

      userid: null,
      userName: null,
      userProfileImage: null,
      loadlimit: 15,
      jwtToken: null,
    };
    
    this.socket = this.props.getSocket.socket;
  }

  componentWillMount() {

    this.setState({
      userid: this.props.getUserid.userid,
      jwtToken: this.props.getJWTToken.jwttoken,
    }, () => {
      this.fetchUserData();
    });

    this.socket.on("reconnect", () => {
      //reload socket io listener and refresh data
      this.fetchData();
    });

    this.socket.on('chatroomchanges', (changes) => {
      //update data
      if (changes.operationType === 'insert') {
        var newchanges = [];
        newchanges.push(changes);
        var newchanges2 = this.getMappedChatRoom(newchanges);
        this.addNewChatRoom(newchanges2[0]);
      }
      else {
        this.reloadMessage(changes.chatroomid, changes.newmessage, changes.lastmessage, changes.time);
      }
    });

  }

  fetchUserData = () => {

    const { userid } = this.state;
  
    var url = apis.GETUser_BASEURL+'&userid__equals='+ userid;

    axios.get(url)
    .then((response) => {

      var data = response.data;

      if (data.length > 0) {
        this.setState({
          userName: response.data[0].name ? response.data[0].name : null,
          userProfileImage: response.data[0].profileimage ? response.data[0].profileimage : null,
        }, () => {
          this.fetchData();
        });
      }
      else {
        this.setState({
          end: true, 
          empty: true, 
        })
      }
      
    })
    .catch((error) => {
      alert("error = " + error)
      console.log(error);
    });
  }

  fetchData = () => {

    const { userid, page, loadlimit, lasttime, jwtToken} = this.state;

    var url = apis.GETChatRoom_BASEURL + "userid=" + userid + "&limit=" + loadlimit + "&userrole=jobseeker";

    if (lasttime) {
        url = url + '&time__lt=' + lasttime;
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    axios.get(url, { headers: headers } )
    .then((response) => {
        var data = response.data;
        this.setState({
          error: data.error || null,
          end: data.length < loadlimit ? true : false,
          data: page === 1 ? data : [...this.state.data, ...data],
          refreshing: false,
          lasttime: data.length === 0 ? null : data[data.length-1].time,
          empty: data.length === 0 ? true : false,
        }, () => {
          this.socketEmitter();
        });
      })
      .catch(err => {
        alert(err)
          this.setState({
            error: err, 
            end: true, 
            empty: true, 
          });
      });

  }

  socketEmitter = () => {
    this.socket.emit('monitorChatroom', this.state.userid);
  }

  getMappedChatRoom = (chatroom) => {
    return chatroom
      ?
    chatroom
      .map(({ _id, userid, newmessage, chatroomid, lastmessage, time, receiverid, receiverimg, receivername }) => {
        return {
          _id,
          userid,
          newmessage,
          chatroomid,
          lastmessage,
          time,
          receiverid,
          userinfo: [{
            profileimage: receiverimg ? receiverimg : null,
            name: receivername ? receivername : null,
          }],
        };
      })
    : [];
  };

  addNewChatRoom = (changes) => {
    var newdata = [changes, ...this.state.data];
    this.setState({
        data: newdata
    })
  }

  reloadMessage = (chatroomid, newmessage, lastmessage, time) => {
    var newdata = [...this.state.data];
    var changedindex = this.getIndex(chatroomid, newdata, 'chatroomid');
    if (changedindex >= 0) {
      newdata[changedindex].newmessage = newmessage;  
      newdata[changedindex].lastmessage = lastmessage;  
      if (newdata[changedindex].time != time )  {
        newdata[changedindex].time = time;  
        newdata = this.moveIdToTop(newdata, changedindex);
      }
      this.setState({
        data: newdata
      })
    }
  }


  moveIdToTop = (jsonarray, oldindex) => {
    var temparray = jsonarray[oldindex];
    jsonarray.splice(oldindex, 1);
    jsonarray.unshift(temparray);
    return jsonarray;
  }

  getIndex = (value, arr, prop) => {
    
    for(var i = 0; i < arr.length; i++) {
      
        if(arr[i][prop] === value) {
            return i;
        }
    }
    return -1; //to handle the case where the value doesn't exist
  }
  

  onItemPressed = (navigation, {item, index}) => {

    console.log("onItemPressed PRESSED");

    var newdata = [...this.state.data];
    var changedindex = index;
   
    newdata[changedindex].newmessage = false;  

    this.setState({
      data: newdata
    })

    var receiverdefaultimg;
    receiverdefaultimg = this.setAvatarName(item.userinfo[0].name);
   
    setTimeout(function () {
      navigation.navigate({
          routeName: 'ChatRoom',
          params: {
            userid: this.state.userid,
            username: this.state.userName,
            receiverid: item.receiverid,
            receivername: item.userinfo[0].name,
            receiverimg: item.userinfo[0].profileimage,
            receiverdefaultimg: receiverdefaultimg,
            chatroomid: item.chatroomid,
            userrole: 'jobseeker',
            online: item.userinfo[0].online,
            lastonlinetime: item.userinfo[0].lastonlinetime,
          },
        })
      }.bind(this), 50);

  }

  setAvatarName = (userName) => {
    
    var avatarName;
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      avatarName = '';
    }

    return avatarName;
  }

  convertDate = (time) => {
    Moment.locale('en');
    var t = new Date( time );
    var lastmessageDate = Moment(t).format('DD MMM YY');
    return lastmessageDate;
  }

  _renderItem = ({item, index}) => (

    <View style={{flex:1}}>
       
       <Touchable 
          onPress={this.onItemPressed.bind(this, this.props.screenProps.parentNavigation, {item, index})}
          background={Touchable.Ripple(colors.ripplegray)}    
       >

        <View
          style={{ paddingVertical:15, paddingHorizontal: 25, flexDirection: 'row' }}>

            <View
              style={{ marginTop:10, marginRight: 15, height: 60, width: 60, borderRadius: 30}}>
       
              <Image
                style={{height: 60, width: 60, borderRadius: 30}}
                source={{uri:item.userinfo[0].profileimage}}
              />

              {!item.userinfo[0].online ? null :

              <View
              style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 15, width: 15, borderRadius: 15/2, borderWidth: 1, borderColor: 'white'}}/> }
              
            </View>

            <View 
              style={{flex:2, flexDirection: 'column'}}>

                <View 
                  style={{ flexDirection: 'row'}}>

                  <Text 
                    numberOfLines={1} 
                    style={{ flex:1, color: item.newmessage ? colors.darkOrange: colors.greyBlack, fontWeight: '500', marginTop:10, marginBottom: 5, fontSize: 15}}>
                    {item.userinfo[0].name}
                  </Text>

                  <Text 
                    numberOfLines={1} 
                    style={{ alignItems: 'flex-end', alignContent: 'flex-end', color: item.newmessage ? 'black' : 'grey', marginLeft:10, marginTop:10, marginBottom: 5, fontSize: 12}}>
                    {this.convertDate(item.time)}
                  </Text>
                
                </View>

                <Text numberOfLines={1} style={{ flex:1,color: item.newmessage ? 'black' : 'grey', marginTop:7, marginBottom: 5}}>
                  {item.lastmessage}
                </Text>
            
            </View>

        </View>

        </Touchable>

      </View>
  )

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "90%",
          backgroundColor: colors.shadowgray,
          alignSelf:'center',
        }}
      />
    );
  }

  renderFooter = () => {
    console.log("renderFooter end =" + this.state.end);
    if (this.state.end) return null;

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
  };

  handleLoadMore = () => {

    if (!this.state.end) {
      this.setState({
        page: this.state.page + 1,
      
      }, () => {
          this.fetchData();
      });
    }
   
  }

  handleRefresh = () => {

    this.setState({
        page: 1,
        refreshing: true,
        lasttime: null,
        end: false,
    }, () => {
        this.fetchData();
    });
      
  }

  renderHeader = () => {
    return <Text style={styles.heading}>Messages</Text>
  };

  renderEmptyView(navigation) {
    return (
        <View>
            <ScrollView style={styles.scrollView}>

                <Text style={styles.nosavedheading}>
                Messages
                </Text>

                <View style={{ marginTop:150, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                  <Image
                    style={{ justifyContent:'center', alignSelf:'center', height: 50, width: 50 }}
                    source={emptyIcon}
                  />

                  <Text style={styles.description}>
                  No messages yet. Chat with employers to know more about job details such as attires, job scope etc.
                  </Text>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Touchable 
                    style={styles.findJobsButton}
                    onPress={() => 

                      setTimeout(function () {
                        this.props.screenProps.parentNavigation.navigate("Home")
                      }.bind(this), 50)
                      
                    }
                    background={Touchable.Ripple(colors.ripplegray)}>
               
                    <Text style={styles.findJobsButtonText}>
                        Start Explore
                    </Text>

                </Touchable>
            </View>

            
        </View>
    );
  }

  renderFlatListView() {
    return (
        <List  containerStyle={{ flex: 1, backgroundColor: 'white', borderBottomWidth: 0, borderTopWidth: 0 }}>

          <FlatList
              data={this.state.data}
              keyExtractor={(item) => item._id}
              renderItem={this._renderItem}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter} 
              onEndReached={this.handleLoadMore}     
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              onEndReachedThreshold={0.01}
            />
        </List>
    );
  }

  render() {
    return (

      <View style={{ backgroundColor: 'white', display: 'flex', flex: 1, }}>

          {!this.state.empty && this.renderFlatListView()}

          {this.state.empty && this.renderEmptyView(this.props.screenProps.parentNavigation)}
        
      </View>
    );
  }
}

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(MessageContainer);

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    padding: 50,
  },
  scrollView: {
    height: '100%',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray04,
    paddingLeft: 30,
    marginTop:10,
    textAlign: 'center',
    paddingRight: 30,
  },
  nosavedheading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.greyBlack,
    marginTop:30,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.greyBlack,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 25,
  },
  findJobsButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: colors.themeblue,
  },
  findJobsButtonText: {
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

