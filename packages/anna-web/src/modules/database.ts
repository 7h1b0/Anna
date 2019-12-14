import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { Config } from 'types/config';
import { Room } from 'types/room';
import { Scene } from 'types/scene';
import { Routine } from 'types/routine';
import { Trigger } from 'types/trigger';

export interface AnnaDatabase extends DBSchema {
  scenes: {
    key: string;
    value: Scene;
  };
  routines: {
    key: string;
    value: Routine;
  };
  rooms: {
    key: string;
    value: Room;
  };
  triggers: {
    key: string;
    value: Trigger;
  };
}
export type Stores = 'scenes' | 'routines' | 'rooms' | 'triggers';
export type AnnaThings = Scene | Routine | Trigger | Room;

export async function getDatabase() {
  const db = await openDB<AnnaDatabase>('anna', 1, {
    upgrade(db) {
      db.createObjectStore('scenes', {
        keyPath: 'sceneId',
      });
      db.createObjectStore('routines', {
        keyPath: 'routineId',
      });
      db.createObjectStore('rooms', {
        keyPath: 'roomId',
      });
      db.createObjectStore('triggers', {
        keyPath: 'aliasId',
      });
    },
  });

  return db;
}

export async function saveConfig(
  database: IDBPDatabase<AnnaDatabase>,
  annaConfig: Config,
) {
  console.log('YOLO, will save', annaConfig, database);
  return Promise.all([
    addAll(database, 'scenes', annaConfig.scenes),
    addAll(database, 'routines', annaConfig.routines),
    addAll(database, 'triggers', annaConfig.alias),
    addAll(database, 'rooms', annaConfig.rooms),
  ])
    .then(() => {
      console.log('SUCCEED');
    })
    .catch(console.log);
}

async function addAll(
  database: IDBPDatabase<AnnaDatabase>,
  store: Stores,
  objects: AnnaThings[],
) {
  try {
    const tx = database.transaction(store, 'readwrite');
    objects.forEach(object => {
      tx.store.put(object);
    });
    await tx.done;
  } catch (e) {
    console.log(e);
  }
}
