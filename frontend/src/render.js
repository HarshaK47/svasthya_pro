import React from "react";
import App from './App.js';

import { Route, Switch } from "react-router-dom";

const Render = () => {
  return (<>
      <Switch>
      <Route exact path='/store' component={App} />
      </Switch>
 </>
  );
};

export default Render;
