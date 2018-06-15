const dispatch = require('../dispatch');
const hueService = require('../../services/hueService');
const dioService = require('../../services/dioService');
const Scene = require('../models/scene');
const { HUE_LIGHT, DIO, SCENE } = require('../type');

describe('Dispatch', () => {
  beforeAll(() => {
    Scene.findById = jest.fn(() =>
      Promise.resolve({
        actions: [{ type: HUE_LIGHT, id: 5, body: { on: true } }],
      }),
    );
    hueService.setLightState = jest.fn(() => Promise.resolve());
    dioService.add = jest.fn(() => Promise.resolve());
  });

  afterEach(() => {
    hueService.setLightState.mockClear();
    dioService.add.mockClear();
    Scene.findById.mockClear();
  });

  it('should call hueService when type is HUE_LIGHT', async () => {
    await dispatch({ type: HUE_LIGHT, id: 1, body: {} });

    expect(hueService.setLightState).toHaveBeenCalledWith(1, {});
  });

  it('should call dioService when type is DIO', async () => {
    await dispatch({ type: DIO, id: 1, body: { on: false } });

    expect(dioService.add).toHaveBeenCalledWith(1, false);
  });

  it('should call hueService and dioService when type is SCENE', async () => {
    await dispatch({ type: SCENE, id: 1, body: {} });

    expect(hueService.setLightState).toHaveBeenCalledWith(5, { on: true });
  });

  it('should reject if type is unknow', () => {
    expect(dispatch({ type: 'TEST', id: 1, body: {} })).rejects.toBeDefined();
  });
});
