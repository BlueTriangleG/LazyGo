import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

// Define latDataCoords type
type latDataCoords = {
  lat: number;
  long: number;
  title: string;
  description: string;
}

// Props to pass both latData and latData1
interface MapProps {
  coords: latDataCoords[]; // latData

}

const Map: React.FC<MapProps> = ({ coords }) => {
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.length > 0 ? coords[0].lat : 35.6586, // Default position
          longitude: coords.length > 0 ? coords[0].long : 139.7454,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {/* Render Markers for latData */}
        {coords.map((location, index) => (
          <Marker
            key={`latData-${index}`}
            coordinate={{ latitude: location.lat, longitude: location.long }}
            title={location.title}
            description={location.description}
            anchor={{ x: 0.5, y: 1 }} // Set anchor point to bottom center
          >
            <View style={styles.markerContainer}>
              <Image
                source={require('@/assets/images/pin.png')} // Custom marker image
                style={styles.markerImage}
              />
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}

        {/* Polyline for latData */}
        {coords.length > 1 && (
          <Polyline
            coordinates={coords.map((location) => ({
              latitude: location.lat,
              longitude: location.long,
            }))}
            strokeColor="#76c893" // Line color
            strokeWidth={3} // Line width
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImage: {
    width: 20,
    height: 20,
  },
  markerText: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    bottom: 5,
  },
});

export default Map;
