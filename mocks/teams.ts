// Mock teams data with players
// TODO: Replace with Supabase query: SELECT * FROM teams ORDER BY group, name

import { Team } from '@/types';

export const teams: Team[] = [
  // Group A
  {
    id: 'team-1',
    name: 'France',
    group: 'A',
    flag: '🇫🇷',
    logo: '🇫🇷',
    players: [
      { id: 'p-fr-1', name: 'Kylian Mbappé', position: 'Forward', number: 10 },
      { id: 'p-fr-2', name: 'Antoine Griezmann', position: 'Midfielder', number: 7 },
      { id: 'p-fr-3', name: 'Olivier Giroud', position: 'Forward', number: 9 },
      { id: 'p-fr-4', name: 'Hugo Lloris', position: 'Goalkeeper', number: 1 },
      { id: 'p-fr-5', name: 'Raphaël Varane', position: 'Defender', number: 4 },
    ],
  },
  {
    id: 'team-2',
    name: 'Brazil',
    group: 'A',
    flag: '🇧🇷',
    logo: '🇧🇷',
    players: [
      { id: 'p-br-1', name: 'Neymar Jr', position: 'Forward', number: 10 },
      { id: 'p-br-2', name: 'Vinícius Júnior', position: 'Forward', number: 20 },
      { id: 'p-br-3', name: 'Casemiro', position: 'Midfielder', number: 5 },
      { id: 'p-br-4', name: 'Alisson', position: 'Goalkeeper', number: 1 },
      { id: 'p-br-5', name: 'Marquinhos', position: 'Defender', number: 5 },
    ],
  },
  {
    id: 'team-3',
    name: 'Argentina',
    group: 'A',
    flag: '🇦🇷',
    logo: '🇦🇷',
    players: [
      { id: 'p-ar-1', name: 'Lionel Messi', position: 'Forward', number: 10 },
      { id: 'p-ar-2', name: 'Ángel Di María', position: 'Midfielder', number: 11 },
      { id: 'p-ar-3', name: 'Emiliano Martínez', position: 'Goalkeeper', number: 23 },
      { id: 'p-ar-4', name: 'Rodrigo De Paul', position: 'Midfielder', number: 7 },
      { id: 'p-ar-5', name: 'Cristian Romero', position: 'Defender', number: 13 },
    ],
  },
  {
    id: 'team-4',
    name: 'Spain',
    group: 'A',
    flag: '🇪🇸',
    logo: '🇪🇸',
    players: [
      { id: 'p-es-1', name: 'Pedri', position: 'Midfielder', number: 8 },
      { id: 'p-es-2', name: 'Álvaro Morata', position: 'Forward', number: 7 },
      { id: 'p-es-3', name: 'Unai Simón', position: 'Goalkeeper', number: 23 },
      { id: 'p-es-4', name: 'Sergio Busquets', position: 'Midfielder', number: 5 },
      { id: 'p-es-5', name: 'Aymeric Laporte', position: 'Defender', number: 24 },
    ],
  },
  
  // Group B
  {
    id: 'team-5',
    name: 'Germany',
    group: 'B',
    flag: '🇩🇪',
    logo: '🇩🇪',
    players: [
      { id: 'p-de-1', name: 'Kai Havertz', position: 'Forward', number: 7 },
      { id: 'p-de-2', name: 'Joshua Kimmich', position: 'Midfielder', number: 6 },
      { id: 'p-de-3', name: 'Manuel Neuer', position: 'Goalkeeper', number: 1 },
      { id: 'p-de-4', name: 'Toni Kroos', position: 'Midfielder', number: 8 },
      { id: 'p-de-5', name: 'Antonio Rüdiger', position: 'Defender', number: 2 },
    ],
  },
  {
    id: 'team-6',
    name: 'Italy',
    group: 'B',
    flag: '🇮🇹',
    logo: '🇮🇹',
    players: [
      { id: 'p-it-1', name: 'Federico Chiesa', position: 'Forward', number: 14 },
      { id: 'p-it-2', name: 'Nicolò Barella', position: 'Midfielder', number: 18 },
      { id: 'p-it-3', name: 'Gianluigi Donnarumma', position: 'Goalkeeper', number: 21 },
      { id: 'p-it-4', name: 'Marco Verratti', position: 'Midfielder', number: 6 },
      { id: 'p-it-5', name: 'Leonardo Bonucci', position: 'Defender', number: 19 },
    ],
  },
  {
    id: 'team-7',
    name: 'England',
    group: 'B',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    players: [
      { id: 'p-en-1', name: 'Harry Kane', position: 'Forward', number: 9 },
      { id: 'p-en-2', name: 'Jude Bellingham', position: 'Midfielder', number: 22 },
      { id: 'p-en-3', name: 'Jordan Pickford', position: 'Goalkeeper', number: 1 },
      { id: 'p-en-4', name: 'Declan Rice', position: 'Midfielder', number: 4 },
      { id: 'p-en-5', name: 'John Stones', position: 'Defender', number: 5 },
    ],
  },
  {
    id: 'team-8',
    name: 'Netherlands',
    group: 'B',
    flag: '🇳🇱',
    logo: '🇳🇱',
    players: [
      { id: 'p-nl-1', name: 'Memphis Depay', position: 'Forward', number: 10 },
      { id: 'p-nl-2', name: 'Frenkie de Jong', position: 'Midfielder', number: 21 },
      { id: 'p-nl-3', name: 'Virgil van Dijk', position: 'Defender', number: 4 },
      { id: 'p-nl-4', name: 'Georginio Wijnaldum', position: 'Midfielder', number: 8 },
      { id: 'p-nl-5', name: 'Jasper Cillessen', position: 'Goalkeeper', number: 1 },
    ],
  },
  
  // Group C
  {
    id: 'team-9',
    name: 'Portugal',
    group: 'C',
    flag: '🇵🇹',
    logo: '🇵🇹',
    players: [
      { id: 'p-pt-1', name: 'Cristiano Ronaldo', position: 'Forward', number: 7 },
      { id: 'p-pt-2', name: 'Bruno Fernandes', position: 'Midfielder', number: 18 },
      { id: 'p-pt-3', name: 'Rúben Dias', position: 'Defender', number: 4 },
      { id: 'p-pt-4', name: 'Bernardo Silva', position: 'Midfielder', number: 10 },
      { id: 'p-pt-5', name: 'Diogo Costa', position: 'Goalkeeper', number: 22 },
    ],
  },
  {
    id: 'team-10',
    name: 'Belgium',
    group: 'C',
    flag: '🇧🇪',
    logo: '🇧🇪',
    players: [
      { id: 'p-be-1', name: 'Kevin De Bruyne', position: 'Midfielder', number: 7 },
      { id: 'p-be-2', name: 'Romelu Lukaku', position: 'Forward', number: 9 },
      { id: 'p-be-3', name: 'Thibaut Courtois', position: 'Goalkeeper', number: 1 },
      { id: 'p-be-4', name: 'Eden Hazard', position: 'Forward', number: 10 },
      { id: 'p-be-5', name: 'Jan Vertonghen', position: 'Defender', number: 5 },
    ],
  },
  {
    id: 'team-11',
    name: 'Croatia',
    group: 'C',
    flag: '🇭🇷',
    logo: '🇭🇷',
    players: [
      { id: 'p-hr-1', name: 'Luka Modrić', position: 'Midfielder', number: 10 },
      { id: 'p-hr-2', name: 'Ivan Perišić', position: 'Forward', number: 4 },
      { id: 'p-hr-3', name: 'Dominik Livaković', position: 'Goalkeeper', number: 1 },
      { id: 'p-hr-4', name: 'Marcelo Brozović', position: 'Midfielder', number: 11 },
      { id: 'p-hr-5', name: 'Joško Gvardiol', position: 'Defender', number: 20 },
    ],
  },
  {
    id: 'team-12',
    name: 'Uruguay',
    group: 'C',
    flag: '🇺🇾',
    logo: '🇺🇾',
    players: [
      { id: 'p-uy-1', name: 'Luis Suárez', position: 'Forward', number: 9 },
      { id: 'p-uy-2', name: 'Federico Valverde', position: 'Midfielder', number: 15 },
      { id: 'p-uy-3', name: 'Sergio Rochet', position: 'Goalkeeper', number: 1 },
      { id: 'p-uy-4', name: 'Rodrigo Bentancur', position: 'Midfielder', number: 6 },
      { id: 'p-uy-5', name: 'José María Giménez', position: 'Defender', number: 2 },
    ],
  },
  
  // Group D
  {
    id: 'team-13',
    name: 'Mexico',
    group: 'D',
    flag: '🇲🇽',
    logo: '🇲🇽',
    players: [
      { id: 'p-mx-1', name: 'Hirving Lozano', position: 'Forward', number: 22 },
      { id: 'p-mx-2', name: 'Raúl Jiménez', position: 'Forward', number: 9 },
      { id: 'p-mx-3', name: 'Guillermo Ochoa', position: 'Goalkeeper', number: 13 },
      { id: 'p-mx-4', name: 'Héctor Herrera', position: 'Midfielder', number: 16 },
      { id: 'p-mx-5', name: 'Edson Álvarez', position: 'Defender', number: 4 },
    ],
  },
  {
    id: 'team-14',
    name: 'Japan',
    group: 'D',
    flag: '🇯🇵',
    logo: '🇯🇵',
    players: [
      { id: 'p-jp-1', name: 'Takumi Minamino', position: 'Forward', number: 10 },
      { id: 'p-jp-2', name: 'Daichi Kamada', position: 'Midfielder', number: 8 },
      { id: 'p-jp-3', name: 'Shuichi Gonda', position: 'Goalkeeper', number: 12 },
      { id: 'p-jp-4', name: 'Wataru Endo', position: 'Midfielder', number: 6 },
      { id: 'p-jp-5', name: 'Maya Yoshida', position: 'Defender', number: 22 },
    ],
  },
  {
    id: 'team-15',
    name: 'Morocco',
    group: 'D',
    flag: '🇲🇦',
    logo: '🇲🇦',
    players: [
      { id: 'p-ma-1', name: 'Achraf Hakimi', position: 'Defender', number: 2 },
      { id: 'p-ma-2', name: 'Youssef En-Nesyri', position: 'Forward', number: 19 },
      { id: 'p-ma-3', name: 'Yassine Bounou', position: 'Goalkeeper', number: 1 },
      { id: 'p-ma-4', name: 'Sofyan Amrabat', position: 'Midfielder', number: 4 },
      { id: 'p-ma-5', name: 'Hakim Ziyech', position: 'Midfielder', number: 7 },
    ],
  },
  {
    id: 'team-16',
    name: 'Senegal',
    group: 'D',
    flag: '🇸🇳',
    logo: '🇸🇳',
    players: [
      { id: 'p-sn-1', name: 'Sadio Mané', position: 'Forward', number: 10 },
      { id: 'p-sn-2', name: 'Ismaïla Sarr', position: 'Forward', number: 18 },
      { id: 'p-sn-3', name: 'Édouard Mendy', position: 'Goalkeeper', number: 1 },
      { id: 'p-sn-4', name: 'Idrissa Gueye', position: 'Midfielder', number: 5 },
      { id: 'p-sn-5', name: 'Kalidou Koulibaly', position: 'Defender', number: 3 },
    ],
  },
];

export const getTeamById = (id: string): Team | undefined => {
  return teams.find(team => team.id === id);
};

export const getTeamsByGroup = (group: 'A' | 'B' | 'C' | 'D'): Team[] => {
  return teams.filter(team => team.group === group);
};

export const getAllPlayers = (): Array<{ id: string; name: string; teamId: string; teamName: string }> => {
  return teams.flatMap(team => 
    team.players.map(player => ({
      id: player.id,
      name: player.name,
      teamId: team.id,
      teamName: team.name,
    }))
  );
};

export const getPlayersByTeam = (teamId: string) => {
  const team = getTeamById(teamId);
  return team?.players || [];
};
