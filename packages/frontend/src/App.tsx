import { Provider } from "react-redux";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import "./styles/globals.css";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <LoginPage />
    </Provider>
  );
}

export default App;
