'use strict';

// Imports
const electron = require('electron')
const {ipcRenderer, remote} = electron
var THREE = require('three')
var EffectComposer = require('three-effectcomposer')(THREE)

let scene

// Shaders

/**
* Simple component level color add / subtract shader
*/
const ChannelShader = {
	uniforms: {
		"video": { type:'t', value: null },
		"amount": { type:'f', value: 1.0 },
		"red": { type:'f', value: 0. },
		"green": { type:'f', value: 0. },
		"blue": { type:'f', value: 0. },
	},
	vertexShader: [
		"varying vec2 vUv;",
    "void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"uniform float amount;",
		"uniform float red;",
		"uniform float green;",
		"uniform float blue;",
		"uniform sampler2D video;",
		"varying vec2 vUv;",
		"void main() {",
			"vec4 color = texture2D(video, vUv);",
			"color.rgb = min(vec3(1.), color.rgb + vec3(red, green, blue) * vec3(amount));",
			"gl_FragColor = color;",
		"}"
	].join( "\n" )
}
/**
* Simple component level color add / subtract shader
*/
const ColorizeShader = {
	uniforms: {
		"tDiffuse": { type:'t', value: null },
		"amount": { type:'f', value: 1.0 },
		"red": { type:'f', value: 0. },
		"green": { type:'f', value: 0. },
		"blue": { type:'f', value: 0. },
	},
	vertexShader: [
		"varying vec2 vUv;",
    "void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"uniform float amount;",
		"uniform float red;",
		"uniform float green;",
		"uniform float blue;",
		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",
		"void main() {",
			"vec4 color = texture2D(tDiffuse, vUv);",
			"color.rgb = min(vec3(1.), color.rgb + vec3(red, green, blue) * vec3(amount));",
			"gl_FragColor = color;",
		"}"
	].join( "\n" )
}

/**
* Simple component based inverse multiplication lightness shader
*/
const LightnessShader = {
	uniforms: {
		"tDiffuse": { type:'t', value: null },
		"amount": { type:'f', value: 1.0 },
	},
	vertexShader: [
		"varying vec2 vUv;",
    "void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"uniform float amount;",
		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",
		"void main() {",
			"vec4 color = texture2D(tDiffuse, vUv);",
			"color.rgb = color.rgb * vec3(amount);",
			"gl_FragColor = color;",
		"}"
	].join( "\n" )
}

/**
* Creates a Vignette
*/
const VignetteShader = {
	uniforms: {
		"tDiffuse": { type:'t', value: null },
		"size":   { type:'f', value: 1.0 },
		"smooth": { type:'f', value: 0.5 },
	},
	vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"uniform float size;",
		"uniform float smooth;",
		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",
		"void main() {",
			"vec4 color = texture2D(tDiffuse, vUv);",
			"float dist = distance(vUv, vec2( 0.5 ));",
			"color.rgb *= smoothstep(0.8, size * 0.5, dist * (smooth + size));",
			"gl_FragColor = color;",
		"}"
	].join( "\n" )
}

