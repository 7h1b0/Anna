import Ajv from 'ajv';
import uuidv4 from 'uuid/v4';
import knex from '../../knexClient';
import sceneSchema from '../schemas/scene';
import { TABLE as ACTION_TABLE, findBySceneId } from './action';

export const TABLE = 'scenes';
export const COLUMNS = [
  'sceneId',
  'name',
  'description',
  'createdAt',
  'updatedAt',
  'createdBy',
];

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(sceneSchema, data);
}

export function findAll() {
  return knex(TABLE).select(COLUMNS);
}

export async function findById(sceneId) {
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

export function findByIdAndUpdate({ sceneId, name, description, actions }) {
  return knex
    .transaction(trx => {
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
              const formatedAction = {
                type: action.type,
                name: action.name,
                targetId: action.targetId,
                sceneId,
                body: JSON.stringify(action.body),
              };
              return trx.insert(formatedAction).into(ACTION_TABLE);
            }),
          );
        });
    })
    .catch(err => {
      if (err.message === 'No scene found') {
        return 0;
      }
      throw err;
    });
}

export async function save({ name, description, userId, actions }) {
  const sceneId = uuidv4();
  await knex.transaction(trx => {
    const insertIntoScene = trx
      .insert({
        sceneId,
        description,
        name,
        createdBy: userId,
      })
      .into(TABLE);

    const insertIntoActions = actions.map(action => {
      const formatedAction = {
        type: action.type,
        name: action.name,
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

export function remove(sceneId) {
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
