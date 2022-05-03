import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import MapView, {LatLng, Marker, Region} from 'react-native-maps';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
import Svg, {Circle} from 'react-native-svg';

const initialRegion: Region = {
  latitude: 10,
  longitude: 10,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

const markersCoords: LatLng[] = [];
const nMarkers = 50;
while (markersCoords.length < nMarkers) {
  markersCoords.push({
    latitude:
      initialRegion.latitude +
      Math.random() * 2 * (Math.random() > 0.5 ? -1 : 1),
    longitude:
      initialRegion.longitude +
      Math.random() * 2 * (Math.random() > 0.5 ? -1 : 1),
  });
}

const pin = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
};

const Map = () => {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [asImage, setAsImage] = useState<boolean>(false);
  const [asCustomView, setAsCustomView] = useState<boolean>(true);

  const showMarkers = region.latitudeDelta < 10; // isRegionSmallEnough(region);

  return (
    <View style={styles.mapHolder}>
      <MapView
        style={styles.mapView}
        zoomEnabled={true}
        initialRegion={{...initialRegion, latitudeDelta: 6, longitudeDelta: 6}}
        zoomControlEnabled={false}
        showsPointsOfInterest={true}
        onRegionChangeComplete={reg => {
          setRegion(reg);
        }}>
        {showMarkers &&
          markersCoords.map((c, index) => {
            return (
              <Marker
                coordinate={c}
                key={`${index}_${asImage}_${asCustomView}`}
                image={asImage ? pin : undefined}>
                {asCustomView && (
                  <Svg height="32" width="32" viewBox="0 0 100 100">
                    <Circle
                      cx="16"
                      cy="16"
                      r="16"
                      stroke="black"
                      strokeWidth="2"
                      fill="white"
                    />
                  </Svg>
                )}
              </Marker>
            );
          })}
      </MapView>
      {showMarkers && (
        <Animated.View
          style={styles.animation}
          entering={BounceIn}
          exiting={BounceOut}>
          <Text style={styles.animationText}>
            Useless animation to trigger the use of reanimated!
          </Text>
        </Animated.View>
      )}
      <View style={styles.overlay}>
        <Text style={styles.text}>
          {showMarkers
            ? 'Zoomed in enough, will show markers'
            : 'Need to zoom in more to show markers, no markers should be visible now.'}
        </Text>
        <View style={styles.buttons}>
          <Button
            color={!asImage && !asCustomView ? '#000' : '#666'}
            onPress={() => {
              setAsImage(false);
              setAsCustomView(false);
            }}
            title={'Regular marker'}
          />
          <Button
            color={asImage ? '#000' : '#666'}
            onPress={() => {
              setAsImage(true);
              setAsCustomView(false);
            }}
            title={'Image'}
          />
          <Button
            color={asCustomView ? '#000' : '#666'}
            onPress={() => {
              setAsImage(false);
              setAsCustomView(true);
            }}
            title={'Custom View'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapHolder: {
    flexGrow: 1,
    position: 'relative',
  },
  mapView: {
    flexGrow: 1,
  },
  text: {
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    zIndex: 100,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  buttons: {
    flexDirection: 'row',
  },
  animation: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
  },
  animationText: {
    backgroundColor: 'rgba(255,255,255, 0.8)',
    padding: 8,
    margin: 32,
    textAlign: 'center',
  },
});

export default function App() {
  return <Map />;
}