/**
* Specialized composing shader combines two mandalas, the spectrum and the logo
*/
const ChannelComposerShader = {
	uniforms: {
		"channelA": { type:'t', value: null },
		"channelB": { type:'t', value: null },
		"effectChannel": { type:'t', value: null },
    "effectBlendMode": {type: 'i', value: 0 },
		"effectMix": { type:'f', value: 0. },
		"mixAmount": { type:'f', value: 0.5 },
    "brightness": { type:'f', value: 1.0 },
    "saturation": { type:'f', value: 1.0 },
    "vignetteSize": { type:'f', value: 1.0 },
    "vignetteSmooth": { type:'f', value: 0.5 },
    "mask": { type:'t', value: null },
    "useMask": { type:'i', value: 1 },
    "cursor": { type:'2f', value: new THREE.Vector2(0.1,0.1)},
    "showCursor": { type:'i', value: 1 },
	},
	vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
    "uniform sampler2D channelA;",
    "uniform sampler2D channelB;",
    "uniform sampler2D effectChannel;",
    "uniform float effectMix;",
		"uniform int effectBlendMode;",
		"uniform float mixAmount;",
		"uniform float brightness;",
		"uniform float saturation;",
		"uniform float vignetteSize;",
		"uniform float vignetteSmooth;",
    "uniform sampler2D mask;",
		"uniform int useMask;",
		"uniform vec2 cursor;",
		"uniform int showCursor;",
		"varying vec2 vUv;",

    "vec3 rgb2hsv(vec3 c) {",
      "vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
      "vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
      "vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
      "float d = q.x - min(q.w, q.y);",
      "float e = 1.0e-10;",
      "return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);",
    "}",

    "vec3 hsv2rgb(vec3 c) {",
      "vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
      "vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
      "return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
    "}",

		"void main() {",
      "vec4 color = vec4(.0, .0, .0,  1.);",
			"vec4 channelACol = texture2D(channelA, vUv);",
			"vec4 channelBCol = texture2D(channelB, vUv);",
			"vec4 effectChannelCol = texture2D(effectChannel, vUv);",
			"float dist = distance(vUv, vec2( 0.5 ));",
      "color.rgb = channelACol.rgb * vec3(1. - mixAmount) + channelBCol.rgb * vec3(mixAmount);",
      "vec4 effectColor = vec4(effectChannelCol.rgb, 1.0);",
      "if (effectBlendMode == 0) {", // mix
        "effectColor.rgb = effectColor.rgb;",
      "} else if (effectBlendMode == 1) {", // add
        "effectColor.rgb = min(vec3(1.,1.,1.), color.rgb + effectColor.rgb);",
      "} else if (effectBlendMode == 2) {", // subtract
        "effectColor.rgb = max(vec3(0.,0.,0.), color.rgb - effectColor.rgb);",
      "} else if (effectBlendMode == 3) {", // multiply
        "effectColor.rgb *= color.rgb;",
      "} else if (effectBlendMode == 4) {", // divide
        "effectColor.rgb = min(vec3(1.), color.rgb / max(vec3(.0001), effectColor.rgb));",
      "} else if (effectBlendMode == 5) {", // lighten
        "effectColor.rgb = max(color.rgb, effectColor.rgb);",
      "} else if (effectBlendMode == 6) {", // darken
        "effectColor.rgb = min(color.rgb, effectColor.rgb);",
      "} else if (effectBlendMode == 7) {", // hue
        "vec3 effecthsv = rgb2hsv(effectColor.rgb);",
        "vec3 colorhsv = rgb2hsv(color.rgb);",
        "colorhsv.x = effecthsv.x;",
        "effectColor.rgb = hsv2rgb(colorhsv);",
      "} else if (effectBlendMode == 8) {", // valsat
        "vec3 effecthsv = rgb2hsv(effectColor.rgb);",
        "vec3 colorhsv = rgb2hsv(color.rgb);",
        "colorhsv.z = effecthsv.y;",
        "effectColor.rgb = hsv2rgb(colorhsv);",
      "} else if (effectBlendMode == 9) {", // valdiv
        "vec3 effecthsv = rgb2hsv(effectColor.rgb);",
        "vec3 colorhsv = rgb2hsv(color.rgb);",
        "colorhsv.z /= effecthsv.z;",
        "effectColor.rgb = hsv2rgb(colorhsv);",
      "}",

      "color.rgb = effectColor.rgb*effectMix + color.rgb*(1.-effectMix);",
      "vec3 hsv = rgb2hsv(color.rgb);",
      "hsv.y *= saturation;",
      "color.rgb = hsv2rgb(hsv);",
      "color.rgb *= smoothstep(vignetteSize, vignetteSize-vignetteSize*vignetteSmooth, dist );",
      "color.rgb *= vec3(brightness);",
      "if (useMask == 1) {",
        "vec4 maskCol = texture2D(mask, vUv);",
        "color = vec4(color.rgb*(maskCol.r), color.a*(maskCol.r));",
      "}",
      "if (showCursor == 1) {",
        "color = mix(color, max(vec4(vec3( step(abs(cursor.x-vUv.x),.002 ) ), 1.0), vec4(vec3( step(abs(cursor.y-vUv.y),.002 ) ), 1.0)),.5);",
      "}",
      "gl_FragColor = color;",
		"}"
	].join( "\n" )
}



