const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const {ipcMain} = electron
const THREE = require('three')
const fs = require('fs')
const path = require('path')
const url = require('url')

let controlsWindow
let displayWindow

let fullscreen = false

function toggleFullscreen() {
  //  fullscreen = !fullscreen
  //  displayWindow.setFullScreen(fullscreen)
}
function createWindow() {
  controlsWindow = new BrowserWindow({width: 1024, height: 768})
  controlsWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'component/controls/ui.html'),
    protocol: 'file:',
    slashes: true
  }))
  // Open the DevTools.
  //controlsWindow.webContents.openDevTools()
  controlsWindow.on('closed', function () {
    controlsWindow = null
  })
  controlsWindow.setMenu(null)

  displayWindow = new BrowserWindow({width: 960, height: 540})
  displayWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'component/display/ui.html'),
    protocol: 'file:',
    slashes: true
  }))
  // Open the DevTools.
  //displayWindow.webContents.openDevTools()
  displayWindow.on('closed', function () {
    displayWindow = null
  })
  displayWindow.setMenu(null)
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})


var defaults = {
  play: true,
  fullscreen: false,
  nthFrame: 1,
  master: 1,
  saturation: 1,
  vignetteSize: 1,
  vignetteSmooth: .5,
  xOffset: 0,
  yOffset: 0,
  scaleX: 1,
  scaleY: 1,
  scale: 1,
  zOffset: 1,
  channel:{
    mix: 0.5,
    left: {
      src: path.resolve('./assets/scene7_3.mp4'),
      playbackSpeed: 1.0,
      red: 0,
      green: 0,
      blue: 0,
    },
    effect: {
      src: path.resolve('./assets/scene6_2.mp4'),
      playbackSpeed: 1.0,
      red: 0,
      green: 0,
      blue: 0,
      blendMode: 0,
      mix: 0,
    },
    right: {
      src: path.resolve('./assets/scene3.mp4'),
      playbackSpeed: 1.0,
      red: 0,
      green: 0,
      blue: 0,
    },
  },
  mask: {
    use: true,
    shapes:[
      [
        {x:-1, y:-1},
        {x:-1, y:1},
        {x:1, y:1},
        {x:1, y:-1},
      ]
    ]
  },
  ui:{
    view: "mixer",
    selectedShape: 0,
    selectedPoint: 0
  },
  cursor:{
    x:0,
    y:0
  }
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

var model = clone(defaults)

function setRecursive(pointer, path, value) {
  var name = path.shift()
  if(pointer.hasOwnProperty(name)) {
    if(path.length) setRecursive(pointer[name], path, value)
    else pointer[name] = value
  }
}

function notifyRecursive(ipc, pointer, path) {
  if (!ipc) return
  for (var k in pointer) {
    pathBranch = path.slice(0)
    pathBranch.push(k)
    if(pointer[k] !== null && typeof pointer[k]  === 'object' && !(pointer[k] instanceof Array) ) {
      notifyRecursive(ipc, pointer[k], pathBranch)
    } else {
      ipc.send('change', pathBranch.join('.'), pointer[k])
    }
  }
}

function findDefaultRecursive(pointer, path, value) {
  var name = path.shift()
  if(pointer.hasOwnProperty(name)) {
    if(path.length) return findDefaultRecursive(pointer[name], path, value)
    else return pointer[name]
  }
}

function set(key, value) {
  setRecursive(model, key.split('.'), value)
  if(displayWindow) displayWindow.send('change', key, value)
  if(controlsWindow) controlsWindow.send('change', key, value)
}

function setDefault(key) {
  var value = findDefaultRecursive(defaults, key.split('.'), value)
  set(key, value)
}

ipcMain.on('get', function(event, key, value){
  displayWindow.send('get', key, value)
})

ipcMain.on('setDefault', function(event, key){
  setDefault(key)
})

ipcMain.on('init', function(event){
  notifyRecursive(event.sender, model, [])
})

ipcMain.on('set', function(event, key, value){
  set(key, value)
})

STORE = 'data/config.json'

ipcMain.on('saveModel', function(event){
  var json = JSON.stringify(model)
  fs.writeFile(STORE, json, 'utf8', (err) => {
      if (err) {
        console.warn("write error", err)
      } else {
        console.log("wrote file")
      }
    })
})

ipcMain.on('loadModel', function(event){
  fs.readFile(STORE, 'utf8', (err, contents) => {
      if (err) {
        console.warn(err)
      } else {
        model = JSON.parse(contents)
        notifyRecursive(displayWindow, model, [])
        notifyRecursive(controlsWindow, model, [])
      }
    })
})
