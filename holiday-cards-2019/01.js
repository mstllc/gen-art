const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const colors = require('nice-color-palettes')

const BLEED_WIDTH = 5.98
const BLEED_HEIGHT = 4.21
const CUT_WIDTH = 5.83
const CUT_HEIGHT = 4.13
const TEXT_PADDING = 0.2
const SHOW_NOISE = false
const SIZE = 100

const remap = (value, low1, high1, low2, high2) => {
  return low2 + (value - low1) * (high2 - low2) / (high1 - low1)
}

// const palette = colors[random.rangeFloor(0, 100)]
const palette = ['#6bc5d2', '#105e62', '#b5525c']

const settings = {
  dimensions: [ BLEED_WIDTH, BLEED_HEIGHT ],
  pixelsPerInch: 300,
  units: 'in'
}

const sketch = () => {
  return ({ context, width, height, canvasWidth, canvasHeight, scaleX, scaleY, exporting }) => {
    context.clearRect(0, 0, width, height)
    context.fillStyle = '#d2fafb'
    context.fillRect(0, 0, width, height)

    const x = Math.floor(canvasWidth / 2) / scaleX
    const y = Math.floor(canvasHeight / 2) / scaleY
    const size = SIZE / scaleX

    const r = (1/2) * size * (1 / Math.tan(Math.PI / 3))
    const R = (1/2) * size * (1 / Math.sin(Math.PI / 3))
    const a = Math.sqrt((R * R) - (r * r))
    const triWidth = a * 2
    const triHeight = R + r
    const adj = triHeight / 2

    const drawTriangle = (x, y, color, up, circle, radius) => {
      const flip = up ? 1 : -1
      pt1 = [x - a, y + (r * flip)]
      pt2 = [x, y - (R * flip)]
      pt3 = [x + a, y + (r * flip)]

      context.fillStyle = color
      context.beginPath()
      context.moveTo(x - a, y + adj * flip)
      context.lineTo(x, y - adj * flip)
      context.lineTo(x + a, y + adj * flip)
      context.fill()

      if (circle) {
        context.strokeStyle = color
        context.lineWidth = 0.005
        context.beginPath()
        context.arc(x, y, radius, 0, 2 * Math.PI)
        context.stroke()
      }
    }

    let row = 0, col = 0
    for (let y = 0; y < Math.ceil(height / triHeight); y += triHeight) {
      for (let x = 0; x < Math.ceil(width / triWidth); x += a) {
        const noise = random.noise2D(x, y, 0.5)
        const white = noise * 255
        const gray = `rgb(${white}, ${white}, ${white})`

        // context.fillStyle = gray
        // context.fillRect(x, y, triWidth/2, triHeight);
        
        // if (random.chance(noise)) {
        if (noise > 0.5 ) {
          const up = (row % 2 === 0) ? (col % 2 === 0) : (col % 2 !== 0)
          const radius = remap(noise, 0, 1, SIZE / 1000, SIZE / 100)
          drawTriangle(x, y, random.pick(palette), up, random.chance(0.2), radius)
        }
        
        col++
      }
      row++
    }

    // context.fillStyle = 'white'
    // context.fillRect(0, 0, width, height)

    context.font = 'bold 0.6px Quicksand'
    context.textAlign = 'right'
    context.textBaseline = 'bottom'
    const textRect = context.measureText('Love You')

    // console.log(textRect)

    // context.fillStyle = 'red'
    // context.fillRect(3, 3, textRect.width + (0 - textRect.actualBoundingBoxRight), 1)

    context.fillStyle = '#EEE'
    // context.fillText('LOVE YOU', BLEED_WIDTH - ((BLEED_WIDTH - CUT_WIDTH) / 2) + (0 - textRect.actualBoundingBoxRight) - TEXT_PADDING, (BLEED_HEIGHT - (BLEED_HEIGHT - CUT_HEIGHT)) + (0 - textRect.actualBoundingBoxDescent) - TEXT_PADDING)

    // Cut Zone
    if (!exporting) {
      // context.lineWidth = 0.005
      // context.strokeRect((width - CUT_WIDTH) / 2, 0, CUT_WIDTH, CUT_HEIGHT);
    }
  }
}

canvasSketch(sketch, settings)
