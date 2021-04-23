import React, { useState, useEffect } from 'react';
import { Chord } from '@antv/g2plot';
// import './userCenter.css';
interface ChordChartProps {
  data: any;
  // chartHeight:number
  height: number;
  width: number;
  chordId: string;
}

const ChordChart: React.FC<ChordChartProps> = (props) => {
  const { data, height, width, chordId } = props;
  const [chord, setChord] = useState<any>(null);
  useEffect(() => {
    let chord = new Chord(chordId, {
      height: height,
      width: width,
      data,
      sourceField: 'from',
      targetField: 'to',
      weightField: 'value',
      state: {
        active: {
          style: {
            lineWidth: 0,
            fillOpacity: 0.65,
          },
        },
      },
    });
    chord.render();
    setChord(chord);
    return () => {
      chord.destroy();
    };
  }, []);
  useEffect(() => {
    if (chord) {
      chord.update({
        data: data,
      });
    }
  }, [data]);
  return <div id={chordId}></div>;
};
ChordChart.defaultProps = {};
export default ChordChart;