// 0-4 while from 3 up logging wil occur per tick
const LOG_LEVEL = 0

// Render Target Width and Height
const BUFFER_SIZE = 1024
const BUFFER_WIDTH = 1920/2
const BUFFER_HEIGHT = 1080/2
// Cam Settings
const FOV = 75
const ASPECT = BUFFER_WIDTH / BUFFER_HEIGHT
const NEAR = 0.1
const FAR = 10

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
/**
* Creates a buffered video texture mandala ring
*/
function makeVideo(renderer) {
  var t = {}

  t.renderer = renderer

  // Buffer
  t.buffer = new THREE.WebGLRenderTarget(
     BUFFER_WIDTH,
     BUFFER_HEIGHT,
     {
       minFilter: THREE.LinearFilter,
       magFilter: THREE.LinearFilter,
       depthBuffer: false,
       stencilBuffer: false,
     }
   )

  // Scene
  t.scene = new THREE.Scene()

  t.loaded = false
  t.video = document.createElement("VIDEO")
  t.video.autoplay = true
  t.video.loop = true
  t.video.controls = false
  t.video.muted = true
  t.video.addEventListener('loadeddata', function() {
      if (LOG_LEVEL >= 2) console.log("video loaded")
      t.loaded = true
      t.material.needsUpdate = true
  })
  if (LOG_LEVEL >= 2) console.log(t.video)

  t.texture = new THREE.VideoTexture(t.video)
  t.texture.minFilter = THREE.LinearFilter
  t.texture.magFilter = THREE.LinearFilter;
  t.texture.format = THREE.RGBFormat
  t.material = new THREE.MeshBasicMaterial({map : t.texture})

  t.geometry = new THREE.PlaneBufferGeometry(2, 2)

  t.mesh = new THREE.Mesh(t.geometry, t.material)

  //t.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR)
  t.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, NEAR, FAR)
  t.camera.position.z = 1;

  t.scene.add(t.mesh)


  t.render = function() {
    if (LOG_LEVEL >= 3) console.log("render ring")
    //if(t.loaded) t.composer.render()
    //t.composer.render()
    t.renderer.render(t.scene, t.camera, t.buffer)
  }

  t.setSrc = function(src) {
    if (LOG_LEVEL >= 2) console.log("set video source")
    t.video.src = src
    t.loaded = false
  }
  return t
}

function makeChannel(renderer) {
  var t = {}


  t.renderer = renderer
  // Src
  t.video = makeVideo(t.renderer)
  // Buffer
  t.buffer = new THREE.WebGLRenderTarget(
     BUFFER_WIDTH,
     BUFFER_HEIGHT,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    }
  )

  // Scene
  t.scene = new THREE.Scene()

  //t.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR)
  t.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, NEAR, FAR)
  t.camera.position.z = 1;

  t.geometry = new THREE.PlaneBufferGeometry(2, 2)

  t.material = new THREE.ShaderMaterial(clone(ChannelShader))
  t.material.uniforms.video.value = t.video.buffer.texture
  t.material.uniforms.red.value = 1.
  t.material.uniforms.green.value = 1.
  t.material.uniforms.blue.value = 1.

  t.mesh = new THREE.Mesh(t.geometry, t.material)

  t.scene.add(t.mesh)

  t.render = function() {
    if (LOG_LEVEL >= 3) console.log("render channel")
    t.video.render()
    //t.material.needsUpdate = true
    t.renderer.render(t.scene, t.camera, t.buffer)
  }
  return t
}


