import * as React from "react";
import { render } from "react-dom";
import config from "./configs/firebase";
import firebase from "./utils/firebase";

import App from "./App";

firebase.initializeApp(config);

const rootElement = document.getElementById("root");
render(<App />, rootElement);
