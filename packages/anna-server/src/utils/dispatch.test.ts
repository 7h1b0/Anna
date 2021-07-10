import dispatch from './dispatch';
import * as hueService from '../services/hueService';
import dioAdd from '../modules/dio/service';
import * as Action from '../modules/scene/action';
import { toggleHueLight } from './actions';
import TYPES from './type';

jest.mock('../modules/dio/service', () => jest.fn().mockResolvedValue(void 0));

describe('Dispatch', () => {
  beforeAll(() => {
    jest
      .spyOn(Action, 'findBySceneId')
      .mockResolvedValue([toggleHueLight('5', true)]);

    jest.spyOn(hueService, 'setLightState').mockResolvedValue(void 0);
  });

  it('should call hueService when type is HUE_LIGHT', async () => {
    await dispatch({
      type: TYPES.HUE_LIGHT,
      targetId: '1',
      body: { on: true },
    });

    expect(hueService.setLightState).toHaveBeenCalledWith('1', { on: true });
  });

  it('should call dioService when type is DIO', async () => {
    await dispatch({ type: TYPES.DIO, targetId: '1', body: { on: false } });

    expect(dioAdd).toHaveBeenCalledWith('1', false);
  });

  it("should call services according scene's actions", async () => {
    await dispatch({ type: TYPES.SCENE, targetId: '1' });

    expect(hueService.setLightState).toHaveBeenCalledWith('5', { on: true });
  });
});
