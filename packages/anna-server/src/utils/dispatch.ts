import TYPES from './type';
import { AnnaAction } from './actions';
import { findBySceneId } from 'modules/scene/action';
import dioAdd from 'modules/dio/service';
import { setLightState } from 'services/hueService';

export default async function dispatch(action: AnnaAction): Promise<void> {
  switch (action.type) {
    case TYPES.HUE_LIGHT:
      return setLightState(action.targetId, action.body);

    case TYPES.DIO:
      return dioAdd(action.targetId, action.body.on);

    case TYPES.SCENE:
      await findBySceneId(action.targetId).then((actions) => {
        if (actions) {
          return Promise.all(actions.map((action) => dispatch(action)));
        }
        throw new Error(`Cannot find scene ${action.targetId}`);
      });
  }
}
