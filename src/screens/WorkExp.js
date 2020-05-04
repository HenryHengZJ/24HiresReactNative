
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { 
  KeyboardAvoidingView ,
  TextInput, 
  Button, 
  Slider,
  ScrollView, 
  Image,
  Text, 
  View, 
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  TouchableHighlight,
  StyleSheet,
  Platform,
  Keyboard,
  } 
from 'react-native';
import colors from '../styles/colors';
import { NavigationActions } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';


const closeIcon = require('../img/close-button_black.png');

export default class WorkExp extends Component {

  static navigationOptions = ({ navigation }) => ({
    header:null,
    
  });
  

  constructor(props) {
    super(props);
    this.state = {
      buttontxt: '',
      worktitletxt: null,
      workcompanytxt: null,
      worktimetxt: null,
      workcategory: null,
      addnew: null,
      userid: null,
      sliderval: 0,
      index: null,
    };

    this.workexpPressed = false;
    this.onCategoryListClose = this.onCategoryListClose.bind(this);
  
  }

  componentWillMount() {
    
    const { navigation } = this.props;

    const worktitle = navigation.getParam('worktitle');
    const workcompany = navigation.getParam('workcompany');
    const worktime = navigation.getParam('worktime');
    const workcategory = navigation.getParam('workcategory');
    const addnew = navigation.getParam('addnew');
    const userid = navigation.getParam('userid');
    const index = navigation.getParam('index');

    var sliderval;
    if (worktime === "Less than a month") {
      sliderval = 0
    }
    else if (worktime === "Less than 3 months") {
      sliderval = 1
    }
    else if (worktime === "Less than 6 months") {
      sliderval = 2
    }
    else if (worktime === "Less than 1 year") {
      sliderval = 3
    }
    else if (worktime === "2 years +") {
      sliderval = 4
    }
    else if (worktime === "5 years +") {
      sliderval = 5
    }
    else if (worktime === "10 years +") {
      sliderval = 6
    }
    else if (worktime === "20 years +") {
      sliderval = 7
    }

    this.setState({
      userid,
      worktitletxt: worktitle,
      workcompanytxt: workcompany,
      worktimetxt: worktime === "" ? "Less than a month" : worktime,
      workcategory: workcategory,
      addnew,
      buttontxt: addnew? "Add Work Experience" : "Save Work Experience",
      sliderval,
      index,
    });

  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.state.params.onWorkExpClose(this.state.index, this.state.addnew, this.state.worktitletxt, this.state.workcompanytxt, this.state.worktimetxt, this.state.workcategory, this.workexpPressed);
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
      worktimetxt: periodtxt,
      sliderval: values,
    })
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
              {
                Keyboard.dismiss(),
                this.props.navigation.dispatch(NavigationActions.back())
              }
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

  onWorkPressed = (navigation) => {
    Keyboard.dismiss();
    this.workexpPressed = true,
    navigation.goBack();
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

    const offset = (Platform.OS === 'android') ? -180 : 0;

    return (
      <KeyboardAvoidingView keyboardVerticalOffset={offset} behavior="padding" enabled style={{backgroundColor:'white', display: 'flex', flex:1}}>

        {this.renderCloseButton()}
      
        <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} style={{backgroundColor:'white', flex:1}}>

            <Text style={{ color: colors.greyBlack, paddingTop:80, fontWeight: '500', paddingLeft:30, paddingRight:30, paddingBottom: 20, fontSize: 24}}>
              Work Experience
            </Text>

            

            <Text style={{  color: colors.greyBlack, marginTop:40, fontWeight: '500', paddingLeft:30, paddingRight:30, fontSize: 17}}>
              Work Category
            </Text>

            <View
            style={{marginTop:10, paddingLeft:35, paddingRight:35, flexDirection: 'row'}}>

              <TouchableOpacity 
                style={{  flex:1, marginVertical:20 , borderBottomColor: 'rgba(0,0,0,0.1)', borderBottomWidth: 1,}}
                onPress={this.onCategoryPressed.bind(this)}
              >

                <Text style={{ fontWeight: '400', color: colors.greyBlack, fontSize: 15, paddingBottom: 10, lineHeight: 25,}}>
                  {this.state.workcategory}
                </Text>

              </TouchableOpacity>

            </View>

            <Text style={{  color: colors.greyBlack, marginTop:15, fontWeight: '500', paddingLeft:30, paddingRight:30, fontSize: 17}}>
              Work Title
            </Text>

            <TextInput 
              numberOfLines={1} 
              underlineColorAndroid='rgba(0,0,0,0.1)'  
              onChangeText={(value) => this.setState({worktitletxt: value})}
              value={this.state.worktitletxt}
              style={{ color: colors.greyBlack, marginTop:20, marginLeft:30, marginRight:30, paddingBottom: 10, fontSize: 15}}>
            </TextInput>

            <Text style={{  color: colors.greyBlack, marginTop:20, fontWeight: '500', paddingLeft:30, paddingRight:30, fontSize: 17}}>
              Work Company
            </Text>

            <TextInput 
              numberOfLines={1}  
              underlineColorAndroid='rgba(0,0,0,0.1)'  
              onChangeText={(value) => this.setState({workcompanytxt: value})}
              value={this.state.workcompanytxt}
              style={{  color: colors.greyBlack, marginTop:20, marginLeft:30, marginRight:30, paddingBottom: 10, fontSize: 15}}>
            </TextInput>

            <Text style={{ color: colors.greyBlack, marginTop:20, fontWeight: '500', paddingLeft:30, paddingRight:30, fontSize: 17}}>
              Work Period
            </Text>

            <Slider 
              value={this.state.sliderval}
              onValueChange={this.sliderValueChange}
              minimumValue={0}
              maximumValue={7}
              thumbTintColor={'green'}
              maximumTrackTintColor={'grey'}
              step={1}
              style={{marginTop:50,marginLeft:30, marginRight:30,}}/>

            <Text style={{ color: colors.greyBlack, textAlign:'center', alignSelf:'center', marginTop:20, marginLeft:30, marginRight:30, paddingBottom: 10, fontSize: 15}}>
              {this.state.worktimetxt}
            </Text>

        </ScrollView>

        <View 
          style={{ backgroundColor: colors.shadowgray, height:1, width: '100%'}}/>

        <View style={styles.footer}>
            <Touchable 
                background={Touchable.Ripple(colors.ripplegray)}   
                style={styles.applyButton}
                onPress={this.onWorkPressed.bind(this, this.props.navigation)}>
            
                <Text style={styles.ButtonText}>
                    {this.state.buttontxt}
                </Text>

            </Touchable>
        </View>

     
        

      </KeyboardAvoidingView >

    )
  }
}

const styles = StyleSheet.create({
  applyButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: '#67B8ED',
  },
  ButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: 80,
    bottom: 0,
    borderTopWidth: 0,
    borderTopColor: '#dadada',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor:'white',
  },
});

WorkExp.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};


