import { createTamagui } from 'tamagui'

const config = createTamagui({
  themes: {
    light: {
      background: '#ffffff',
      text: '#000000',
    },
    dark: {
      background: '#000000',
      text: '#ffffff',
    },
  },
})

export default config
