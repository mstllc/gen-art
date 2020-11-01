const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const createRegl = require('regl')
const glslify = require('glslify')
const createQuad = require('primitive-quad')
const path = require('path')

const BLEED_WIDTH = 5.98
const BLEED_HEIGHT = 4.21
const CUT_WIDTH = 5.83
const CUT_HEIGHT = 4.13
const TEXT_PADDING = 0.2


const settings = {
  dimensions: [ BLEED_WIDTH, BLEED_HEIGHT ],
  pixelsPerInch: 300,
  units: 'in',
  context: 'webgl'
}

const sketch = () => {
  return ({ gl, width, height, exporting }) => {
    const regl = createRegl({ gl })
    const quad = createQuad()

    const drawQuad = regl({
      vert: glslify(path.resolve(__dirname, 'shader.vert')),
      frag: glslify(path.resolve(__dirname, 'shader.frag')),
      uniforms: {
        
      },
      attributes: { position: quad.positions },
      elements: regl.elements(quad.cells)
    })

    regl.poll()
    regl.clear({ color: [ 0, 0, 0, 0 ], depth: 1, stencil: 0 })
    
    drawQuad()

    gl.flush()

  }
}

canvasSketch(sketch, settings)
