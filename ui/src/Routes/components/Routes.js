import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

const Home = lazy(() => import("../../Home"));
const Capture = lazy(() => import("../../Capture"));
const Library = lazy(() => import("../../Library"));
const Search = lazy(() => import("../../Search"));


const Routes = () => (
  <Suspense fallback={<div className="route-loading"><h1>Loading...</h1></div>}>
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/capture" exact component={Capture}/>
      <Route path="/library" exact component={Library}/>
      <Route path="/search" exact component={Search}/>
    </Switch>
  </Suspense>
);

export default Routes;