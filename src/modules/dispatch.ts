import TYPES from './type';
import { AnnaAction } from './actions';
import { findById as findSceneById } from './models/scene';
import { setLightState } from '../services/hueService';
import dioAdd from '../services/dioService';

export default async function dispatch(action: AnnaAction): Promise<any> {
  switch (action.type) {
    case TYPES.HUE_LIGHT:
      return setLightState(action.id, action.body);

    case TYPES.DIO:
      return dioAdd(action.id, action.body.on);

    case TYPES.SCENE:
      return findSceneById(action.id).then(scene => {
        if (scene) {
          return Promise.all(scene.actions.map(action => dispatch(action)));
        }
        throw new Error(`Cannot find scene ${action.id}`);
      });
  }
}
