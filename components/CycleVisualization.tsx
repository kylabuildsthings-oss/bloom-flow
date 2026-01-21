'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Info, Leaf } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';
import { format, subDays, parseISO } from 'date-fns';
import { GameItemCard } from './GameItemCard';

interface CycleDay {
  date: string;
  day: number;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  flow: 'none' | 'light' | 'medium' | 'heavy';
  symptoms: string[];
}

const PHASE_COLORS = {
  menstrual: '#ee4694',
  follicular: '#9a5aff',
  ovulation: '#ff6b7a',
  luteal: '#f670b0',
};

const PHASE_INFO = {
  menstrual: {
    name: 'Menstrual Phase',
    description: 'Days 1-5: Your period. The uterine lining sheds.',
    typicalLength: '3-7 days',
  },
  follicular: {
    name: 'Follicular Phase',
    description: 'Days 1-13: Follicles in ovaries mature, preparing for ovulation.',
    typicalLength: '13-14 days',
  },
  ovulation: {
    name: 'Ovulation',
    description: 'Day 14: Egg is released from ovary. Peak fertility window.',
    typicalLength: '1 day',
  },
  luteal: {
    name: 'Luteal Phase',
    description: 'Days 15-28: Uterine lining thickens. If no pregnancy, cycle restarts.',
    typicalLength: '12-14 days',
  },
};

export function CycleVisualization() {
  const [cycleData, setCycleData] = useState<CycleDay[]>([]);
  const [currentPhase, setCurrentPhase] = useState<keyof typeof PHASE_INFO | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<keyof typeof PHASE_INFO | null>(null);
  const opik = useOpik();

  useEffect(() => {
    loadCycleData();
  }, []);

  const loadCycleData = async () => {
    const data = await HealthDataStorage.getSensitive('cycle_data');
    if (data) {
      setCycleData(data);
      calculateCurrentPhase(data);
    } else {
      // Generate sample data for demonstration
      generateSampleData();
    }
    opik.logNonSensitive('cycle_data_viewed', {});
  };

  const generateSampleData = () => {
    const sample: CycleDay[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const day = (30 - i) % 28 || 28;
      
      let phase: CycleDay['phase'] = 'follicular';
      let flow: CycleDay['flow'] = 'none';
      
      if (day <= 5) {
        phase = 'menstrual';
        flow = day <= 3 ? 'medium' : 'light';
      } else if (day <= 13) {
        phase = 'follicular';
      } else if (day === 14) {
        phase = 'ovulation';
      } else {
        phase = 'luteal';
      }
      
      sample.push({
        date: format(date, 'yyyy-MM-dd'),
        day,
        phase,
        flow,
        symptoms: [],
      });
    }
    
    setCycleData(sample);
    calculateCurrentPhase(sample);
    HealthDataStorage.storeSensitive('cycle_data', sample);
  };

  const calculateCurrentPhase = (data: CycleDay[]) => {
    if (data.length === 0) return;
    const today = data[data.length - 1];
    setCurrentPhase(today.phase);
  };

  const chartData = cycleData.map(day => ({
    day: day.day,
    date: format(parseISO(day.date), 'MMM d'),
    phase: day.phase,
    flow: day.flow === 'none' ? 0 : day.flow === 'light' ? 1 : day.flow === 'medium' ? 2 : 3,
  }));

  const phaseStats = cycleData.reduce((acc, day) => {
    acc[day.phase] = (acc[day.phase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-primary-700">Cycle Visualization</h2>
        </div>
      </div>

      {currentPhase && cycleData.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <GameItemCard
            title="Cycle Day"
            value={cycleData[cycleData.length - 1].day}
            icon={Calendar}
            iconColor="text-primary-600"
            cornerIcon={<Leaf className="w-3 h-3 text-primary-500" />}
            subtitle={`Day ${cycleData[cycleData.length - 1].day} of cycle`}
            variant="wood"
          />
          <GameItemCard
            title="Current Phase"
            value={PHASE_INFO[currentPhase].name.split(' ')[0]}
            icon={Calendar}
            iconColor="text-primary-600"
            cornerIcon={<Leaf className="w-3 h-3" style={{ color: PHASE_COLORS[currentPhase] }} />}
            subtitle={PHASE_INFO[currentPhase].typicalLength}
            variant="stone"
            onClick={() => setSelectedInfo(selectedInfo === currentPhase ? null : currentPhase)}
          />
        </div>
      )}

      {selectedInfo && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="font-semibold text-lg mb-2">{PHASE_INFO[selectedInfo].name}</h3>
          <p className="text-neutral-700 mb-2">{PHASE_INFO[selectedInfo].description}</p>
          <p className="text-sm text-neutral-600">
            <strong>Typical Length:</strong> {PHASE_INFO[selectedInfo].typicalLength}
          </p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-600 mb-3">30-Day Cycle Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              {Object.entries(PHASE_COLORS).map(([phase, color]) => (
                <linearGradient key={phase} id={`color${phase}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[0, 3]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const labels = ['None', 'Light', 'Medium', 'Heavy'];
                return labels[value] || '';
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
                      <p className="font-semibold">Day {data.day}</p>
                      <p className="text-sm" style={{ color: PHASE_COLORS[data.phase] }}>
                        {PHASE_INFO[data.phase].name}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="flow"
              stroke={PHASE_COLORS[currentPhase || 'follicular']}
              fill={`url(#color${currentPhase || 'follicular'})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Object.entries(PHASE_INFO).map(([phase, info]) => (
          <button
            key={phase}
            onClick={() => setSelectedInfo(selectedInfo === phase ? null : phase)}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedInfo === phase
                ? 'ring-2 ring-offset-2'
                : 'hover:bg-neutral-50'
            }`}
            style={{
              backgroundColor: selectedInfo === phase ? `${PHASE_COLORS[phase]}20` : 'transparent',
              ringColor: PHASE_COLORS[phase],
            }}
          >
            <div
              className="w-4 h-4 rounded-full mx-auto mb-2"
              style={{ backgroundColor: PHASE_COLORS[phase] }}
            />
            <p className="text-xs font-semibold text-neutral-700">{info.name.split(' ')[0]}</p>
            <p className="text-xs text-neutral-500">{phaseStats[phase] || 0} days</p>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <TrendingUp className="w-4 h-4" />
          <p>Educational visualization to help you understand your cycle patterns</p>
        </div>
      </div>
    </div>
  );
}
