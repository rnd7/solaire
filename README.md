# Lux & Lucid Solaire
Video Mixer realized as Electron App. Features 2 + 1 Channels, Blend FXs, Output Masking and Vignette, Color Transform, Adjustable Playback Speed and more. This piece of Software surely can't compete with full fledged VJing Sofware. But therefore it is free.

## Before Download
The vids in the asset directory are quite heavy (> 50MB)

## Installation
You need node and npm installed on your machine. It should work on all platforms electron supports. I only tested in on a linux machine.

```
npm install
```

## Run

```
npm start
```

## Usage
Drag and drop your Videos to the Video input fields within the Channel Section. You can playback 3 Vids simultaneously, one for each Video Channel and one as FX Layer Overlay. Use the Crossfader to blend between the Video Channels. Furthermore Solaire features a simple output masking utility, change to the Mask View and use the sliders to move the mask points. Could be improved in terms of usability, but I had no time. You can write the current Application State to a file called config.json in the data directory. This will overwrite the default configuration. You have to juggle the config files manually, if you want different save files.

## Screenshots
![screenshot](https://raw.githubusercontent.com/rnd7/solaire/master/doc/screenshot.png)


## License

The videos within the assets directory are all copyright by rnd7 and licensed under a Creative Commons Attribution-NonCommercial 4.0 International License. [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/) 
![Creative Commons License](https://i.creativecommons.org/l/by-nc/4.0/88x31.png)

See the [LICENSE](LICENSE.md) file for license rights and limitations (GPL-v3).
