import TYPES from './type';
import { AnnaAction } from './actions';
import { findById as findSceneById } from './models/scene';
import { setLightState } from 'services/hueService';
import dioAdd from 'services/dioService';

export default async function dispatch(action: AnnaAction): Promise<void> {
  switch (action.type) {
    case TYPES.HUE_LIGHT:
      return setLightState(action.targetId, action.body);

    case TYPES.DIO:
      return dioAdd(action.targetId, action.body.on);

    case TYPES.SCENE:
      await findSceneById(action.targetId).then(scene => {
        if (scene) {
          return Promise.all(scene.actions.map(action => dispatch(action)));
        }
        throw new Error(`Cannot find scene ${action.targetId}`);
      });
  }
}
