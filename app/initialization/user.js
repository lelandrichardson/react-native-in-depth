import store from '../store';
import UserService from '../services/UserService';

UserService.initialize(store, state => state.user);
