
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Keyboard,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';

import RadioInput from '../../components/form/RadioInput';
import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';
import NextArrowButton from '../../components/buttons/NextArrowButton';

import { NavigationActions } from 'react-navigation';
import { StyleSheet } from 'react-native';
import iPhoneSize from '../../helpers/utils';

const loginPhoto = require('../../img/loginphoto_blurred.png');
const androidbackIcon = require('../../img/android_back_black.png');
const iosbackIcon = require('../../img/ios_back_black.png');
const chevRightIcon = require('../../img/right_chevron.png');

let headingTextSize = 30;
let termsTextSize = 17;
if (iPhoneSize() === 'small') {
  headingTextSize = 26;
  termsTextSize = 16;
}

export default class CreateJobType extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      jobtype: 'Part Time (Short Term)',
    };

    console.disableYellowBox = true;

    this.handleNextButton = this.handleNextButton.bind(this);

  }

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.getParam('edit')){
      navigation.state.params.onEditJobTypeClose(true, this.state.jobtype,);
    }
  }

  componentWillMount() {

    const { navigation } = this.props;
   
    const edit = navigation.getParam('edit');
    const jobtype = navigation.getParam('jobtype');

    if (edit) {
      this.setState({ 
        jobtype: jobtype? jobtype : 'Part Time (Short Term)',
      });
    }
  }


  handleNextButton() {
    Keyboard.dismiss();
    
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;

    const { jobtype } = this.state;

    const category = navigation.getParam('category');
    const title = navigation.getParam('title');
    const descrip = navigation.getParam('descrip');
    const location = navigation.getParam('location');

    const edit = navigation.getParam('edit');

    if (edit) {
      navigation.goBack();
      return;
    }

    navigate('CreateJobSalary', {
      category: category,
      title: title,
      descrip: descrip,
      location: location,
      jobtype: jobtype,
    });
  }

  selectJobOption = (jobtype) => {
    this.setState({  jobtype: jobtype, });
  }


  renderJobTypePreference() {
    return (

      <View style={{ marginBottom: 80, marginTop:20, marginLeft:20, marginRight:20,}}>

      <TouchableOpacity
        onPress={() => this.selectJobOption('Part Time (Short Term)')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20}}
        
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack,paddingBottom: 20}}>
            Part Time (Short Term)
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'Part Time (Short Term)'}
            />
          </View>
        </View>
      </TouchableOpacity>
    
      <TouchableOpacity
        onPress={() => this.selectJobOption('Part Time (Long Term)')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20}}
        
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack,paddingBottom: 20}}>
            Part Time (Long Term)
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'Part Time (Long Term)'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectJobOption('Full Time')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            Full Time
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'Full Time'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectJobOption('EzyTask')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
            EzyTask
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'EzyTask'}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.selectJobOption('Internship')}
        style={{flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 20, }}
       
        >
        <View>
          <Text style={{fontSize: 16, fontWeight: '400', color: colors.lightBlack, paddingBottom: 20}}>
          Internship
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0,}}>
            <RadioInput
              backgroundColor={colors.gray07}
              borderColor={colors.gray05}
              selectedBackgroundColor={colors.green01}
              selectedBorderColor={colors.green01}
              iconColor={colors.white}
              selected={this.state.jobtype === 'Internship'}
            />
          </View>
        </View>
      </TouchableOpacity>

      </View>
    )
  }


  renderBackButton() {
    return (
      <TouchableOpacity
          style={{ 
            position:'absolute', 
            left:10, 
            top:20, 
            zIndex:10,
            padding:10, 
            height: 50,
            width: 50,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'transparent'}}
            onPress={() => 
                  this.props.navigation.dispatch(NavigationActions.back())
            }
        >

        <Image
            style={{ 
              height: 25,
              width: 25,
            }}
            source={Platform.OS === 'android' ? androidbackIcon : iosbackIcon}
          />
        
        
        </TouchableOpacity>
    )
  }


  render() {
    const {
      jobtype
    } = this.state;

    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: 'white' }, styles.wrapper]}
      >
        {this.renderBackButton()}
        <View style={styles.scrollViewWrapper}>
          <ScrollView 
            keyboardShouldPersistTaps='handled'
            style={styles.scrollView}>
            <Text style={styles.loginHeader}>
              What type of job?
            </Text>

            {this.renderJobTypePreference()}
           
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton}
            disabled={false}
          />
        </View>

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
  },
  scrollViewWrapper: {
    marginTop: 70,
    flex: 1,
    padding: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex: 1,
  },
  loginHeader: {
    fontSize: headingTextSize,
    color: colors.greyBlack,
    fontWeight: '500',
    marginBottom: 40,
  },
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

