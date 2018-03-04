const light = {
  name: 'light',
  preview: '',
  mainColor: [255, 255, 255], // RGB
  colors: [
    ['red', 'blue', 'green'],
    ['red', 'blue', 'green'],
    ['red', 'blue', 'green'],
    ['red', 'blue', 'green']
  ],
  fonts: [
    [12, 14, 16, 18, 20, 24],
    [12, 16, 18, 20, 24, 28],
    [14, 18, 20, 24, 28, 32]
  ]
}

const dark = {
  name: 'dark',
  preview: '',
  mainColor: [0, 0, 0], // RGB
  colors: [
    ['red', 'blue', 'green'],
    ['red', 'blue', 'green'],
    ['red', 'blue', 'green'],
    ['red', 'blue', 'green']
  ],
  fonts: [
    [12, 14, 16, 18, 20, 24],
    [12, 16, 18, 20, 24, 28],
    [14, 18, 20, 24, 28, 32]
  ]
}

export const themes = {
  light,
  dark
}

export default themes
