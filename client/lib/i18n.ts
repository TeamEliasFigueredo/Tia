export type Language = "en" | "es" | "fr";

export interface Translations {
  // Header
  teams: string;
  yourPlan: string;

  // Navigation
  currentPlan: string;
  availablePackages: string;
  viewBills: string;

  // User menu
  myAccount: string;
  profile: string;
  security: string;
  termsOfUse: string;
  logOut: string;

  // Database management
  databases: string;
  newDatabase: string;
  databaseName: string;
  addDocument: string;
  processDocuments: string;
  processing: string;
  renameDatabase: string;
  deleteDatabase: string;
  confirmDelete: string;
  dragDropFiles: string;
  documents: string;
  pages: string;

  // Document viewer
  documentViewer: string;
  searchInDocument: string;
  selectDocument: string;
  page: string;
  of: string;

  // Chat
  chatWithTia: string;
  askQuestion: string;
  searchChat: string;
  savedChats: string;
  saveCurrent: string;
  settings: string;

  // Settings
  changeLanguage: string;
  adjustFontSize: string;
  customizeAppearance: string;
  privacySettings: string;
  language: string;
  fontSize: string;
  appearance: string;
  theme: string;
  light: string;
  dark: string;
  auto: string;
  shareUsage: string;
  saveHistory: string;
  allowAnalytics: string;

  // General
  save: string;
  cancel: string;
  close: string;
  delete: string;
  edit: string;
  upload: string;
  send: string;
  loading: string;
  error: string;
  success: string;

  // Footer
  footerText: string;
  rightsReserved: string;
  tiaIsCreation: string;
  softiaLink: string;

  // File upload
  uploadFiles: string;
  dragDropHere: string;
  myDocuments: string;

  // Chat messages
  timestamp: string;
  references: string;
  chatSessionName: string;

  // Teams management
  teamManagement: string;
  teamsTab: string;
  teamMembers: string;
  databasePermissions: string;
  createNewTeam: string;
  teamName: string;
  teamDescription: string;
  createTeam: string;
  searchTeams: string;
  members: string;
  created: string;
  manageTeam: string;
  teamMembersManagement: string;
  addNewMember: string;
  addNewTeamMember: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
  member: string;
  teamAdministrator: string;
  addMember: string;
  editTeamMember: string;
  saveChanges: string;
  lastActive: string;
  adminStatus: string;
  admin: string;
  actions: string;
  removeMember: string;
  teamDatabaseAccessPermissions: string;
  configurePermissions: string;
  database: string;
  read: string;
  write: string;
  manage: string;
  permissionHierarchy: string;
  viewDatabaseContent: string;
  addEditDocuments: string;
  removeDocuments: string;
  fullDatabaseControl: string;
  saveAllChanges: string;
  user: string;
  viewer: string;
  removeFromTeam: string;
  addToTeam: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    teams: "Teams",
    yourPlan: "Your Plan",

    // Navigation
    currentPlan: "Current Plan",
    availablePackages: "Available Packages",
    viewBills: "View Bills",

    // User menu
    myAccount: "My Account",
    profile: "Profile",
    security: "Security",
    termsOfUse: "Terms of Use",
    logOut: "Log out",

    // Database management
    databases: "Databases",
    newDatabase: "New Database",
    databaseName: "Database name",
    addDocument: "Add Document",
    processDocuments: "Process Documents",
    processing: "Processing",
    renameDatabase: "Rename Database",
    deleteDatabase: "Delete Database",
    confirmDelete: "Are you sure you want to delete this?",
    dragDropFiles: "Or drag & drop files here",
    documents: "documents",
    pages: "pages",

    // Document viewer
    documentViewer: "Document Viewer",
    searchInDocument: "Search in document...",
    selectDocument: "Select a document to view its content",
    page: "Page",
    of: "of",

    // Chat
    chatWithTia: "Chat with Tia",
    askQuestion: "Ask Tia a question...",
    searchChat: "Search chat...",
    savedChats: "Saved Chats",
    saveCurrent: "Save Current",
    settings: "Settings",

