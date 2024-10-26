import React, { useState, useRef } from 'react'
import ResDetail from '@/components/TravelPlanComponent/ResDetailCard/ResDetail' // 导入 ResDetail 模态框
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native'
import { photoUrlBase } from '@/lib/google-map-api'

type TravelCardProps = {
  time: string | null
  duration: string | null
  destination: string | null
  destinationDescrib: string | null
  destinationDuration: string | null
  transportation: string | null
  distance: string | null
  estimatedPrice: string | null
  startLocation: string | null
  endLocation: string | null
  detailedinfo: string | null
  photoReference: string | null
  rating: number | null
  user_ratings_total: number | null
}

const TravelCard: React.FC<TravelCardProps> = ({
  time,
  duration,
  destination,
  destinationDescrib,
  destinationDuration,
  transportation,
  distance,
  estimatedPrice,
  startLocation,
  endLocation,
  detailedinfo,
  rating,
  user_ratings_total,
  photoReference,
}) => {
  const [lineHeight, setLineHeight] = useState(0)
  const [modalVisible, setModalVisible] = useState(false) // 控制模态框的可见性
  const cardRef = useRef<View>(null)

  const handleCardLayout = () => {
    if (cardRef.current) {
      cardRef.current.measure((x, y, width, height) => {
        const calculatedHeight = height * 0.8
        setLineHeight(calculatedHeight)
      })
    }
  }
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating) // 获取完整星星的数量
    const hasHalfStar = rating % 1 !== 0 // 判断是否有半颗星
    const stars = []

    // 添加完整的星星
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={20} color="gold" />)
    }

    // 添加半颗星
    if (hasHalfStar) {
      stars.push(
        <Icon key={fullStars} name="star-half-full" size={20} color="gold" />
      )
    }

    // 添加空星星
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={fullStars + 1 + i} name="star-o" size={20} color="gold" />
      )
    }

    return <View style={{ flexDirection: 'row' }}>{stars}</View>
  }

  const renderTransportationIcons = () => {
    switch (transportation) {
      case 'Transit':
        return '🚶‍♂️'
      case 'Driving':
        return '🚗 '
      case 'Walking':
        return '🚶‍♀️'
      default:
        return ''
    }
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${endLocation}&travelmode=driving`
    Linking.openURL(url).catch((err) => console.error('An error occurred', err))
  }

  const getRandomRating = () => {
    return (Math.random() * (5 - 3.5) + 3.5).toFixed(1) // Generates a random number between 3.5 and 5
  }

  // Function to generate a random number of comments between 300 and 3000
  const getRandomComments = () => {
    return Math.floor(Math.random() * (3000 - 300 + 1)) + 300 // Generates a random integer between 300 and 3000
  }

  // const randomRating = getRandomRating();
  // const randomComments = getRandomComments();

  return (
    <View style={styles.container}>
      {/* 左边时间线 */}
      {/* ...时间线的代码... */}
      <View style={styles.timelineContainer}>
        <Image
          source={require('@/assets/images/start.png')}
          style={styles.marker}
        />
        <View style={[styles.line, { height: lineHeight }]}>
          <View style={styles.dashedLine} />
        </View>
      </View>
      {/* 外部卡片 */}
      <View style={styles.outerCard} ref={cardRef} onLayout={handleCardLayout}>
        {/* 内部卡片 */}
        <View style={styles.card}>
          <View style={styles.header}>
            {/* 图片 */}
            {photoReference && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: photoUrlBase + photoReference }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {estimatedPrice && (
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{estimatedPrice}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 目的地和出发时间 */}
          {destination && (
            <Text style={styles.location}>
              {destination}
              {'\n'}
              {time && (
                <Text style={styles.departureTime}>Depart at: {time}</Text>
              )}
            </Text>
          )}

          {/* 停留时间 */}
          {destinationDuration && (
            <View style={styles.durationContainer}>
              <Image
                source={require('@/assets/images/TravelCard/time.png')}
                style={styles.icon}
              />
              <Text style={styles.destinationDuration}>
                Stay Duration: {destinationDuration} min
              </Text>
            </View>
          )}

          {/* 评分和评论 */}
          {rating !== null && user_ratings_total !== null && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 1,
                marginBottom: 2,
              }}>
              <RatingStars rating={parseFloat(rating)} />
              <Text style={{ fontSize: 12, color: '#666666', marginLeft: 8 }}>
                {user_ratings_total} comments
              </Text>
            </View>
          )}
          {/* click show more */}
          <View style={styles.transportInfoContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.transportInfo}>More Detail...</Text>
            </TouchableOpacity>
          </View>

          {/* click for more detail */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <ResDetail
              onClose={() => setModalVisible(false)}
              title={destination}
              description={destinationDescrib}
              coords={endLocation}
              duration={duration}
              destinationDuration={destinationDuration}
              transportation={transportation}
              distance={distance}
              estimatedPrice={estimatedPrice}
              photoReference={photoReference}
              rating={rating}
              tips={rating}
              user_ratings_total={user_ratings_total}
            />
          </Modal>
        </View>

        {/* 导航信息 */}
        <View style={styles.additionalInfoContainer}>
          <Text style={styles.sectionTitle}>Navigation Info</Text>
          <TouchableOpacity onPress={openGoogleMaps}>
            <Text style={styles.detailedInfo}>Click to google map</Text>
          </TouchableOpacity>
          {(distance || transportation || duration) && (
            <View style={styles.transportIcons}>
              <Text>
                {distance ? `Distance: ${distance}` : ''}
                {distance && transportation ? ' / ' : ''}
                {transportation || ''}
                {(distance || transportation) && duration ? ' ' : ''}
                {duration ? `(${duration})` : ''}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 模态框 */}
      {/* ...模态框的代码... */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '91%',
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: -15,
    position: 'relative',
  },
  marker: {
    top: 50,
    width: 20,
    height: 20,
    zIndex: 1,
    marginBottom: 6,
  },
  line: {
    position: 'absolute',
    top: 100,
    width: 2,
  },
  dashedLine: {
    borderLeftWidth: 2,
    borderLeftColor: '#222222',
    height: '95%',
    borderStyle: 'dashed',
  },
  outerCard: {
    padding: 0,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  header: {
    flexDirection: 'column', // 改为竖直排列
    alignItems: 'center', // 可选择居中对齐
    marginBottom: 0,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  departureTime: {
    fontSize: 16,
    color: '#666666',
  },
  waitTime: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 0,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#666666',
  },
  transportationInfo: {
    fontSize: 14,
    color: '#555555',
  },
  durationContainer: {
    flexDirection: 'row', // 水平排列图标和文本
    alignItems: 'center', // 垂直居中
  },
  icon: {
    width: 16, // 根据图标大小调整
    height: 16, // 根据图标大小调整
    marginRight: 5, // 图标和文本之间的间距
  },
  destinationDuration: {
    marginTop: 2,
    fontSize: 14,
    color: '#555555',
  },
  transportInfoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  transportInfo: {
    fontSize: 14,
    color: '#000000',
  },
  additionalInfoContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailedInfo: {
    fontSize: 14,
    color: '#023e8a',
    marginBottom: 5,
  },
  transportIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  imageContainer: {
    marginTop: -8,
    borderRadius: 10,
    overflow: 'hidden',
    width: 277,
    height: 180,
    position: 'relative',
  },
  image: {
    borderRadius: 10,
    width: '100%',
    height: 180,
    minWidth: 277,
  },
  priceTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 5,
  },

  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
})

export default TravelCard
