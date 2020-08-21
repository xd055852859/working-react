import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./reducer/index";
import rootSaga from "./saga/rootSaga";

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== "production") {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, bindMiddleware([sagaMiddleware]));
sagaMiddleware.run(rootSaga);

export default store;
