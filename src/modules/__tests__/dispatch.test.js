import dispatch from '../dispatch';
import * as hueService from '../../services/hueService';
import dioAdd from '../../services/dioService';
import * as Scene from '../models/scene';
import { HUE_LIGHT, DIO, SCENE } from '../type';

jest.mock('../../services/dioService', () => jest.fn(() => Promise.resolve()));

describe('Dispatch', () => {
  beforeAll(() => {
    Scene.findById = jest.fn(() =>
      Promise.resolve({
        actions: [{ type: HUE_LIGHT, targetId: 5, body: { on: true } }],
      }),
    );
    hueService.setLightState = jest.fn(() => Promise.resolve());
  });

  afterEach(() => {
    hueService.setLightState.mockClear();
    dioAdd.mockClear();
    Scene.findById.mockClear();
  });

  it('should call hueService when type is HUE_LIGHT', async () => {
    await dispatch({ type: HUE_LIGHT, id: 1, body: {} });

    expect(hueService.setLightState).toHaveBeenCalledWith(1, {});
  });

  it('should call dioService when type is DIO', async () => {
    await dispatch({ type: DIO, id: 1, body: { on: false } });

    expect(dioAdd).toHaveBeenCalledWith(1, false);
  });

  it('should call hueService and dioService when type is SCENE', async () => {
    await dispatch({ type: SCENE, id: 1, body: {} });

    expect(hueService.setLightState).toHaveBeenCalledWith(5, { on: true });
  });

  it('should reject if type is unknow', () => {
    expect(dispatch({ type: 'TEST', id: 1, body: {} })).rejects.toBeDefined();
  });
});
