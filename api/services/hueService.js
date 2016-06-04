const request = require('./requestService');

function toArray(jsonObject) {
  const ids = Object.keys(jsonObject);
  return ids.map(id =>
    Object.assign({}, jsonObject[id], { _id: id })
  );
}

function extractId(jsonArray) {
  return jsonArray[0].success.id;
}

class HueService {
  constructor(hostname, username) {
    this.hostname = hostname;
    this.username = username;
    this.api = `http://${this.hostname}/api/${this.username}`;
  }

  // -----------------------------------------
  // Getters
  getHostname() {
    return this.hostname;
  }

  getUsername() {
    return this.username;
  }

  // -----------------------------------------
  // Lights API
  getLights() {
    return new Promise((resolve, reject) => {
      request.get(`${this.api}/lights`)
        .then(body => {
          let correctedBody = body;
          if (body) {
            correctedBody = toArray(body);
          }
          resolve(correctedBody);
        })
        .catch(err => reject(err));
    });
  }

  getLight(id) {
    return request.get(`${this.api}/lights/${id}`);
  }

  renameLight(id, name) {
    return request.put(`${this.api}/lights/${id}`, { name });
  }

  setLightState(id, body) {
    return request.put(`${this.api}/lights/${id}/state`, body);
  }

  switchLight(id, on) {
    return this.setLightState(id, { on });
  }

  // -----------------------------------------
  // Scenes API
  getScenes() {
    return new Promise((resolve, reject) => {
      request.get(`${this.api}/scenes`)
        .then(body => {
          let correctedBody = body;
          if (body) {
            correctedBody = toArray(body);
          }
          resolve(correctedBody);
        })
        .catch(err => reject(err));
    });
  }

  getScene(id) {
    return request.get(`${this.api}/scenes/${id}`);
  }

  createScene(scene) {
    return new Promise((resolve, reject) => {
      request.post(`${this.api}/scenes`, scene)
        .then(body => {
          const id = extractId(body);
          resolve(id);
        })
        .catch(err => reject(err));
    });
  }

  setScene(id, body) {
    return request.put(`${this.api}/scenes/${id}`, body);
  }

  setSceneLightStates(id, idLight, body) {
    return request.put(`${this.api}/scenes/${id}/lightstates/${idLight}`, body);
  }

  deleteScene(id) {
    return request.delete(`${this.api}/scenes/${id}`);
  }

  recallScene(id) {
    return request.put(`${this.api}/groups/0/action`, { scene: id });
  }

  // -----------------------------------------
  // Schedules API
  getSchedules() {
    return new Promise((resolve, reject) => {
      request.get(`${this.api}/schedules`)
        .then(body => {
          let correctedBody = body;
          if (body) {
            correctedBody = toArray(body);
          }
          resolve(correctedBody);
        })
        .catch(err => reject(err));
    });
  }

  getSchedule(id) {
    return request.get(`${this.api}/schedules/${id}`);
  }

  createSchedule(schedule) {
    return new Promise((resolve, reject) => {
      request.post(`${this.api}/schedules`, schedule)
        .then(body => {
          const id = extractId(body);
          resolve(id);
        })
        .catch(err => reject(err));
    });
  }

  setSchedule(id, body) {
    return request.put(`${this.api}/schedules/${id}`, body);
  }

  deleteSchedule(id) {
    return request.delete(`${this.api}/schedules/${id}`);
  }

  startSchedule(id) {
    return this.setSchedule(id, { status: 'enabled' });
  }

  stopSchedule(id) {
    return this.setSchedule(id, { status: 'disabled' });
  }

  // -----------------------------------------
  // Rules API
  getRules() {
    return new Promise((resolve, reject) => {
      request.get(`${this.api}/rules`)
        .then(body => {
          let correctedBody = body;
          if (body) {
            correctedBody = toArray(body);
          }
          resolve(correctedBody);
        })
        .catch(err => reject(err));
    });
  }

  getRule(id) {
    return request.get(`${this.api}/rules/${id}`);
  }

  createRule(rule) {
    return new Promise((resolve, reject) => {
      request.post(`${this.api}/rules`, rule)
        .then(body => {
          const id = extractId(body);
          resolve(id);
        })
        .catch(err => reject(err));
    });
  }

  setRule(id, body) {
    return request.put(`${this.api}/rules/${id}`, body);
  }

  deleteRule(id) {
    return request.delete(`${this.api}/rules/${id}`);
  }

  // -----------------------------------------
  // Sensors API
  getSensors() {
    return new Promise((resolve, reject) => {
      request.get(`${this.api}/sensors`)
        .then(body => {
          let correctedBody = body;
          if (body) {
            correctedBody = toArray(body);
          }
          resolve(correctedBody);
        })
        .catch(err => reject(err));
    });
  }

  getSensor(id) {
    return request.get(`${this.api}/sensors/${id}`);
  }

  createSensor(sensor) {
    return new Promise((resolve, reject) => {
      request.post(`${this.api}/sensors`, sensor)
        .then(body => {
          const id = extractId(body);
          resolve(id);
        })
        .catch(err => reject(err));
    });
  }

  setSensor(id, body) {
    return request.put(`${this.api}/sensors/${id}`, body);
  }

  setSensorConfig(id, body) {
    return request.put(`${this.api}/sensors/${id}/config`, body);
  }

  setSensorState(id, body) {
    return request.put(`${this.api}/sensors/${id}/state`, body);
  }

  deleteSensor(id) {
    return request.delete(`${this.api}/sensors/${id}`);
  }

  // -----------------------------------------
  // State API
  getState() {
    return this.getLights();
  }

  restoreState(state) {
    const result = state.reduce((promises, lighState) => {
      const promise = request.setLightState(lighState._id, lighState.state);
      return promises.concat(promise);
    }, []);

    return Promise.all(result);
  }
}

module.exports = HueService;
