import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let subscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Obtenir la position actuelle une fois au début
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      // Abonnez-vous aux mises à jour de la position
      subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Mettre à jour toutes les 5 secondes
          distanceInterval: 7, // Mettre à jour si l'utilisateur se déplace de plus de  mètres
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    })();

    // Cleanup the subscription on unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={false} // Désactiver l'indicateur de position par défaut
        rotateEnabled={false}
        
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        >
          <Image
            source={require('./assets/taxi-rider-1.png')}
            style={styles.markerImage}
          />
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default App;
