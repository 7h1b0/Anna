import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';
import SecondaryButton from 'components/secondary-button';
import Alert from 'components/alert';
import Select from 'components/select';
import Checkbox from 'components/checkbox';
import Typographie from 'components/typography';

import type { Dio as DioType } from 'types/dio';
import type { HueLight as HueLightType, HueLightState } from 'types/hue-light';

import useRequest from 'hooks/use-request';

type Props = {
  dios: DioType[];
  hueLights: HueLightType[];
};

type DioAction = {
  targetId: number;
  type: 'DIO';
  body: { on: boolean };
};
type HueLightAction = {
  targetId: number;
  type: 'HUE_LIGHT';
  body: HueLightState;
};
type Action = DioAction | HueLightAction;
type SceneForm = {
  name: string;
  description: string;
  favorite: boolean;
  actions: Action[];
};

function SceneForm({ dios, hueLights }: Props) {
  const [hasError, setError] = React.useState(false);
  const { control, register, handleSubmit } = useForm<SceneForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'actions',
  });
  const request = useRequest();
  const history = useHistory();

  const hueLightsOptions = hueLights.map((light) => ({
    label: light.name,
    value: light.id,
  }));
  const diosOptions = dios.map((dio) => ({
    label: dio.name,
    value: `${dio.dioId}`,
  }));

  async function onSubmit(data: SceneForm) {
    console.log('YOLO', data);
    // try {
    //   await request(`/api/scenes`, 'POST', data);
    //   history.goBack();
    // } catch (error) {
    //   setError(true);
    // }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
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

      <div>
        <Typographie variant="label">Actions:</Typographie>
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="mb-3 text-gray-200 shadow-md rounded bg-gray-800 py-4 px-2 xl:px-4"
            >
              <Select
                name={`actions.${index}.targetId` as const}
                label="Device"
                register={register(`actions.${index}.targetId` as const, {
                  valueAsNumber: true,
                })}
                options={field.type === 'DIO' ? diosOptions : hueLightsOptions}
              />

              <Checkbox
                name={`actions.${index}.body.on`}
                label="On"
                register={register(`actions.${index}.body.on` as const)}
                defaultValue={field.body.on}
              />

              {field.type === 'HUE_LIGHT' && (
                <>
                  <input
                    type="number"
                    min="0"
                    max="254"
                    {...register(`actions.${index}.body.bri` as const, {
                      valueAsNumber: true,
                    })}
                    defaultValue={field.body.bri}
                  />
                  <input
                    type="color"
                    defaultValue={field.body.hex}
                    {...register(`actions.${index}.body.hex` as const)}
                  />
                </>
              )}

              <SecondaryButton type="button" onClick={() => remove(index)}>
                Remove
              </SecondaryButton>
            </div>
          );
        })}
        <div className="grid grid-cols-2 gap-4">
          <SecondaryButton
            type="button"
            onClick={() =>
              append({ type: 'DIO' as const, targetId: 1, body: { on: true } })
            }
          >
            Add Dio
          </SecondaryButton>

          <SecondaryButton
            type="button"
            onClick={() =>
              append({
                type: 'HUE_LIGHT' as const,
                targetId: 1,
                body: {
                  on: true,
                  bri: 250,
                  hex: '#eff7ff',
                },
              })
            }
          >
            Add Hue Light
          </SecondaryButton>
        </div>
      </div>

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default SceneForm;
