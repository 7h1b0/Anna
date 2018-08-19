import { HUE_LIGHT, DIO, SCENE } from './type';
import { findById as findSceneById } from './models/scene';
import { setLightState } from '../services/hueService';
import dioAdd from '../services/dioService';

export default function dispatch({ type, id, body }) {
  switch (type) {
    case HUE_LIGHT:
      return setLightState(id, body);

    case DIO:
      return dioAdd(id, body.on);

    case SCENE:
      return findSceneById(id).then(scene => {
        if (scene) {
          return Promise.all(
            scene.actions.map(({ type, targetId, body }) =>
              dispatch({ type, id: targetId, body }),
            ),
          );
        }
        throw new Error(`Cannot find scene ${id}`);
      });

    default:
      return Promise.reject(`Unknow type ${type}`);
  }
}
