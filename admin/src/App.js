import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { roomInputs, userInputs,hotelInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { hotelColumns, roomColumns, userColumns } from "./datatablesource";
import { DarkModeContext } from "./context/darkModeContext";
import {AuthContext} from "./context/AuthContext";
import NewHotel from "./pages/newHotel/NewHotel";
import NewRoom from "./pages/newRoom/NewRoom";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) =>{
    const {user} = useContext(AuthContext);

    if(!user){
      return <Navigate to="/login"/>;
    }
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index  element={<Login />} />
            <Route  path="home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            <Route path="users">
              <Route index element={
              <ProtectedRoute>
                <List columns={userColumns}/>
              </ProtectedRoute>} />

             

              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <New inputs={userInputs}  />
                  </ProtectedRoute>} />
            </Route>

            <Route path="hotels">
              <Route index element={
                <ProtectedRoute>
                  <List columns={hotelColumns}/>
                </ProtectedRoute>
              } />

              
              
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewHotel hotelInputs={hotelInputs} />
                  </ProtectedRoute>
              }
              />
            </Route>
            <Route path="rooms">
              <Route index element={
                <ProtectedRoute>
                  <List columns={roomColumns}/>
                </ProtectedRoute>
              } />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewRoom roomInputs={roomInputs} />
                  </ProtectedRoute>
              }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
