import React from 'react';
import { useParams } from 'react-router-dom';

import Title from 'src/components/title';
import TriggerForm from 'components/trigger-form';

import { useDataStoreGetAll, useDataStoreGet } from 'context/db-context';

import { Trigger as TriggerType } from 'types/trigger';
import { Scene as SceneType } from 'types/scene';

const TriggerEdit: React.FC<{}> = () => {
  const { triggerId = '' } = useParams();
  const trigger = useDataStoreGet<TriggerType>('triggers', triggerId);
  const scenes = useDataStoreGetAll<SceneType>('scenes');

  if (trigger && scenes) {
    return (
      <>
        <Title title="Trigger Form" activateNavigation />
        <TriggerForm trigger={trigger} scenes={scenes} />
      </>
    );
  }
  return null;
};

export default TriggerEdit;
