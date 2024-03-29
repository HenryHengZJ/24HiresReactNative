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

import { List,SearchBar, Card, ListItem, Button } from 'react-native-elements';
import colors from '../../styles/colors';
import apis from '../../styles/apis';
import Touchable from 'react-native-platform-touchable';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

const emptyIcon = require('../../img/noappliedjob.png');

const navigateToJobDetail = NavigationActions.navigate({
  routeName: 'JobDetail',
});

class AppliedContainer extends Component {
 
  constructor(props) {
		super(props);

		this.state = {
      data: [],
			page: 1,
      error: null,
      end: false,
      refreshing: false,
      loadlimit: 15,
      lasttime: null,
      empty: false,
      scrolling: false,
      userid: null,         
    };
    
    this.socket = this.props.getSocket.socket;
  }

  fetchData = () => {

    const { loadlimit, page, lasttime, userid} = this.state;

   // var url = apis.GETAppliedJobs_BASEURL+'limit='+loadlimit+'&userid='+userid;

    var url = apis.GETJobSeekerJobs_BASEURL +'&userid='+ userid + '&limit='+ loadlimit +'&status=applied&appliedrejected=appliedrejected';

    if (lasttime) {
      url = url + '&lasttime=' + lasttime;
    }

    axios.get(url)
    .then((response) => {

      var data = response.data[0].paginationdata;

      console.log("fetchData data length=" + data.length);
      console.log("fetchData data =" + data);
      console.log("fetchData data =" + JSON.stringify(data) );
      this.setState({
          error: data.error || null,
          end: data.length < loadlimit ? true : false,
          data: page === 1 ? data : [...this.state.data, ...data],
          refreshing: false,
          lasttime: data.length === 0 ? null : data[data.length-1].time,
          empty: data.length === 0 ? lasttime ? false : true : false,
      });
    })
    .catch(err => {
        this.setState({
          error: err,
          end: true,
          empty: true,
      });
    });

  }

  componentWillMount() {

    this.setState({
      userid: this.props.getUserid.userid,
    }, () => {
      this.fetchData();

      this.socket.on("reconnect", () => {
        //refresh data
        this.handleRefresh();
      });
  
      this.socket.on('jobseekerjobschanges', (changes) => {
        //update data
        if (changes.status === 'appliedrejected') {
          var newdata = [...this.state.data];
          var changedindex = this.getIndex(changes.postkey, newdata, 'postkey');
          if (changedindex >= 0) {
            newdata[changedindex].status = changes.status;  
            newdata[changedindex].time = changes.time;  
            this.setState({
              data: newdata
            })
          }
        }
        else if (changes.status === 'hired') {
          var newdata = [...this.state.data];
          var changedindex = this.getIndex(changes.postkey, newdata, 'postkey');
          if (changedindex >= 0) {
            newdata.splice(changedindex, 1);
            this.setState({
              data: newdata
            })
          }
        }
      });
    })

  }

