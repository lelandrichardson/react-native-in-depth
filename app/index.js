import { ROOT, ROOM, ROOMS, SETTINGS, ADD_ROOM } from './routes';
import registerScreen from './registerScreen';

registerScreen(ROOT, () => require('./screens/Rooms'));

registerScreen(ROOM, () => require('./screens/Room'));
registerScreen(ROOMS, () => require('./screens/Rooms'));
registerScreen(SETTINGS, () => require('./screens/Settings'));
registerScreen(ADD_ROOM, () => require('./screens/AddRoom'));
