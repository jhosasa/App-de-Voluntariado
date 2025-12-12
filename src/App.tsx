import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import EventDetailsPage from "./pages/EventDetailsPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ONGDashboardPage from "./pages/ONGDashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterONGPage from "./pages/RegisterONGPage";
import CreateEventPage from "./pages/CreateEventPage";

// --- IMPORTACIONES NUEVAS QUE FALTABAN ---
import EventsListPage from "./pages/EventsListPage"; // Importamos la lista de eventos
import ProfilePage from "./pages/ProfilePage"; // Importamos tu página de perfil real

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-background text-text min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* --- AQUÍ AGREGAMOS LA RUTA QUE FALTABA --- */}
              <Route path="/events" element={<EventsListPage />} />

              <Route path="/event/:id" element={<EventDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route
                path="/register-ong"
                element={
                  <ProtectedRoute>
                    <RegisterONGPage />
                  </ProtectedRoute>
                }
              />
              {/* Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ong-dashboard"
                element={
                  <ProtectedRoute requiredRole="organization">
                    {" "}
                    {/* <--- CAMBIO CLAVE AQUÍ */}
                    <ONGDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create-event"
                element={
                  <ProtectedRoute requiredRole="organization">
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />

              {/* --- AQUÍ CONECTAMOS TU COMPONENTE REAL DE PERFIL --- */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    {/* Ya no usamos el div placeholder, usamos tu componente */}
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "",
              style: {
                background: "#262626",
                color: "#FFFFFF",
                border: "1px solid #2F2F2F",
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
