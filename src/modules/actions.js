import { DIO, HUE_LIGHT, SCENE } from './type';

export function toggleDio(id, on) {
  return {
    type: DIO,
    body: { on },
    id,
  };
}

export function toggleHueLight(id, on) {
  return {
    type: HUE_LIGHT,
    body: { on },
    id,
  };
}

export function callScene(id) {
  return {
    type: SCENE,
    id,
  };
}
