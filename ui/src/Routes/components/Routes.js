import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

const Search = lazy(() => import("../../Search"));


const Routes = () => (
  <Suspense fallback={<div className="route-loading"><h1>Loading...</h1></div>}>
    <Switch>
      <Route path="/" exact component={Search}/>
    </Switch>
  </Suspense>
);

export default Routes;