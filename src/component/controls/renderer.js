'use strict';
const {ipcRenderer} = require('electron')

window.addEventListener('dragover', function(e) {
  e.preventDefault();
});
// prevent drag and drop defaults
document.addEventListener("dragover",  function(ev){
  ev.preventDefault()
  ev.stopPropagation()
  if(ev.target.dataset.dropzone!=="true") {
    ev.dataTransfer.effectAllowed = "none";
    ev.dataTransfer.dropEffect = "none";
  }
}, false);
document.addEventListener("dragleave",  function(ev){
  ev.preventDefault()
  ev.stopPropagation()
  if(ev.target.dataset.dropzone!=="true") {
    ev.dataTransfer.effectAllowed = "none";
    ev.dataTransfer.dropEffect = "none";
  }
}, false);
document.addEventListener("drop",  function(ev){
  ev.preventDefault()
  ev.stopPropagation()
  if(ev.target.dataset.dropzone!=="true") {
    ev.dataTransfer.effectAllowed = "none";
    ev.dataTransfer.dropEffect = "none";
  }
}, false);


var mixerView = document.querySelector('#mixerView')
var maskView = document.querySelector('#maskView')

var videoAPreview = document.querySelector('#videoAPreview')
videoAPreview.addEventListener("dragover", function(){}, false);
videoAPreview.addEventListener("dragleave",  function(){}, false);
videoAPreview.addEventListener("drop",  function(ev){
  if( ev.dataTransfer.files.length){
    var filepath = ev.dataTransfer.files[0].path
    videoAPreview.src = filepath
    ipcRenderer.send('set', 'channel.left.src', filepath)
  }
}, false);
var videoBPreview = document.querySelector('#videoBPreview')
videoBPreview.addEventListener("dragover", function(){}, false);
videoBPreview.addEventListener("dragleave",  function(){}, false);
videoBPreview.addEventListener("drop",  function(ev){
  if( ev.dataTransfer.files.length){
    var filepath = ev.dataTransfer.files[0].path
    videoBPreview.src = filepath
    ipcRenderer.send('set', 'channel.right.src', filepath)
  }
}, false);
var effectChannelPreview = document.querySelector('#effectChannelPreview')
effectChannelPreview.addEventListener("dragover", function(){}, false);
effectChannelPreview.addEventListener("dragleave",  function(){}, false);
effectChannelPreview.addEventListener("drop",  function(ev){
  if( ev.dataTransfer.files.length){
    var filepath = ev.dataTransfer.files[0].path
    effectChannelPreview.src = filepath
    ipcRenderer.send('set', 'channel.effect.src', filepath)
  }
}, false);

var fullscreen = document.querySelector('#fullscreen')
fullscreen.addEventListener('click', function () {
  ipcRenderer.send('set', 'fullscreen', true)
})

var leaveFullscreen = document.querySelector('#leaveFullscreen')
leaveFullscreen.addEventListener('click', function () {
  ipcRenderer.send('set', 'fullscreen', false)
})

var play = document.querySelector('#play')
play.addEventListener('click', function () {
  ipcRenderer.send('set', 'play', true)
})

var pause = document.querySelector('#pause')
pause.addEventListener('click', function () {
  ipcRenderer.send('set', 'play', false)
})


var toggleMixerView = document.querySelector('#toggleMixerView')
toggleMixerView.addEventListener('click', function () {
  ipcRenderer.send('set', 'ui.view', "mixer")
})

var toggleMaskView = document.querySelector('#toggleMaskView')
toggleMaskView.addEventListener('click', function () {
  ipcRenderer.send('set', 'ui.view', "mask")
})

var nthFrame = document.querySelector('#nthFrame')
nthFrame.addEventListener('change', function (event) {
  ipcRenderer.send('set', 'nthFrame', event.target.value)
})
nthFrame.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'nthFrame')
})

var xOffset = document.querySelector('#xOffset')
xOffset.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'xOffset', event.target.valueAsNumber)
})
xOffset.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'xOffset')
})

var yOffset = document.querySelector('#yOffset')
yOffset.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'yOffset', event.target.valueAsNumber)
})
yOffset.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'yOffset')
})

var scaleX = document.querySelector('#scaleX')
scaleX.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'scaleX', event.target.valueAsNumber)
})
scaleX.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'scaleX')
})

