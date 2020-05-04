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

const emptyIcon = require('../../img/nohiredjob.png');

const navigateToJobDetail = NavigationActions.navigate({
  routeName: 'JobDetail',
});

class HiredContainer extends Component {
 
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

    var url = apis.GETJobSeekerJobs_BASEURL +'&userid='+ userid + '&limit='+ loadlimit + '&status=hired' ;

    if (lasttime) {
      url = url + '&lasttime=' + lasttime;
    }

    console.log("url = " + url);

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
        if (changes.status === 'hired') {
          var newdata = [...this.state.data];
          var changedindex = this.getIndex(changes.postkey, newdata, 'postkey');
          //If postkey doesnt exists, means its new, add to datalist
          if (changedindex === -1) {
            this.setState({
              data: [changes, ...this.state.data],
            })
          }
        }
      });
    })

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
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.3,
            elevation: 3,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBottom: 10,
        }} >

        <View  style={{flex:1}}>

            <View 
                style={{flexDirection: 'column'}}>

              <Touchable 
                delayPressIn = {50000}
                onPress={this.onItemPressed.bind(this, this.props.navigation, {item})}
                background={Touchable.Ripple(colors.ripplegray)}
                style={{paddingTop:15, paddingBottom:10, paddingLeft:15, paddingRight:15,}}
              >

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

              </Touchable>

             
              <View style={{alignSelf:'center', width:'90%', height: 1, backgroundColor: colors.shadowgray}}/>

              <Touchable 
                delayPressIn = {50000}
                onPress={() => console.log('onPress! = ' + JSON.stringify( item.jobdetails[0].title))}
                background={Touchable.Ripple(colors.ripplegray)}
                style={{ paddingTop:10, paddingBottom:15, paddingLeft:15, paddingRight:15,}} >

                <View 
                  style={{ flexDirection: 'row'}}>

                  <Icon name="check-circle" color= {'green'} size={20} style={{ justifyContent:'center', marginRight: 15}}/>

                  <Text numberOfLines={1} style={{fontWeight: '400', color: 'green', fontSize: 15}}>
                    Hired
                  </Text>

                  <Icon name="chevron-right" color= {'grey'} size={15} style={{ opacity: 0.5, position:'absolute', right:8, alignSelf:'center', alignContent:'center', justifyContent:'center'}}/>

                </View>

              </Touchable>

            </View>

        </View>
        
    </Card>
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
    return <Text style={styles.heading}>Hired Jobs</Text>
  };

  renderEmptyView(navigation) {
    return (
        <View>
            <ScrollView style={styles.scrollView}>

                <Text style={styles.nosavedheading}>
                Hired Jobs
                </Text>

                <View style={{ marginTop:150, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                  <Image
                    style={{ justifyContent:'center', alignSelf:'center', height: 50, width: 50 }}
                    source={emptyIcon}
                  />

                  <Text style={styles.description}>
                  Don't give up! More jobs are waiting for you!
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

HiredContainer.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(HiredContainer);

