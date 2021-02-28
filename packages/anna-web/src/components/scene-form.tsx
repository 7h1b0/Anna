import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';
import SecondaryButton from 'components/secondary-button';
import Alert from 'components/alert';
import Select from 'components/select';
import Checkbox from 'components/checkbox';
import Typographie from 'components/typography';

import type { Dio as DioType } from 'types/dio';
import type { HueLight as HueLightType } from 'types/hue-light';

import useRequest from 'hooks/use-request';

type Props = {
  dios: DioType[];
  hueLights: HueLightType[];
};

type SceneForm = {
  name: string;
  description: string;
  favorite: boolean;
  actions: { targetId: number; type: 'DIO' | 'HUE_LIGHT'; body: object }[];
};

function SceneForm({ dios, hueLights }: Props) {
  const [hasError, setError] = React.useState(false);
  const { register, handleSubmit, watch } = useForm<SceneForm>();
  const watchActions = watch('actions');
  const request = useRequest();
  const history = useHistory();

  const [actions, setActions] = React.useState<number>(0);

  const hueLightsOptions = hueLights.map((light) => ({
    label: light.name,
    value: light.id,
  }));
  const diosOptions = dios.map((dio) => ({
    label: dio.name,
    value: `${dio.dioId}`,
  }));

  async function onSubmit(data: SceneForm) {
    try {
      await request(`/api/scenes`, 'POST', data);
      history.goBack();
    } catch (error) {
      setError(true);
    }
  }

  console.log('YOLO', watchActions);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {hasError && <Alert>Invalid form</Alert>}
      <Input name="name" label="name" register={register('name')} />
      <Input
        name="description"
        label="description"
        register={register('description')}
      />
      <Checkbox
        name="favorite"
        label="favorite"
        register={register('favorite')}
      />

      <Typographie variant="label">Actions:</Typographie>
      {Array.from({ length: actions }, (_, i) => i).map((i: number) => {
        return (
          <div
            key={i}
            className="mb-3 text-gray-200 shadow-md rounded bg-gray-800 py-4 px-2 xl:px-4"
          >
            <div className="flex justify-around">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="HUE_LIGHT"
                  className="mx-3"
                  {...register(`actions[${i}].type`)}
                />
                Hue Light
              </label>
              <label>
                <input
                  type="radio"
                  value="DIO"
                  className="mx-3"
                  {...register(`actions[${i}].type`)}
                />
                Dio
              </label>
            </div>

            {watchActions?.[i] && (
              <Select
                name={`actions[${i}].targetId`}
                label="Device"
                register={register(`actions[${i}].targetId`, {
                  valueAsNumber: true,
                })}
                options={
                  watchActions[i].type === 'DIO'
                    ? diosOptions
                    : hueLightsOptions
                }
              />
            )}

            <Checkbox
              name={`actions[${i}].body.on`}
              label="On"
              register={register(`actions[${i}].body.on`)}
            />
          </div>
        );
      })}

      <SecondaryButton
        type="button"
        onClick={() => setActions((actions) => actions + 1)}
      >
        Add action
      </SecondaryButton>

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default SceneForm;
