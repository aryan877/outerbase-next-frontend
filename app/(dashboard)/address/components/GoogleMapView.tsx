import useLocationStore from '@/store/LocationStore';
import { Input, Stack } from '@mantine/core';
import { Autocomplete, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect } from 'react';

function GoogleMapView() {
  const containerStyle = {
    width: '100%',
    height: '50vh', // Increased height for a better view
  };

  const { getLocation, latitude, longitude, error } = useLocationStore();

  useEffect(() => {
    getLocation();
  }, []);

  // Convert user's location into LatLngLiteral format
  const userLocation = {
    lat: latitude as number,
    lng: longitude as number,
  };

  return (
    <div>
      <LoadScript
        libraries={['places']}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <Stack gap="md">
          <Autocomplete>
            <Input.Wrapper label="Search address" required>
              <Input type="text" placeholder="Search Address" />
            </Input.Wrapper>
          </Autocomplete>

          <div>
            <GoogleMap
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
              }}
              center={userLocation}
              zoom={16}
              mapContainerStyle={containerStyle}
            >
              <Marker position={userLocation} title="Your Location" />
            </GoogleMap>
          </div>
        </Stack>
      </LoadScript>
    </div>
  );
}

export default GoogleMapView;