function makeMask(renderer) {
  var t = {}


  t.renderer = renderer
  // Buffer
  t.buffer = new THREE.WebGLRenderTarget(
     BUFFER_WIDTH,
     BUFFER_HEIGHT,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    }
  )

  // Scene
  t.scene = new THREE.Scene()

  //t.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR)
  t.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, NEAR, FAR)
  t.camera.position.z = 1;

  t.geometry = new THREE.PlaneBufferGeometry(2, 2)

  t.material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } )
  t.bgmaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } )

  t.mesh = new THREE.Mesh(t.geometry, t.bgmaterial)

  //t.scene.add(t.mesh)
  t.mesh.z = -1
  t.shapes = new THREE.Object3D()
  t.scene.add(t.shapes)


  t.removeAll = function() {
    for(var i = 0; i < t.shapes.children.length; i++) {
      t.shapes.remove(t.shapes.children[i])
    }
  }

  t.setShapes = function(shapes) {
    console.log("setShapes", shapes)
    t.removeAll()
    for (var i = 0; i < shapes.length; i++) {
      var points = shapes[i]
      if (points.length > 3) {
        var shape = new THREE.Shape()

        shape.moveTo((points[points.length-1].x), (points[points.length-1].y))
        for (var j = 0; j<points.length; j++) {
          console.log("drawPoint",points[j])
          shape.lineTo((points[j].x), (points[j].y))
        }
        shape.closePath()
        var geometry = new THREE.ShapeGeometry(shape)

        var mesh = new THREE.Mesh( geometry, t.material )
        t.shapes.add(mesh)
      }
    }
    t.render()
  }
  //t.bitmap = new Uint8Array(BUFFER_WIDTH*BUFFER_HEIGHT*4)
  t.render = function() {
    if (LOG_LEVEL >= 3) console.log("render mask")
    //t.material.needsUpdate = true
    t.renderer.render(t.scene, t.camera, t.buffer)

  //t.renderer.readRenderTargetPixels(t.buffer, 0,0, BUFFER_WIDTH, BUFFER_HEIGHT, t.bitmap)
    console.log("mask",t.buffer)
  }
  t.render()
  return t
}


/**
* Returns a channel instance
*/
function makeMixer(renderer) {
  var t = {}

  t.renderer = renderer
  // Src
  t.channelA = makeChannel(t.renderer)
  t.effectChannel = makeChannel(t.renderer)
  t.channelB = makeChannel(t.renderer)
  t.mask = makeMask(t.renderer)
  // Buffer
  t.buffer = new THREE.WebGLRenderTarget(
    BUFFER_WIDTH,
    BUFFER_HEIGHT,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    }
  )

  // Scene
  t.scene = new THREE.Scene()

  //t.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR)
  t.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, NEAR, FAR)
  t.camera.position.z = 1;

  t.geometry = new THREE.PlaneBufferGeometry(2, 2)

  t.material = new THREE.ShaderMaterial(clone(ChannelComposerShader))
  t.material.uniforms.channelA.value = t.channelA.buffer.texture
  t.material.uniforms.channelB.value = t.channelB.buffer.texture
  t.material.uniforms.effectChannel.value = t.effectChannel.buffer.texture
  t.material.uniforms.mask.value = t.mask.buffer.texture
  t.material.uniforms.useMask.value = 1
  t.material.uniforms.mixAmount.value = 0.5
  t.material.uniforms.brightness.value = 1.
  t.material.uniforms.saturation.value = 1.
  t.material.uniforms.vignetteSize.value = 1.
  t.material.uniforms.vignetteSmooth.value = .5

  t.mesh = new THREE.Mesh(t.geometry, t.material)

  t.scene.add(t.mesh)

  //t.composer = new EffectComposer(renderer)
  //t.composer.addPass(new EffectComposer.RenderPass(t.scene, t.camera))
  t.render = function() {
    //console.log("render mixer")
    if (LOG_LEVEL >= 3) console.log("render channel")
    //console.log(t.material.uniforms.mixAmount.value)
    if(t.material.uniforms.mixAmount.value < 1) t.channelA.render()
    if(t.material.uniforms.mixAmount.value > 0) t.channelB.render()
    if(t.material.uniforms.effectMix.value > 0) t.effectChannel.render()
    t.renderer.render(t.scene, t.camera)
  }
  return t
}