var scaleY = document.querySelector('#scaleY')
scaleY.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'scaleY', event.target.valueAsNumber)
})
scaleY.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'scaleY')
})

var scale = document.querySelector('#scale')
scale.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'scale', event.target.valueAsNumber)
})
scale.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'scale')
})


var loadModel = document.querySelector('#loadModel')
loadModel.addEventListener('click', function(e){
  ipcRenderer.send('loadModel')
})

var saveModel = document.querySelector('#saveModel')
saveModel.addEventListener('click', function(e){
  ipcRenderer.send('saveModel')
})

var channelRingAVideo = document.querySelector('#channelRingAVideo')
channelRingAVideo.addEventListener("dragover", function(){}, false);
channelRingAVideo.addEventListener("dragleave",  function(){}, false);
channelRingAVideo.addEventListener("drop",  function(ev){
  if( ev.dataTransfer.files.length){
    var filepath = ev.dataTransfer.files[0].path
    videoAPreview.src = filepath
    ipcRenderer.send('set', 'channel.left.src', filepath)
  }
}, false);

var channelRingBVideo = document.querySelector('#channelRingBVideo')
channelRingBVideo.addEventListener("dragover", function(){}, false);
channelRingBVideo.addEventListener("dragleave",  function(){}, false);
channelRingBVideo.addEventListener("drop",  function(ev){
  ev.preventDefault()
  ev.stopPropagation()
  if( ev.dataTransfer.files.length){
    var filepath = ev.dataTransfer.files[0].path
    videoBPreview.src = filepath
    ipcRenderer.send('set', 'channel.right.src', filepath)
  }
}, false);


var effectChannelVideo = document.querySelector('#effectChannelVideo')
effectChannelVideo.addEventListener("dragover", function(){}, false);
effectChannelVideo.addEventListener("dragleave",  function(){}, false);
effectChannelVideo.addEventListener("drop",  function(ev){
  ev.preventDefault()
  ev.stopPropagation()
  if( ev.dataTransfer.files.length){
    var filepath = ev.dataTransfer.files[0].path
    effectPreview.src = filepath
    ipcRenderer.send('set', 'channel.effect.src', filepath)
  }
}, false);

var channelMixAmount = document.querySelector('#channelMixAmount')
channelMixAmount.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.mix', event.target.valueAsNumber)
})
channelMixAmount.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.mix')
})

var fadeTimeout
function fade(speed) {
  if(fadeTimeout) clearTimeout(fadeTimeout)
  function fadeLoop() {
    var value = channelMixAmount.valueAsNumber
    value = Math.max(0,value + speed)
    channelMixAmount.value = value
    ipcRenderer.send('set', 'channel.mix', value)
    if ((value>0 && speed < 0)||(value<1 && speed > 0)) {
      fadeTimeout = setTimeout(fadeLoop, 40)
    }
  }
  fadeLoop()
}


var fadeAFast = document.querySelector('#fadeAFast')
fadeAFast.addEventListener('click', function (event) {
  fade(-.1)
})

var fadeASlow = document.querySelector('#fadeASlow')
fadeASlow.addEventListener('click', function (event) {
  fade(-.01)
})

var fadeASlower = document.querySelector('#fadeASlower')
fadeASlower.addEventListener('click', function (event) {
  fade(-.001)
})

var fadeBFast = document.querySelector('#fadeBFast')
fadeBFast.addEventListener('click', function (event) {
  fade(.1)
})

var fadeBSlow = document.querySelector('#fadeBSlow')
fadeBSlow.addEventListener('click', function (event) {
  fade(.01)
})

var fadeBSlower = document.querySelector('#fadeBSlower')
fadeBSlower.addEventListener('click', function (event) {
  fade(.001)
})

var channelRingAPlaybackSpeed = document.querySelector('#channelRingAPlaybackSpeed')
channelRingAPlaybackSpeed.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.left.playbackSpeed', event.target.valueAsNumber)
})
channelRingAPlaybackSpeed.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.left.playbackSpeed')
})

var effectChannelPlaybackSpeed = document.querySelector('#effectChannelPlaybackSpeed')
effectChannelPlaybackSpeed.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.effect.playbackSpeed', event.target.valueAsNumber)
})
effectChannelPlaybackSpeed.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.effect.playbackSpeed')
})

