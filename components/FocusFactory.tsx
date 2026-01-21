'use client';

import { useState, useEffect } from 'react';
import { Cog, Zap, CheckCircle2, Play, Square } from 'lucide-react';
import { playClickSound } from '@/lib/sound-effects';

interface Task {
  id: string;
  name: string;
  color: string;
  status: 'pending' | 'processing' | 'completed';
  progress: number; // 0-100
  duration?: number; // minutes
}

interface FocusSession {
  id: string;
  taskId: string;
  isActive: boolean;
  startTime?: Date;
}

const TASK_COLORS = {
  analysis: '#B87333', // Copper
  tracking: '#708090', // Steel
  review: '#D2B48C', // Tan
  planning: '#CD853F', // Peru
  optimization: '#8B7355', // Dark tan
};

export function FocusFactory() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Cycle Analysis', color: TASK_COLORS.analysis, status: 'processing', progress: 65 },
    { id: '2', name: 'Health Tracking', color: TASK_COLORS.tracking, status: 'pending', progress: 0 },
    { id: '3', name: 'Data Review', color: TASK_COLORS.review, status: 'completed', progress: 100 },
    { id: '4', name: 'Pattern Planning', color: TASK_COLORS.planning, status: 'pending', progress: 0 },
    { id: '5', name: 'System Optimization', color: TASK_COLORS.optimization, status: 'processing', progress: 30 },
  ]);

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([
    { id: 's1', taskId: '1', isActive: true },
    { id: 's2', taskId: '5', isActive: true },
  ]);

  const [completedCount, setCompletedCount] = useState(3);
  const [beltOffset, setBeltOffset] = useState(0);

  // Simulate task progress
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'processing' && task.progress < 100) {
          const newProgress = Math.min(task.progress + 2, 100);
          if (newProgress === 100) {
            setCompletedCount(c => c + 1);
            return { ...task, progress: 100, status: 'completed' };
          }
          return { ...task, progress: newProgress };
        }
        return task;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animate conveyor belt
  useEffect(() => {
    const interval = setInterval(() => {
      setBeltOffset(prev => (prev + 1) % 800);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const processingTasks = tasks.filter(t => t.status === 'processing');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="relative w-full min-h-[600px] rounded-lg overflow-hidden border-2 border-[#8B7355] bg-gradient-to-b from-[#F5E6D3] via-[#E8D5B7] to-[#D2B48C] shadow-soft-lg">
      {/* Factory Schematic Background */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8B7355" strokeWidth="1" opacity="0.4"/>
          </pattern>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#708090" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
        
        {/* Factory pipes - schematic style */}
        <path d="M 0 120 L 200 120 L 200 80 L 400 80 L 400 120 L 600 120" stroke="#708090" strokeWidth="4" fill="none" opacity="0.25" strokeLinecap="round" />
        <path d="M 0 280 L 200 280 L 200 320 L 400 320 L 400 280 L 600 280" stroke="#708090" strokeWidth="4" fill="none" opacity="0.25" strokeLinecap="round" />
        
        {/* Factory machines outline - schematic boxes */}
        <rect x="80" y="180" width="100" height="60" fill="none" stroke="#B87333" strokeWidth="3" opacity="0.3" rx="2" />
        <rect x="280" y="180" width="100" height="60" fill="none" stroke="#B87333" strokeWidth="3" opacity="0.3" rx="2" />
        <rect x="480" y="180" width="100" height="60" fill="none" stroke="#B87333" strokeWidth="3" opacity="0.3" rx="2" />
        
        {/* Machine connections */}
        <line x1="180" y1="210" x2="280" y2="210" stroke="#B87333" strokeWidth="2" opacity="0.3" />
        <line x1="380" y1="210" x2="480" y2="210" stroke="#B87333" strokeWidth="2" opacity="0.3" />
        
        {/* Factory icons - simple schematic style */}
        <circle cx="130" cy="210" r="8" fill="none" stroke="#708090" strokeWidth="2" opacity="0.3" />
        <circle cx="330" cy="210" r="8" fill="none" stroke="#708090" strokeWidth="2" opacity="0.3" />
        <circle cx="530" cy="210" r="8" fill="none" stroke="#708090" strokeWidth="2" opacity="0.3" />
      </svg>

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#5C4A37] mb-2">Focus Factory</h2>
            <p className="text-[#8B7355]">Productivity pipeline in action</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#B87333]">{completedCount}</div>
            <div className="text-sm text-[#8B7355]">Completed</div>
          </div>
        </div>

        {/* Conveyor Belt System */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#5C4A37] mb-4">Production Line</h3>
          
          {/* Conveyor Belt SVG */}
          <div className="relative w-full h-32 mb-4">
            <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
              {/* Conveyor belt base */}
              <rect x="0" y="50" width="800" height="20" fill="#708090" rx="2" />
              <rect x="0" y="52" width="800" height="16" fill="#8B9DC3" rx="1" />
              
              {/* Conveyor belt texture - animated */}
              <g transform={`translate(${-beltOffset % 8}, 0)`}>
                <line x1="0" y1="60" x2="800" y2="60" stroke="#5A6A7A" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="8" y1="60" x2="808" y2="60" stroke="#5A6A7A" strokeWidth="1" strokeDasharray="4,4" />
              </g>
              
              {/* Moving tasks on belt */}
              {processingTasks.map((task, index) => {
                const basePosition = 50 + (index * 150);
                const progressOffset = (task.progress / 100) * 500;
                const currentPosition = (basePosition + progressOffset + beltOffset * 0.1) % 800;
                
                return (
                  <g key={task.id}>
                    {/* Task module/cube */}
                    <rect
                      x={currentPosition}
                      y="45"
                      width="40"
                      height="30"
                      fill={task.color}
                      rx="3"
                      stroke="#5C4A37"
                      strokeWidth="2"
                    />
                    {/* Cube shadow */}
                    <rect
                      x={currentPosition + 2}
                      y="47"
                      width="40"
                      height="30"
                      fill="rgba(0,0,0,0.2)"
                      rx="3"
                    />
                    {/* Cube highlight */}
                    <rect
                      x={currentPosition + 5}
                      y="48"
                      width="15"
                      height="10"
                      fill="rgba(255,255,255,0.3)"
                      rx="2"
                    />
                    {/* Task label */}
                    <text
                      x={currentPosition + 20}
                      y="63"
                      textAnchor="middle"
                      fontSize="8"
                      fill="#FFF"
                      fontWeight="bold"
                    >
                      {task.name.substring(0, 8)}
                    </text>
                    {/* Progress indicator */}
                    <rect
                      x={currentPosition + 5}
                      y="70"
                      width={30 * (task.progress / 100)}
                      height="3"
                      fill="#90EE90"
                      rx="1"
                    />
                  </g>
                );
              })}

              {/* Pending tasks queue */}
              {pendingTasks.slice(0, 3).map((task, index) => (
                <g key={task.id}>
                  <rect
                    x={20 + index * 50}
                    y="20"
                    width="35"
                    height="25"
                    fill={task.color}
                    rx="2"
                    stroke="#5C4A37"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                  <text
                    x={37.5 + index * 50}
                    y="35"
                    textAnchor="middle"
                    fontSize="7"
                    fill="#FFF"
                    fontWeight="bold"
                  >
                    {task.name.substring(0, 6)}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Active Machines with Sparks/Gears */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {focusSessions.map((session, index) => {
              const task = tasks.find(t => t.id === session.taskId);
              if (!task || !session.isActive) return null;
              
              return (
                <div
                  key={session.id}
                  className="relative bg-[#E8D5B7] border-2 border-[#B87333] rounded-lg p-4"
                  style={{
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Machine label */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#5C4A37]">Machine {index + 1}</span>
                    <div className="flex items-center gap-1">
                      {/* Animated gear */}
                      <Cog
                        className="w-4 h-4 text-[#708090]"
                        style={{
                          animation: `spin ${2 + index * 0.5}s linear infinite`,
                          transformOrigin: 'center',
                        }}
                      />
                      {/* Animated sparks */}
                      <Zap
                        className="w-3 h-3 text-[#FFD700]"
                        style={{
                          animation: `sparkle ${1 + index * 0.3}s ease-in-out infinite`,
                          animationDelay: `${index * 0.2}s`,
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Task info */}
                  <div className="text-xs text-[#8B7355] mb-2">{task.name}</div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-[#D2B48C] rounded-full h-2 mb-1">
                    <div
                      className="bg-[#B87333] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-[#5C4A37] text-right">{task.progress}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Output Bin */}
        <div className="relative">
          <h3 className="text-lg font-semibold text-[#5C4A37] mb-4">Output Bin</h3>
          <div className="relative bg-[#E8D5B7] border-2 border-[#708090] rounded-lg p-4 min-h-[200px]">
            {/* Bin visual */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#708090] rounded-b-lg border-t-2 border-[#5A6A7A]" />
            
            {/* Completed tasks stack */}
            <div className="flex flex-wrap gap-2 items-end" style={{ minHeight: '150px' }}>
              {completedTasks.slice(-6).map((task, index) => (
                <div
                  key={task.id}
                  className="relative"
                  style={{
                    animation: `dropIn ${0.5}s ease-out`,
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-[#5C4A37] flex items-center justify-center"
                    style={{
                      backgroundColor: task.color,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                      transform: `translateY(${index * 2}px) rotate(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                    }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-[#5C4A37] font-semibold whitespace-nowrap">
                    {task.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Fill level indicator */}
            <div className="absolute bottom-2 right-2 text-xs text-[#5C4A37] font-semibold">
              {completedTasks.length} / {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => playClickSound()}
            className="flex items-center gap-2 px-4 py-2 bg-[#B87333] text-white rounded-lg font-semibold hover:bg-[#A06323] hover:scale-105 active:scale-95 transition-all duration-200 shadow-soft text-sm"
          >
            <Play className="w-4 h-4" />
            Start Session
          </button>
          <button
            onClick={() => playClickSound()}
            className="flex items-center gap-2 px-4 py-2 bg-[#708090] text-white rounded-lg font-semibold hover:bg-[#5A6A7A] hover:scale-105 active:scale-95 transition-all duration-200 shadow-soft text-sm"
          >
            <Square className="w-4 h-4" />
            Pause All
          </button>
        </div>
      </div>

    </div>
  );
}