/**
* Create a Scene
*/
function makeScene(selector) {
  var t = {}

  t.selector = selector || "body"
  t.paused = true
  t.scheduled = false

  t.source = null
  t.volume = 0.

  t.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, stencil:false })
  t.renderer.setClearColor( 0x000000, 1. )
  t.renderer.setPixelRatio(window.devicePixelRatio)
  t.renderer.setSize(BUFFER_WIDTH, BUFFER_HEIGHT)

  t.container = document.querySelector(t.selector)
  t.container.appendChild(t.renderer.domElement)

  t.mixer = makeMixer(t.renderer)

  //t.channel = makeChannel(t.renderer)

  //t.mixer = makeMixer(t.renderer, t.channel)

  t.render = function() {
    if (LOG_LEVEL >= 3) console.log("render scene")
    //t.channel.render()
    //t.mixer.render()
    t.mixer.render()
  }

  t.update = function() {
    if (LOG_LEVEL >= 3) console.log("update scene")
    t.render()
  }

  t.nthFrame = 1
  t.iteration = 0
  t.loop = function() {
    if (LOG_LEVEL >= 3) console.log("loop scene")
    t.iteration++
    t.scheduled = false
    if (!t.paused) {
      t.scheduled = true
      requestAnimationFrame(t.loop)
      if(t.iteration%t.nthFrame == 0) t.update()
    }
  }

  t.play = function() {
    if (LOG_LEVEL >= 2) console.log("scene play")
    if (t.paused) {
      t.paused = false
      t.mixer.channelA.video.video.play()
      t.mixer.channelB.video.video.play()
      if (!t.scheduled) t.loop()
    }
  }

  t.pause = function() {
    if (LOG_LEVEL >= 2) console.log("scene pause")
    if (!t.paused) {
      t.paused = true
      t.mixer.channelA.video.video.pause()
      t.mixer.channelB.video.video.pause()
    }
  }
  return t
}

function resize() {
  var size = remote.getCurrentWindow().getContentSize()
  console.log("resize current window", size )
  scene.renderer.setSize(size[0], size[1])
}
/* Expose the API via interprocess communication */

remote.getCurrentWindow().on('resize', resize, false);

