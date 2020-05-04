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
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { connect } from "react-redux";
import { List,SearchBar, Card, ListItem, Button } from 'react-native-elements';
import colors from '../styles/colors';
import apis from '../styles/apis';
import HireRejectView from '../components/HireRejectView';
import RadioInput from '../components/form/RadioInput';

import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { PropTypes } from 'prop-types';
import axios from 'axios';

const emptyIcon = require('../img/nosavedjob.png');
const noapplicantIcon = require('../img/noapplicant.png');
const workexpIcon = require('../img/profile_work.png');
const locationIcon = require('../img/location2.png');
const newIcon = require('../img/newapplicant.png');

const navigateToJobDetail = NavigationActions.navigate({
  routeName: 'JobDetail',
});

const { carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue } = colors;

/*const navigateToJobDetail = NavigationActions.navigate({
  type: 'Navigation/NAVIGATE',
  routeName: 'Job',
  action: {
    type: 'Navigation/NAVIGATE',
    routeName: 'Home',
  }
});*/

class PendingApplicantContainer extends Component {

  constructor(props) {
		super(props);

		this.state = {
      userid: null,
      postkey: null,
      totalpendingapplicants: 0,
			data: [],
			page: 1,
      error: null,
      end: false,
      refreshing: false,
      loadlimit: 16,
      lasttime: null,
      empty: false,
      formValid: true,
      newApplicantLoad: false,
    };
    
    this.socket = this.props.getSocket.socket;

  }


  fetchUserData = () => {

    const { loadlimit, page, city, lasttime, userid, postkey } = this.state;

    console.log("fetchUserData");

   // var url = apis.GETPendingApplicants_BASEURL+'limit='+loadlimit+'&postkey='+postkey+'&userid='+userid;
    var url = apis.GETApplicant_BASEURL+'limit='+loadlimit+'&postkey='+postkey+'&userid='+userid + '&status=pending';

    if (lasttime) {
        url = url + '&time__lt=' + lasttime;
    }

    console.log('PendingApplicantContainer url = ' + url + '\n' + 'userid= ' + userid)

    axios.get(url)
    .then((response) => {
       
        var data = response.data[0].paginationdata; 
        var totalcount = response.headers['x-total-count'];
        this.setState({
            error: data.error || null,
            end: data.length < loadlimit ? true : false,
            data: page === 1 ? data : [...this.state.data, ...data],
            refreshing: false,
            lasttime: data.length === 0 ? null : data[data.length-1].time,
            empty: data.length === 0 ? lasttime ? false : true : false,
            totalpendingapplicants: totalcount,
        },() => {

          if (this.state.data.length > 0) {
            var newdata = [...this.state.data];

            for(var i = page === 1 ? newdata.length - 1 : 0; i < data.length; i++) {
                newdata[i]['imageBroken'] = false 
            }

            this.setState({
                data: newdata
            })
          }
        })
    })
    .catch((error) => {
        console.log('container err = ' + error);
        this.setState({
            error: true,
        })
    });

  }

  
  componentWillMount() {

    this.setState({
        userid: this.props.getUserid.userid,
        postkey: this.props.screenProps.postkey,
    }, () => {
        this.fetchUserData(this.state.userid);
        
        this.socket.on('applicantschanges', (changes) => {
          //update data
          if (changes.newapplicants > this.state.totalpendingapplicants) {
            //got new applicants
            this.setState({
              newApplicantLoad: true,
            })
          }
        });
    })

  }

  componentWillReceiveProps(nextProps) {

    if ( nextProps.getPendingApplicant.pendingapplicant ) {
     
      if (this.props.getPendingApplicant.pendingapplicant !== nextProps.getPendingApplicant.pendingapplicant){
        if (nextProps.getPendingApplicant.pendingapplicant.status === 'delete') {
          this.removeItemfromFlatlist(nextProps.getPendingApplicant.pendingapplicant.applicantid);
        }
      }
    }

  }

  removeItemfromFlatlist = (applicantid) => {
    var newdata = [...this.state.data];
    var changedindex = this.getIndex(applicantid, newdata, 'applicantid');
    if (changedindex >= 0) {
      newdata.splice(changedindex, 1);
      this.setState({
        data: newdata,
        end: newdata.length === 0 ? true : false,
        page: newdata.length === 0 ? 1 : this.state.page,
        lasttime: newdata.length === 0 ? null : this.state.lasttime,
        empty: newdata.length === 0 ? true : false,
      })
    }
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

    setTimeout(function () {
      navigation.navigate({
        routeName: 'OtherUserProfile',
        params: {
          isApplicant: true,
          userid: item.applicantid,
          applicantType: "pending",
          newVal: item.new,
          postkey: item.postkey,
        },
      });   
    }.bind(this), 50);

  }

