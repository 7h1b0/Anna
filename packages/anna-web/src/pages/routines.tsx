import React from 'react';
import { RouteComponentProps } from '@reach/router';

import Header from 'components/header';
import Routine from 'components/routine';
import ContainerList from 'components/container-list';

// import useFetch from 'src/hooks/use-fetch';

// import { Routine as RoutineType } from 'types/routine';

const fixtures = [
  {
    routineId: '0d71ff45-cab5-4437-abee-7b0af702404b',
    name: 'Leave Home',
    interval: '15 9 * * 1-5',
    sceneId: 'abfff1db-8aaf-4e3a-a8ce-7e1ddb8cd864',
    runAtBankHoliday: false,
    enabled: true,
    createdAt: 1563039655000,
    updatedAt: 1568963701000,
    lastFailedAt: 0,
    lastRunAt: 1568963701000,
    nextRunAt: 1569222900000,
    failReason: null,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    routineId: '43388a08-d8d2-4fcc-9002-8fbad608d418',
    name: 'Morning',
    interval: '20 8 * * 1-5',
    sceneId: 'd552ad52-131e-4c56-920a-5dd792bb126d',
    runAtBankHoliday: false,
    enabled: true,
    createdAt: 1563039659000,
    updatedAt: 1568960400000,
    lastFailedAt: 0,
    lastRunAt: 1568960400000,
    nextRunAt: 1569219600000,
    failReason: null,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    routineId: '49b7081e-006f-4ea1-8ab6-0bfe6e9e51a5',
    name: 'Dyson Off',
    interval: '0 5 * * 1',
    sceneId: 'a5a4146d-ed64-4eaf-b831-453947ecfaea',
    runAtBankHoliday: true,
    enabled: true,
    createdAt: 1563039680000,
    updatedAt: 1568602800000,
    lastFailedAt: 0,
    lastRunAt: 1568602800000,
    nextRunAt: 1569207600000,
    failReason: null,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    routineId: 'cd113700-355e-4e4a-8723-2e1f763efca3',
    name: 'Dyson On',
    interval: '0 0 * * 1',
    sceneId: '6e0bc62a-4f0a-42f8-a0b9-f054db7165bf',
    runAtBankHoliday: true,
    enabled: true,
    createdAt: 1563039650000,
    updatedAt: 1568584800000,
    lastFailedAt: 0,
    lastRunAt: 1568584800000,
    nextRunAt: 1569189600000,
    failReason: null,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
];

const Routines: React.FC<RouteComponentProps> = () => {
  // const scenes = useFetch<RoutineType>('/api/scenes');

  return (
    <>
      <Header title="Routines" />
      <ContainerList column={1}>
        {fixtures.map(({ name, lastRunAt, routineId }) => (
          <Routine
            key={routineId}
            routineId={routineId}
            name={name}
            lastRunAt={lastRunAt}
          />
        ))}
      </ContainerList>
    </>
  );
};

export default Routines;
