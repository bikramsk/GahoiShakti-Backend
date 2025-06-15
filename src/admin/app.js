const config = {
  locales: [
    // Keep your locales if needed
  ],
  
  // Add these new configurations:
  head: {
    title: 'Gahoi Admin', // Changes browser tab title
  },
  translations: {
    en: {
      'app.components.LeftMenu.navbrand.title': 'GAHOI',
      'app.components.LeftMenu.navbrand.workplace': 'Admin Panel',
      'Auth.form.welcome.title': 'Welcome to Gahoi',
      'Auth.form.welcome.subtitle': 'Log in to Gahoi Admin',
    },
  },
  theme: {
    colors: {
      primary500: '#3366ff', // Gahoi brand color
    },
  },
};

const bootstrap = (app) => {
  // Force-set title on startup
  document.title = 'Gahoi Admin';
  
  // Double-set to prevent flash of default title
  setTimeout(() => {
    document.title = 'Gahoi Admin';
  }, 1000);
};

export default {
  config,
  bootstrap,
};