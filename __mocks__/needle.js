export default jest.fn((method, url) => {
  if (method === 'get') {
    if (/\/lights$/.test(url)) {
      return Promise.resolve({
        body: {
          '1': {
            state: {
              on: true,
              bri: 163,
              hue: 15736,
              sat: 32,
              effect: 'none',
              xy: [0.3969, 0.3851],
              ct: 272,
              alert: 'none',
              colormode: 'xy',
              reachable: true,
            },
            type: 'Extended color light',
            name: 'MOCK',
            modelid: 'LCT001',
            manufacturername: 'Philips',
          },
          '2': {
            state: {
              on: false,
              bri: 97,
              hue: 17161,
              sat: 38,
              effect: 'none',
              xy: [0.3978, 0.3883],
              ct: 272,
              alert: 'none',
              colormode: 'xy',
              reachable: true,
            },
            type: 'Extended color light',
            name: 'JEST',
            modelid: 'LCT001',
            manufacturername: 'Philips',
          },
        },
      });
    } else if (/\/lights\/[0-9]+$/.test(url)) {
      return Promise.resolve({
        body: {
          state: {
            on: false,
            bri: 163,
            hue: 15736,
            sat: 32,
            effect: 'none',
            xy: [0.3969, 0.3851],
            ct: 272,
            alert: 'none',
            colormode: 'xy',
            reachable: true,
          },
          type: 'Extended color light',
          name: 'MOCK',
          modelid: 'LCT001',
          manufacturername: 'Philips',
        },
      });
    }
    return Promise.resolve();
  }
  if (/\/lights\/[0-9]+$/.test(url)) {
    return Promise.resolve({
      body: [
        {
          success: {
            '/lights/1/name': 'test',
          },
        },
      ],
    });
  } else if (/state/.test(url)) {
    return Promise.resolve({
      body: [
        {
          success: {
            '/lights/1/state/on': true,
          },
        },
      ],
    });
  }
  return Promise.resolve();
});