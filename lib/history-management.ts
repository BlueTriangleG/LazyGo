import AsyncStorage from "@react-native-async-storage/async-storage"

export const getHistory = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail') // step1
      if (!email) {
        console.log('Email not found')
        return
      }

      // get favorite data
      const response = await fetch(`/(api)/VisitedPlaces?email=${email}`, {
        // step2
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network wrong')
      }

      const result = await response.json() //step3

      if (!Array.isArray(result)) {
        console.error('Wrong Data:', result)
        return
      }

      if (result.length === 0) {
        console.log('NO data found')
        return
      }
      const filtered_result = result.map(item => ({
        title: item.title,
        visit_count: item.visit_count
      }));
      
      return filtered_result;

    } catch (error) {
      console.error('Getting favorite Wrong:', error)
      return;
    }
  }