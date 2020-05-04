


import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
} from 'react-native';
import moment from 'moment'
import colors from '../styles/colors';
import RadioInput from './form/RadioInput';
import { Calendar } from 'react-native-calendars'; 

const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(365, 'days').format(_format)

const finalformat = 'DD MMM YY';
const finalMarkedDatesFormat = 'YYYYMMDD'
const finalStartingDateFormat = 'YYMMDD'

export default class CalendarViewModal extends Component {

  initialState = {
      [_today]: {selected: true, startingDay: true, endingDay: true, color: colors.themeblue, textColor: 'white'}
  }
  
  constructor() {
    super();

    this.state = {
      _markedDates: this.initialState,
      firstdate: _today,
      finaldate: _today,
      markedStyle: 'single',
      finalmarkedDates: [parseInt(moment(_today).format(finalMarkedDatesFormat))],
    }
  }

  selectedSinglePressed = (handleOnClosePress) => {
    
    const {_markedDates, finalmarkedDates} = this.state;
    var finaldate = '';
    for (var i=0; i < finalmarkedDates.length; i++) { 
      finaldate = moment(''+finalmarkedDates[i]).format(finalformat);
    }
    this.setState({
      finaldate,
    },() => {
      var finalstartdate = moment(''+finalmarkedDates[0]).format(finalStartingDateFormat);
      handleOnClosePress(finaldate, finalstartdate)
    })

  }

  selectedMultiplePressed = (handleOnClosePress) => {

    const {_markedDates, finalmarkedDates} = this.state;
    var finaldate = [];
    var countingdate;

    for (var i=0; i < finalmarkedDates.length; i++) {

      var convertedday = (''+finalmarkedDates[i]).slice(6,8);
      var convertedmonth = (''+finalmarkedDates[i]).slice(4,6); 
      var convertedpreviousmonth = (i-1) <  0 ? '' : (''+finalmarkedDates[i-1]).slice(4,6);
      var convertednextmonth = (i+1) >  finalmarkedDates.length ? '' : (''+finalmarkedDates[i+1]).slice(4,6); 
      
      if (convertedmonth === convertednextmonth) {
          countingdate = countingdate ? countingdate + convertedday + " / " : convertedday + " / ";
      }
      else {
          countingdate = countingdate ? countingdate + moment(''+finalmarkedDates[i]).format(finalformat) : moment(''+finalmarkedDates[i]).format(finalformat);
          finaldate = [...finaldate, countingdate];
          countingdate = '';
      }
    }

    this.setState({
      finaldate: finaldate.join("\n"),
    },() => {
      var finalstartdate = moment(''+finalmarkedDates[0]).format(finalStartingDateFormat);
      handleOnClosePress(this.state.finaldate, finalstartdate)
    })

  }

  selectedRangePressed = (handleOnClosePress) => {

    const {_markedDates, finalmarkedDates} = this.state;
   
    var startingfinaldate;
    var endingfinaldate;
    var finaldate;
    
    startingfinaldate = finalmarkedDates[0];
    
    endingfinaldate = finalmarkedDates[ finalmarkedDates.length - 1];
  
    if (startingfinaldate !== endingfinaldate) {
      finaldate = moment(''+startingfinaldate).format(finalformat) + ' - ' + moment(''+endingfinaldate).format(finalformat);
    }
    else {
      finaldate = moment(''+startingfinaldate).format(finalformat);
    }

    this.setState({
      finaldate,
    },() => {
      var finalstartdate = moment(''+finalmarkedDates[0]).format(finalStartingDateFormat);
      handleOnClosePress(finaldate, finalstartdate)
    })

  }


  createDateString(y,m,d){
      var dateString = y+"-";
      if(m <10){
          dateString += "0"+m+"-";
      }else{
          dateString += m+"-";
      }
      if(d<10){
          dateString += "0"+d;
      }else{
          dateString += d;
      }
      return dateString;
  }

  onSingleDaySelect = (day) => {

    const _selectedDay = moment(day.dateString).format(_format);
    const _selectedFinalDay = moment(day.dateString).format(finalMarkedDatesFormat);
    var updatedFinalMarkedDates; 
    let selected = true;
    if (this.state._markedDates[_selectedDay]) {
      // Already in marked dates, so reverse current marked state
      selected = !this.state._markedDates[_selectedDay].selected;
      updatedFinalMarkedDates = [];
      
    }
    else {
      updatedFinalMarkedDates = [parseInt(_selectedFinalDay)];
    }
    
    // Create a new object using object property spread since it should be immutable
    // Reading: https://davidwalsh.name/merge-objects
    const updatedMarkedDates = {...{ [_selectedDay]: { selected } } }
    
    // Triggers component to render again, picking up the new state
    this.setState({ 
      _markedDates: updatedMarkedDates,
      finalmarkedDates: updatedFinalMarkedDates.sort((a, b) => a - b),
    })
    
  }

