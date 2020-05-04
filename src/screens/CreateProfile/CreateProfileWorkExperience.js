
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
  Slider,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../redux/actions';
import colors from '../../styles/colors';
import transparentHeaderStyle from '../../styles/navigation';
import InputField from '../../components/form/InputField';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import NavBarButton from '../../components/buttons/NavBarButton';
import styles from './styles/CreateProfileWorkExperience';
import { NavigationActions } from 'react-navigation';

const loginPhoto = require('../../img/loginphoto_blurred.png');

class CreateProfileWorkExperience extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavBarButton
      handleButtonPress={() => navigation.navigate('CreateProfileEducation',
      {
        birth: navigation.getParam('birth'),
      })}
      location="right"
      color={colors.white}
      text="Skip"
    />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      workdata: [],
      formValid: true,
      validWorkTitle: false,
      WorkTitle: '',
      WorkCompany: '',
      validWorkCompany: false,
      loadingVisible: false,
      workperiodtxt: 'Less than a month',
      workcategory: null,
      slidervalue: 0,
      clearInput: false,
    };

    console.disableYellowBox = true;

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleWorkTitleChange = this.handleWorkTitleChange.bind(this);
    this.handleWorkCompanyChange = this.handleWorkCompanyChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.onCategoryListClose = this.onCategoryListClose.bind(this);
  
  }

  handleNextButton = (navigation, birth,) => {
    Keyboard.dismiss();
  //  this.setState({ loadingVisible: true });
    const { logIn } = this.props;
    const { navigate } = navigation;

    const { WorkTitle, WorkCompany, workperiodtxt, workcategory} = this.state;

    var newworkdata = {
      worktitle: WorkTitle,
      workcompany: WorkCompany,
      worktime: workperiodtxt,
      workcategory: workcategory,
    };

    this.setState({
      workdata: [...this.state.workdata, newworkdata],
    })

    Alert.alert(
      'Add More Work Experiences',
      'Do you want to add more work experiences before proceeding to next screen?',
      [
        { text: 'Finish',
          onPress: () => 
           navigate('CreateProfileEducation',
          {
            birth: birth,
            workexp: this.state.workdata,
          }), 
          style: 'cancel'
        },
        { text: 'Add More', 
          onPress: () => 
          {
            this.setState({
              formValid: true,
              validWorkTitle: false,
              WorkTitle: '',
              WorkCompany: '',
              validWorkCompany: false,
              loadingVisible: false,
              workperiodtxt: 'Less than a month',
              workcategory: null,
              slidervalue: 0,
              clearInput: true,
            });
            this.handleWorkTitleChange;
            this.handleWorkCompanyChange;
          }
        },
      ],
      { cancelable: true },
      { onDismiss: () => {} }
    )
  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }


  handleWorkTitleChange(WorkTitle) {

    this.setState({  WorkTitle: WorkTitle, });

    if (WorkTitle != "") {
      this.setState({ 
        validWorkTitle: true,
      });
    } 
    else {
      this.setState({ 
        validWorkTitle: false,
       });
    }
  }

  handleWorkCompanyChange(WorkCompany) {

    this.setState({  WorkCompany: WorkCompany, });

    if (WorkCompany != "") {
      this.setState({ 
        validWorkCompany: true,
      });
    } 
    else {
      this.setState({ 
        validWorkCompany: false,
       });
    }
  }

  toggleNextButtonState() {
    const { validWorkCompany, validWorkTitle } = this.state;
    if (validWorkCompany && validWorkTitle) {
      return false;
    }
    return true;
  }

  sliderValueChange = (values) => {
    var periodtxt;
    if (values === 0) {
      periodtxt = "Less than a month"
    }
    else if (values === 1) {
      periodtxt = "Less than 3 months"
    }
    else if (values === 2) {
      periodtxt = "Less than 6 months"
    }
    else if (values === 3) {
      periodtxt = "Less than 1 year"
    }
    else if (values === 4) {
      periodtxt = "2 years +"
    }
    else if (values === 5) {
      periodtxt = "5 years +"
    }
    else if (values === 6) {
      periodtxt = "10 years +"
    }
    else if (values === 7) {
      periodtxt = "20 years +"
    }

    this.setState({
      workperiodtxt: periodtxt,
      slidervalue: values,
    })
  }

  onCategoryPressed = () => {
    this.props.navigation.navigate('CategoryContainer', { onCategoryListClose: this.onCategoryListClose });
  }

  onCategoryListClose( categoryName, categorySelected) {
 
    if (categorySelected) {
        this.setState({
          workcategory: categoryName,
        })  
    } 
  }

  render() {
    const {
      formValid, loadingVisible, validWorkTitle, validWorkCompany,clearInput,
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;

    const { navigation } = this.props;
    const birth = navigation.getParam('birth');

    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: 'black' }, styles.wrapper]}
      >

       <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>
       
        <View style={styles.scrollViewWrapper}>
          <ScrollView 
            keyboardShouldPersistTaps='handled'
            style={styles.scrollView}>
            <Text style={styles.loginHeader}>
              What's your Work Experience?
            </Text>

            <Text style={{  color: colors.white, marginTop:40, fontWeight: '500', fontSize: 14}}>
              WORK CATEGORY
            </Text>

            <View
            style={{marginBottom:10, marginTop:20, flexDirection: 'row'}}>

              <TouchableOpacity 
                style={{  flex:1, marginVertical:20 , borderBottomColor: colors.white, borderBottomWidth: 1,}}
                onPress={this.onCategoryPressed.bind(this)}
              >

                <Text style={{ fontWeight: '400', color: colors.white, fontSize: 15, paddingBottom: 10, lineHeight: 25,}}>
                  {this.state.workcategory ? this.state.workcategory : ''}
                </Text>

              </TouchableOpacity>

            </View>

            <InputField
              labelText="WORK TITLE"
              labelTextSize={14}
              labelColor={colors.white}
              inputType="email"
              textColor={colors.white}
              borderBottomColor={colors.white}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleWorkTitleChange}
              showCheckmark={validWorkTitle}
              value={this.state.WorkTitle}
            />
            <InputField
              labelText="WORK COMPANY"
              labelTextSize={14}
              labelColor={colors.white}
              inputType="email"
              textColor={colors.white}
              borderBottomColor={colors.white}
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleWorkCompanyChange}
              showCheckmark={validWorkCompany}
              value={this.state.WorkCompany}
            />

            <Text style={{ fontWeight: '700', color: 'white', fontSize: 14 , marginBottom: 20,}}>
              Work Period
            </Text>

            <Slider 
              value={this.state.slidervalue}
              onValueChange={this.sliderValueChange}
              minimumValue={0}
              maximumValue={7}
              thumbTintColor={colors.themeblue}
              maximumTrackTintColor={'white'}
              minimumTrackTintColor={colors.themeblue}
              step={1}
              style={{marginTop:50,marginLeft:30, marginRight:30,}}/>

            <Text style={{ marginBottom: 20, color: 'white', textAlign:'center', alignSelf:'center', marginTop:20, paddingBottom: 20, fontSize: 15}}>
              {this.state.workperiodtxt}
            </Text>


         
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton.bind(this, 
              this.props.navigation, 
              birth,)}
            disabled={this.toggleNextButtonState()}
          />
        </View>
        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />

        <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine = "These credentials don't look right."
            secondLine="Please try again."
          />
        </View>

        </ImageBackground>

      </KeyboardAvoidingView>
    );
  }
}

CreateProfileWorkExperience.propTypes = {
  logIn: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default CreateProfileWorkExperience;