    // Settings
    changeLanguage: "Change Language",
    adjustFontSize: "Adjust Font Size",
    customizeAppearance: "Customize Appearance",
    privacySettings: "Privacy Settings",
    language: "Language",
    fontSize: "Font Size",
    appearance: "Appearance",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    shareUsage: "Share usage data",
    saveHistory: "Save chat history",
    allowAnalytics: "Allow analytics",

    // General
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    delete: "Delete",
    edit: "Edit",
    upload: "Upload",
    send: "Send",
    loading: "Loading...",
    error: "Error",
    success: "Success",

    // Footer
    footerText: "Tia is a Creation of Softia.ca",
    rightsReserved: "All rights reserved",
    tiaIsCreation: "Tia is a Creation of",
    softiaLink: "Softia.ca",

    // File upload
    uploadFiles: "Upload Files",
    dragDropHere: "Or drag & drop here",
    myDocuments: "My Documents",

    // Chat messages
    timestamp: "Timestamp",
    references: "References",
    chatSessionName: "Chat Session",

    // Teams management
    teamManagement: "Team Management",
    teamsTab: "Teams",
    teamMembers: "Team Members",
    databasePermissions: "Database Permissions",
    createNewTeam: "Create New Team",
    teamName: "Team Name",
    teamDescription: "Description",
    createTeam: "Create Team",
    searchTeams: "Search teams...",
    members: "members",
    created: "Created",
    manageTeam: "Manage Team",
    teamMembersManagement: "Team Members Management",
    addNewMember: "Add New Member",
    addNewTeamMember: "Add New Team Member",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    role: "Role",
    member: "Member",
    teamAdministrator: "Team Administrator",
    addMember: "Add Member",
    editTeamMember: "Edit Team Member",
    saveChanges: "Save Changes",
    lastActive: "Last Active",
    adminStatus: "Admin Status",
    admin: "Admin",
    actions: "Actions",
    removeMember: "Remove Member",
    teamDatabaseAccessPermissions: "Team Database Access Permissions",
    configurePermissions: "Configure database access permissions for each team",
    database: "Database",
    read: "Read",
    write: "Write",
    manage: "Manage",
    permissionHierarchy: "Permission Hierarchy:",
    viewDatabaseContent: "View database content",
    addEditDocuments: "Add and edit documents (requires Read)",
    removeDocuments: "Remove documents (requires Read)",
    fullDatabaseControl: "Full database control",
    saveAllChanges: "Save All Changes",
    user: "User",
    viewer: "Viewer",
    removeFromTeam: "Remove from team",
    addToTeam: "Add to team",
  },

  es: {
    // Header
    teams: "Equipos",
    yourPlan: "Tu Plan",

    // Navigation
    currentPlan: "Plan Actual",
    availablePackages: "Paquetes Disponibles",
    viewBills: "Ver Facturas",

    // User menu
    myAccount: "Mi Cuenta",
    profile: "Perfil",
    security: "Seguridad",
    termsOfUse: "Términos de Uso",
    logOut: "Cerrar sesión",

    // Database management
    databases: "Bases de Datos",
    newDatabase: "Nueva Base de Datos",
    databaseName: "Nombre de la base de datos",
    addDocument: "Agregar Documento",
    processDocuments: "Procesar Documentos",
    processing: "Procesando",
    renameDatabase: "Renombrar Base de Datos",
    deleteDatabase: "Eliminar Base de Datos",
    confirmDelete: "¿Estás seguro de que quieres eliminar esto?",
    dragDropFiles: "O arrastra y suelta archivos aquí",
    documents: "documentos",
    pages: "páginas",

    // Document viewer
    documentViewer: "Visor de Documentos",
    searchInDocument: "Buscar en documento...",
    selectDocument: "Selecciona un documento para ver su contenido",
    page: "Página",
    of: "de",

    // Chat
    chatWithTia: "Chat con Tia",
    askQuestion: "Pregúntale a Tia...",
    searchChat: "Buscar en chat...",
    savedChats: "Chats Guardados",
    saveCurrent: "Guardar Actual",
    settings: "Configuración",

    // Settings
    changeLanguage: "Cambiar Idioma",
    adjustFontSize: "Ajustar Tamaño de Fuente",
    customizeAppearance: "Personalizar Apariencia",
    privacySettings: "Configuración de Privacidad",
    language: "Idioma",
    fontSize: "Tamaño de Fuente",
    appearance: "Apariencia",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    auto: "Automático",
    shareUsage: "Compartir datos de uso",
    saveHistory: "Guardar historial de chat",
    allowAnalytics: "Permitir análisis",

    // General
    save: "Guardar",
    cancel: "Cancelar",
    close: "Cerrar",
    delete: "Eliminar",
    edit: "Editar",
    upload: "Subir",
    send: "Enviar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",

    // Footer
    footerText: "Tia es una creación de Softia.ca",
    rightsReserved: "Todos los derechos reservados",
    tiaIsCreation: "Tia es una creación de",
    softiaLink: "Softia.ca",

    // File upload
    uploadFiles: "Subir Archivos",
    dragDropHere: "O arrastra y suelta aquí",
    myDocuments: "Mis Documentos",

    // Chat messages
    timestamp: "Marca de tiempo",
    references: "Referencias",
    chatSessionName: "Sesión de Chat",

    // Teams management
    teamManagement: "Gestión de Equipos",
    teamsTab: "Equipos",
    teamMembers: "Miembros del Equipo",
    databasePermissions: "Permisos de Base de Datos",
    createNewTeam: "Crear Nuevo Equipo",
    teamName: "Nombre del Equipo",
    teamDescription: "Descripción",
    createTeam: "Crear Equipo",
    searchTeams: "Buscar equipos...",
    members: "miembros",
    created: "Creado",
    manageTeam: "Gestionar Equipo",
    teamMembersManagement: "Gestión de Miembros del Equipo",
    addNewMember: "Agregar Nuevo Miembro",
    addNewTeamMember: "Agregar Nuevo Miembro del Equipo",
    firstName: "Nombre",
    lastName: "Apellido",
    emailAddress: "Correo Electrónico",
    role: "Rol",
    member: "Miembro",
    teamAdministrator: "Administrador del Equipo",
    addMember: "Agregar Miembro",
    editTeamMember: "Editar Miembro del Equipo",
    saveChanges: "Guardar Cambios",
    lastActive: "Última Actividad",
    adminStatus: "Estado de Administrador",
    admin: "Administrador",
    actions: "Acciones",
    removeMember: "Eliminar Miembro",
    teamDatabaseAccessPermissions:
      "Permisos de Acceso a Base de Datos del Equipo",
    configurePermissions:
      "Configurar permisos de acceso a la base de datos para cada equipo",
    database: "Base de Datos",
    read: "Leer",
    write: "Escribir",
    manage: "Gestionar",
    permissionHierarchy: "Jerarquía de Permisos:",
    viewDatabaseContent: "Ver contenido de la base de datos",
    addEditDocuments: "Agregar y editar documentos (requiere Lectura)",
    removeDocuments: "Eliminar documentos (requiere Lectura)",
    fullDatabaseControl: "Control total de la base de datos",
    saveAllChanges: "Guardar Todos los Cambios",
    user: "Usuario",
    viewer: "Visualizador",
    removeFromTeam: "Eliminar del equipo",
    addToTeam: "Agregar al equipo",
  },

  fr: {
    // Header
    teams: "Équipes",
    yourPlan: "Votre Plan",

    // Navigation
    currentPlan: "Plan Actuel",
    availablePackages: "Packages Disponibles",
    viewBills: "Voir les Factures",

    // User menu
    myAccount: "Mon Compte",
    profile: "Profil",
    security: "Sécurité",
    termsOfUse: "Conditions d'Utilisation",
    logOut: "Se déconnecter",

    // Database management
    databases: "Bases de Données",
    newDatabase: "Nouvelle Base de Données",
    databaseName: "Nom de la base de données",
    addDocument: "Ajouter Document",
    processDocuments: "Traiter Documents",
    processing: "En cours",
    renameDatabase: "Renommer Base de Données",
    deleteDatabase: "Supprimer Base de Données",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer ceci?",
    dragDropFiles: "Ou glissez-déposez les fichiers ici",
    documents: "documents",
    pages: "pages",

    // Document viewer
    documentViewer: "Visionneuse de Documents",
    searchInDocument: "Rechercher dans le document...",
    selectDocument: "Sélectionnez un document pour voir son contenu",
    page: "Page",
    of: "de",

    // Chat
    chatWithTia: "Chat avec Tia",
    askQuestion: "Demandez à Tia...",
    searchChat: "Rechercher dans le chat...",
    savedChats: "Chats Sauvegardés",
    saveCurrent: "Sauvegarder Actuel",
    settings: "Paramètres",

    // Settings
    changeLanguage: "Changer la Langue",
    adjustFontSize: "Ajuster la Taille de Police",
    customizeAppearance: "Personnaliser l'Apparence",
    privacySettings: "Paramètres de Confidentialité",
    language: "Langue",
    fontSize: "Taille de Police",
    appearance: "Apparence",
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    auto: "Automatique",
    shareUsage: "Partager les données d'utilisation",
    saveHistory: "Sauvegarder historique de chat",
    allowAnalytics: "Autoriser l'analyse",

    // General
    save: "Sauvegarder",
    cancel: "Annuler",
    close: "Fermer",
    delete: "Supprimer",
    edit: "Modifier",
    upload: "Télécharger",
    send: "Envoyer",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",

    // Footer
    footerText: "Tia est une création de Softia.ca",
    rightsReserved: "Tous droits réservés",
    tiaIsCreation: "Tia est une création de",
    softiaLink: "Softia.ca",

    // File upload
    uploadFiles: "Télécharger Fichiers",
    dragDropHere: "Ou glissez-déposez ici",
    myDocuments: "Mes Documents",

    // Chat messages
    timestamp: "Horodatage",
    references: "Références",
    chatSessionName: "Session de Chat",

    // Teams management
    teamManagement: "Gestion des Équipes",
    teamsTab: "Équipes",
    teamMembers: "Membres de l'Équipe",
    databasePermissions: "Permissions de Base de Données",
    createNewTeam: "Créer Nouvelle Équipe",
    teamName: "Nom de l'Équipe",
    teamDescription: "Description",
    createTeam: "Créer Équipe",
    searchTeams: "Rechercher équipes...",
    members: "membres",
    created: "Créé",
    manageTeam: "Gérer l'Équipe",
    teamMembersManagement: "Gestion des Membres de l'Équipe",
    addNewMember: "Ajouter Nouveau Membre",
    addNewTeamMember: "Ajouter Nouveau Membre d'Équipe",
    firstName: "Prénom",
    lastName: "Nom de Famille",
    emailAddress: "Adresse Email",
    role: "Rôle",
    member: "Membre",
    teamAdministrator: "Administrateur d'Équipe",
    addMember: "Ajouter Membre",
    editTeamMember: "Modifier Membre d'Équipe",
    saveChanges: "Sauvegarder Changements",
    lastActive: "Dernière Activité",
    adminStatus: "Statut Administrateur",
    admin: "Administrateur",
    actions: "Actions",
    removeMember: "Supprimer Membre",
    teamDatabaseAccessPermissions:
      "Permissions d'Accès aux Bases de Données d'Équipe",
    configurePermissions:
      "Configurer les permissions d'accès aux bases de données pour chaque équipe",
    database: "Base de Données",
    read: "Lire",
    write: "Écrire",
    manage: "Gérer",
    permissionHierarchy: "Hiérarchie des Permissions:",
    viewDatabaseContent: "Voir le contenu de la base de données",
    addEditDocuments: "Ajouter et modifier des documents (nécessite Lecture)",
    removeDocuments: "Supprimer des documents (nécessite Lecture)",
    fullDatabaseControl: "Contrôle total de la base de données",
    saveAllChanges: "Sauvegarder Tous les Changements",
    user: "Utilisateur",
    viewer: "Visualiseur",
    removeFromTeam: "Retirer de l'équipe",
    addToTeam: "Ajouter à l'équipe",
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}
