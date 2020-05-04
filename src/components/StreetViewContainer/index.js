import {
	View,
  } from 'react-native';
import React, { Component } from 'react';
import StreetView from 'react-native-streetview';
import styles from "./StreetViewContainerStyles"

export const StreetViewContainer = ({region})=>{

	return (
		<View style={styles.container}>

			<StreetView
				style={styles.map}
				allGesturesEnabled={true}
				coordinate={region}
			/>

		</View>
	)
}

export default StreetViewContainer;

