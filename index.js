// set up some global environment variables
import './app/initialization/env';

// set up proper unhandled promise rejection handling
import './app/initialization/promises';

// configure which warnings we can safely ignore
import './app/initialization/warnings';

// configure which errors we can safely ignore
import './app/initialization/errors';

// we need to turn on LayoutAnimation for android
import './app/initialization/layoutAnimation';

// initialize the user service, which has some data persistence, etc.
import './app/initialization/user';

// in debug mode, expose some dev tools on the global
import './app/devtools';

// the main app, including all screen registrations
import './app';


import { UIManager, NativeModules } from 'react-native';

global.UIManager = UIManager;
global.NativeModules = NativeModules;
