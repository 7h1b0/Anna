import React from 'react';

import { BarChart, XAxis, Bar, LabelList, ResponsiveContainer } from 'recharts';

import useFetch from 'hooks/use-fetch';
import Title from 'src/components/title';

import { Consumption } from 'src/types/consumption';
import Loader from 'src/components/loader';
import Typography from 'src/components/typography';

function format(timestamp) {
  const date = new Date(timestamp);
  return `${date.getDate()}`.padStart(2, '0');
}
function formatDate(data) {
  return data.map((d) => ({
    date: format(d.date),
    value: d.value,
  }));
}
const ConsumptionPage: React.FC<{}> = () => {
  const consumptions = useFetch<Consumption[]>(`/api/consumption`);

  if (consumptions) {
    const totalConsumptions = consumptions.reduce(
      (acc, consumption) => acc + consumption.value,
      0,
    );
    return (
      <>
        <Title title="Consumption" />
        <div className="text-gray-200 flex flex-col rounded bg-gray-800 p-4">
          <Typography>Last week</Typography>
          <Typography variant="head">
            {Math.round(totalConsumptions * 100) / 100}kWh
          </Typography>
          <ResponsiveContainer width="100%" aspect={2}>
            <BarChart barSize={15} data={formatDate(consumptions)}>
              <XAxis dataKey="date" style={{ fill: '#718096' }} />
              <Bar
                isAnimationActive={false}
                dataKey="value"
                fill="#38B2AC"
                background={{ fill: '#232D3D' }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{ fill: '#FFF' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }
  return <Loader />;
};

export default ConsumptionPage;
