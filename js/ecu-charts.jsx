import * as React from 'react';

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const data = [
  { subject: 'Math', A: 120, B: 110, fullMark: 150 },
  { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
  { subject: 'English', A: 86, B: 130, fullMark: 150 },
  { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
  { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
  { subject: 'History', A: 65, B: 85, fullMark: 150 },
];

export class MessageSignalSizeDistribution extends React.Component {
  render() {
    let data = this.props.signals;

    const usedBits = this.props.signals.reduce((acc, signal) => acc + signal.signal_size, 0);
    const unusedBits = 8*8 - usedBits;

    if (unusedBits !== 0) {
      data.push({name: "Unused Bits", signal_size: unusedBits });
    }

    return (
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <Radar name="Size in Bits" dataKey="signal_size" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    );
  }
}