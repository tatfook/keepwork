const light = {
  name: 'light',
  preview: '',
  mainColor: [255, 255, 255], // RGB
  colors: [
    ['red', 'blue', 'green'],
    ['blue', 'green', 'red'],
    ['green', 'red', 'blue']
  ],
  fonts: [
    [12, 14, 16, 18, 20, 24],
    [16, 18, 20, 24, 28, 36],
    [24, 26, 28, 32, 36, 42]
  ],
  bgColors: [
    ['#fff', 'blue', 'green'],
    ['#eee', 'green', 'red'],
    ['#ddd', 'red', 'blue']
  ]
}

const dark = {
  name: 'dark',
  preview: '',
  mainColor: [0, 0, 0], // RGB
  colors: [
    ['#eee', 'green', 'red'],
    ['#fff', 'blue', 'green'],
    ['#ddd', 'red', 'blue']
  ],
  fonts: [
    [12, 14, 16, 18, 20, 24],
    [16, 18, 20, 24, 28, 36],
    [24, 26, 28, 32, 36, 42]
  ],
  bgColors: [
    ['#eee', 'green', 'red'],
    ['#fff', 'blue', 'green'],
    ['#ddd', 'red', 'blue']
  ]
}

export default {
  light,
  dark
}
