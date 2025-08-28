import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  // Se estiver carregando, mostra uma tela de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se estiver autenticado, redireciona para a página principal
  if (user) {
    return <Navigate to="/chat" replace />;
  }

  // Se não estiver autenticado, renderiza o componente filho
  return <Outlet />;
};

export default PublicRoute;