  componentWillReceiveProps(nextProps) {

    if ( nextProps.getAppliedJob.appliedjob ) {
     
      if (this.props.getAppliedJob.appliedjob !== nextProps.getAppliedJob.appliedjob){
        if (nextProps.getAppliedJob.appliedjob.status === 'applied') {
          this.handleRefresh()
        }
        else if (nextProps.getAppliedJob.appliedjob.status === 'delete') {
          this.removeItemfromFlatlist(nextProps.getAppliedJob.appliedjob.postkey);
        }
      }
    }

  }

  
  removeItemfromFlatlist = (postkey) => {
    var newdata = [...this.state.data];
    var changedindex = this.getIndex(postkey, newdata, 'postkey');
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
  

  onItemPressed = (navigation, {item}) => {

    setTimeout(function () {
        this.props.screenProps.parentNavigation.navigate({
          routeName: 'JobDetail',
          params: {
              _id: item.postkey,
          },
      });    
       
    }.bind(this), 50);

  }

  _renderItem = ({item, index}) => (

    <Card
        flexDirection={'row'}
       
        containerStyle={{
            padding:0,
            borderWidth: 1,
            borderRadius: 2,
            borderColor: '#dddddd',
            borderTopWidth: 0,
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 1, height: 1},
            shadowOpacity: 0.3,
            elevation: 3,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBottom: 10,
        }} >

        <Touchable 
            delayPressIn = {50000}
            onPress={this.onItemPressed.bind(this, this.props.navigation, {item})}
            background={Touchable.Ripple(colors.ripplegray)}
            style={{padding:15, flex:1}}>

            <View 
                style={{flexDirection: 'column'}}>

              <View 
                  style={{flexDirection: 'row'}}>

                  <View style={{  width:60, height: 60, marginRight: 10, alignItems: 'center', alignSelf: 'center'}}>
                    <Image
                        style={{ width:40, height: 40, }}
                        source={{uri: item.jobdetails[0].categoryimage}} />
                  </View>

                  <View 
                      style={{flex:3, flexDirection: 'column'}}>

                      <View 
                        style={{ flexDirection: 'row'}}>

                        <Text style={{ fontSize: 12, color: colors.darkOrange, fontWeight: '500', marginBottom: 7 }}>{item.jobdetails[0].category.toUpperCase()}</Text>

                        <TouchableOpacity  style={{position: 'absolute', right: 0, zIndex: 2}}>
                          <MaterialIcon name="clear" color={'grey'} size={25}/>
                        </TouchableOpacity>
                      
                      </View>

                      <Text numberOfLines={2} style={{ alignSelf:'flex-start',  color: colors.greyBlack, fontSize: 15, fontWeight: '500', marginBottom: 7, marginRight: 30}}>
                      {item.jobdetails[0].title}
                      </Text>

                      <Text numberOfLines={2} style={{color: colors.greyBlack, fontSize: 15, marginBottom: 7}}>
                        {item.jobdetails[0].desc}
                      </Text>

                  </View>
              
              </View>

              <View 
                style={{width:'100%', height: 1, marginTop: 10, backgroundColor: colors.shadowgray}}/>

              {item.status === "appliedrejected" ? this.renderRejectedView() : this.renderWaitingView() }


            </View>

        </Touchable>
        
    </Card>
  )

  renderWaitingView() {
    return (
      <View 
        style={{ marginTop:10 , flexDirection: 'row'}}>

        <MaterialIcon name="timer" color= {colors.lightOrange} size={20} style={{ justifyContent:'center', marginRight: 15}}/>

        <Text numberOfLines={1} style={{fontWeight: '400', color: colors.lightOrange, fontSize: 15}}>
          Waiting for Reply
        </Text>

      </View>
    );
  };

  renderRejectedView() {
    return (
      <View 
        style={{ marginTop:10 , flexDirection: 'row'}}>

        <Icon name="times-circle" color={colors.darkOrange} size={20} style={{ justifyContent:'center', marginRight: 15}}/>

        <Text numberOfLines={1} style={{fontWeight: '400', color: colors.darkOrange, fontSize: 15}}>
          Rejected
        </Text>

      </View>
    );
  };
 
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
        data: [],
    }, () => {
        this.fetchData();
    });
      
  }

  renderHeader = () => {
    return <Text style={styles.heading}>Applied Jobs</Text>
  };

  renderEmptyView(navigation) {
    return (
        <View>
            <ScrollView style={styles.scrollView}>

                <Text style={styles.nosavedheading}>
                Applied Jobs
                </Text>

                <View style={{ marginTop:150, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                  <Image
                    style={{ justifyContent:'center', alignSelf:'center', height: 50, width: 50 }}
                    source={emptyIcon}
                  />

                  <Text style={styles.description}>
                  Everyday is a new challenge. Start applying your first job here!
                  </Text>
                </View>

            </ScrollView>

        </View>
    );
  }

  renderFlatListView() {
    return (
        <List  containerStyle={{marginTop:0, paddingTop:0, paddingHorizontal: 5, borderBottomWidth: 0, borderTopWidth: 0 }}>
  
           <FlatList
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

        <View style={{ display: 'flex', backgroundColor: colors.white,}}>

            {!this.state.empty && this.renderFlatListView()}

            {this.state.empty && this.renderEmptyView(this.props.navigation)}

        </View>

    )

  }
}

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
    paddingRight: 30,
    marginTop:10,
    textAlign: 'center',
  },
  nosavedheading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.greyBlack,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.greyBlack,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
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
    borderTopWidth: 1,
    borderTopColor: colors.gray05,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

AppliedContainer.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
  getAppliedJob: state.getAppliedJob,
});

export default connect(mapStateToProps)(AppliedContainer);

