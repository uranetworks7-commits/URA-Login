'use client';

import React from 'react';

const Snowflake = ({ style }: { style: React.CSSProperties }) => (
  <div className="pointer-events-none absolute text-primary text-xl" style={style}>
    ❄
  </div>
);

export function SnowflakeBackground() {
  const snowflakes = React.useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const style = {
        left: `${Math.random() * 100}%`,
        animation: `fall ${Math.random() * 10 + 5}s linear infinite`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.3,
        transform: `scale(${Math.random() * 0.8 + 0.2})`,
      };
      return <Snowflake key={i} style={style} />;
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
      {snowflakes}
    </div>
  );
}