  onMultipleDaySelect = (day) => {

    const _selectedDay = moment(day.dateString).format(_format);
    const _selectedFinalDay = moment(day.dateString).format(finalMarkedDatesFormat);
    var updatedFinalMarkedDates = [...this.state.finalmarkedDates];
    let selected = true;
    if (this.state._markedDates[_selectedDay]) {
      // Already in marked dates, so reverse current marked state
      selected = !this.state._markedDates[_selectedDay].selected;
      while (updatedFinalMarkedDates.indexOf(parseInt(_selectedFinalDay)) !== -1) {
        updatedFinalMarkedDates.splice(updatedFinalMarkedDates.indexOf(parseInt(_selectedFinalDay)), 1);
      }
    }
    else {
      updatedFinalMarkedDates = [...this.state.finalmarkedDates, parseInt(_selectedFinalDay)];
    }
    
    // Create a new object using object property spread since it should be immutable
    // Reading: https://davidwalsh.name/merge-objects
    const updatedMarkedDates = {...this.state._markedDates, ...{ [_selectedDay]: { selected } } };

    // Triggers component to render again, picking up the new state
    this.setState({ 
      _markedDates: updatedMarkedDates,
      finalmarkedDates: updatedFinalMarkedDates.sort((a, b) => a - b),
    });

  }

  onRangeDaySelect = (day) => {
    console.log('day.dateString'+day.dateString)
    const _selectedDay = moment(day.dateString).format(_format);
    const _selectedFinalDay = moment(day.dateString).format(finalMarkedDatesFormat);
    const _oldfirstDay = this.state.firstdate;
    const _oldfirstFinalDay = moment(_oldfirstDay).format(finalMarkedDatesFormat);
    
    var startDate = new Date(_oldfirstDay)
    var lastDate = new Date(_selectedDay);
    
    var updatedMarkedDates;
    var updatedFinalMarkedDates;
    var newfirstdate;
    var newselecteddata;

    if (this.state._markedDates[_selectedDay] ) {
      // Already in marked dates, so reverse current marked state
      newselecteddata = {
          selected: true, startingDay: true, endingDay: true, color: colors.themeblue, textColor: 'white'
      }
      updatedMarkedDates= {
          [_selectedDay]: newselecteddata
      }
      newfirstdate = _selectedDay;

      updatedFinalMarkedDates = [parseInt(_selectedFinalDay)];
    }
    else {

      if (Object.keys(this.state._markedDates).length > 1) {

        newselecteddata = {
          selected: true, startingDay: true, endingDay: true, color: colors.themeblue, textColor: 'white'
        }
        updatedMarkedDates= {
            [_selectedDay]: newselecteddata
        }
        newfirstdate = _selectedDay;

        updatedFinalMarkedDates = [parseInt(_selectedFinalDay)];

      }
      else {

        if (lastDate.getTime() < startDate.getTime())  {

          newselecteddata = {
            selected: true, startingDay: true, endingDay: true, color: colors.themeblue, textColor: 'white'
          }
          updatedMarkedDates= {
              [_selectedDay]: newselecteddata
          }
          newfirstdate = _selectedDay;

          updatedFinalMarkedDates = [parseInt(_selectedFinalDay)];

        }
        else {       
          var startingdata = {
              selected: true, startingDay: true, color: colors.themeblue, textColor: 'white'
          }
          var endingdata = {
              selected: true, endingDay: true, color: colors.themeblue, textColor: 'white'
          }
          
          updatedMarkedDates= {
              [_oldfirstDay]: startingdata,
              [_selectedDay]: endingdata
          }

          updatedFinalMarkedDates = [parseInt(_oldfirstFinalDay),parseInt(_selectedFinalDay)];

          while(startDate.getTime() < lastDate.getTime()) {
            startDate.setTime( startDate.getTime() + 24 * 60 * 60 * 1000 ) // basically day + 1
            var selecteddates = this.createDateString(startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate());
            var inbetweendata = {
              [selecteddates]: { selected: true, color: colors.themeblue, textColor: 'white'}
            }
            if (selecteddates !== _selectedDay) {
                updatedMarkedDates = { ...updatedMarkedDates, ...inbetweendata };
                updatedFinalMarkedDates = [...updatedFinalMarkedDates, parseInt(moment(selecteddates).format(finalMarkedDatesFormat))];
            }    
          }
        }
      }
    }
    
    this.setState({ 
      _markedDates: updatedMarkedDates,
      finalmarkedDates: updatedFinalMarkedDates.sort((a, b) => a - b),
      firstdate: newfirstdate,
    });
  }

  onSinglePickPressed = () => {
    this.setState({ 
      markedStyle: 'single',
      _markedDates: this.initialState,
      finalmarkedDates: [parseInt(moment(_today).format(finalMarkedDatesFormat))],
    });
  }

  onMultiplePickPressed = () => {
    this.setState({ 
      markedStyle: 'multiple',
      _markedDates: this.initialState,
      finalmarkedDates: [parseInt(moment(_today).format(finalMarkedDatesFormat))],
    });
  }

