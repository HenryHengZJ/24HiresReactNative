import {
	View,
	Image,
	Text,
	Button,
	ImageBackground,
  } from 'react-native';
import React, { Component } from 'react';
import MapView from "react-native-maps";
import styles from "./MapContainerStyles"

const markerIcon = require('../../img/mapview_marker.png');

/*<View style={{alignItems:'center', alignSelf: 'center', width: 20, height: 20,}}>

						<Image
							style={{ height: 15, width: 15}}
							source={markerIcon}
						/>

						<Text style={{
							color: 'black',
							fontWeight: 'bold',
							textAlign: 'center',
							fontSize: 15,
							}}>1</Text>

					</View>*/
					

export const MapContainer = ({region})=>{

	return (
		<View style={styles.container}>
			<MapView
				provider = {MapView.PROVIDER_GOOGLE}
				style = {styles.map}
				region = {region}
			>
				<MapView.Marker
					
					coordinate={region}
					>

					<View 
					style={{width: 30,
							height: 30,
							alignItems:'center',
							alignSelf:'center',
							justifyContent:'center',
							borderRadius: 30 / 2,
							backgroundColor: 'white'}}>
						<Text 	
						style={{color: 'black',
								fontWeight: 'bold',
								textAlign: 'center',
								fontSize: 20,
								}}>1</Text>
						
					</View>

					<MapView.Callout>
						<View>
						<Button title='Click Me!' onPress={() => console.log('Clicked')} />
						</View>
					</MapView.Callout>
					
				</MapView.Marker>
			</MapView>
			
		</View>
	)
}

export default MapContainer;