  setAvatarColor = (userName) => {
    var avatarColor;
    var avatarName;
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      avatarName = '';
    }

    let sumChars = 0;
    for (let i = 0; i < userName.length; i += 1) {
      sumChars += userName.charCodeAt(i);
    }

    // inspired by https://github.com/wbinnssmith/react-user-avatar
    // colors from https://flatuicolors.com/
    const colors = [carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue];

    avatarColor = colors[sumChars % colors.length];

    var returnresult = {
        avatarColor: avatarColor,
        avatarName: avatarName,
    }

    return returnresult;
  }

  errorLoadImg = ({item, index}) => {
    
    var newdata = [...this.state.data];

    newdata[index]['imageBroken'] = true 

    this.setState({
        data: newdata
    })

  }

  _renderItem = ({item, index}) => (

    <Touchable 
          style={{flex: 1, paddingLeft: 10, paddingTop: 10, paddingBottom: 20, paddingRight: 20, }}
          //delayPressIn = {5000}
          onPress={this.onItemPressed.bind(this, this.props.screenProps.parentNavigation, {item, index})}
          background={Touchable.Ripple(colors.ripplegray)}>
     
        <View style={{ flexDirection: 'row',}}>

            {item.new ? 
            <Image
              style={{alignSelf:'flex-start', height: 40, width: 40, }}
              source={newIcon}
            />
            : null}
        
            <View style={{ marginLeft: item.new ? -25 : 15, marginRight: 15, alignSelf:'center', justifyContent:'center', alignItems: 'center'}}>
            
            {!item.imageBroken ? 

            <View
              style={{ alignSelf:'center', height: 70, width: 70, borderRadius: 35, marginTop: 5,}}>

              <Image
                style={{alignSelf:'center', height: 70, width: 70, borderRadius: 35, }}
                source={{uri:item.applicantdetails[0].profileimage}}
                onError={this.errorLoadImg.bind(this, {item,index})}
              />

              {!item.online ? null :

              <View
                  style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 15, width: 15, borderRadius: 15/2, borderWidth: 1, borderColor: 'white'}}/> }

            </View>

            :

            <TouchableOpacity
                disabled={true}
                style={{alignSelf:'center', alignItems: 'center', justifyContent:'center', height: 70, width: 70, borderRadius: 35, marginTop: 5, backgroundColor:  this.setAvatarColor(item.applicantdetails[0].name).avatarColor}}
                accessibilityTraits="image"
            >
              <Text style={{alignSelf:'center', alignItems: 'center', justifyContent:'center', textAlign: 'center', color: 'white', fontSize: 22, backgroundColor: 'transparent', fontWeight: '500',}}>
              {this.setAvatarColor(item.applicantdetails[0].name).avatarName}</Text>

              {!item.online ? null :

              <View
                style={{ backgroundColor: colors.lightgreen, position: 'absolute', bottom: 0, right: 0, height: 15, width: 15, borderRadius: 15/2, borderWidth: 1, borderColor: 'white'}}/> }


            </TouchableOpacity>

            }

            </View>

            <View style={{ flex: 1, alignItems: 'flex-start',  paddingLeft: 10, paddingBottom: 7, marginRight: 20, }}>

              <View style={{  flex: 1, flexDirection: 'column'}}>

                  <Text numberOfLines={1} style={{  marginRight: 15, color: '#454545', fontSize: 15, fontWeight: 'bold' }}>
                  {item.applicantdetails[0].name}</Text>

                  <View style={{ marginRight: 0, paddingTop: 5, flexDirection: 'row'}}>
                    <Image  style={{ alignItems:'center', justifyContent: 'center', marginTop: 3, height: 15, width: 15, opcaity: 0.5 }} 
                    source={locationIcon}/>
                    <Text numberOfLines={2} style={{ color: colors.greyBlack, paddingLeft: 10, paddingRight: 20, fontSize: 13, opcaity: 0.8 }}>
                    Penang</Text>
                  </View>

                  {item.applicantdetails[0].workexp && item.applicantdetails[0].workexp.length > 0 ? 

                  <View style={{ marginRight: 0, paddingTop: 5, flexDirection: 'row'}}>
                    <Image  style={{ alignItems:'center', justifyContent: 'center', marginTop: 3, height: 15, width: 15 }} 
                    source={workexpIcon}/>
                    <Text numberOfLines={2} style={{ color: colors.greyBlack, paddingLeft: 10, paddingRight: 20, fontSize: 13, opcaity: 0.8 }}>
                    {item.applicantdetails[0].workexp[0].worktitle + ' at ' + item.applicantdetails[0].workexp[0].workcompany}</Text>
                  </View>

                  :

                  <View style={{ marginRight: 0, paddingTop: 5, flexDirection: 'row'}}>
                    <Image  style={{ alignItems:'center', justifyContent: 'center', marginTop: 3, height: 15, width: 15 }} 
                    source={workexpIcon}/>
                    <Text numberOfLines={2} style={{ color: colors.greyBlack, paddingLeft: 10, paddingRight: 20, fontSize: 13, opcaity: 0.8 }}>
                    No Working Experiences</Text>
                  </View>

                  }

                  {item.applicantdetails[0].workexp && item.applicantdetails[0].workexp.length > 1 ? 

                  <View style={{ marginRight: 0, paddingTop: 5, flexDirection: 'row'}}>
                    <Image  style={{ alignItems:'center', justifyContent: 'center', marginTop: 3, height: 15, width: 15 }} 
                    source={workexpIcon}/>
                    <Text numberOfLines={2} style={{ color: colors.greyBlack, paddingLeft: 10, paddingRight: 20, fontSize: 13, opcaity: 0.8 }}>
                    {item.applicantdetails[0].workexp[1].worktitle + ' at ' + item.applicantdetails[0].workexp[1].workcompany}</Text>
                  </View>

                  : null}

              </View>

            </View>

        </View>
        
    </Touchable>
  )

 
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
            this.fetchUserData();
        });
      }
  }

  handleRefresh = () => {

    this.setState({
        page: 1,
        refreshing: true,
        lasttime: null,
    }, () => {
        this.fetchUserData();
    });
      
  }

  renderHeader = () => {
    
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.heading, {color: 'orange'}]}>{this.state.totalpendingapplicants}</Text>
        <Text style={[styles.heading, {color: colors.greyBlack }]}>Pending Applicants</Text>
      </View>
    )
    
  };

  renderEmptyView() {
    return (
        <View>
            <ScrollView style={styles.scrollView}>

                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.heading, {color: 'orange'}]}>0</Text>
                  <Text style={[styles.heading, {color: colors.greyBlack }]}>Pending Applicants</Text>
                </View>

                <View style={{ marginTop:150, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                  <Image
                    style={{ justifyContent:'center', alignSelf:'center', height: 50, width: 50 }}
                    source={noapplicantIcon}
                  />

                  <Text style={styles.description}>
                   No Applicants Yet
                  </Text>
                </View>

            </ScrollView>

            
        </View>
    );
  }

  renderFlatListView() {
    return (
        <List  containerStyle={{ marginTop:0, paddingTop:0, paddingHorizontal: 5, borderBottomWidth: 0, borderTopWidth: 0 }}>
  
           <FlatList
              extraData={this.state.totalpendingapplicants}
              data={this.state.data}
              keyExtractor={(item) => item._id}
              renderItem={this._renderItem}
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

        <View style={{ display: 'flex', backgroundColor: colors.white, flex: 1}}>

            {!this.state.empty && this.renderFlatListView()}

            {this.state.empty && this.renderEmptyView()}

            {this.state.newApplicantLoad? 

            <View
              style={{ borderRadius:25, backgroundColor:'white', position:'absolute',  top: 80, alignSelf: 'center',}}>

              <Touchable
                style={{ 
                    borderLeftWidth: 0, 
                    borderRightWidth: 0, 
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: '#dddddd', 
                    borderRadius:25,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 1,
                        height: 1,
                    },
                    shadowOpacity: 0.3,
                    justifyContent:'center',
                    elevation:3,
                    opacity: this.state.research ? 0.2 : 1.0,
                    backgroundColor: colors.priceblue}}
                    onPress={() => 
                      {
                        this.setState({newApplicantLoad: false})
                        this.handleRefresh();
                      }
                    }
                >

                <View style={{ alignItems:'center', justifyContent:'center'}}>

                  <Text style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, color: 'white', fontWeight: '500', fontSize: 15}}>
                    New Applicants
                  </Text>

                </View>

              </Touchable>
            </View>

            : null }

        </View>

    )

  }
}

const styles = StyleSheet.create({
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
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    paddingTop: 30,
    paddingLeft: 20,
  },
});

PendingApplicantContainer.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
  getPendingApplicant: state.getPendingApplicant,
});

export default connect(mapStateToProps)(PendingApplicantContainer);
