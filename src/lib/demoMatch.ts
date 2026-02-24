import { MatchSummary, Point, Player, SetData } from '@/types/sports';

export const DEMO_MATCH_ID = 'demo-match-volley';

function pt(id: number, team: 'blue' | 'red', type: 'scored' | 'fault', action: string, x: number, y: number, playerId?: string): Point {
  return {
    id: `demo-pt-${id}`,
    team,
    type,
    action: action as any,
    x,
    y,
    timestamp: Date.now() - (50 - id) * 30_000,
    ...(playerId ? { playerId } : {}),
  };
}

export function getDemoMatch(): MatchSummary {
  const players: Player[] = [
    { id: 'demo-p1', name: 'Lucas', number: '7' },
    { id: 'demo-p2', name: 'Théo', number: '3' },
    { id: 'demo-p3', name: 'Emma', number: '11' },
    { id: 'demo-p4', name: 'Hugo', number: '9' },
    { id: 'demo-p5', name: 'Léa', number: '5' },
    { id: 'demo-p6', name: 'Nathan', number: '1' },
  ];

  // --- Set 1 completed: 25-23 ---
  const set1Points: Point[] = [
    pt(1, 'blue', 'scored', 'ace', 50, 20, 'demo-p6'),
    pt(2, 'red', 'scored', 'attack', 30, 35),
    pt(3, 'blue', 'scored', 'attack', 70, 25, 'demo-p1'),
    pt(4, 'blue', 'scored', 'block', 45, 10, 'demo-p4'),
    pt(5, 'red', 'fault', 'out', 85, 5),
    pt(6, 'red', 'scored', 'ace', 50, 80),
    pt(7, 'blue', 'scored', 'attack', 25, 18, 'demo-p2'),
    pt(8, 'red', 'scored', 'attack', 60, 30),
    pt(9, 'blue', 'scored', 'ace', 55, 15, 'demo-p6'),
    pt(10, 'red', 'scored', 'block', 40, 40),
    pt(11, 'blue', 'scored', 'attack', 65, 22, 'demo-p3'),
    pt(12, 'blue', 'fault', 'net_fault', 50, 50, 'demo-p5'),
    pt(13, 'red', 'scored', 'attack', 35, 28),
    pt(14, 'blue', 'scored', 'bidouille', 20, 30, 'demo-p2'),
    pt(15, 'red', 'fault', 'service_miss', 50, 90),
    pt(16, 'blue', 'scored', 'attack', 75, 20, 'demo-p1'),
    pt(17, 'red', 'scored', 'attack', 28, 32),
    pt(18, 'blue', 'scored', 'block', 48, 12, 'demo-p4'),
    pt(19, 'red', 'scored', 'ace', 50, 75),
    pt(20, 'blue', 'scored', 'attack', 60, 28, 'demo-p3'),
    pt(21, 'red', 'scored', 'attack', 42, 38),
    pt(22, 'blue', 'scored', 'ace', 52, 18, 'demo-p6'),
    pt(23, 'red', 'scored', 'block', 38, 42),
    pt(24, 'blue', 'scored', 'attack', 68, 24, 'demo-p1'),
    pt(25, 'red', 'fault', 'out', 90, 8),
    pt(26, 'red', 'scored', 'attack', 32, 34),
    pt(27, 'blue', 'scored', 'seconde_main', 55, 15, 'demo-p2'),
    pt(28, 'blue', 'scored', 'attack', 72, 22, 'demo-p3'),
    pt(29, 'red', 'scored', 'attack', 45, 30),
    pt(30, 'blue', 'scored', 'attack', 30, 20, 'demo-p1'),
    pt(31, 'red', 'scored', 'ace', 48, 78),
    pt(32, 'blue', 'scored', 'block', 50, 10, 'demo-p4'),
    pt(33, 'red', 'scored', 'attack', 55, 35),
    pt(34, 'blue', 'scored', 'attack', 62, 26, 'demo-p1'),
    pt(35, 'red', 'fault', 'net_fault', 50, 50),
    pt(36, 'red', 'scored', 'attack', 40, 32),
    pt(37, 'blue', 'scored', 'ace', 48, 16, 'demo-p6'),
    pt(38, 'blue', 'fault', 'out', 88, 5, 'demo-p3'),
    pt(39, 'red', 'scored', 'attack', 58, 28),
    pt(40, 'blue', 'scored', 'attack', 35, 22, 'demo-p2'),
    pt(41, 'red', 'scored', 'block', 44, 40),
    pt(42, 'blue', 'scored', 'attack', 66, 18, 'demo-p1'),
    pt(43, 'red', 'scored', 'attack', 50, 30),
    pt(44, 'blue', 'scored', 'attack', 58, 24, 'demo-p3'),
    pt(45, 'red', 'fault', 'service_miss', 50, 85),
    pt(46, 'blue', 'scored', 'block', 42, 8, 'demo-p4'),
    pt(47, 'red', 'scored', 'attack', 36, 36),
    pt(48, 'blue', 'scored', 'attack', 70, 20, 'demo-p1'),
  ];
  // Count: blue scored ~25, red scored ~23

  const set1: SetData = {
    id: 'demo-set-1',
    number: 1,
    points: set1Points,
    score: { blue: 25, red: 23 },
    winner: 'blue',
    duration: 1620,
  };

  // --- Set 2 in progress: ~14-12 ---
  const set2Points: Point[] = [
    pt(49, 'blue', 'scored', 'attack', 64, 22, 'demo-p1'),
    pt(50, 'red', 'scored', 'ace', 52, 76),
    pt(51, 'blue', 'scored', 'ace', 46, 14, 'demo-p6'),
    pt(52, 'red', 'scored', 'attack', 38, 30),
    pt(53, 'blue', 'scored', 'block', 50, 12, 'demo-p4'),
    pt(54, 'red', 'scored', 'attack', 62, 34),
    pt(55, 'blue', 'scored', 'attack', 28, 20, 'demo-p2'),
    pt(56, 'red', 'fault', 'out', 92, 4),
    pt(57, 'blue', 'scored', 'attack', 74, 18, 'demo-p3'),
    pt(58, 'red', 'scored', 'attack', 44, 32),
    pt(59, 'blue', 'scored', 'bidouille', 56, 26, 'demo-p5'),
    pt(60, 'red', 'scored', 'block', 40, 42),
    pt(61, 'blue', 'scored', 'ace', 54, 16, 'demo-p6'),
    pt(62, 'red', 'scored', 'attack', 48, 28),
    pt(63, 'blue', 'fault', 'net_fault', 50, 50, 'demo-p2'),
    pt(64, 'red', 'scored', 'attack', 56, 36),
    pt(65, 'blue', 'scored', 'attack', 66, 24, 'demo-p1'),
    pt(66, 'red', 'scored', 'ace', 50, 82),
    pt(67, 'blue', 'scored', 'attack', 32, 22, 'demo-p3'),
    pt(68, 'red', 'fault', 'net_fault', 50, 50),
    pt(69, 'blue', 'scored', 'block', 46, 10, 'demo-p4'),
    pt(70, 'blue', 'scored', 'attack', 60, 20, 'demo-p1'),
    pt(71, 'red', 'scored', 'attack', 42, 34),
    pt(72, 'blue', 'fault', 'service_miss', 50, 90, 'demo-p5'),
    pt(73, 'red', 'scored', 'block', 38, 38),
    pt(74, 'red', 'scored', 'attack', 54, 30),
  ];

  return {
    id: DEMO_MATCH_ID,
    teamNames: { blue: 'Équipe My Volley', red: 'Adversaires' },
    completedSets: [set1],
    currentSetNumber: 2,
    points: set2Points,
    sidesSwapped: false,
    chronoSeconds: 2400,
    createdAt: Date.now() - 3600_000,
    updatedAt: Date.now(),
    finished: false,
    players,
    sport: 'volleyball',
    metadata: { hasCourt: true },
  };
}
