import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'

// 定义 latDataCoords 类型
type latDataCoords = {
  lat: number
  long: number
  title: string
  description: string
}

// 通过 props 传递 latDataCoords 数据
interface MapProps {
  coords: latDataCoords[] // 接收的经纬度数据数组
}

const Map: React.FC<MapProps> = ({ coords }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.length > 0 ? coords[0].lat : 35.6586, // 默认显示第一个位置
          longitude: coords.length > 0 ? coords[0].long : 139.7454,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {/* 动态生成 Marker */}
        {coords.map((location, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: location.lat, longitude: location.long }}
            title={location.title}
            description={location.description}
            anchor={{ x: 0.5, y: 1 }} // 将锚点设置为底部中央
          >
            <View style={styles.markerContainer}>
              <Image
                source={require('@/assets/images/pin.png')} // 自定义标记图像
                style={styles.markerImage}
              />
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}

        {/* 根据传递的坐标连线 */}
        {coords.length > 1 && (
          <Polyline
            coordinates={coords.map((location) => ({
              latitude: location.lat,
              longitude: location.long,
            }))}
            strokeColor="#76c893" // 线的颜色
            strokeWidth={3} // 线的宽度
          />
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 300, // 根据需求调整地图的高度
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    position: 'relative', // 相对定位，以便将数字放在图片上面
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImage: {
    width: 20, // 根据实际图像大小调整
    height: 20, // 根据实际图像大小调整
  },
  markerText: {
    position: 'absolute', // 绝对定位以将文本放在图像中央
    fontWeight: 'bold',
    fontSize: 10, // 字体大小
    color: '#FFFFFF', // 字体颜色
    textAlign: 'center',
    bottom: 5, // 向下偏移一些以确保文本在图标的中心
  },
})

export default Map
