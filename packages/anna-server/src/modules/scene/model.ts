import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';
import knex from '../../knexClient';
import sceneSchema from './schema';
import { TABLE as ACTION_TABLE, findBySceneId } from './action';
import { ToggleDio, ToggleHueLight } from 'utils/actions';

export const TABLE = 'scenes';
export const COLUMNS = [
  'sceneId',
  'name',
  'description',
  'favorite',
  'createdAt',
  'updatedAt',
  'createdBy',
];

export type Scene = {
  sceneId: string;
  name: string;
  description: string;
  createdBy: string;
  favorite: boolean;
  createdAt?: number;
  updatedAt?: number;
};

export type SceneAction = {
  actions: (ToggleDio | ToggleHueLight)[];
} & Scene;

export function validate(data: Record<string, unknown>) {
  const ajv = new Ajv();
  return ajv.validate(sceneSchema, data);
}

export async function findAll(): Promise<Scene[]> {
  return knex(TABLE).select(COLUMNS);
}

export async function findById(
  sceneId: string,
): Promise<SceneAction | undefined> {
  const fetchScene = knex(TABLE).first(COLUMNS).where('sceneId', sceneId);
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
  favorite,
  actions,
}: SceneAction) {
  return knex
    .transaction(async (trx) => {
      return trx
        .update({ name, description, favorite })
        .where('sceneId', sceneId)
        .into(TABLE)
        .then((row) => {
          if (row < 1) {
            throw new Error('No scene found');
          }
          return trx.del().where('sceneId', sceneId).into(ACTION_TABLE);
        })
        .then(() => {
          return Promise.all(
            actions.map((action) => {
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
  favorite,
  createdBy,
  actions,
}: Omit<SceneAction, 'sceneId'>) {
  const sceneId = uuidv4();
  await knex.transaction((trx) => {
    const insertIntoScene = trx
      .insert({
        sceneId,
        description,
        favorite,
        name,
        createdBy,
      })
      .into(TABLE);

    const insertIntoActions = actions.map((action) => {
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
  return knex.transaction((trx) => {
    const removeScene = trx.del().where('sceneId', sceneId).into(TABLE);

    const removeActions = trx
      .del()
      .where('sceneId', sceneId)
      .into(ACTION_TABLE);

    return Promise.all([removeScene, removeActions]);
  });
}

export async function findAllFavorite(): Promise<Scene[]> {
  return knex(TABLE).select(COLUMNS).where('favorite', true);
}
