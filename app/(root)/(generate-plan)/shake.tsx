import React, { useEffect, useState } from 'react'
import { Accelerometer } from 'expo-sensors'
import { View, Text } from 'react-native'

interface ShakeDetectorProps {
  onShake: () => void // 回调函数，无参数
  disabled?: boolean // 可选的 disabled 属性
}

const ShakeDetector: React.FC<ShakeDetectorProps> = ({ onShake, disabled }) => {
  const [subscription, setSubscription] = useState<any>(null)
  const [lastAccelerometer, setLastAccelerometer] = useState({
    x: 0,
    y: 0,
    z: 0,
  })
  const [shakeCount, setShakeCount] = useState(0)
  const threshold = 3
  const shakeThreshold = 6
  const resetTime = 1500 // 1.5秒

  useEffect(() => {
    _subscribe()
    return () => _unsubscribe()
  }, [])

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        _checkShake(accelerometerData)
      })
    )
    Accelerometer.setUpdateInterval(100)
  }

  const _unsubscribe = () => {
    subscription && subscription.remove()
    setSubscription(null)
  }

  const _checkShake = ({ x, y, z }: { x: number; y: number; z: number }) => {
    if (disabled) return
    const last = lastAccelerometer

    if (
      Math.abs(last.x - x) > threshold ||
      Math.abs(last.y - y) > threshold ||
      Math.abs(last.z - z) > threshold
    ) {
      setShakeCount((prevCount) => {
        const newCount = prevCount + 1

        if (newCount >= shakeThreshold) {
          resetShakeCount()
          onShake()
        }

        resetShakeCountTimer()
        return newCount
      })
    }

    setLastAccelerometer({ x, y, z })
  }

  let resetShakeCountTimerId: NodeJS.Timeout | null = null

  const resetShakeCount = () => {
    setShakeCount(0)
  }

  const resetShakeCountTimer = () => {
    if (resetShakeCountTimerId) clearTimeout(resetShakeCountTimerId)

    resetShakeCountTimerId = setTimeout(() => {
      resetShakeCount()
    }, resetTime)
  }

  return (
    <View>
      <Text className="font-JakartaBold text-left font-light my-1 px-4 self-start text-black">
        Shake to refresh
      </Text>
    </View>
  )
}

export default ShakeDetector
