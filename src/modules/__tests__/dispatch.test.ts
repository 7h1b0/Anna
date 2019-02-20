import dispatch from '../dispatch';
import * as hueService from '../../services/hueService';
import dioAdd from '../../services/dioService';
import * as Scene from '../models/scene';
import { SceneAction } from 'modules/models/scene';
import { toggleHueLight } from 'modules/actions';
import TYPES from '../type';

jest.mock('../../services/dioService', () => jest.fn(async () => {}));

describe('Dispatch', () => {
  beforeAll(() => {
    jest.spyOn(Scene, 'findById').mockImplementation(async () => {
      return new SceneAction('test', 'test', 'test', 'test', [
        toggleHueLight('5', true),
      ]);
    });

    jest.spyOn(hueService, 'setLightState').mockImplementation(async () => {});
  });

  it('should call hueService when type is HUE_LIGHT', async () => {
    await dispatch({ type: TYPES.HUE_LIGHT, id: '1', body: { on: true } });

    expect(hueService.setLightState).toHaveBeenCalledWith(1, { on: true });
  });

  it('should call dioService when type is DIO', async () => {
    await dispatch({ type: TYPES.DIO, id: '1', body: { on: false } });

    expect(dioAdd).toHaveBeenCalledWith(1, false);
  });

  it('should call hueService and dioService when type is SCENE', async () => {
    await dispatch({ type: TYPES.SCENE, id: '1' });

    expect(hueService.setLightState).toHaveBeenCalledWith(5, { on: true });
  });
});
