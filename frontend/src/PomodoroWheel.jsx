import { useState, useEffect } from "react";

function PomodoroWheel({ minutes = 30 }) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const radius = 100;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (secondsLeft / (minutes * 60)) * circumference;

  const tickTimes = [5, 10, 15, 20, 25]; // ticks in minutes
  const tickLength = 10;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const getTickCoords = (minute) => {
    const angle = (minute / minutes) * 2 * Math.PI - Math.PI / 2;
    const x1 = 110 + (radius - strokeWidth / 2) * Math.cos(angle);
    const y1 = 110 + (radius - strokeWidth / 2) * Math.sin(angle);
    const x2 = 110 + (radius + tickLength - strokeWidth / 2) * Math.cos(angle);
    const y2 = 110 + (radius + tickLength - strokeWidth / 2) * Math.sin(angle);
    const xText = 110 + (radius + 25) * Math.cos(angle);
    const yText = 110 + (radius + 25) * Math.sin(angle);
    return { x1, y1, x2, y2, xText, yText };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={240} height={240}>
        {/* Base Circle */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#ccc"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#4caf50"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          transform="rotate(-90 110 110)"
          strokeLinecap="round"
        />
        {/* Tick Marks with numbers */}
        {tickTimes.map((minute) => {
          const { x1, y1, x2, y2, xText, yText } = getTickCoords(minute);
          return (
            <g key={minute}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth="2" />
              <text
                x={xText}
                y={yText}
                fontSize="14"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000"
              >
                {minute}
              </text>
            </g>
          );
        })}
      </svg>
      <button onClick={() => setIsRunning(!isRunning)} style={{ marginTop: 20 }}>
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
}

export default PomodoroWheel;
