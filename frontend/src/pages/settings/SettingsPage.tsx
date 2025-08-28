import React, { useState, useEffect } from 'react';
import { FiSave, FiUser, FiLock, FiSettings, FiGlobe, FiShield, FiKey, FiMonitor } from 'react-icons/fi';
import MainLayout from '../../components/layout/MainLayout';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Tabs from '../../components/common/Tabs';
import Toggle from '../../components/common/Toggle';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useDarkMode } from '../../hooks/useDarkMode';

interface UserSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  apiKey: string;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const { theme, setTheme } = useDarkMode();
  
  const [settings, setSettings] = useState<UserSettings>({
    language: 'pt-BR',
    theme: theme,
    notifications: true,
    apiKey: '',
  });

  useEffect(() => {
    // Carregar configurações do usuário
    // Aqui seria feita uma chamada à API para buscar as configurações
    // Por enquanto, usamos valores padrão
    setSettings({
      language: localStorage.getItem('language') || 'pt-BR',
      theme: theme,
      notifications: localStorage.getItem('notifications') !== 'false',
      apiKey: localStorage.getItem('apiKey') || '',
    });
  }, [theme]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Aqui seria feita uma chamada à API para atualizar o perfil
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de chamada à API
      
      // Simulação de atualização do perfil
      // Em uma implementação real, aqui seria feita uma chamada à API
      
      showNotification('success', 'Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showNotification('error', 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', 'As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Aqui seria feita uma chamada à API para atualizar a senha
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de chamada à API
      
      showNotification('success', 'Senha atualizada com sucesso');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      showNotification('error', 'Erro ao atualizar senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Salvar no localStorage
      localStorage.setItem(key, value.toString());
      
      // Se a configuração for o tema, atualizar o hook useDarkMode
      if (key === 'theme' && setTheme) {
        setTheme(value);
      }
      
      return newSettings;
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Aqui seria feita uma chamada à API para salvar as configurações
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de chamada à API
      
      showNotification('success', 'Configurações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      showNotification('error', 'Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Background decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header com gradiente */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 animate-glow">
            <FiSettings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Personalize sua experiência e gerencie suas preferências
          </p>
        </div>
        
        <Tabs
          tabs={[
            {
              id: 'profile',
              label: 'Perfil',
              icon: <FiUser className="h-5 w-5" />,
              content: (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 mb-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Informações do Perfil</h3>
                      <p className="text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais</p>
                    </div>
                  </div>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <Input
                      label="Email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="Seu email"
                      type="email"
                      disabled
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      O email não pode ser alterado
                    </p>
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        leftIcon={<FiSave className="h-5 w-5" />}
                        isLoading={isLoading}
                      >
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                </div>
              ),
            },
            {
              id: 'password',
              label: 'Senha',
              icon: <FiLock className="h-5 w-5" />,
              content: (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 mb-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                      <FiShield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Segurança da Conta</h3>
                      <p className="text-gray-600 dark:text-gray-400">Altere sua senha para manter sua conta segura</p>
                    </div>
                  </div>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <Input
                      label="Senha Atual"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Digite sua senha atual"
                      type="password"
                      required
                    />
                    <Input
                      label="Nova Senha"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Digite sua nova senha"
                      type="password"
                      required
                    />
                    <Input
                      label="Confirmar Nova Senha"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirme sua nova senha"
                      type="password"
                      required
                    />
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        leftIcon={<FiSave className="h-5 w-5" />}
                        isLoading={isLoading}
                      >
                        Atualizar Senha
                      </Button>
                    </div>
                  </form>
                </div>
              ),
            },
            {
              id: 'preferences',
              label: 'Preferências',
              icon: <FiSettings className="h-5 w-5" />,
              content: (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 mb-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                      <FiMonitor className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Preferências do Sistema</h3>
                      <p className="text-gray-600 dark:text-gray-400">Configure a aparência e comportamento da aplicação</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Aparência</h3>
                      <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Tema
                            </label>
                            <div className="flex space-x-4">
                              {['light', 'dark', 'system'].map((theme) => (
                                <div key={theme} className="flex items-center">
                                  <input
                                    type="radio"
                                    id={`theme-${theme}`}
                                    name="theme"
                                    value={theme}
                                    checked={settings.theme === theme}
                                    onChange={() => handleSettingsChange('theme', theme)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                                  />
                                  <label
                                    htmlFor={`theme-${theme}`}
                                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300 capitalize"
                                  >
                                    {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {settings.theme === 'system' ? 'Usando preferência do sistema' : 
                               settings.theme === 'light' ? 'Usando tema claro' : 'Usando tema escuro'}
                            </p>
                          </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Idioma</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Idioma da Interface
                          </label>
                          <select
                            value={settings.language}
                            onChange={(e) => handleSettingsChange('language', e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es">Español</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notificações</h3>
                      <div className="space-y-4">
                        <Toggle
                          label="Ativar notificações"
                          description="Receba notificações sobre atualizações e novos recursos"
                          enabled={settings.notifications}
                          onChange={(enabled) => handleSettingsChange('notifications', enabled)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">API</h3>
                      <div className="space-y-4">
                        <Input
                          label="Chave da API"
                          value={settings.apiKey}
                          onChange={(e) => handleSettingsChange('apiKey', e.target.value)}
                          placeholder="Insira sua chave da API"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        variant="primary"
                        leftIcon={<FiSave className="h-5 w-5" />}
                        onClick={handleSaveSettings}
                        isLoading={isLoading}
                      >
                        Salvar Configurações
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'api',
              label: 'API',
              icon: <FiGlobe className="h-5 w-5" />,
              content: (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 mb-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                      <FiKey className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Configurações da API</h3>
                      <p className="text-gray-600 dark:text-gray-400">Gerencie suas chaves e acesso à API do Joyce.AI</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      Aqui você pode encontrar informações sobre como usar a API do Joyce.AI em suas aplicações.
                    </p>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Endpoint Base</h4>
                      <code className="block p-2 bg-gray-200 dark:bg-gray-800 rounded text-sm overflow-x-auto">
                        https://api.joyce.ai/v1
                      </code>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Exemplo de Requisição</h4>
                      <code className="block p-2 bg-gray-200 dark:bg-gray-800 rounded text-sm overflow-x-auto whitespace-pre">
                        {`fetch('https://api.joyce.ai/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Olá, como posso ajudar?',
    conversationId: 'optional-conversation-id'
  })
})`}
                      </code>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Documentação</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Para mais informações, consulte nossa documentação completa da API.
                      </p>
                      <Button
                        variant="secondary"
                        onClick={() => window.open('https://docs.joyce.ai', '_blank')}
                      >
                        Ver Documentação
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </MainLayout>
  );
};

export default SettingsPage;