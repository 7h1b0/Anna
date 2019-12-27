import React from 'react';
import { IDBPDatabase } from 'idb';

import {
  AnnaDatabase,
  getDatabase,
  Stores,
  AnnaThings,
} from 'modules/database';

const DataStoreContext = React.createContext<IDBPDatabase<AnnaDatabase> | null>(
  null,
);

export function useDataStoreGetAll<T extends AnnaThings>(
  storeName: Stores,
): T[] | null {
  const [data, setData] = React.useState<T[] | null>(null);
  const datastore = React.useContext(DataStoreContext);
  React.useEffect(() => {
    async function fetchData() {
      if (datastore !== null) {
        const data = await datastore.getAll(storeName);
        // @ts-ignore
        setData(data);
      }
    }
    fetchData();
  }, [storeName, datastore]);
  return data;
}

export function useDataStoreGet<T extends AnnaThings>(
  storeName: Stores,
  annaThingsId: string,
): T | null {
  const [data, setData] = React.useState<T | null>(null);
  const datastore = React.useContext(DataStoreContext);
  React.useEffect(() => {
    async function fetchData() {
      if (datastore !== null) {
        const data = await datastore.get(storeName, annaThingsId);
        // @ts-ignore
        setData(data);
      }
    }
    fetchData();
  }, [storeName, datastore, annaThingsId]);
  return data;
}

export function useDatabase() {
  const db = React.useContext(DataStoreContext);
  if (db === null) {
    throw new Error(`Datastore shouldn't be null`);
  }
  return db;
}

export const DatabaseProvider: React.FC<{}> = ({ children }) => {
  const [isLoading, loading] = React.useState(true);
  const [db, setDb] = React.useState<IDBPDatabase<AnnaDatabase> | null>(null);

  React.useEffect(() => {
    async function fetchDatabase() {
      const db = await getDatabase();
      setDb(db);
      loading(false);
    }
    fetchDatabase();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <DataStoreContext.Provider value={db}>{children}</DataStoreContext.Provider>
  );
};
