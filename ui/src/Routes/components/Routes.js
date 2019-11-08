import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

const Home = lazy(() => import("../../Home"));
const Capture = lazy(() => import("../../Capture"));
const Library = lazy(() => import("../../Library"));


const Routes = () => (
  <Suspense fallback={<div><h1>Loading...</h1></div>}>
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/capture" exact component={Capture}/>
      <Route path="/library" exact component={Library}/>
    </Switch>
  </Suspense>
);

export default Routes;