var channelRingBPlaybackSpeed = document.querySelector('#channelRingBPlaybackSpeed')
channelRingBPlaybackSpeed.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.right.playbackSpeed', event.target.valueAsNumber)
})
channelRingBPlaybackSpeed.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.right.playbackSpeed')
})

var channelRingARed = document.querySelector('#channelRingARed')
channelRingARed.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.left.red', event.target.valueAsNumber)
})
channelRingARed.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.left.red')
})

var channelRingAGreen = document.querySelector('#channelRingAGreen')
channelRingAGreen.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.left.green', event.target.valueAsNumber)
})
channelRingAGreen.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.left.green')
})

var channelRingABlue = document.querySelector('#channelRingABlue')
channelRingABlue.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.left.blue', event.target.valueAsNumber)
})
channelRingABlue.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.left.blue')
})

var effectChannelRed = document.querySelector('#effectChannelRed')
effectChannelRed.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.effect.red', event.target.valueAsNumber)
})
effectChannelRed.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.effect.red')
})

var effectChannelGreen = document.querySelector('#effectChannelGreen')
effectChannelGreen.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.effect.green', event.target.valueAsNumber)
})
effectChannelGreen.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.effect.green')
})
var effectChannelBlue = document.querySelector('#effectChannelBlue')
effectChannelBlue.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.effect.blue', event.target.valueAsNumber)
})
effectChannelBlue.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.effect.blue')
})

var effectBlendMode = document.querySelector("#effectBlendMode")
effectBlendMode.addEventListener('change', function(event) {
  ipcRenderer.send('set', 'channel.effect.blendMode', parseInt(event.target.value))
})

var effectChannelMix = document.querySelector("#effectChannelMix")
effectChannelMix.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.effect.mix', event.target.valueAsNumber)
})


var channelRingBRed = document.querySelector('#channelRingBRed')
channelRingBRed.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.right.red', event.target.valueAsNumber)
})
channelRingBRed.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.right.red')
})

var channelRingBGreen = document.querySelector('#channelRingBGreen')
channelRingBGreen.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.right.green', event.target.valueAsNumber)
})
channelRingBGreen.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.right.green')
})

var channelRingBBlue = document.querySelector('#channelRingBBlue')
channelRingBBlue.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'channel.right.blue', event.target.valueAsNumber)
})
channelRingBBlue.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'channel.right.blue')
})


var master = document.querySelector('#master')
master.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'master', event.target.valueAsNumber)
})
master.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'master')
})

var saturation = document.querySelector('#saturation')
saturation.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'saturation', event.target.valueAsNumber)
})
saturation.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'saturation')
})

var vignetteSize = document.querySelector('#vignetteSize')
vignetteSize.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'vignetteSize', event.target.valueAsNumber)
})
vignetteSize.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'vignetteSize')
})

var vignetteSmooth = document.querySelector('#vignetteSmooth')
vignetteSmooth.addEventListener('input', function (event) {
  ipcRenderer.send('set', 'vignetteSmooth', event.target.valueAsNumber)
})
vignetteSmooth.addEventListener('click', function (event) {
  if(event.ctrlKey) ipcRenderer.send('setDefault', 'vignetteSmooth')
})


var addShape = document.querySelector('#addShape')
addShape.addEventListener('click', function(e){
  var shapeIndex = selectedShape.valueAsNumber
  shapesCache.push([
    {x:-1, y:-1},
    {x:-1, y:1},
    {x:1, y:1},
    {x:1, y:-1},
  ])
  ipcRenderer.send('set', 'mask.shapes', shapesCache)
  ipcRenderer.send('set', 'ui.selectedShape', shapeIndex+1)
})
var selectedShape = document.querySelector('#selectedShape')
selectedShape.addEventListener('input', function(e){
  ipcRenderer.send('set', 'ui.selectedShape', e.target.valueAsNumber)
})
var removeSelectedShape = document.querySelector('#removeSelectedShape')
  removeSelectedShape.addEventListener('click', function(e){
  var shapeIndex = selectedShape.valueAsNumber

  shapesCache.splice(shapeIndex, 1)
  var nextIndex = (shapeIndex-1+shapesCache.length)%shapesCache.length
  ipcRenderer.send('set', 'mask.shapes', shapesCache)
  ipcRenderer.send('set', 'ui.selectedShape', nextIndex)
})

