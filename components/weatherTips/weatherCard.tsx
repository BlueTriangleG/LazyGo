import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// 根据天气情况获取对应的天气图标
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
      return require('@/assets/images/weather/default.png'); // 默认图标
  }
};

// 根据天气情况获取对应的穿戴建议图标
const getAccessoryIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear sky':
      return require('@/assets/images/weather/sunglasses.png'); // 太阳镜
    case 'overcast clouds':
      return require('@/assets/images/weather/hat.png'); // 帽子
    case 'rain':
      return require('@/assets/images/weather/umbrella.png'); // 雨伞
    default:
      return require('@/assets/images/weather/neutral.png'); // 中性图标
  }
};

// 根据温度获取穿衣建议图标
const getClothingIcon = (temp: number) => {
  if (temp < 5) {
    return require('@/assets/images/weather/heavy_clothes.png'); // 厚衣服
  } else if (temp >= 5 && temp <= 20) {
    return require('@/assets/images/weather/medium_clothes.png'); // 中等厚度衣服
  } else {
    return require('@/assets/images/weather/light_clothes.png'); // 轻薄的衣服
  }
};

interface WeatherCardProps {
  weatherData: string; // 接收 JSON 字符串形式的天气数据
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  // 解析传入的 weatherData
  let parsedWeatherData;
  try {
    parsedWeatherData = JSON.parse(weatherData);
  } catch (error) {
    console.error('Invalid weatherData:', error);
    return <Text>Invalid weather data</Text>; // 数据无效时的提示
  }

  // 提取当前天气、今日预报和小时预报（仅第一条）
  const { currentTemperature, currentCondition, HourForecast } =
    parsedWeatherData || {};

  // 检查是否有 HourForecast 并获取第一条
  const firstHourForecast = HourForecast && HourForecast.length > 0 ? HourForecast[0] : null;

  return (
    <View style={styles.container}>
      {/* 当前天气状态、穿戴建议、穿衣建议在一行展示 */}
      <View style={styles.rowContainer}>
        {/* 当前天气状态 */}
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
