// Admin Classification page - Pools standings + Knockout bracket (quarts, demis, finals)
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamLogo from '@/components/TeamLogo';
import { Match } from '@/types';

const GROUPS = ['A', 'B', 'C', 'D'] as const;
const KNOCKOUT_PHASES: { key: Match['phase']; label: string }[] = [
  { key: 'quarter', label: 'Quarts de finale' },
  { key: 'semi', label: 'Demi-finales' },
  { key: 'final', label: 'Finale' },
];

export default function AdminClassificationPage() {
  const { teams, matches, standings, updateStanding, updateMatch, currentUser, refreshData } = useApp();
  const [activeSection, setActiveSection] = useState<'poules' | 'eliminatoires'>('poules');
  const [editingRow, setEditingRow] = useState<{ teamId: string; group: 'A' | 'B' | 'C' | 'D' } | null>(null);
  const [editValues, setEditValues] = useState({ points: 0, goalsFor: 0, goalsAgainst: 0, matchesPlayed: 0 });
  const [editingScoreMatchId, setEditingScoreMatchId] = useState<string | null>(null);
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-text-primary">Access Denied</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const byGroup = standings || { A: [], B: [], C: [], D: [] };

  const handleSaveStanding = async () => {
    if (!editingRow) return;
    await updateStanding(editingRow.teamId, editingRow.group, {
      points: editValues.points,
      goalsFor: editValues.goalsFor,
      goalsAgainst: editValues.goalsAgainst,
      matchesPlayed: editValues.matchesPlayed,
    });
    setEditingRow(null);
    await refreshData();
  };

  const startEditStanding = (teamId: string, group: 'A' | 'B' | 'C' | 'D') => {
    const row = byGroup[group]?.find((r) => r.teamId === teamId);
    setEditingRow({ teamId, group });
    setEditValues({
      points: row?.points ?? 0,
      goalsFor: row?.goalsFor ?? 0,
      goalsAgainst: row?.goalsAgainst ?? 0,
      matchesPlayed: row?.matchesPlayed ?? 0,
    });
  };

  const handleSaveScore = async (matchId: string) => {
    const s1 = parseInt(score1, 10);
    const s2 = parseInt(score2, 10);
    if (isNaN(s1) || isNaN(s2)) return;
    await updateMatch(matchId, { status: 'finished', score1: s1, score2: s2 });
    setEditingScoreMatchId(null);
    setScore1('');
    setScore2('');
    await refreshData();
  };

  const knockoutMatches = matches.filter((m) => ['quarter', 'semi', 'final'].includes(m.phase));

  return (
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin" className="text-accent hover:text-accent-hover mb-2 inline-block transition-colors duration-200">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-semibold text-text-primary">Classification</h1>
          <p className="text-text-secondary mt-1">Poules : points, buts, écarts. Éliminatoires : quarts, demis, finale.</p>
        </div>

        {/* Sub-nav: Poules | Éliminatoires */}
        <div className="flex gap-2 mb-6 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setActiveSection('poules')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'poules' ? 'bg-accent text-white' : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
            }`}
          >
            Poules Classification
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('eliminatoires')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'eliminatoires' ? 'bg-accent text-white' : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
            }`}
          >
            Éliminatoires
          </button>
        </div>

        {/* Poules: table per group (#, Nom, J, Buts pour, Buts contre, Dif, Pts) */}
        {activeSection === 'poules' && (
          <div className="space-y-8">
            {GROUPS.map((group) => {
              const rows = byGroup[group] || [];
              return (
                <Card key={group} className="p-4 sm:p-6" padding="none">
                  <h2 className="text-xl font-bold text-text-primary px-4 pt-4 pb-2">Groupe {group}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-bg-tertiary border-b border-border">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-text-secondary uppercase">#</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-text-secondary uppercase">Nom</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-text-secondary uppercase">J</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-text-secondary uppercase">Buts pour</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-text-secondary uppercase">Buts contre</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-text-secondary uppercase">Dif</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-text-secondary uppercase">Pts</th>
                          {currentUser?.isAdmin && <th className="px-3 py-2 text-right text-xs font-medium text-text-secondary uppercase">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-6 text-center text-text-secondary text-sm">
                              Aucune équipe dans ce groupe. Assignez des équipes dans{' '}
                              <Link href="/admin/groups" className="text-accent hover:underline">Groupes</Link>.
                            </td>
                          </tr>
                        ) : (
                          rows.map((row, index) => {
                            const isEditing = editingRow?.teamId === row.teamId && editingRow?.group === group;
                            return (
                              <tr key={row.teamId} className="hover:bg-bg-tertiary/50">
                                <td className="px-3 py-2">
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium bg-bg-tertiary text-text-primary">
                                    {index + 1}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <TeamLogo logo={row.logo} flag={row.flag} name={row.teamName} size="sm" />
                                    <span className="font-medium text-text-primary">{row.teamName}</span>
                                  </div>
                                </td>
                                {isEditing ? (
                                  <>
                                    <td className="px-3 py-2 text-center">
                                      <input
                                        type="number"
                                        min={0}
                                        value={editValues.matchesPlayed}
                                        onChange={(e) => setEditValues((v) => ({ ...v, matchesPlayed: parseInt(e.target.value, 10) || 0 }))}
                                        className="w-14 px-1 py-0.5 border border-border rounded bg-bg-primary text-text-primary text-center text-sm"
                                      />
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <input
                                        type="number"
                                        min={0}
                                        value={editValues.goalsFor}
                                        onChange={(e) => setEditValues((v) => ({ ...v, goalsFor: parseInt(e.target.value, 10) || 0 }))}
                                        className="w-14 px-1 py-0.5 border border-border rounded bg-bg-primary text-text-primary text-center text-sm"
                                      />
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <input
                                        type="number"
                                        min={0}
                                        value={editValues.goalsAgainst}
                                        onChange={(e) => setEditValues((v) => ({ ...v, goalsAgainst: parseInt(e.target.value, 10) || 0 }))}
                                        className="w-14 px-1 py-0.5 border border-border rounded bg-bg-primary text-text-primary text-center text-sm"
                                      />
                                    </td>
                                    <td className="px-3 py-2 text-center text-text-primary">
                                      {editValues.goalsFor - editValues.goalsAgainst}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <input
                                        type="number"
                                        min={0}
                                        value={editValues.points}
                                        onChange={(e) => setEditValues((v) => ({ ...v, points: parseInt(e.target.value, 10) || 0 }))}
                                        className="w-14 px-1 py-0.5 border border-border rounded bg-bg-primary text-text-primary text-center text-sm"
                                      />
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                      <div className="flex gap-1 justify-end">
                                        <Button size="sm" onClick={handleSaveStanding}>Enregistrer</Button>
                                        <Button size="sm" variant="outline" onClick={() => setEditingRow(null)}>Annuler</Button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-3 py-2 text-center text-text-primary">{row.matchesPlayed}</td>
                                    <td className="px-3 py-2 text-center text-text-primary">{row.goalsFor}</td>
                                    <td className="px-3 py-2 text-center text-text-primary">{row.goalsAgainst}</td>
                                    <td className="px-3 py-2 text-center text-text-primary">{row.goalDiff}</td>
                                    <td className="px-3 py-2 text-center font-medium text-text-primary">{row.points}</td>
                                    <td className="px-3 py-2 text-right">
                                      <Button size="sm" variant="outline" onClick={() => startEditStanding(row.teamId, group)}>
                                        Modifier
                                      </Button>
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              );
            })}
            <div className="flex justify-end">
              <Button onClick={refreshData}>Mise à jour</Button>
            </div>
          </div>
        )}

        {/* Éliminatoires: quarters, semis, finals - match cards */}
        {activeSection === 'eliminatoires' && (
          <div className="space-y-8">
            {KNOCKOUT_PHASES.map(({ key, label }) => {
              const phaseMatches = knockoutMatches.filter((m) => m.phase === key).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              return (
                <Card key={key} className="p-4 sm:p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-4">{label}</h2>
                  <div className="space-y-4">
                    {phaseMatches.length === 0 ? (
                      <p className="text-text-secondary text-sm">Aucun match. Créez des matchs en phase &quot;{label}&quot; dans{' '}
                        <Link href="/admin/matches" className="text-accent hover:underline">Matchs</Link>.
                      </p>
                    ) : (
                      phaseMatches.map((match) => {
                        const team1 = teams.find((t) => t.id === match.team1Id);
                        const team2 = teams.find((t) => t.id === match.team2Id);
                        const hasResult = match.score1 !== undefined && match.score2 !== undefined && match.status === 'finished';
                        const isEditingScore = editingScoreMatchId === match.id;
                        return (
                          <div
                            key={match.id}
                            className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-bg-tertiary/50"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <TeamLogo logo={team1?.logo} flag={team1?.flag} name={team1?.name} size="sm" />
                              <span className="font-medium text-text-primary truncate">{team1?.name ?? 'Inconnu'}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[120px] justify-center">
                              {isEditingScore ? (
                                <>
                                  <input
                                    type="number"
                                    min={0}
                                    value={score1}
                                    onChange={(e) => setScore1(e.target.value)}
                                    className="w-12 px-2 py-1 border border-border rounded bg-bg-primary text-text-primary text-center"
                                  />
                                  <span className="text-text-secondary">-</span>
                                  <input
                                    type="number"
                                    min={0}
                                    value={score2}
                                    onChange={(e) => setScore2(e.target.value)}
                                    className="w-12 px-2 py-1 border border-border rounded bg-bg-primary text-text-primary text-center"
                                  />
                                  <Button size="sm" onClick={() => handleSaveScore(match.id)}>OK</Button>
                                  <Button size="sm" variant="outline" onClick={() => { setEditingScoreMatchId(null); setScore1(''); setScore2(''); }}>Annuler</Button>
                                </>
                              ) : hasResult ? (
                                <>
                                  <span className="font-semibold text-text-primary">{match.score1}</span>
                                  <span className="text-text-secondary">-</span>
                                  <span className="font-semibold text-text-primary">{match.score2}</span>
                                  <Button size="sm" variant="outline" onClick={() => { setEditingScoreMatchId(match.id); setScore1(String(match.score1 ?? '')); setScore2(String(match.score2 ?? '')); }}>Modifier</Button>
                                </>
                              ) : (
                                <>
                                  <span className="text-text-secondary text-sm">Aucun résultat</span>
                                  <Button size="sm" onClick={() => { setEditingScoreMatchId(match.id); setScore1(''); setScore2(''); }}>Renseigner</Button>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                              <TeamLogo logo={team2?.logo} flag={team2?.flag} name={team2?.name} size="sm" />
                              <span className="font-medium text-text-primary truncate">{team2?.name ?? 'Inconnu'}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              );
            })}
            <div className="flex justify-end">
              <Button onClick={refreshData}>Mise à jour</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
