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
  const shakeThreshold = 4
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
          resetShakeCount() // 重置计数器
          onShake() // 直接调用传入的函数
        }

        resetShakeCountTimer() // 每次摇动后重置计时器
        return newCount // 返回新的摇动计数
      })
    }

    setLastAccelerometer({ x, y, z }) // 更新最后的加速度数据
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
