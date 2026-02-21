import { useState, useEffect, useCallback } from 'react';
import { X, Pencil, Check, Trash2, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SportType, getScoredActionsForSport, getFaultActionsForSport } from '@/types/sports';
import { getSavedPlayers, removeSavedPlayer } from '@/lib/savedPlayers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface SavedPlayersManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

interface SavedPlayer {
  id: string;
  name: string;
  sport: SportType;
}

interface PlayerWithStats extends SavedPlayer {
  totalPoints: number;
  totalFaults: number;
  matchCount: number;
  actionDetails: Record<string, number>;
}

export function SavedPlayersManager({ open, onOpenChange, userId }: SavedPlayersManagerProps) {
  const { t } = useTranslation();
  const [sport, setSport] = useState<SportType>('volleyball');
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadPlayers = useCallback(async () => {
    setLoading(true);
    const saved = await getSavedPlayers(sport, userId);

    const { data: matches } = await supabase
      .from('matches')
      .select('match_data')
      .eq('user_id', userId);

    const statsMap = new Map<string, { points: number; faults: number; matches: Set<string>; actions: Record<string, number> }>();

    if (matches) {
      for (const row of matches) {
        const matchData = row.match_data as any;
        if (!matchData || (matchData.sport || 'volleyball') !== sport) continue;
        const matchPlayers: { id: string; name: string }[] = matchData.players || [];
        const allPoints = [
          ...(matchData.completedSets || []).flatMap((s: any) => s.points || []),
          ...(matchData.points || []),
        ];

        for (const mp of matchPlayers) {
          const sp = saved.find(s => s.name === mp.name);
          if (!sp) continue;
          
          if (!statsMap.has(sp.id)) {
            statsMap.set(sp.id, { points: 0, faults: 0, matches: new Set(), actions: {} });
          }
          const stat = statsMap.get(sp.id)!;
          stat.matches.add(matchData.id);

          for (const pt of allPoints) {
            if (pt.playerId === mp.id) {
              if (pt.type === 'scored') stat.points += (pt.pointValue ?? 1);
              if (pt.type === 'fault') stat.faults++;
              // Track action details
              const actionKey = pt.action as string;
              stat.actions[actionKey] = (stat.actions[actionKey] ?? 0) + 1;
            }
          }
        }
      }
    }

    const playersWithStats: PlayerWithStats[] = saved.map(sp => {
      const stat = statsMap.get(sp.id);
      return {
        ...sp,
        sport,
        totalPoints: stat?.points ?? 0,
        totalFaults: stat?.faults ?? 0,
        matchCount: stat?.matches.size ?? 0,
        actionDetails: stat?.actions ?? {},
      };
    });

    setPlayers(playersWithStats);
    setLoading(false);
  }, [sport, userId]);

  useEffect(() => {
    if (open) loadPlayers();
  }, [open, loadPlayers]);

  const handleDelete = async (id: string) => {
    await removeSavedPlayer(id, sport, userId);
    setDeletingId(null);
    loadPlayers();
    toast.success(t('savedPlayers.playerDeleted'));
  };

  const handleSaveName = async (id: string) => {
    if (!editName.trim()) return;
    const { error } = await supabase
      .from('saved_players')
      .update({ name: editName.trim() })
      .eq('id', id);
    if (error) { toast.error(t('savedPlayers.nameChangeError')); return; }
    setEditingId(null);
    loadPlayers();
    toast.success(t('savedPlayers.nameChanged'));
  };

  const scoredActions = getScoredActionsForSport(sport);
  const faultActions = getFaultActionsForSport(sport);

  const renderActionDetails = (p: PlayerWithStats) => {
    const hasAnyAction = Object.keys(p.actionDetails).length > 0;
    if (!hasAnyAction) return <p className="text-[11px] text-muted-foreground py-2">{t('savedPlayers.noPlayers')}</p>;

    const scoredEntries = scoredActions.filter(a => p.actionDetails[a.key]);
    const faultEntries = faultActions.filter(a => p.actionDetails[a.key]);

    return (
      <div className="space-y-2 pt-1">
        {scoredEntries.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-action-scored uppercase tracking-wider mb-1">⚡ {t('savedPlayers.scored')}</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {scoredEntries.map(a => (
                <div key={a.key} className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{t(`actions.${a.key}`, a.label)}</span>
                  <span className="font-bold text-foreground tabular-nums">{p.actionDetails[a.key]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {faultEntries.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-action-fault uppercase tracking-wider mb-1">❌ {t('savedPlayers.faultsCategory')}</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {faultEntries.map(a => (
                <div key={a.key} className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{t(`actions.${a.key}`, a.label)}</span>
                  <span className="font-bold text-foreground tabular-nums">{p.actionDetails[a.key]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            <Users size={18} className="inline mr-2" />
            {t('savedPlayers.title')}
          </DialogTitle>
        </DialogHeader>

        {/* Sport tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          {([
            { key: 'volleyball' as SportType, icon: '🏐', label: t('savedPlayers.volley') },
            { key: 'basketball' as SportType, icon: '🏀', label: t('savedPlayers.basket') },
            { key: 'tennis' as SportType, icon: '🎾', label: t('savedPlayers.tennis') },
            { key: 'padel' as SportType, icon: '🏓', label: t('savedPlayers.padel') },
          ]).map(s => (
            <button
              key={s.key}
              onClick={() => { setSport(s.key); setExpandedId(null); }}
              className={`py-2 rounded-xl font-bold text-xs transition-all border-2 ${
                sport === s.key
                  ? 'bg-primary/15 text-primary border-primary/40'
                  : 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('savedPlayers.loading')}</p>
        ) : players.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('savedPlayers.noPlayers')}</p>
        ) : (
          <div className="space-y-2">
            {players.map(p => (
              <div key={p.id} className="bg-secondary/50 rounded-xl px-3 py-2.5 space-y-1">
                <div className="flex items-center gap-2">
                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedId === p.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {editingId === p.id ? (
                    <>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="h-7 flex-1 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Nom"
                        onKeyDown={e => { if (e.key === 'Enter') handleSaveName(p.id); }}
                        autoFocus
                      />
                      <button onClick={() => handleSaveName(p.id)} className="p-1 text-primary"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground"><X size={14} /></button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-medium text-foreground truncate">{p.name || '—'}</span>
                      <button onClick={() => { setEditingId(p.id); setEditName(p.name); }} className="p-1 text-muted-foreground hover:text-foreground"><Pencil size={13} /></button>
                      <button onClick={() => setDeletingId(p.id)} className="p-1 text-destructive/60 hover:text-destructive"><Trash2 size={13} /></button>
                    </>
                  )}
                </div>
                <div className="flex gap-3 text-[11px] text-muted-foreground pl-6">
                  <span>{p.matchCount} match{p.matchCount > 1 ? 's' : ''}</span>
                  <span>⚡ {p.totalPoints} {t('playerStats.pts')}</span>
                  <span>❌ {p.totalFaults} {t('savedPlayers.faults')}</span>
                </div>

                {/* Expanded action details */}
                {expandedId === p.id && (
                  <div className="pl-6 pt-1 border-t border-border/50 mt-1">
                    {renderActionDetails(p)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete confirm */}
        {deletingId && (
          <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setDeletingId(null)}>
            <div className="bg-card rounded-2xl p-5 max-w-xs w-full border border-border space-y-3" onClick={e => e.stopPropagation()}>
              <p className="text-sm font-bold text-foreground text-center">{t('savedPlayers.deletePlayer')}</p>
              <div className="flex gap-2">
                <button onClick={() => setDeletingId(null)} className="flex-1 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm">{t('common.cancel')}</button>
                <button onClick={() => handleDelete(deletingId)} className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold text-sm">{t('common.delete')}</button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