function lerp(pt1, pt2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return {
    x: pt1.x + (pt2.x - pt1.x) * amount,
    y: pt1.y + (pt2.y - pt1.y) * amount
  }
};
var addPoint = document.querySelector('#addPoint')
addPoint.addEventListener('click', function(e){
  var shapeIndex = selectedShape.valueAsNumber
  var pointIndex = selectedPoint.valueAsNumber
  var shape = shapesCache[shapeIndex]
  if(shape) {
    var point = shape[pointIndex]
    var next = shape[(pointIndex+1)%shape.length]
    var median = lerp( next, point,.5)
    shape.splice(
      pointIndex+1,
      0,
      median
    )
    ipcRenderer.send('set', 'mask.shapes', shapesCache)
    ipcRenderer.send('set', 'ui.selectedPoint', pointIndex+1)
  }
})
var selectedPoint = document.querySelector('#selectedPoint')
selectedPoint.addEventListener('input', function(e){
  ipcRenderer.send('set', 'ui.selectedPoint', e.target.valueAsNumber)
})


var selectedPointUp = document.querySelector('#selectedPointUp')
selectedPointUp.addEventListener('click', function(e){
  var shapeIndex = selectedShape.valueAsNumber
  var pointIndex = selectedPoint.valueAsNumber
  var shape = shapesCache[shapeIndex]
  if(shape) {
    var point = shape[pointIndex]
    point.y +=.001
    ipcRenderer.send('set', 'mask.shapes', shapesCache)
  }
})

var selectedPointDown = document.querySelector('#selectedPointDown')
selectedPointDown.addEventListener('click', function(e){
  var shapeIndex = selectedShape.valueAsNumber
  var pointIndex = selectedPoint.valueAsNumber
  var shape = shapesCache[shapeIndex]
  if(shape) {
    var point = shape[pointIndex]
    point.y -=.001
    ipcRenderer.send('set', 'mask.shapes', shapesCache)
  }
})
var selectedPointRight = document.querySelector('#selectedPointRight')
selectedPointRight.addEventListener('click', function(e){
  var shapeIndex = selectedShape.valueAsNumber
  var pointIndex = selectedPoint.valueAsNumber
  var shape = shapesCache[shapeIndex]
  if(shape) {
    var point = shape[pointIndex]
    point.x +=.001
    ipcRenderer.send('set', 'mask.shapes', shapesCache)
  }
})
var selectedPointLeft = document.querySelector('#selectedPointLeft')
selectedPointLeft.addEventListener('click', function(e){
  var shapeIndex = selectedShape.valueAsNumber
  var pointIndex = selectedPoint.valueAsNumber
  var shape = shapesCache[shapeIndex]
  if(shape) {
    var point = shape[pointIndex]
    point.x -=.001
    ipcRenderer.send('set', 'mask.shapes', shapesCache)
  }
})

function moveCursorToSelected() {

  var shapeIndex = selectedShape.valueAsNumber
  var pointIndex = selectedPoint.valueAsNumber
  var shape = shapesCache[shapeIndex]
  if(shape) {
    var point = shape[pointIndex]
    ipcRenderer.send('set', 'cursor.x', point.x)
    ipcRenderer.send('set', 'cursor.y', point.y)
  }
}
var removeSelectedPoint = document.querySelector('#removeSelectedPoint')
removeSelectedPoint.addEventListener("click", function(e){
  var shapeIndex = selectedShape.valueAsNumber
  var pointIndex = selectedPoint.valueAsNumber
  var shape = shapesCache[shapeIndex]
  if(shape && shape.length >3) {
    var point = shape[pointIndex]
    shape.splice(pointIndex, 1)
    var nextIndex = (pointIndex-1+shape.length)%shape.length
    ipcRenderer.send('set', 'mask.shapes', shapesCache)
    ipcRenderer.send('set', 'ui.selectedPoint', nextIndex)
  }
})

var selectedPointX = document.querySelector('#selectedPointX')
selectedPointX.addEventListener('input', function(e){
  var shape = shapesCache[selectedShape.valueAsNumber]
  if(shape) {
    var point = shape[selectedPoint.valueAsNumber]
    point.x = event.target.valueAsNumber
    ipcRenderer.send('set', 'mask.shapes', shapesCache)
    console.log("shapes after", shapesCache)
  }
})
var selectedPointY = document.querySelector('#selectedPointY')
selectedPointY.addEventListener('input', function(e){
  var shape = shapesCache[selectedShape.valueAsNumber]
  if(shape) {
    var point = shape[selectedPoint.valueAsNumber]
    point.y = event.target.valueAsNumber
    ipcRenderer.send('set', 'mask.shapes', shapesCache)
  }
})


