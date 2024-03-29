import TYPES from './type';
import { DioBody, HueLigthBody } from '../modules/scene/action';

type Action = {
  type: string;
  targetId: string;
};

export class ToggleDio implements Action {
  readonly type = TYPES.DIO;
  constructor(public targetId: string, public body: DioBody) {}
}

export class ToggleHueLight implements Action {
  readonly type = TYPES.HUE_LIGHT;
  constructor(public targetId: string, public body: HueLigthBody) {}
}

class CallScene implements Action {
  readonly type = TYPES.SCENE;
  constructor(public targetId: string) {}
}

class CallAlias implements Action {
  readonly type = TYPES.ALIAS;
  constructor(public targetId: string) {}
}

export function toggleDio(targetId: string, on: boolean) {
  return new ToggleDio(targetId, { on });
}

export function toggleHueLight(targetId: string, on: boolean) {
  return new ToggleHueLight(targetId, { on });
}

export function callScene(targetId: string) {
  return new CallScene(targetId);
}

export function callAlias(alias: string) {
  return new CallAlias(alias);
}

export type AnnaAction = ToggleDio | ToggleHueLight | CallScene | CallAlias;
