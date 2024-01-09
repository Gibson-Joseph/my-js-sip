import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";
import { ModelProvider } from "./provider/ModelProvider/ModelProvider";
import { SipPhoneProvider } from "./provider/SipPhoneProvider/SipPhoneProvider";
import { SipClientProvider } from "./provider/SipClientProvider/SipClientProvider";
import { SipSessionProvider } from "./provider/SipSessionProvider/SipSessionProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <SipClientProvider>
      <ModelProvider>
        <SipSessionProvider>
          <SipPhoneProvider>
            <App />
          </SipPhoneProvider>
        </SipSessionProvider>
      </ModelProvider>
    </SipClientProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
