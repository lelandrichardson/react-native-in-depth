import { LOGIN, ROOT } from './routes';

import registerScreen from './registerScreen';

registerScreen(LOGIN, () => require('./screens/Login'));
registerScreen(ROOT, () => require('./screens/Login'));


// import Navigator from 'native-navigation';

// Navigator.registerScreen(LOGIN, () => require('./screens/Login'));
// Navigator.registerScreen(ROOT, () => require('./screens/Login'));
