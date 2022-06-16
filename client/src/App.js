import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";

function App() {
  const { token, authCheck } = useAuth();

  return (
    <div className="App">
      {authCheck && (
        <>
          {!token && <Login />}
          {token && (
            <Router>
              <Navbar />

              <Switch>
                <Route path="/playlists/:id">
                  <h1>single playlist details page</h1>
                </Route>

                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Router>
          )}
        </>
      )}
    </div>
  );
}

export default App;
