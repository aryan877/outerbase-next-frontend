'use client';
import useLocationStore from '@/store/LocationStore';
import { Button, Input, Stack, Text } from '@mantine/core';
import { Autocomplete, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

function GoogleMapView({ nextStep }: { nextStep: () => void }) {
  const containerStyle = {
    width: '100%',
    height: '50vh',
  };

  const inputRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { latitude, longitude, error, setLocation, address } = useLocationStore();
  const [markerPosition, setMarkerPosition] = useState({
    lat: latitude,
    lng: longitude,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMarkerPosition({
      lat: latitude as number,
      lng: longitude as number,
    });

    if (latitude !== 0 && longitude !== 0) {
      setLoading(false);
    }
  }, [latitude, longitude]);

  const handlePlaceChanged = () => {
    const place = inputRef.current?.getPlace();
    if (place) {
      setLocation(
        place.geometry?.location?.lat() as number,
        place.geometry?.location?.lng() as number,
        place.formatted_address as string
      );
    }
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    const newLat = event?.latLng?.lat();
    const newLng = event?.latLng?.lng();

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: newLat as number, lng: newLng as number } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setLocation(newLat as number, newLng as number, results[0].formatted_address);
        }
      }
    );
  };

  return (
    <div>
      <LoadScript
        libraries={['places']}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <Stack gap="md">
          <Autocomplete
            onLoad={(ref) => (inputRef.current = ref)}
            onPlaceChanged={handlePlaceChanged}
          >
            <Input.Wrapper label="Search location">
              <Input type="text" placeholder="Search Location" />
            </Input.Wrapper>
          </Autocomplete>

          {loading ? (
            <div>Locating user...</div>
          ) : (
            <div>
              <GoogleMap
                options={{
                  fullscreenControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
                center={markerPosition}
                zoom={16}
                mapContainerStyle={containerStyle}
              >
                <Marker
                  position={markerPosition}
                  title="Your Location"
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                />
              </GoogleMap>
              <Stack mt="md">
                <Text>{address}</Text>
                <Button
                  onClick={() => {
                    nextStep();
                  }}
                >
                  Confirm Location
                </Button>
              </Stack>
            </div>
          )}
        </Stack>
      </LoadScript>
    </div>
  );
}

export default GoogleMapView;
