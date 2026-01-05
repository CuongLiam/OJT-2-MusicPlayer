import { createRoot } from "react-dom/client";
import "./index.css";
// import 'antd/dist/reset.css';
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { PlayerProvider } from "./contexts/PlayerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </BrowserRouter>
  </Provider>
);
