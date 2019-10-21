import Ajv from 'ajv';
import uuidv4 from 'uuid/v4';
import knex from '../../knexClient';
import sceneSchema from './schema';
import { TABLE as ACTION_TABLE, findBySceneId } from './action';
import { ToggleDio, ToggleHueLight } from 'utils/actions';

export const TABLE = 'scenes';
export const COLUMNS = [
  'sceneId',
  'name',
  'description',
  'createdAt',
  'updatedAt',
  'createdBy',
];

export class Scene {
  constructor(
    public sceneId: string,
    public name: string,
    public description: string,
    public createdBy: string,
    public createdAt?: number,
    public updatedAt?: number,
  ) {}
}

export class SceneAction extends Scene {
  constructor(
    sceneId: string,
    name: string,
    description: string,
    createdBy: string,
    public actions: (ToggleDio | ToggleHueLight)[],
    createdAt?: number,
    updatedAt?: number,
  ) {
    super(sceneId, name, description, createdBy, createdAt, updatedAt);
  }
}

export function validate(data: object) {
  const ajv = new Ajv();
  return ajv.validate(sceneSchema, data);
}

export async function findAll(): Promise<Scene[]> {
  return knex(TABLE).select(COLUMNS);
}

export async function findById(
  sceneId: string,
): Promise<SceneAction | undefined> {
  const fetchScene = knex(TABLE)
    .first(COLUMNS)
    .where('sceneId', sceneId);
  const fetchActions = findBySceneId(sceneId);

  const [scene, actions] = await Promise.all([fetchScene, fetchActions]);
  if (scene) {
    return { ...scene, actions };
  }
  return;
}

export async function findByIdAndUpdate({
  sceneId,
  name,
  description,
  actions,
}: SceneAction) {
  return knex
    .transaction(async trx => {
      return trx
        .update({ name, description })
        .where('sceneId', sceneId)
        .into(TABLE)
        .then(row => {
          if (row < 1) {
            throw new Error('No scene found');
          }
          return trx
            .del()
            .where('sceneId', sceneId)
            .into(ACTION_TABLE);
        })
        .then(() => {
          return Promise.all(
            actions.map(action => {
              const actionId = uuidv4();
              const formatedAction = {
                type: action.type,
                targetId: action.targetId,
                sceneId,
                actionId,
                body: JSON.stringify(action.body),
              };
              return trx.insert(formatedAction).into(ACTION_TABLE);
            }),
          );
        });
    })
    .catch((err: Error) => {
      if (err.message === 'No scene found') {
        return 0;
      }
      throw err;
    });
}

export async function save({
  name,
  description,
  createdBy,
  actions,
}: SceneAction) {
  const sceneId = uuidv4();
  await knex.transaction(trx => {
    const insertIntoScene = trx
      .insert({
        sceneId,
        description,
        name,
        createdBy,
      })
      .into(TABLE);

    const insertIntoActions = actions.map(action => {
      const formatedAction = {
        type: action.type,
        targetId: action.targetId,
        sceneId,
        body: JSON.stringify(action.body),
        actionId: uuidv4(),
      };
      return trx.insert(formatedAction).into(ACTION_TABLE);
    });

    return Promise.all([insertIntoScene, ...insertIntoActions]);
  });

  return sceneId;
}

export async function remove(sceneId: string): Promise<number[]> {
  return knex.transaction(trx => {
    const removeScene = trx
      .del()
      .where('sceneId', sceneId)
      .into(TABLE);

    const removeActions = trx
      .del()
      .where('sceneId', sceneId)
      .into(ACTION_TABLE);

    return Promise.all([removeScene, removeActions]);
  });
}
