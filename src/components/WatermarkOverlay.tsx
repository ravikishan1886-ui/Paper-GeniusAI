import React from 'react';
import { WatermarkConfig } from '../types';

interface WatermarkOverlayProps {
  watermark: WatermarkConfig;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({ watermark }) => {
  if (!watermark || !watermark.enabled) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center select-none z-0"
      aria-hidden="true"
    >
      <div
        className="font-extrabold tracking-widest text-center whitespace-nowrap"
        style={{
          transform: `rotate(${watermark.rotation}deg)`,
          opacity: watermark.opacity,
          color: watermark.color,
          fontSize: `${watermark.fontSize * 1.5}px`,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}
      >
        {watermark.text || 'Ravi Kishan'}
      </div>
    </div>
  );
};
