import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ChatPage from './pages/chat/ChatPage';
import PromptsPage from './pages/prompts/PromptsPage';
import ConversationsPage from './pages/conversations/ConversationsPage';
import SettingsPage from './pages/settings/SettingsPage';
import './App.css'



function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<ConversationsPage />} />
        <Route path="/chat/new" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/prompts" element={<PromptsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      
      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
