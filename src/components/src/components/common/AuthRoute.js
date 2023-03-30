import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
// import { logout } from '../../modules/Auth/actions/auth.action';

export default function AuthRoute({ component: Component, ...rest }) {

  const dispatch = useDispatch();
  const { isAuthenticated, sessionUser } = useSelector(state => state.Auth);
  let role = sessionUser && sessionUser?.user?.role; // or manager
  // let role = 'admin'; // or manager


  if (isAuthenticated && role) {
    if (role === 'Admin')
      return <Redirect to='/admin-dashboard' />
    else if (role === 'manager')
      return <Redirect to='/manager/my-team' />
    else if (role === 'KPO')
      return <Redirect to='/kpo/overview' />
    else {
      // dispatch(logout());
    }
  }

  return <Route {...rest} render={props => <Component {...props} />} />;
}