  onRangePickPressed = () => {
    this.setState({ 
      markedStyle: 'period',
      _markedDates: this.initialState,
      finalmarkedDates: [parseInt(moment(_today).format(finalMarkedDatesFormat))],
    });
  }

  render() {
    const { animationType, calendarmodalVisible, handleOnPress, handleOnClosePress } = this.props;
   
    return (
      <Modal
        animationType={animationType}
        transparent
        visible={calendarmodalVisible}
        onRequestClose={handleOnClosePress}
      >

      <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/>
 
      <View style={styles.wrapper}>

        <TouchableWithoutFeedback
          onPress={handleOnClosePress}>

          <View style={styles.touchable}/>

        </TouchableWithoutFeedback>

        <View style={styles.loaderContainer}>

          <Calendar
            // we use moment.js to give the minimum and maximum dates.
            style={{height:300}}
            minDate={_today}
            maxDate={_maxDate}
            onDayPress={this.state.markedStyle === 'period' ? this.onRangeDaySelect : this.state.markedStyle === 'multiple' ? this.onMultipleDaySelect : this.onSingleDaySelect}
            markedDates={this.state._markedDates}
            markingType={this.state.markedStyle}
          />

          <View style={{flex : 1,marginLeft: 20, marginTop: 10, marginBottom: 20, flexDirection: 'row', justifyContent:'center', alignSelf: 'center', alignItems: 'center'}}>

            <TouchableOpacity 
              onPress={this.onSinglePickPressed.bind(this)}>

              <RadioInput
                backgroundColor={colors.gray07}
                borderColor={colors.gray05}
                selectedBackgroundColor={colors.green01}
                selectedBorderColor={colors.green01}
                iconColor={colors.white}
                selected={this.state.markedStyle === 'single'}
              />

            </TouchableOpacity>
        
            <Text style={{ marginHorizontal: 15, alignSelf: 'center', fontSize: 15, color: colors.greyBlack,}}>
              Single
            </Text>

            <TouchableOpacity 
              onPress={this.onMultiplePickPressed.bind(this)}>

              <RadioInput
                backgroundColor={colors.gray07}
                borderColor={colors.gray05}
                selectedBackgroundColor={colors.green01}
                selectedBorderColor={colors.green01}
                iconColor={colors.white}
                selected={this.state.markedStyle === 'multiple'}
              />

            </TouchableOpacity>
        
            <Text style={{ marginHorizontal: 15, alignSelf: 'center', fontSize: 15, color: colors.greyBlack,}}>
              Multiple
            </Text>

            <TouchableOpacity 
              onPress={this.onRangePickPressed.bind(this)}>

              <RadioInput
                backgroundColor={colors.gray07}
                borderColor={colors.gray05}
                selectedBackgroundColor={colors.green01}
                selectedBorderColor={colors.green01}
                iconColor={colors.white}
                selected={this.state.markedStyle === 'period'}
              />

            </TouchableOpacity>
        
            <Text style={{ marginHorizontal: 15, alignSelf: 'center', fontSize: 15, color: colors.greyBlack,}}>
              Range
            </Text>

          </View>

          <View style={styles.errorMessageContainer}>

            <TouchableOpacity
              style={{ 
                  borderLeftWidth: 0, 
                  borderRightWidth: 0, 
                  borderTopWidth: 0,
                  borderBottomWidth: 1,
                  borderColor: '#ddd', 
                  borderRadius:5,
                  shadowColor: '#000',
                  shadowOffset: {
                      width: 1,
                      height: 1
                  },
                  height: 50,
                  shadowOpacity: 0.3,
                  flex:1,
                  marginHorizontal: 7.5,
                  justifyContent:'center',
                  elevation:3,
                  backgroundColor: colors.themeblue}}
                  onPress={this.state.markedStyle === 'period' ? this.selectedRangePressed.bind(this, handleOnClosePress) : this.state.markedStyle === 'multiple' ? this.selectedMultiplePressed.bind(this, handleOnClosePress) : this.selectedSinglePressed.bind(this, handleOnClosePress) }
              >

                <View style={{ alignItems:'center', justifyContent:'center'}}>

                  <Text style={{ color: 'white', fontWeight: '500', fontSize: 15}}>
                        Select
                  </Text>

                </View>

            </TouchableOpacity>

          </View>

        </View>

        </View>
        
      </Modal>
    );
  }
}

CalendarViewModal.propTypes = {
  animationType: PropTypes.string.isRequired,
  calendarmodalVisible: PropTypes.bool.isRequired,
  handleOnPress: PropTypes.func,
  handleOnClosePress: PropTypes.func,
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    backgroundColor: colors.white,
    width: '100%',
    height: '68%',
  },
  touchable : {
    width: '100%',
    height: '32%',
  },
  errorMessageContainer: {
    flexDirection: 'row',
    flex: 1,
    padding: 15,    
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    
  },
  loaderImage: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginTop: 20,
    alignSelf: 'center',
  },
});
