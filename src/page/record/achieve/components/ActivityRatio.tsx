import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import BathSmall from '../../../../common/icons/bath-map.svg';
import CafeSmall from '../../../../common/icons/cafe-category.svg';
import BeautySmall from '../../../../common/icons/beauty-category.svg';
import WalkSmall from '../../../../common/icons/walk-category.svg';
import KinderSmall from '../../../../common/icons/kinder-category.svg';
import HospitalSmall from '../../../../common/icons/hospital-mint-small.svg';
import EatSmall from '../../../../common/icons/eat-category.svg';
import EtcSmall from '../../../../common/icons/etc-small.svg';
import { categoryColor, imgSmallKey } from '../../../../common/types/category';

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

interface iconCount {
  img: string;
  name: string;
  count: number;
}

interface Props {
  counts: {
    CA0001: number;
    CA0002: number;
    CA0003: number;
    CA0005: number;
    CA0006: number;
    CA0007: number;
    CA9999: number;
    [key: string]: number;
  };
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
}: LabelProps) => {
  const radius = outerRadius - 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      fontSize="10"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const ActivityRatio = ({ counts }: Props) => {
  const initialIconList = [
    { img: WalkSmall, name: 'WalkSmall', count: 1 },
    { img: CafeSmall, name: 'CafeSmall', count: 1 },
    { img: EatSmall, name: 'EatSmall', count: 1 },
    { img: BeautySmall, name: 'BeautySmall', count: 1 },
    { img: HospitalSmall, name: 'HospitalSmall', count: 1 },
    { img: KinderSmall, name: 'KinderSmall', count: 1 },
    { img: EtcSmall, name: 'EtcSmall', count: 1 },
  ];

  let allCountsAreZero = true;

  if (counts) {
    allCountsAreZero = Object.values(counts).every((value) => value === 0);
  }

  const updatedIconList = initialIconList.map((icon: iconCount) => {
    const ratioKey = imgSmallKey[icon.name];
    if (ratioKey && ratioKey !== 'CA0004') {
      return { ...icon, count: allCountsAreZero ? 1 : counts[ratioKey] || 0 };
    }
    return icon;
  });

  const sortedIconList = [...updatedIconList].sort((a, b) => b.count - a.count);
  const total = updatedIconList.reduce((acc, icon) => acc + icon.count, 0);

  return (
    <section className="activity-ratio">
      <header>
        <h1>활동 비율</h1>
      </header>
      <div className="activity-ratio-wrapper">
        <ResponsiveContainer width={150} height={150}>
          <PieChart width={105} height={105}>
            <Pie
              data={sortedIconList}
              cx="38%"
              cy="50%"
              dataKey="count"
              labelLine={false}
              label={renderCustomizedLabel}
              startAngle={90}
              endAngle={-270}
            >
              {sortedIconList.map((entry) => {
                const color = categoryColor[imgSmallKey[entry.name]];
                return <Cell key={entry.name} fill={color} />;
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <aside className="activity-ratio-icon-wrapper">
          {sortedIconList.map((entry) => {
            // 각 항목의 비율 계산
            const percentage = total > 0 ? ((entry.count / total) * 100).toFixed(0) : 0;
            return (
              <figure className="activity-ratio-icon" key={entry.name}>
                <img src={entry.img} alt="Icon" width={25} height={25} />
                <figcaption>{percentage}%</figcaption>
              </figure>
            );
          })}
        </aside>
      </div>
    </section>
  );
};
