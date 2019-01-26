import TYPES from './type';

interface Action {
  type: string;
  id: string;
}

export class ToggleDio implements Action {
  readonly type = TYPES.DIO;
  constructor(public id: string, public body: { on: boolean }) {}
}

export class ToggleHueLight implements Action {
  readonly type = TYPES.HUE_LIGHT;
  constructor(public id: string, public body: { on: boolean }) {}
}

class CallScene implements Action {
  readonly type = TYPES.SCENE;
  constructor(public id: string) {}
}

export function toggleDio(id: string, on: boolean) {
  return new ToggleDio(id, { on });
}

export function toggleHueLight(id: string, on: boolean) {
  return new ToggleHueLight(id, { on });
}

export function callScene(id: string) {
  return new CallScene(id);
}

export type AnnaAction = ToggleDio | ToggleHueLight | CallScene;
