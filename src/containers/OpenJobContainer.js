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
  Alert,
  AlertIOS,
  Platform,
} from 'react-native';

import { List,SearchBar, Card, ListItem, Button } from 'react-native-elements';
import colors from '../styles/colors';
import apis from '../styles/apis';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import Loader from '../components/Loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
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


class OpenJobContainer extends Component {

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
      jobIDPressed: null,
      loadingVisible: false,
      selectedjob: null,
    };
      
    this.socket = this.props.getSocket.socket;

  }

  fetchData = () => {

    const { loadlimit, page, lasttime, userid} = this.state;

    var url = apis.JOB_BASEURL+'sort=-time&limit='+loadlimit+'&userid='+ userid + '&closed=false';

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
        })
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
    //  this.socket.emit('monitorApplicants', this.props.getUserid.userid);
      this.socket.on('applicantschanges', (changes) => {
        //update data
        
        var _id = changes.postkey;
        var newapplicants = changes.newapplicants;
        var totalapplicants = changes.totalapplicants;
        var hiredapplicants = changes.hiredapplicants;
        this.reloadMessage(_id, newapplicants, totalapplicants, hiredapplicants);
      });
    })
  }

  reloadMessage = (_id, newapplicants, totalapplicants, hiredapplicants) => {
    var newdata = [...this.state.data];
    var changedindex = this.getIndex(_id, newdata, '_id');
   
    if (changedindex >= 0) {

      newdata[changedindex].newapplicants = newapplicants;  
      newdata[changedindex].totalapplicants = totalapplicants;  
      newdata[changedindex].hiredapplicants = hiredapplicants;  
        
      this.setState({
        data: newdata
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

  removeItemfromFlatlist = (_id) => {
    var newdata = [...this.state.data];
    var changedindex = this.getIndex(_id, newdata, '_id');
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


  applicantPressed = ({item, index}) => {

    this.props.screenProps.parentNavigation.navigate({
        routeName: 'EmployeeProfileContainer',
        params: {
          postkey: item._id,
        },
    });    
   
  }

  editJob = () => {

    const {selectedjob} = this.state;

    var dataToEdit = {
      title : selectedjob.title,
      descrip : selectedjob.desc,
      jobtype : selectedjob.jobtype,
      gender : selectedjob.gender === 'unisex' ? '' : selectedjob.gender,
    }
   
    var category = {
      title: selectedjob.category,
      image: selectedjob.categoryimage
    }
    dataToEdit.category = category;

    var location = {
      address: selectedjob.fulladdress,
      latitude: selectedjob.latitude,
      longitude: selectedjob.longitude
    }
    dataToEdit.location = location;

    if (selectedjob.wages) {
      dataToEdit.salary = selectedjob.wages;
    }
    if (selectedjob.currency) {
      dataToEdit.currency = selectedjob.currency;
    }
    if (selectedjob.rate) {
      dataToEdit.rates = selectedjob.rate;
    }
    if (selectedjob.payment) {
      dataToEdit.payment = selectedjob.payment;
    }
    if (selectedjob.date) {
      dataToEdit.date = selectedjob.date;
    }
    if (selectedjob.commitment) {
      dataToEdit.commitment = selectedjob.commitment;
    }
    if (selectedjob.daysperweek) {
      dataToEdit.daysperweek = selectedjob.daysperweek;
    }
    
    this.props.screenProps.parentNavigation.navigate('CreateJobOverview', {
      category: dataToEdit.category,
      title: dataToEdit.title,
      descrip: dataToEdit.descrip,
      location: dataToEdit.location,
      jobtype: dataToEdit.jobtype,
      salary: dataToEdit.salary,
      currency: dataToEdit.currency,
      rates: dataToEdit.rates,
      payment: dataToEdit.payment,
      date: dataToEdit.date,
      commitment: dataToEdit.commitment,
      daysperweek: dataToEdit.daysperweek,
      gender: dataToEdit.gender,
      editJob: true,
      postkey: selectedjob._id,
    });

  }

  closedJob = () => {
    
    const { setClosedJob } = this.props;

    this.setState({ loadingVisible: true, })

    var data = {
      postkey: this.state.jobIDPressed,
      status: 'pending',
      closed: 'true',
    }

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.getJWTToken.jwttoken,
    }

    var closedjoburl = apis.CLOSEDjob_BASEURL + "userid=" + this.state.userid;
    
    axios.put(closedjoburl, data, { headers: headers } )
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        this.setState({ loadingVisible: false});
        setClosedJob(data);
        this.removeItemfromFlatlist(this.state.jobIDPressed)
      }
    })
    .catch((error) => {
      this.setState({ loadingVisible: false });
    });

  }

  closeJobAlert =() => {

    Platform.OS === 'android' ? 

      Alert.alert(
        'Close Job',
        'Are you sure you want to close this job? You will no longer be able to accept new applicants ',
        [
          {text: 'Cancel', style: 'cancel'
          },
          {text: 'Close Job', 
            onPress: () => 
              {this.closedJob()}
          },
        ],
        { cancelable: true },
        { onDismiss: () => {} }
      )

      :
      
      AlertIOS.alert(
      'Close Job',
      'Are you sure you want to close this job? You will no longer be able to accept new applicants',
      [
        {
          text: 'Close Job', 
          onPress: () => {this.closedJob()},
          style: 'default'
        },
        {
          text: 'Cancel', 
          onPress: () => {null},
          style: 'cancel'
        },
      ],
      
    )
      
  }

  showActionSheet = ({item, index}) => {
    this.setState({
      jobIDPressed: item._id,
      selectedjob: item,
    }, () => {
      this.ActionSheet.show()
    })
  }

  jobPressed = (index) => {
    if (index === 0) {
      this.viewjobPressed()
    }
    else if (index === 1) {
      console.log('Edit Job')
      this.editJob();
    }
    else if (index === 2) {
      console.log('Close Job')
      this.closeJobAlert();
    } 
  }

  viewjobPressed = () => {
    this.props.screenProps.parentNavigation.navigate({
      routeName: 'JobDetail',
      params: {
        _id: this.state.jobIDPressed,
      },
    });    
  }

  _renderItem = ({item, index}) => (

    <Touchable 
          //delayPressIn = {5000}
          onPress={this.showActionSheet.bind(this, {item, index})}
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

                        <Text style={{ paddingTop: 5, fontSize: 13, color: colors.darkOrange, fontWeight: '500' }}>
                        New Applicants: {item.newapplicants}</Text>

                        <Text style={{ paddingTop: 5, fontSize: 13, color: colors.priceblue, fontWeight: '500' }}>
                        Hired Applicants: {item.hiredapplicants}</Text>

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
                        style={{ color: colors.priceblue, alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 24}}>
                              {!item.totalapplicants ? 0 : item.totalapplicants}
                        </Text>

                        <Text style={{ color: '#67B8ED', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 13}}>
                              Total
                        </Text>

                        <Text style={{ color: '#67B8ED', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 13}}>
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
    }, () => {
        this.fetchData();
    });
      
  }

  renderHeader = () => {
    return <Text style={styles.heading}>Open Jobs</Text>
  };

  renderEmptyView() {
    return (
        <View>
            <ScrollView style={styles.scrollView}>

                <Text style={styles.heading}>
                Open Jobs
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

            <ActionSheet
              ref={o => this.ActionSheet = o}
              title={''}
              options={['View Job', 'Edit Job', 'Close Job', 'Cancel']}
              cancelButtonIndex={3}
              destructiveButtonIndex={2}
              onPress={(index) => { this.jobPressed(index) }}
            />

            <Loader
              modalVisible={this.state.loadingVisible}
              animationType="fade"
            />

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


OpenJobContainer.propTypes = {
  setClosedJob: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getSocket: state.getSocket,
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OpenJobContainer);
