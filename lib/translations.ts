// Translation files for French and English

export type Language = 'fr' | 'en';

export type TranslationKey = 
  // Common
  | 'common.back'
  | 'common.save'
  | 'common.cancel'
  | 'common.loading'
  | 'common.saving'
  | 'common.logout'
  | 'common.home'
  | 'common.matches'
  | 'common.browse'
  | 'common.leaderboard'
  | 'common.profile'
  | 'common.admin'
  | 'common.login'
  | 'common.register'
  | 'common.sportsPredictions'
  | 'common.predictions'
  | 'common.loggingOut'
  | 'common.backToHome'
  | 'common.viewAll'
  | 'common.total'
  | 'common.finished'
  | 'common.upcoming'
  | 'common.points'
  | 'common.you'
  | 'common.group'
  | 'common.vs'
  | 'common.draw'
  | 'common.predict'
  | 'common.live'
  | 'common.all'
  | 'common.past'
  | 'common.allPhases'
  | 'common.list'
  | 'common.grid'
  | 'common.noMatchesFound'
  | 'common.browseAndPredict'
  | 'common.createAccountToPredict'
  | 'common.loginToPredict'
  // Home
  | 'home.championship'
  | 'home.predictAndCompete'
  | 'home.viewMatches'
  | 'home.upcomingMatches'
  | 'home.groups'
  | 'home.createAccount'
  | 'home.createAccountDesc'
  // Login
  | 'login.title'
  | 'login.registerTitle'
  | 'login.signIn'
  | 'login.createAccount'
  | 'login.name'
  | 'login.username'
  | 'login.email'
  | 'login.emailOptional'
  | 'login.password'
  | 'login.submit'
  | 'login.register'
  | 'login.noAccount'
  | 'login.haveAccount'
  | 'login.error'
  // Matches
  | 'matches.title'
  | 'matches.phase.group'
  | 'matches.phase.round16'
  | 'matches.phase.quarter'
  | 'matches.phase.semi'
  | 'matches.phase.final'
  | 'matches.status.finished'
  | 'matches.status.upcoming'
  // Match Detail
  | 'matchDetail.notFound'
  | 'matchDetail.backToMatches'
  | 'matchDetail.makePrediction'
  | 'matchDetail.predictionSubmitted'
  | 'matchDetail.redirecting'
  | 'matchDetail.existingPrediction'
  | 'matchDetail.score'
  | 'matchDetail.winner'
  | 'matchDetail.motm'
  | 'matchDetail.predictionType'
  | 'matchDetail.exactScore'
  | 'matchDetail.winnerOnly'
  | 'matchDetail.points10'
  | 'matchDetail.points3'
  | 'matchDetail.teamScore'
  | 'matchDetail.predictedWinner'
  | 'matchDetail.selectWinner'
  | 'matchDetail.manOfTheMatch'
  | 'matchDetail.optional3pts'
  | 'matchDetail.selectPlayer'
  | 'matchDetail.potentialPoints'
  | 'matchDetail.submitPrediction'
  | 'matchDetail.matchStarted'
  | 'matchDetail.enterBothScores'
  | 'matchDetail.selectWinner'
  | 'matchDetail.motmLabel'
  | 'matchDetail.loginRequired'
  | 'matchDetail.loginToPredict'
  | 'matchDetail.betDistribution'
  | 'matchDetail.noBetsYet'
  | 'matchDetail.yourBetResult'
  | 'matchDetail.youWon'
  | 'matchDetail.youLost'
  | 'matchDetail.yourPrediction'
  | 'matchDetail.actualResult'
  | 'matchDetail.yourMotmPrediction'
  | 'matchDetail.actualMotm'
  | 'matchDetail.matchFinished'
  | 'matchDetail.loginToSeeStats'
  | 'matchDetail.noPredictionMade'
  // Leaderboard
  | 'leaderboard.title'
  | 'leaderboard.rankings'
  | 'leaderboard.rank'
  | 'leaderboard.player'
  | 'leaderboard.exact'
  | 'leaderboard.winner'
  | 'leaderboard.scoringRules'
  | 'leaderboard.exactScore'
  | 'leaderboard.winnerOnly'
  | 'leaderboard.manOfMatch'
  | 'leaderboard.bonus'
  | 'leaderboard.wrong'
  | 'leaderboard.pts'
  // Profile
  | 'profile.title'
  | 'profile.editProfile'
  | 'profile.name'
  | 'profile.profilePicture'
  | 'profile.instagramHandle'
  | 'profile.instagramPlaceholder'
  | 'profile.instagramHint'
  | 'profile.saveChanges'
  | 'profile.profileUpdated'
  | 'profile.statistics'
  | 'profile.totalPoints'
  | 'profile.exactScores'
  | 'profile.winnerOnly'
  | 'profile.accountInfo'
  | 'profile.username'
  | 'profile.email'
  | 'profile.language'
  | 'profile.selectLanguage'
  | 'profile.french'
  | 'profile.english'
  // Admin
  | 'admin.accessDenied'
  | 'admin.needPrivileges'
  | 'admin.goHome'
  | 'admin.panel'
  | 'admin.manage'
  | 'admin.teamManagement'
  | 'admin.teamManagementDesc'
  | 'admin.groupAssignment'
  | 'admin.groupAssignmentDesc'
  | 'admin.matchManagement'
  | 'admin.matchManagementDesc'
  | 'admin.matchResults'
  | 'admin.matchResultsDesc'
  // My Bets
  | 'common.myBets'
  | 'myBets.title'
  | 'myBets.subtitle'
  | 'myBets.totalBets'
  | 'myBets.won'
  | 'myBets.lost'
  | 'myBets.noBets'
  | 'myBets.browsMatches'
  | 'myBets.result';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  fr: {
    // Common
    'common.back': 'Retour',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.loading': 'Chargement...',
    'common.saving': 'Enregistrement...',
    'common.logout': 'Déconnexion',
    'common.home': 'Accueil',
    'common.matches': 'Matchs',
    'common.browse': 'Parcourir',
    'common.leaderboard': 'Classement',
    'common.profile': 'Profil',
    'common.admin': 'Admin',
    'common.login': 'Connexion',
    'common.register': 'Inscription',
    'common.sportsPredictions': 'Prédictions Sportives',
    'common.predictions': 'Prédictions',
    'common.loggingOut': 'Déconnexion...',
    'common.backToHome': '← Retour à l\'accueil',
    'common.viewAll': 'Voir tout →',
    'common.total': 'Total',
    'common.finished': 'Terminé',
    'common.upcoming': 'À venir',
    'common.points': 'points',
    'common.you': 'Vous',
    'common.group': 'Groupe',
    'common.vs': 'vs',
    'common.draw': 'Match nul',
    'common.predict': 'Prédire →',
    'common.live': 'En direct',
    'common.all': 'Tous',
    'common.past': 'Passé',
    'common.allPhases': 'Toutes les phases',
    'common.list': 'Liste',
    'common.grid': 'Grille',
    'common.noMatchesFound': 'Aucun match trouvé pour les filtres sélectionnés.',
    'common.browseAndPredict': 'Parcourir et prédire les résultats des matchs',
    'common.createAccountToPredict': 'Créez un compte pour commencer à parier',
    'common.loginToPredict': 'Connectez-vous pour faire vos prédictions',
    // Home
    'home.championship': 'Championnat de Prédictions Sportives',
    'home.predictAndCompete': 'Prédisez les résultats des matchs et devenez le plus malicieux',
    'home.viewMatches': 'Voir les Matchs',
    'home.upcomingMatches': 'Matchs à Venir',
    'home.groups': 'Groupes',
    'home.createAccount': 'Créer un Compte',
    'home.createAccountDesc': 'Inscrivez-vous pour commencer à faire vos prédictions et participer au classement',
    // Login
    'login.title': 'Connexion',
    'login.registerTitle': 'Inscription',
    'login.signIn': 'Connectez-vous à votre compte',
    'login.createAccount': 'Créez un nouveau compte pour commencer la malice',
    'login.name': 'Nom',
    'login.username': 'Nom d\'utilisateur',
    'login.email': 'Email',
    'login.emailOptional': 'Email (optionnel)',
    'login.password': 'Mot de passe',
    'login.submit': 'Connexion',
    'login.register': 'Inscription',
    'login.noAccount': 'Vous n\'avez pas de compte ? Inscription',
    'login.haveAccount': 'Vous avez déjà un compte ? Connexion',
    'login.error': 'Une erreur s\'est produite',
    // Matches
    'matches.title': 'Matchs',
    'matches.phase.group': 'Phase de groupes',
    'matches.phase.round16': 'Huitièmes de finale',
    'matches.phase.quarter': 'Quarts de finale',
    'matches.phase.semi': 'Demi-finales',
    'matches.phase.final': 'Finale',
    'matches.status.finished': 'Terminé',
    'matches.status.upcoming': 'À venir',
    // Match Detail
    'matchDetail.notFound': 'Match introuvable',
    'matchDetail.backToMatches': 'Retour aux Matchs',
    'matchDetail.makePrediction': 'Faites Votre Prédiction',
    'matchDetail.predictionSubmitted': '✓ Prédiction soumise avec succès !',
    'matchDetail.redirecting': 'Redirection vers les matchs...',
    'matchDetail.existingPrediction': 'Vous avez déjà une prédiction pour ce match',
    'matchDetail.score': 'Score',
    'matchDetail.winner': 'Vainqueur',
    'matchDetail.motm': 'Joueur du match',
    'matchDetail.predictionType': 'Type de Prédiction',
    'matchDetail.exactScore': 'Score Exact',
    'matchDetail.winnerOnly': 'Vainqueur Seulement',
    'matchDetail.points10': '+10 points',
    'matchDetail.points3': '+3 points',
    'matchDetail.teamScore': 'Score',
    'matchDetail.predictedWinner': 'Vainqueur Prévu',
    'matchDetail.selectWinner': 'Sélectionner le vainqueur',
    'matchDetail.manOfTheMatch': 'Joueur du Match',
    'matchDetail.optional3pts': '(Optionnel, +3 pts)',
    'matchDetail.selectPlayer': 'Sélectionner un joueur',
    'matchDetail.potentialPoints': 'Points Potentiels',
    'matchDetail.submitPrediction': 'Soumettre la Prédiction',
    'matchDetail.matchStarted': 'Ce match a déjà commencé. Les prédictions sont fermées.',
    'matchDetail.enterBothScores': 'Veuillez entrer les deux scores',
    'matchDetail.motmLabel': 'Joueur du match',
    'matchDetail.loginRequired': 'Connexion Requise',
    'matchDetail.loginToPredict': 'Vous devez être connecté pour faire une prédiction. Créez un compte ou connectez-vous pour continuer.',
    'matchDetail.betDistribution': 'Répartition des paris (1/N/2)',
    'matchDetail.noBetsYet': 'Aucun pari sur ce match pour le moment.',
    'matchDetail.yourBetResult': 'Résultat de votre pari',
    'matchDetail.youWon': 'Vous avez gagné !',
    'matchDetail.youLost': 'Perdu...',
    'matchDetail.yourPrediction': 'Votre prédiction',
    'matchDetail.actualResult': 'Résultat réel',
    'matchDetail.yourMotmPrediction': 'Votre joueur du match',
    'matchDetail.actualMotm': 'Joueur du match',
    'matchDetail.matchFinished': 'Match terminé',
    'matchDetail.loginToSeeStats': 'Connectez-vous pour voir vos statistiques de paris.',
    'matchDetail.noPredictionMade': 'Vous n\'avez pas fait de prédiction pour ce match.',
    // Leaderboard
    'leaderboard.title': 'Classement',
    'leaderboard.rankings': 'Classements basés sur les points totaux gagnés',
    'leaderboard.rank': 'Rang',
    'leaderboard.player': 'Parieur',
    'leaderboard.exact': 'Exact',
    'leaderboard.winner': 'Vainqueur',
    'leaderboard.scoringRules': 'Règles de Score',
    'leaderboard.exactScore': 'Score exact',
    'leaderboard.winnerOnly': 'Vainqueur seulement',
    'leaderboard.manOfMatch': 'Joueur du match',
    'leaderboard.bonus': '(bonus)',
    'leaderboard.wrong': 'Incorrect',
    'leaderboard.pts': 'pts',
    // Profile
    'profile.title': 'Mon Profil',
    'profile.editProfile': 'Modifier le Profil',
    'profile.name': 'Nom',
    'profile.profilePicture': 'Photo de Profil',
    'profile.instagramHandle': 'Compte Instagram',
    'profile.instagramPlaceholder': '@nomutilisateur',
    'profile.instagramHint': 'Entrez votre nom d\'utilisateur Instagram (avec ou sans @)',
    'profile.saveChanges': 'Enregistrer les Modifications',
    'profile.profileUpdated': 'Profil mis à jour avec succès !',
    'profile.statistics': 'Statistiques',
    'profile.totalPoints': 'Points Totaux',
    'profile.exactScores': 'Scores Exactes',
    'profile.winnerOnly': 'Vainqueur Seulement',
    'profile.accountInfo': 'Informations du Compte',
    'profile.username': 'Nom d\'utilisateur',
    'profile.email': 'Email',
    'profile.language': 'Langue',
    'profile.selectLanguage': 'Sélectionner la Langue',
    'profile.french': 'Français',
    'profile.english': 'Anglais',
    // Admin
    'admin.accessDenied': 'Accès Refusé',
    'admin.needPrivileges': 'Vous avez besoin de privilèges administrateur pour accéder à cette page.',
    'admin.goHome': 'Retour à l\'accueil',
    'admin.panel': 'Panneau d\'Administration',
    'admin.manage': 'Gérer les équipes, groupes, matchs et résultats',
    'admin.teamManagement': 'Gestion des Équipes',
    'admin.teamManagementDesc': 'Créer et modifier les équipes, ajouter des joueurs',
    'admin.groupAssignment': 'Affectation des Groupes',
    'admin.groupAssignmentDesc': 'Assigner les équipes aux groupes',
    'admin.matchManagement': 'Gestion des Matchs',
    'admin.matchManagementDesc': 'Créer et modifier les matchs',
    'admin.matchResults': 'Résultats des Matchs',
    'admin.matchResultsDesc': 'Définir les scores finaux et le joueur du match',
    // My Bets
    'common.myBets': 'Mes Paris',
    'myBets.title': 'Mes Paris',
    'myBets.subtitle': 'Historique de tous vos paris et prédictions',
    'myBets.totalBets': 'Total Paris',
    'myBets.won': 'Gagnés',
    'myBets.lost': 'Perdus',
    'myBets.noBets': 'Vous n\'avez pas encore fait de paris. Commencez à parier sur les matchs !',
    'myBets.browsMatches': 'Voir les Matchs',
    'myBets.result': 'Résultat',
  },
  en: {
    // Common
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.saving': 'Saving...',
    'common.logout': 'Logout',
    'common.home': 'Home',
    'common.matches': 'Matches',
    'common.browse': 'Browse',
    'common.leaderboard': 'Leaderboard',
    'common.profile': 'Profile',
    'common.admin': 'Admin',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.sportsPredictions': 'Sports Predictions',
    'common.predictions': 'Predictions',
    'common.loggingOut': 'Logging out...',
    'common.backToHome': '← Back to home',
    'common.viewAll': 'View all →',
    'common.total': 'Total',
    'common.finished': 'Finished',
    'common.upcoming': 'Upcoming',
    'common.points': 'points',
    'common.you': 'You',
    'common.group': 'Group',
    'common.vs': 'vs',
    'common.draw': 'Draw',
    'common.predict': 'Predict →',
    'common.live': 'Live',
    'common.all': 'All',
    'common.past': 'Past',
    'common.allPhases': 'All Phases',
    'common.list': 'List',
    'common.grid': 'Grid',
    'common.noMatchesFound': 'No matches found for the selected filters.',
    'common.browseAndPredict': 'Browse and predict match results',
    'common.createAccountToPredict': 'Create an account to start betting',
    'common.loginToPredict': 'Log in to make your predictions',
    // Home
    'home.championship': 'Sports Prediction Championship',
    'home.predictAndCompete': 'Predict match results and compete for points',
    'home.viewMatches': 'View Matches',
    'home.upcomingMatches': 'Upcoming Matches',
    'home.groups': 'Groups',
    'home.createAccount': 'Create Account',
    'home.createAccountDesc': 'Sign up to start making predictions and join the leaderboard',
    // Login
    'login.title': 'Login',
    'login.registerTitle': 'Register',
    'login.signIn': 'Sign in to your account',
    'login.createAccount': 'Create a new account to start predicting',
    'login.name': 'Name',
    'login.username': 'Username',
    'login.email': 'Email',
    'login.emailOptional': 'Email (optional)',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.register': 'Register',
    'login.noAccount': 'Don\'t have an account? Register',
    'login.haveAccount': 'Already have an account? Login',
    'login.error': 'An error occurred',
    // Matches
    'matches.title': 'Matches',
    'matches.phase.group': 'Group Stage',
    'matches.phase.round16': 'Round of 16',
    'matches.phase.quarter': 'Quarter Finals',
    'matches.phase.semi': 'Semi Finals',
    'matches.phase.final': 'Final',
    'matches.status.finished': 'Finished',
    'matches.status.upcoming': 'Upcoming',
    // Match Detail
    'matchDetail.notFound': 'Match not found',
    'matchDetail.backToMatches': 'Back to Matches',
    'matchDetail.makePrediction': 'Make Your Prediction',
    'matchDetail.predictionSubmitted': '✓ Prediction submitted successfully!',
    'matchDetail.redirecting': 'Redirecting to matches...',
    'matchDetail.existingPrediction': 'You already have a prediction for this match',
    'matchDetail.score': 'Score',
    'matchDetail.winner': 'Winner',
    'matchDetail.motm': 'Man of the Match',
    'matchDetail.predictionType': 'Prediction Type',
    'matchDetail.exactScore': 'Exact Score',
    'matchDetail.winnerOnly': 'Winner Only',
    'matchDetail.points10': '+10 points',
    'matchDetail.points3': '+3 points',
    'matchDetail.teamScore': 'Score',
    'matchDetail.predictedWinner': 'Predicted Winner',
    'matchDetail.selectWinner': 'Select winner',
    'matchDetail.manOfTheMatch': 'Man of the Match',
    'matchDetail.optional3pts': '(Optional, +3 pts)',
    'matchDetail.selectPlayer': 'Select player',
    'matchDetail.potentialPoints': 'Potential Points',
    'matchDetail.submitPrediction': 'Submit Prediction',
    'matchDetail.matchStarted': 'This match has already started. Predictions are closed.',
    'matchDetail.enterBothScores': 'Please enter both scores',
    'matchDetail.motmLabel': 'Man of the Match',
    'matchDetail.loginRequired': 'Login Required',
    'matchDetail.loginToPredict': 'You must be logged in to make a prediction. Create an account or log in to continue.',
    'matchDetail.betDistribution': 'Bet distribution (1/X/2)',
    'matchDetail.noBetsYet': 'No bets on this match yet.',
    'matchDetail.yourBetResult': 'Your Bet Result',
    'matchDetail.youWon': 'You won!',
    'matchDetail.youLost': 'You lost...',
    'matchDetail.yourPrediction': 'Your prediction',
    'matchDetail.actualResult': 'Actual result',
    'matchDetail.yourMotmPrediction': 'Your MOTM pick',
    'matchDetail.actualMotm': 'Actual MOTM',
    'matchDetail.matchFinished': 'Match Finished',
    'matchDetail.loginToSeeStats': 'Log in to see your betting stats.',
    'matchDetail.noPredictionMade': 'You didn\'t make a prediction for this match.',
    // Leaderboard
    'leaderboard.title': 'Leaderboard',
    'leaderboard.rankings': 'Rankings based on total points earned',
    'leaderboard.rank': 'Rank',
    'leaderboard.player': 'Better',
    'leaderboard.exact': 'Exact',
    'leaderboard.winner': 'Winner',
    'leaderboard.scoringRules': 'Scoring Rules',
    'leaderboard.exactScore': 'Exact score',
    'leaderboard.winnerOnly': 'Winner only',
    'leaderboard.manOfMatch': 'Man of match',
    'leaderboard.bonus': '(bonus)',
    'leaderboard.wrong': 'Wrong',
    'leaderboard.pts': 'pts',
    // Profile
    'profile.title': 'My Profile',
    'profile.editProfile': 'Edit Profile',
    'profile.name': 'Name',
    'profile.profilePicture': 'Profile Picture',
    'profile.instagramHandle': 'Instagram Handle',
    'profile.instagramPlaceholder': '@username',
    'profile.instagramHint': 'Enter your Instagram username (with or without @)',
    'profile.saveChanges': 'Save Changes',
    'profile.profileUpdated': 'Profile updated successfully!',
    'profile.statistics': 'Statistics',
    'profile.totalPoints': 'Total Points',
    'profile.exactScores': 'Exact Scores',
    'profile.winnerOnly': 'Winner Only',
    'profile.accountInfo': 'Account Info',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.language': 'Language',
    'profile.selectLanguage': 'Select Language',
    'profile.french': 'French',
    'profile.english': 'English',
    // Admin
    'admin.accessDenied': 'Access Denied',
    'admin.needPrivileges': 'You need admin privileges to access this page.',
    'admin.goHome': 'Go Home',
    'admin.panel': 'Admin Panel',
    'admin.manage': 'Manage teams, groups, matches, and results',
    'admin.teamManagement': 'Team Management',
    'admin.teamManagementDesc': 'Create and edit teams, add players',
    'admin.groupAssignment': 'Group Assignment',
    'admin.groupAssignmentDesc': 'Assign teams to groups',
    'admin.matchManagement': 'Match Management',
    'admin.matchManagementDesc': 'Create and edit matches',
    'admin.matchResults': 'Match Results',
    'admin.matchResultsDesc': 'Set final scores and man of the match',
    // My Bets
    'common.myBets': 'My Bets',
    'myBets.title': 'My Bets',
    'myBets.subtitle': 'History of all your bets and predictions',
    'myBets.totalBets': 'Total Bets',
    'myBets.won': 'Won',
    'myBets.lost': 'Lost',
    'myBets.noBets': 'You haven\'t placed any bets yet. Start betting on matches!',
    'myBets.browsMatches': 'Browse Matches',
    'myBets.result': 'Result',
  },
};

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] || translations['fr'][key] || key;
}
