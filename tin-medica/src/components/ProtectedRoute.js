const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log('ProtectedRoute user:', user);

  if (!user) {
    console.log('User not logged in. Redirecting to /login.');
    return <Navigate to="/login" />;
  }

  return children;
};
