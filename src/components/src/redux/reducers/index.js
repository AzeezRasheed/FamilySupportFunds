import { combineReducers } from 'redux';
import authActionTypes from '../../modules/Auth/actions/auth.type';
import Auth from '../../modules/Auth/reducers/auth.reducer';
import Alert from './common/alert.reducer'



const appReducer = combineReducers({
  Auth,
  Alert,
});

const rootReducer = (state, action) => {
  if (action.type === authActionTypes.LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;
