import * as React from "react";
import { render } from "react-dom";
import firebase from "firebase";
import config from "./configs/firebase";

import App from "./App";

firebase.initializeApp(config);

const rootElement = document.getElementById("root");
render(<App />, rootElement);
