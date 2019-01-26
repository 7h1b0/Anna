import dispatch from '../dispatch';
import * as hueService from '../../services/hueService';
import dioAdd from '../../services/dioService';
import * as Scene from '../models/scene';
import TYPES from '../type';

jest.mock('../../services/dioService', () => jest.fn(async () => {}));

describe('Dispatch', () => {
  beforeAll(() => {
    Scene.findById = jest.fn(() =>
      Promise.resolve({
        actions: [{ type: TYPES.HUE_LIGHT, targetId: 5, body: { on: true } }],
      }),
    );
    hueService.setLightState = jest.fn(async () => {});
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
    await dispatch({ type: TYPES.SCENE, id: '1', body: {} });

    expect(hueService.setLightState).toHaveBeenCalledWith(5, { on: true });
  });
});
