class Kodi {
  constructor(app, on) {
    this.app = app;
    this.on = on;
    this.KODI_ON_PLAY = 'kodi_on_play';
    this.KODI_ON_RESUME = 'kodi_on_play';
    this.KODI_ON_PAUSE = 'kodi_on_play';
    this.KODI_ON_STOP = 'kodi_on_play';
    this.KODI_ON_ENDED = 'kodi_on_play';
  }

  listen() {
    this.app.get('/api/kodi/play', (req, res) => {
      this.on(this.KODI_ON_PLAY);
      res.end();
    });

    this.app.get('/api/kodi/resume', (req, res) => {
      this.on(this.KODI_ON_RESUME);
      res.end();
    });

    this.app.get('/api/kodi/pause', (req, res) => {
      this.on(this.KODI_ON_PAUSE);
      res.end();
    });

    this.app.get('/api/kodi/stop', (req, res) => {
      this.on(this.KODI_ON_STOP);
      res.end();
    });

    this.app.get('/api/kodi/ended', (req, res) => {
      this.on(this.KODI_ON_ENDED);
      res.end();
    });
  }

  getState() {
    return [this.KODI_ON_PLAY,
      this.KODI_ON_RESUME,
      this.KODI_ON_PAUSE,
      this.KODI_ON_STOP,
      this.KODI_ON_ENDED,
    ];
  }
}

module.exports = Kodi;
