// Translation files for French and English

export type Language = 'fr' | 'en';

export type TranslationKey = 
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
  | 'profile.english';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  fr: {
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
    'profile.title': 'Mon Profil',
    'profile.editProfile': 'Modifier le Profil',
    'profile.name': 'Nom',
    'profile.profilePicture': 'Photo de Profil',
    'profile.instagramHandle': 'Compte Instagram',
    'profile.instagramPlaceholder': '@nomutilisateur',
    'profile.instagramHint': 'Entrez votre nom d\'utilisateur Instagram (avec ou sans @)',
    'profile.saveChanges': 'Enregistrer les Modifications',
    'profile.profileUpdated': 'Profil mis à jour avec succès!',
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
  },
  en: {
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
  },
};

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] || translations['fr'][key] || key;
}
