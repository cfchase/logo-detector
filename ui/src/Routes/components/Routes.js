import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

const Home = lazy(() => import("../../Home"));
const Video = lazy(() => import("../../Video"));
const Search = lazy(() => import("../../Search"));


const Routes = () => (
  <Suspense fallback={<div className="route-loading"><h1>Loading...</h1></div>}>
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/video" exact component={Video}/>
      <Route path="/search" exact component={Search}/>
    </Switch>
  </Suspense>
);

export default Routes;