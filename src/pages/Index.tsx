import { useState, useEffect } from "react";
import { AuthPage } from "./AuthPage";
import { Dashboard } from "./Dashboard";

const Index = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('patripoly_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Cargando Patripoly...</h2>
        </div>
      </div>
    );
  }

  // Show appropriate page based on authentication status
  return user ? <Dashboard /> : <AuthPage />;
};

export default Index;
