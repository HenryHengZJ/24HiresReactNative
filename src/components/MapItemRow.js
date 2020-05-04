import React from "react";
import { View, Text ,Platform, Image, Dimensions, TouchableOpacity,TouchableHighlight,TouchableNativeFeedback, StyleSheet} from "react-native";
import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Touchable from 'react-native-platform-touchable';
import PropTypes from 'prop-types';


class MapItemRow extends React.PureComponent {

    renderCurrencyRateText() {
        return (
            <Text style={{ fontSize: 13, color: colors.themeblue, fontWeight: 'bold' }}>{this.props.itemlist.currency} / month </Text>
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
            <View style={{ marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                <Image
                    style={{ width:70, height: 70, borderRadius: 70/2, resizeMode: 'cover' }}
                    source={{uri: this.props.itemlist.postimage}} />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start',  paddingLeft: 10, paddingTop: 3, paddingBottom: 7 }}>

                <View style={{ flexDirection: 'row'}}>

                    <View style={{ flex: 1, flexDirection: 'column'}}>

                        <Text style={{ fontSize: 12, color: colors.darkOrange, fontWeight: '500' }}>{this.props.itemlist.category.toUpperCase()}</Text>
                        <Text numberOfLines={1} style={{ paddingTop: 5, color: '#454545', fontSize: 15, fontWeight: 'bold' }}>{this.props.itemlist.title}</Text>

                    </View>

                     <View style={{ marginLeft: 10, marginRight: 30, alignItems: 'flex-end', paddingBottom: 7 }}>
                        <Text style={{ fontSize: 18, color: colors.priceblue, fontWeight: 'bold' }}>
                            {this.props.itemlist.wages === 0 ? "N/A" : this.props.itemlist.wages }</Text>
                        {this.props.itemlist.wages === 0 ? this.renderEmptyCurrencyRateText() : this.renderCurrencyRateText()}
                    </View>


                </View>

                <View style={{ flexDirection: 'row'}}>

                    <Text numberOfLines={2} style={{flex: 1, marginRight: 10, color: colors.gray04, fontSize: 15 }}>{this.props.itemlist.fulladdress}</Text>

                    <View style={{ marginRight: 30, height: 25, width: 25, borderRadius: 25/2, backgroundColor: colors.darkOrange, alignItems: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                   
                        <Text style={{ color: 'white', alignSelf: 'center', justifyContent: 'center', fontSize: 15 }}>{this.props.index}</Text>

                    </View>

                </View>

            </View>
           

        </View>
        
        </Touchable>
     
      )
    }
  }

MapItemRow.propTypes = {
    handleOnPress: PropTypes.func,
};


export default MapItemRow;