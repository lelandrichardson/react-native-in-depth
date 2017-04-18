import { ROOT, ROOMS, SETTINGS, ADD_ROOM } from './routes';
import registerScreen from './registerScreen';

registerScreen(ROOT, () => require('./screens/Rooms'));

registerScreen(ROOMS, () => require('./screens/Rooms'));
registerScreen(SETTINGS, () => require('./screens/Settings'));
registerScreen(ADD_ROOM, () => require('./screens/AddRoom'));

// Exercise:
// If you're going to add a new screen, you will need to register it here!
