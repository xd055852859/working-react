import React from 'react';
import Loadable from 'react-loadable';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Test from './views/groupTable/test'

export default function Pages() {
  const App = Loadable({
    loader: () => import('./App'),
    loading: () => null,
  });
  const Home = Loadable({
    loader: () => import('./views/home/home'),
    loading: () => null,
  });

  const Content = Loadable({
    loader: () => import('./views/content/content'),
    loading: () => null,
  });
  const Bootpage = Loadable({
    loader: () => import('./views/bootpage/bootpage'),
    loading: () => null,
  });
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          component={App}
          render={() => <Redirect to="/login" push />}
        />
        <Route path="/home" component={Home} />
        <Route path="/content" component={Content} />
        <Route path="/bootpage" component={Bootpage} />
        <Route path="/test" component={Test} />

        {/* <Route path="/404" component={NotFound} />
        <Redirect to="/404" /> */}
      </Switch>
    </Router>
  );
}
