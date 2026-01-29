// Public Classification page - Poules + Éliminatoires (read-only)
'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import TeamLogo from '@/components/TeamLogo';
import { Match } from '@/types';

const GROUPS = ['A', 'B', 'C', 'D'] as const;
const KNOCKOUT_PHASES: { key: Match['phase']; label: string }[] = [
  { key: 'quarter', label: 'Quarts de finale' },
  { key: 'semi', label: 'Demi-finales' },
  { key: 'final', label: 'Finale' },
];

export default function ClassificationPage() {
  const { teams, matches, standings } = useApp();
  const [activeSection, setActiveSection] = useState<'poules' | 'eliminatoires'>('poules');

  const byGroup = standings || { A: [], B: [], C: [], D: [] };
  const knockoutMatches = matches.filter((m) => ['quarter', 'semi', 'final'].includes(m.phase));

  return (
    <div className="min-h-screen py-6 sm:py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-1">Classification</h1>
          <p className="text-sm text-text-secondary">Poules et éliminatoires</p>
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-text-secondary text-sm">
                              Aucune équipe dans ce groupe.
                            </td>
                          </tr>
                        ) : (
                          rows.map((row, index) => (
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
                              <td className="px-3 py-2 text-center text-text-primary">{row.matchesPlayed}</td>
                              <td className="px-3 py-2 text-center text-text-primary">{row.goalsFor}</td>
                              <td className="px-3 py-2 text-center text-text-primary">{row.goalsAgainst}</td>
                              <td className="px-3 py-2 text-center text-text-primary">{row.goalDiff}</td>
                              <td className="px-3 py-2 text-center font-medium text-text-primary">{row.points}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Éliminatoires: quarters, semis, finals - match cards (read-only) */}
        {activeSection === 'eliminatoires' && (
          <div className="space-y-8">
            {KNOCKOUT_PHASES.map(({ key, label }) => {
              const phaseMatches = knockoutMatches.filter((m) => m.phase === key).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              return (
                <Card key={key} className="p-4 sm:p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-4">{label}</h2>
                  <div className="space-y-4">
                    {phaseMatches.length === 0 ? (
                      <p className="text-text-secondary text-sm">Aucun match.</p>
                    ) : (
                      phaseMatches.map((match) => {
                        const team1 = teams.find((t) => t.id === match.team1Id);
                        const team2 = teams.find((t) => t.id === match.team2Id);
                        const hasResult = match.score1 !== undefined && match.score2 !== undefined && match.status === 'finished';
                        return (
                          <div
                            key={match.id}
                            className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-bg-tertiary/50"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <TeamLogo logo={team1?.logo} flag={team1?.flag} name={team1?.name} size="sm" />
                              <span className="font-medium text-text-primary truncate">{team1?.name ?? 'Inconnu'}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[80px] justify-center">
                              {hasResult ? (
                                <>
                                  <span className="font-semibold text-text-primary">{match.score1}</span>
                                  <span className="text-text-secondary">-</span>
                                  <span className="font-semibold text-text-primary">{match.score2}</span>
                                </>
                              ) : (
                                <span className="text-text-secondary text-sm">Aucun résultat</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
