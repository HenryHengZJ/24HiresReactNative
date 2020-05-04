
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Slider,
  ScrollView,
  TouchableHighlight,
  BackHandler,
  Animated,
  Platform,
  StatusBar,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  TextInput, 
  Alert,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import transparentHeaderStyle from '../styles/navigation';
import NavBarButton from '../components/buttons/NavBarButton';
import * as Animatable from 'react-native-animatable';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import colors from '../styles/colors';
import Touchable from 'react-native-platform-touchable';
import RadioInput from '../components/form/RadioInput';
import RNPickerSelect from 'react-native-picker-select';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Calendar from 'react-native-calendar-select';
import Moment from 'moment';

const closeIcon = require('../img/close-button_black.png');
const chevRightIcon = require('../img/right_chevron.png');
const dropdownIcon = require('../img/dropdown_black.png');


const navigateToTabsAction = NavigationActions.navigate({
  routeName: 'LoggedIn',
});

const SLIDE_IN_DOWN_KEYFRAMES = {
  from: { translateY: -50 },
  to: { translateY: 0 },
};

const SLIDE_IN_UP_KEYFRAMES = {
  from: { translateY: 0 },
  to: { translateY: -80 },
};

export default class FilterApplicant extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavBarButton
      handleButtonPress={() => 
        navigation.state.params.handleClearPressed()
      }
      location="right"
      color={colors.greyBlack}
      text="Clear"
    />,
    headerLeft: <NavBarButton 
      handleButtonPress={() => 
        navigation.dispatch(NavigationActions.back())
      } 
      location="left" icon={<MaterialIcon name="clear" color={colors.greyBlack} size={25} />} 
    />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });
  

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      errortype: "",
      loadingVisible: false,
      measures: 0,
      header: false,
      firstopen: true,
      scrollEnabled: true,
      category: null,
      sliderval: 0,
      worktimetxt: null,
      filterPressed: false,
    };

    this.onCategoryListClose = this.onCategoryListClose.bind(this);
    
  }

  componentWillMount() {

    const { navigation } = this.props;

    const category = navigation.getParam('category');
    const worktime = navigation.getParam('worktime');

    var sliderval;
    if (worktime === "All") {
      sliderval = 0
    }
    else if (worktime === "Less than a month") {
      sliderval = 1
    }
    else if (worktime === "Less than 3 months") {
      sliderval = 2
    }
    else if (worktime === "Less than 6 months") {
      sliderval = 3
    }
    else if (worktime === "Less than 1 year") {
      sliderval = 4
    }
    else if (worktime === "2 years +") {
      sliderval = 5
    }
    else if (worktime === "5 years +") {
      sliderval = 6
    }
    else if (worktime === "10 years +") {
      sliderval = 7
    }
    else if (worktime === "20 years +") {
      sliderval = 8
    }

    this.setState({

        category: category ,
        worktimetxt: worktime === "" || !worktime ? "All" : worktime,
        sliderval: sliderval,
    })
    
  }

  componentWillUnmount() {

    const { navigation } = this.props;
    navigation.state.params.onFilterClose(
      this.state.filterPressed,
      this.state.category,  
      this.state.worktimetxt,
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleClearPressed: this.clearFilter,
    })
    
  }

  clearFilter = () => {

    this.setState({
      category: null,
      worktimetxt: "All",
      sliderval: 0,
    })

  }

 
  disableScroll = () => this.setState({ scrollEnabled: false });


  onCategoryPressed = (navigation) => {
    navigation.navigate('CategoryContainer', { onCategoryListClose: this.onCategoryListClose });
  }

  onCategoryListClose( categoryName, categorySelected) {
 
    if (categorySelected) {
        this.setState({
          category: categoryName,
        })  
    } 
  }

  sliderValueChange = (values) => {
    var periodtxt;
    if (values === 0) {
      periodtxt = "All"
    }
    else if (values === 1) {
      periodtxt = "Less than a month"
    }
    else if (values === 2) {
      periodtxt = "Less than 3 months"
    }
    else if (values === 3) {
      periodtxt = "Less than 6 months"
    }
    else if (values === 4) {
      periodtxt = "Less than 1 year"
    }
    else if (values === 5) {
      periodtxt = "2 years +"
    }
    else if (values === 6) {
      periodtxt = "5 years +"
    }
    else if (values === 7) {
      periodtxt = "10 years +"
    }
    else if (values === 8) {
      periodtxt = "20 years +"
    }

    this.setState({
      worktimetxt: periodtxt,
      sliderval: values,
    })
  }

  renderExperience(sliderval, worktimetxt) {
    return (
      <View>
         <Slider 
            value={sliderval}
            onValueChange={this.sliderValueChange}
            minimumValue={0}
            maximumValue={7}
            thumbTintColor={'green'}
            maximumTrackTintColor={'grey'}
            step={1}
            style={{marginTop:50,marginLeft:30, marginRight:30,}}/>

          <Text style={{ color: colors.greyBlack, textAlign:'center', alignSelf:'center', marginTop:20, marginLeft:30, marginRight:30, paddingBottom: 10, fontSize: 15}}>
            {worktimetxt}
          </Text>

      </View>
    )
  }

  renderCategory(category) {
    return (
      <TouchableOpacity style={{ margin:20,}}
        onPress={this.onCategoryPressed.bind(this, this.props.navigation)}
      >
        <View style={{ flex:1,  paddingRight:10, paddingLeft:0, paddingTop:10, paddingBottom: 10, flexDirection: 'row'}}>
        
          {category ? 
           <Text style={{  color: colors.priceblue, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 17}}>
                {category}
          </Text>
          :
          <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30, marginHorizontal: 10, fontSize: 17, opacity: 0.8}}>
                Pick category here
          </Text>
          }
          
 
          <Image
            style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5,}}
            source={chevRightIcon}
          />
  
        </View>
      </TouchableOpacity>
    )
  }


  handleScroll(event){
    if (event.nativeEvent.contentOffset.y > this.state.measures) {
      this.setState({
        header: true,
        firstopen: false
      })
    }
    else {
      this.setState({
        header: false,
      })
    }

  }

  renderCloseButton() {
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
              height: 15,
              width: 15,
            }}
            source={closeIcon}
          />
        
        
        </TouchableOpacity>
    )
  }

  renderClearButton() {
    return (
      <TouchableOpacity
          style={{ 
            position:'absolute', 
            right:10, 
            top:20, 
            zIndex:10,
            padding:10, 
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'transparent'}}
            onPress={this.clearFilter.bind(this)}
        >

          <Text style={{ paddingTop:5, textAlign:'center', alignSelf:'center', justifyContent:'center',fontWeight: '500', color: colors.greyBlack, fontSize: 15}}>
            Clear
          </Text>

        </TouchableOpacity>
    )
  }
  
 
  render() {

    return (
      <View style={{ backgroundColor: 'white', flex:1,}}>

        <ScrollView 
          scrollEnabled={this.state.scrollEnabled}
          scrollEventThrottle={16}
          onScroll={this.handleScroll.bind(this)}
          showsVerticalScrollIndicator={false} 
          style={{backgroundColor:'transparent', flex:1,  marginTop: 60,}}>

            <Text style={{ color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, paddingBottom: 20, fontSize: 24}}>
              Filter Applicants
            </Text>

            <View 
              style={{ paddingTop:20,  marginLeft:30, marginRight:30}}
              onLayout={({nativeEvent}) => {
                this.setState({
                  measures: nativeEvent.layout.y
                })
              }}>

              <Text style={{ color: colors.greyBlack, fontWeight: '500', fontSize: 17}}>
                Category
              </Text>

            </View>

            {this.renderCategory(this.state.category)}

            <View 
              style={{ backgroundColor: '#dddddd', marginLeft: 20, marginRight: 20, height:1, width: '90%'}}/>
            
            <Text style={{  color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:30, paddingRight:20, fontSize: 17}}>
              Experiences
            </Text>

            {this.renderExperience(this.state.sliderval, this.state.worktimetxt)}

            <View 
              style={{ backgroundColor: 'white', marginLeft: 20, marginTop:20, marginRight: 20, height:1, width: '90%'}}/>

        </ScrollView>

        <View style={styles.footer}>
            <Touchable 
                style={styles.applyFilterButton}
                onPress={() => 
                  this.setState({
                    filterPressed: true,
                  }, () => {
                    setTimeout(function () {
                      this.props.navigation.goBack()
                    }.bind(this), 50)
                  })
                }
                background={Touchable.Ripple(colors.ripplegray)}>
            
                <Text style={styles.applyFilterButtonText}>
                    Apply Filter
                </Text>

            </Touchable>
        </View>

      </View >

    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: colors.themeblue,
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:5,
    height:70,
    borderBottomWidth: 1,
    borderColor: "#CED0CE",
  },
  headerText: {
    color: colors.greyBlack,
    fontSize: 20,
  },
  applyFilterButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: colors.themeblue,
  },
  applyFilterButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: 80,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray05,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

FilterApplicant.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};