ipcRenderer.on('change', function(event, key, value) {
  if (LOG_LEVEL >= 2) console.log("change", key, value)
  switch(key) {
    case "play":
      if(value) scene.play()
      else scene.pause()
    break;
    case "fullscreen":
      remote.getCurrentWindow().setFullScreen(value);
    break;
    case "nthFrame":
      scene.nthFrame = value
    break;
    case "master":
      scene.mixer.material.uniforms.brightness.value = value
      //scene.mixer.lightnessValue = value
    break;
    case "saturation":
      scene.mixer.material.uniforms.saturation.value = value
      //scene.mixer.lightnessValue = value
    break;
    case "vignetteSize":
      scene.mixer.material.uniforms.vignetteSize.value = value
      //scene.mixer.lightnessValue = value
    break;
    case "vignetteSmooth":
      scene.mixer.material.uniforms.vignetteSmooth.value = value
      //scene.mixer.lightnessValue = value
    break;
    case "xOffset":
      scene.mixer.camera.position.x = -value
    break;
    case "yOffset":
      scene.mixer.camera.position.y = value
    break;
    case "scale":
      scene.mixer.camera.zoom = value
      scene.mixer.camera.updateProjectionMatrix()
    break;
    case "scaleX":
      scene.mixer.mesh.scale.x = value
    break;
    case "scaleY":
      scene.mixer.mesh.scale.y = value
    break;
    case "channel.mix":
      scene.mixer.material.uniforms.mixAmount.value = value
    break;
    case "channel.left.src":
      scene.mixer.channelA.video.setSrc(value)
      //scene.channel.ringA.setSrc(value)
    break;
    case "channel.left.playbackSpeed":
      scene.mixer.channelA.video.video.playbackRate = value
      //scene.channel.ringA.video.playbackRate = value
    break;
    case "channel.left.red":
      //scene.channel.ringA.colorize.uniforms.red.value = value
        scene.mixer.channelA.material.uniforms.red.value = value
    break;
    case "channel.left.green":
      //scene.channel.ringA.colorize.uniforms.green.value = value
        scene.mixer.channelA.material.uniforms.green.value = value
    break;
    case "channel.left.blue":
      //scene.channel.ringA.colorize.uniforms.blue.value = value
        scene.mixer.channelA.material.uniforms.blue.value = value
    break;

    case "channel.effect.src":
      scene.mixer.effectChannel.video.setSrc(value)
      //scene.channel.ringA.setSrc(value)
    break;
    case "channel.effect.playbackSpeed":
      scene.mixer.effectChannel.video.video.playbackRate = value
      //scene.channel.ringA.video.playbackRate = value
    break;
    case "channel.effect.red":
      //scene.channel.ringA.colorize.uniforms.red.value = value
        scene.mixer.effectChannel.material.uniforms.red.value = value
    break;
    case "channel.effect.green":
      //scene.channel.ringA.colorize.uniforms.green.value = value
        scene.mixer.effectChannel.material.uniforms.green.value = value
    break;
    case "channel.effect.blue":
      //scene.channel.ringA.colorize.uniforms.blue.value = value
        scene.mixer.effectChannel.material.uniforms.blue.value = value
    break;
    case "channel.effect.blendMode":
      //scene.channel.ringA.colorize.uniforms.blue.value = value
        scene.mixer.material.uniforms.effectBlendMode.value = value
    break;
    case "channel.effect.mix":
      //scene.channel.ringA.colorize.uniforms.blue.value = value
        scene.mixer.material.uniforms.effectMix.value = value
    break;
    case "channel.right.src":
      scene.mixer.channelB.video.setSrc(value)
      //scene.channel.ringB.setSrc(value)
    break;
    case "channel.right.playbackSpeed":
      scene.mixer.channelB.video.video.playbackRate = value
    //  scene.channel.ringB.video.playbackRate = value
    break;
    case "channel.right.red":
      scene.mixer.channelB.material.uniforms.red.value = value
      //  scene.channel.ringB.colorize.uniforms.red.value = value
    break;
    case "channel.right.green":
      scene.mixer.channelB.material.uniforms.green.value = value
      //scene.channel.ringB.colorize.uniforms.green.value = value
    break;
    case "channel.right.blue":
      scene.mixer.channelB.material.uniforms.blue.value = value
    //  scene.channel.ringB.colorize.uniforms.blue.value = value
    break;
    case "mask.shapes":
      scene.mixer.mask.setShapes(value)
    //  scene.channel.ringB.colorize.uniforms.blue.value = value
    break;
    case "mask.use":
      scene.mixer.material.uniforms.useMask.value = value?1:0
    //  scene.channel.ringB.colorize.uniforms.blue.value = value
    break;
    case "ui.view":
      scene.mixer.material.uniforms.showCursor.value = (value === "mask")?1:0;
    break;
    case "cursor.x":
      scene.mixer.material.uniforms.cursor.value.x = (value+1)/2
    break;
    case "cursor.y":
      scene.mixer.material.uniforms.cursor.value.y = (value+1)/2
    break;
    default:
      console.log("ignored", key, value)
  }
})

function init(mode) {
  // hit it
  scene = makeScene('#screen')
  ipcRenderer.send('init')
  resize()
}
module.exports.init = init
