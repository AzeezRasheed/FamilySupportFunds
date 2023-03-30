import React, { Suspense, useState } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Loading } from "components";
const Screen1 = React.lazy(() => import("../pages/ReceiveStock"));
const Screen2 = React.lazy(() => import("./pages/Screen2"));
const Screen3 = React.lazy(() => import("./pages/Screen3"));


import "./style.scss";

const Steps = () => {
  let { path } = useRouteMatch();
  return (
    <Suspense fallback={<Loading />}>
      <div>
        <Switch>
          <Route path={`${path}/$warehouses}`} render={props => <Screen1 {...props} />} />
          <Route path={`${path}/receive-stock}`} render={props => <Screen2 {...props} />} />
          <Route path={`${path}/products`} render={props => <Screen3 {...props} />} />
        </Switch>
      </div>
    </Suspense>
  );
};

export default Steps;