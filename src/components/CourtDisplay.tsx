import { Point, SportType } from '@/types/sports';

interface CourtDisplayProps {
  points: Point[];
  teamNames: { blue: string; red: string };
  sport?: SportType;
}

const VOLLEY_ACTION_SHORT: Record<string, string> = {
  attack: 'A', ace: 'As', block: 'B', bidouille: 'Bi', seconde_main: '2M',
  out: 'O', net_fault: 'F', service_miss: 'SL', block_out: 'BO',
  other_offensive: '',
};

const BASKET_ACTION_SHORT: Record<string, string> = {
  free_throw: '1', two_points: '2', three_points: '3',
  missed_shot: 'X', turnover: 'T', foul_committed: 'F',
};

export function CourtDisplay({ points, teamNames, sport = 'volleyball' }: CourtDisplayProps) {
  const isBasketball = sport === 'basketball';
  const ACTION_SHORT = isBasketball ? BASKET_ACTION_SHORT : VOLLEY_ACTION_SHORT;

  return (
    <div className="rounded-xl overflow-hidden">
      <svg viewBox="0 0 600 400" className="w-full h-auto">
        {/* Court background */}
        <rect x="0" y="0" width="600" height="400" rx="8" fill={isBasketball ? 'hsl(30, 50%, 35%)' : 'hsl(142, 40%, 28%)'} />

        {/* Court border */}
        <rect x="20" y="20" width="560" height="360" rx="4" fill="none" stroke="white" strokeWidth="2" opacity="0.9" />

        {isBasketball ? (
          <>
            {/* Center line */}
            <line x1="300" y1="20" x2="300" y2="380" stroke="white" strokeWidth="2" opacity="0.8" />
            {/* Center circle */}
            <circle cx="300" cy="200" r="40" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
            {/* 3-point arcs */}
            <path d="M 70 80 A 120 120 0 0 1 70 320" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="20" y1="80" x2="70" y2="80" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="20" y1="320" x2="70" y2="320" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <path d="M 530 320 A 120 120 0 0 1 530 80" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="530" y1="80" x2="580" y2="80" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="530" y1="320" x2="580" y2="320" stroke="white" strokeWidth="1.5" opacity="0.7" />
            {/* Baskets */}
            <circle cx="50" cy="200" r="8" fill="none" stroke="orange" strokeWidth="2" opacity="0.8" />
            <circle cx="550" cy="200" r="8" fill="none" stroke="orange" strokeWidth="2" opacity="0.8" />
          </>
        ) : (
          <>
            {/* Net */}
            <line x1="300" y1="20" x2="300" y2="380" stroke="white" strokeWidth="3" />
            <line x1="300" y1="20" x2="300" y2="380" stroke="white" strokeWidth="1" strokeDasharray="8 4" opacity="0.5" />
            {/* Attack lines */}
            <line x1="200" y1="20" x2="200" y2="380" stroke="white" strokeWidth="1.5" opacity="0.6" />
            <line x1="400" y1="20" x2="400" y2="380" stroke="white" strokeWidth="1.5" opacity="0.6" />
          </>
        )}

        {/* Team labels */}
        <text x="110" y="205" textAnchor="middle" fill="hsl(217, 91%, 60%)" fontSize="13" fontWeight="bold" opacity="0.5">
          {teamNames.blue}
        </text>
        <text x="490" y="205" textAnchor="middle" fill="hsl(0, 84%, 60%)" fontSize="13" fontWeight="bold" opacity="0.5">
          {teamNames.red}
        </text>

        {/* Point markers */}
        {points.map((point) => {
          const cx = point.x * 600;
          const cy = point.y * 400;
          const color = point.team === 'blue' ? 'hsl(217, 91%, 60%)' : 'hsl(0, 84%, 60%)';
          const isFault = point.type === 'fault';
          const actionLetter = ACTION_SHORT[point.action] ?? null;
          return (
            <g key={point.id}>
              <circle
                cx={cx}
                cy={cy}
                r={9}
                fill={isFault ? 'transparent' : color}
                opacity={0.85}
                stroke={color}
                strokeWidth={isFault ? 2 : 1.5}
                strokeDasharray={isFault ? '3 2' : 'none'}
              />
              {isFault && !actionLetter && (
                <>
                  <line x1={cx - 3.5} y1={cy - 3.5} x2={cx + 3.5} y2={cy + 3.5} stroke={color} strokeWidth="1.5" />
                  <line x1={cx + 3.5} y1={cy - 3.5} x2={cx - 3.5} y2={cy + 3.5} stroke={color} strokeWidth="1.5" />
                </>
              )}
              {actionLetter && (
                <text x={cx} y={cy + 4} textAnchor="middle" fill={isFault ? color : 'white'} fontSize="10" fontWeight="bold">{actionLetter}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
