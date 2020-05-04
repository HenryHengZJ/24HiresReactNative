import React from "react";
import { View, Text ,Platform, Image, Dimensions, TouchableOpacity,TouchableHighlight,TouchableNativeFeedback, StyleSheet} from "react-native";
import colors from '../../../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Touchable from 'react-native-platform-touchable';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get('window')
const rippleColor =   'rgba(0,0,0,0.4)';

const navigateToJobDetail = NavigationActions.navigate({
    routeName: 'JobDetail',
});


class FlatListVerticalRow extends React.PureComponent {

    renderCurrencyRateText() {
        return (
            <Text style={{ fontSize: 13, color: colors.themeblue, fontWeight: 'bold' }}>{this.props.itemlist.currency} {this.props.itemlist.rate ? this.props.itemlist.rate.replace(/per/, '/') : null} </Text>
        );
    };

    renderEmptyCurrencyRateText() {
        return (
            <Text style={{ fontSize: 13, color: colors.themeblue, fontWeight: 'bold' }}> </Text>
        );
    };

    render() {

        const {
            handleOnPress,
        } = this.props;
       
      return (

        <Touchable 
          delayPressIn = {5000}
          onPress={handleOnPress}
          background={Touchable.Ripple(colors.ripplegray)}>
     
        <View style={{ marginLeft: 10, marginTop: 10, marginBottom: 20, flexDirection: 'row', width: '100%', }}>
            <View style={{  width:60, height: 60, marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                <Image
                    style={{ width:40, height: 40, }}
                    source={{uri: this.props.itemlist.categoryimage}} />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start',  paddingLeft: 10, paddingTop: 3, paddingBottom: 7 }}>

                <View style={{ flexDirection: 'row'}}>

                    <View style={{ flex: 1, flexDirection: 'column'}}>

                        <Text style={{ fontSize: 12, color: colors.darkOrange, fontWeight: '500' }}>{this.props.itemlist.category.toUpperCase()}</Text>
                        <Text numberOfLines={1} style={{ paddingTop: 5, color: '#454545', fontSize: 15, fontWeight: 'bold' }}>{this.props.itemlist.title}</Text>

                    </View>

                     <View style={{ marginLeft: 10, marginRight: 30, alignItems: 'flex-end', paddingBottom: 7 }}>
                        <Text style={{ fontSize: 18, color: colors.priceblue, fontWeight: 'bold' }}>
                            {!this.props.itemlist.wages || this.props.itemlist.wages === 0 ? "N/A" : this.props.itemlist.wages }</Text>
                        {!this.props.itemlist.wages || this.props.itemlist.wages === 0 ? this.renderEmptyCurrencyRateText() : this.renderCurrencyRateText()}
                    </View>


                </View>

                <Text numberOfLines={2} style={{ marginRight: 30, color: colors.gray04, fontSize: 15 }}>{this.props.itemlist.desc}</Text>

                <View style={{ marginRight: 30, paddingTop: 5, flexDirection: 'row'}}>
                    <Image  style={{ alignItems:'center', justifyContent: 'center', marginTop: 3, height: 15, width: 15 }} source={require('../../../img/event.png')}/>
                    <Text numberOfLines={1} style={{ color: colors.green02, paddingLeft: 10, paddingRight: 20, fontSize: 15 }}>
                    {!this.props.itemlist.date || this.props.itemlist.date === 'none' ? this.props.itemlist.jobtype : this.props.itemlist.date }</Text>
                </View>

                
                
            </View>
           

        </View>
        
        </Touchable>
     
      )
    }
  }

FlatListVerticalRow.propTypes = {
    handleOnPress: PropTypes.func,
};

const styles = StyleSheet.create({
    iosWrapper: {
        display: 'flex',
        marginHorizontal: 20, 
        marginBottom: 20, 
        flexDirection: 'row',
        width: width-30, 
        height: width/3 - 20 
    },
   
})

export default FlatListVerticalRow;