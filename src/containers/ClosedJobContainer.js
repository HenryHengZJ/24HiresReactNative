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
  StatusBar,
} from 'react-native';

import { List,SearchBar, Card, ListItem, Button } from 'react-native-elements';
import colors from '../styles/colors';
import apis from '../styles/apis';

import { connect } from "react-redux";
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { PropTypes } from 'prop-types';
import axios from 'axios';

const emptyIcon = require('../img/nosavedjob.png');
const noapplicantIcon = require('../img/noapplicant.png');

const navigateToJobDetail = NavigationActions.navigate({
  routeName: 'JobDetail',
});

const navigateToEmployeeProfileContainer = NavigationActions.navigate({
  routeName: 'EmployeeProfileContainer',
});


class ClosedJobContainer extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
      header: null,
  });
    

  constructor(props) {
		super(props);

		this.state = {
      userid: null,
			data: [],
			page: 1,
      error: null,
      end: false,
      refreshing: false,
      loadlimit: 15,
      lasttime: null,
      empty: false,
		};

  }

  fetchData = () => {

    const { loadlimit, page, lasttime, userid} = this.state;

    var url = apis.JOB_BASEURL+'sort=-time&limit='+loadlimit+'&userid='+ userid + '&closed=true';


    if (lasttime) {
        url = url + '&time__lt=' + lasttime;
    }

    console.log("url = " + url);

    axios.get(url)
    .then((response) => {
      var data = response.data;
        console.log("fetchData data length=" + data.length);
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
          console.log("fetch error" + err);
      });

  }

  componentWillMount() {
    
    this.setState({
      userid: this.props.getUserid.userid,
    }, () => {
      this.fetchData(); 
    })

  }

  
  componentWillReceiveProps(nextProps) {

    if ( nextProps.getClosedJob.closedjob ) {
     
      if (this.props.getClosedJob.closedjob !== nextProps.getClosedJob.closedjob){
        this.handleRefresh()
      }
    }

  }

  applicantPressed = ({item, index}) => {

    this.props.screenProps.parentNavigation.navigate({
        routeName: 'EmployeeProfileContainer',
        params: {
          postkey: item._id,
        },
    });    
   
  }

  onJobPressed = ({item, index}) => {

    this.props.screenProps.parentNavigation.navigate({
        routeName: 'JobDetail',
        params: {
          _id: item._id,
        },
    });    

  }

  _renderItem = ({item, index}) => (

    <Touchable 
          //delayPressIn = {5000}
          onPress={this.onJobPressed.bind(this, {item, index})}
          background={Touchable.Ripple(colors.ripplegray)}>
     
        <View style={{ marginLeft: 10, marginTop: 10, marginBottom: 20, marginRight: 10, flexDirection: 'row', width: '100%', }}>
            <View style={{  marginTop: 5, width:60, height: 60, marginLeft: 5, marginRight: 10, alignItems: 'center'}}>
                <Image
                    style={{ width:40, height: 40, }}
                    source={{uri: item.categoryimage}} />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start',  paddingLeft: 10, paddingBottom: 7 }}>

                <View style={{ flex: 1, flexDirection: 'row'}}>

                    <View style={{ flex: 1, flexDirection: 'column'}}>

                        <Text numberOfLines={1} style={{ color: '#454545', fontSize: 15, fontWeight: 'bold' }}>
                        {item.title}</Text>

                        <View style={{ marginRight: 30, paddingTop: 5, flexDirection: 'row'}}>
                          <Image  style={{ alignItems:'center', justifyContent: 'center', marginTop: 3, height: 15, width: 15 }} 
                          source={require('../img/event.png')}/>
                          <Text numberOfLines={2} style={{ color: colors.green02, paddingLeft: 10, paddingRight: 20, fontSize: 15 }}>
                          {!item.date || item.date === 'none' ? item.jobtype : item.date }</Text>
                        </View>

                        <Text numberOfLines={3} style={{ paddingTop: 5, fontSize: 15, color: colors.greyBlack, opacity: 0.9 }}>
                        {item.desc}</Text>

                    </View>

                    <TouchableOpacity
                        style={{ 
                          marginLeft: 10,
                          marginRight: 20,
                          borderRadius:15, 
                          paddingTop:10,
                          paddingBottom:10,
                          paddingLeft:15,
                          paddingRight:15,
                          justifyContent:'center',
                          elevation:3,
                          backgroundColor: '#fff',
                          shadowColor: '#000',
                          shadowOffset: {
                              width: 1,
                              height: 2,
                          },
                          shadowOpacity: 0.3,}}
                          onPress={this.applicantPressed.bind(this, {item, index})}
                    >

                      <View>

                        <Text 
                        style={{ color: colors.green02, alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 24}}>
                              {!item.hiredapplicants ? 0 : item.hiredapplicants}
                        </Text>

                        <Text style={{ color: colors.green01, alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 13}}>
                              Hired
                        </Text>

                        <Text style={{ color: colors.green01, alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 13}}>
                              Applicants
                        </Text>

                      </View>

                    </TouchableOpacity>

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
    return <Text style={styles.heading}>Closed Jobs</Text>
  };

  renderEmptyView() {
    return (
        <View>
            <ScrollView style={styles.scrollView}>

                <Text style={styles.heading}>
                Closed Jobs
                </Text>

                <View style={{ marginTop:150, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                  <Image
                    style={{ justifyContent:'center', alignSelf:'center', height: 50, width: 50 }}
                    source={emptyIcon}
                  />

                  <Text style={styles.description}>
                  Start posting your first job today!
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

          <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />

            {!this.state.empty && this.renderFlatListView()}

            {this.state.empty && this.renderEmptyView()}

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
    marginBottom: 10,
    color: colors.greyBlack,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

ClosedJobContainer.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
  getClosedJob: state.getClosedJob,
});

export default connect(mapStateToProps)(ClosedJobContainer);