import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// weather with icon
const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear sky':
      return require('@/assets/images/weather/sun.png');
    case 'broken clouds':
      return require('@/assets/images/weather/cloud.png');
    case 'overcast clouds':
      return require('@/assets/images/weather/cloudy.png');
    case 'rain':
      return require('@/assets/images/weather/rain.png');
    default:
      return require('@/assets/images/weather/default.png'); 
  }
};

// weather with outfit
const getAccessoryIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear sky':
      return require('@/assets/images/weather/sunglasses.png'); 
    case 'overcast clouds':
      return require('@/assets/images/weather/hat.png');
    case 'rain':
      return require('@/assets/images/weather/umbrella.png');
    default:
      return require('@/assets/images/weather/neutral.png'); 
  }
};

// temp with cloth
const getClothingIcon = (temp: number) => {
  if (temp < 5) {
    return require('@/assets/images/weather/heavy_clothes.png'); 
  } else if (temp >= 5 && temp <= 20) {
    return require('@/assets/images/weather/medium_clothes.png'); 
  } else {
    return require('@/assets/images/weather/light_clothes.png'); 
  }
};

interface WeatherCardProps {
  weatherData: string; // get json from home.tsx line 470
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  let parsedWeatherData;
  try {
    parsedWeatherData = JSON.parse(weatherData);
  } catch (error) {
    console.error('Invalid weatherData:', error);
    return <Text>Invalid weather data</Text>; 
  }

  const { currentTemperature, currentCondition, HourForecast } =
    parsedWeatherData || {};

  const firstHourForecast = HourForecast && HourForecast.length > 0 ? HourForecast[0] : null;

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.currentWeatherContainer}>
          <Image
            source={getWeatherIcon(currentCondition)}
            style={styles.weatherIcon}
          />
          <View style={styles.weatherInfo}>
            <Text style={styles.temperature}>{currentTemperature}°C</Text>
            <Text style={styles.condition}>{currentCondition}</Text>
          </View>
        </View>

        {/* item recom */}
        <View style={styles.iconWrapper}>
          <Image source={getAccessoryIcon(currentCondition)} style={styles.icon} />

        </View>

        {/* cloth recom */}
        <View style={styles.iconWrapper}>
          <Image source={getClothingIcon(currentTemperature)} style={styles.icon} />

        </View>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  currentWeatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  weatherInfo: {
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  condition: {
    fontSize: 16,
    color: '#666',
  },
  iconWrapper: {
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  hourContainer: {
    alignItems: 'center',
  },
  hourText: {
    fontSize: 14,
    color: '#666',
  },
  smallWeatherIcon: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
});

export default WeatherCard;