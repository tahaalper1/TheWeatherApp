import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import axios from "react-native-axios";

const API_KEY = '3bdf6dd6ecea8b8e902da63521178d2a';

const MyComponent = () => {
  const [locationInfo, setLocationInfo] = useState();
  const [weather, setWeather] = useState();

  const Coordinate = async (latitude, longitude) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log('Hava durumu alınamadı.', error);
    }
  };

  const getLocation = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Konum izni reddedildi.');
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      setLocationInfo(location.coords);
      const weatherData = await Coordinate(location.coords.latitude, location.coords.longitude);
      setWeather(weatherData);
    } catch (error) {
      console.log('Konum alınamadı.', error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View>
      <Text  style={{ color:"red", fontSize: 22, paddingHorizontal: 120, marginTop: 100, marginBottom: 20}}>Konum Bilgisi</Text>
      <Text style={{ color:"black", fontSize: 14, paddingHorizontal: 125, marginBottom: 10}}>Enlem: {locationInfo?.latitude}</Text>
      <Text style={{ color:"black", fontSize: 14, paddingHorizontal: 125, marginBottom: 10}}>Boylam: {locationInfo?.longitude}</Text>
      <Text style={{ color:"black", fontSize: 14, paddingHorizontal: 125, marginBottom: 10}}>Konum: {weather.name}</Text>
      {weather && (
        <View>
          <Text style={{ color:"red", fontSize: 22, paddingHorizontal: 120,marginTop: 100, marginBottom: 10}}>Hava Durumu</Text>
          <Text style={{ color:"black", fontSize: 14, paddingHorizontal: 110, marginBottom: 10}}>Açıklama: {weather.weather[0].description}</Text>
          <Text style={{ color:"black", fontSize: 14, paddingHorizontal: 140, marginBottom: 10}}>Sıcaklık: {Math.ceil(weather.main.temp - 273.15)} °C </Text>
          <Text style={{ color:"black", fontSize: 14, paddingHorizontal: 150, marginBottom: 10}}>Nem: {weather.main.humidity}</Text>
        </View>
      )}
    </View>
  );
};

export default MyComponent;
