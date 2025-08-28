import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useDarkMode = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica se há uma preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Se não houver preferência salva, usa 'system' como padrão
    if (!savedTheme) {
      return 'system';
    }
    
    return savedTheme;
  });
  
  // Estado para rastrear a preferência do sistema
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    // Determina o tema efetivo com base na configuração
    const effectiveTheme = theme === 'system' ? systemPreference : theme;
    
    // Atualiza a classe no elemento HTML
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Salva a preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme, systemPreference]);

  // Listener para mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Retorna o tema efetivo (o que está sendo aplicado) e o tema configurado
  const effectiveTheme = theme === 'system' ? systemPreference : theme;
  
  return { 
    theme, // Tema configurado (light, dark ou system)
    effectiveTheme, // Tema efetivo aplicado (light ou dark)
    toggleTheme, 
    setTheme // Expõe a função para definir o tema diretamente
  };
};