var shapesCache = []



ipcRenderer.on('change', function(event, key, value) {
  switch(key){
    case "play":
    break;
    case "fullscreen":
    break;
    case "nthFrame":
      nthFrame.value = value
    break;
    case "master":
      master.value = value
    break;
    case "saturation":
      saturation.value = value
    break;
    case "vignetteSize":
      vignetteSize.value = value
    break;
    case "vignetteSmooth":
      vignetteSmooth.value = value
    break;
    case "xOffset":
      xOffset.value = value
    break;
    case "yOffset":
      yOffset.value = value
    break;
    case "scaleX":
      scaleX.value = value
    break;
    case "scaleY":
      scaleY.value = value
    break;
    case "scale":
      scale.value = value
    break;
    case "channel.mix":
      channelMixAmount.value = value
    break;
    case "channel.left.src":
      videoAPreview.src = value
      channelRingAVideo.value = value
    break;
    case "channel.left.red":
      channelRingARed.value = value
    break;
    case "channel.left.green":
      channelRingAGreen.value = value
    break;
    case "channel.left.blue":
      channelRingABlue.value = value
    break;
    case "channel.left.playbackSpeed":
      channelRingAPlaybackSpeed.value = value
    break;
    case "channel.right.src":
      videoBPreview.src = value
      channelRingBVideo.value = value
    break;
    case "channel.right.red":
      channelRingBRed.value = value
    break;
    case "channel.right.green":
      channelRingBGreen.value = value
    break;
    case "channel.right.blue":
      channelRingBBlue.value = value
    break;
    case "channel.right.playbackSpeed":
      channelRingBPlaybackSpeed.value = value
    break;

    case "channel.effect.src":
      effectChannelPreview.src = value
      effectChannelVideo.value = value
    break;
    case "channel.effect.red":
      effectChannelRed.value = value
    break;
    case "channel.effect.green":
      effectChannelGreen.value = value
    break;
    case "channel.effect.blue":
      effectChannelBlue.value = value
    break;
    case "channel.effect.playbackSpeed":
      effectChannelPlaybackSpeed.value = value
    break;
    case "channel.effect.blendMode":
      effectBlendMode.value = value
    break;
    case "channel.effect.mix":
      effectChannelMix.value = value
    break;
    case "ui.view":
      console.log("setView", value)
      switch(value) {
        case "mask":
          mixerView.style.display = "none";
          maskView.style.display = "flex";
        break;
        case "mixer":
          mixerView.style.display = "flex";
          maskView.style.display = "none";
        break;
      }
    break;
    case "ui.selectedShape":
      selectedShape.value = value
      updateSelectedShape()
    break;
    case "ui.selectedPoint":
      selectedPoint.value = value
      updateSelectedPoint()
    break;
    case "mask.shapes":
      console.log("update shjape")
      shapesCache = value
      selectedShape.min = 0;
      selectedShape.max = shapesCache.length-1
      selectedShape.value = Math.min(shapesCache.length-1, Math.max(0, selectedShape.value))
      updateSelectedShape()
    break;
  }
})
function updateSelectedShape() {
  console.log("updateSelectedShape")
  var shape = shapesCache[selectedShape.valueAsNumber]
  if(shape) {
    selectedPoint.min = 0;
    selectedPoint.max = shape.length-1
    selectedPoint.value = Math.min(shape.length-1, Math.max(0, selectedPoint.value))
    updateSelectedPoint()
  }
}

function updateSelectedPoint() {
  var shape = shapesCache[selectedShape.valueAsNumber]
  console.log("updateSelectedPoint")
  if(shape) {
    var point = shape[selectedPoint.valueAsNumber]
    console.log("updateSelectedPoint", point)
    selectedPointX.value = point.x
    selectedPointY.value = point.y

    moveCursorToSelected()
  }
}

/*
setShapes = function(shapes) {
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
      var geometry = new THREE.ShapeGeometry(shape)

      var mesh = new THREE.Mesh( geometry, t.material )
      t.shapes.add(mesh)
    }
  }
  t.render()
}
*/
function init(mode) {
  // hit it
  ipcRenderer.send('init')
}
module.exports.init = init
