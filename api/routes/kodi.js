const Scene = require('./../models/scene');

module.exports = app => {
  const SCENE_BUREAU = '57530676aa74142655f13156';
  const SCENE_TELEVISION = '57530665aa74142655f13149';
  const SCENE_CINEMA = '57530652aa74142655f1313c';

  function callScene(sceneID) {
    Scene.findById(sceneID)
      .then(scene => scene.recall(app.service.hue));
  }

  function isDinerTime() {
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    return !(hour < 19 || (hour === 21 && min > 30) || hour >= 22);
  }

  app.get('/api/kodi/start', (req, res) => {
    if (isDinerTime()) {
      callScene(SCENE_TELEVISION, req);
    } else {
      callScene(SCENE_CINEMA, req);
    }
    res.end();
  });

  app.get('/api/kodi/resume', (req, res) => {
    if (isDinerTime()) {
      callScene(SCENE_TELEVISION, req);
    } else {
      callScene(SCENE_CINEMA, req);
    }
    res.end();
  });

  app.get('/api/kodi/pause', (req, res) => {
    callScene(SCENE_BUREAU, req);
    res.end();
  });

  app.get('/api/kodi/stop', (req, res) => {
    callScene(SCENE_BUREAU, req);
    res.end();
  });

  app.get('/api/kodi/ended', (req, res) => {
    callScene(SCENE_BUREAU, req);
    res.end();
  });
};
