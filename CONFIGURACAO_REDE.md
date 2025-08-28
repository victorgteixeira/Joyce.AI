# Configuração para Acesso na Rede Local

## Problema Resolvido
O sistema agora está configurado para aceitar conexões de outras máquinas na rede local.

## Mudanças Realizadas

### 1. Backend (API)
- **Arquivo**: `Back-end/src/server.js`
- **Mudança**: Servidor agora escuta em `0.0.0.0:3000` em vez de apenas `localhost:3000`
- **Resultado**: API acessível de qualquer máquina na rede

### 2. Frontend
- **Arquivo**: `frontend/.env`
- **Mudança**: `VITE_API_URL=http://192.168.82.163:3000`
- **Resultado**: Frontend aponta para o IP da rede em vez de localhost

## URLs de Acesso

### Para sua máquina (localhost):
- **Frontend**: http://localhost:5173/
- **Backend**: http://localhost:3000/

### Para outras máquinas na rede:
- **Frontend**: http://192.168.82.163:5173/
- **Backend**: http://192.168.82.163:3000/

## Como Outros Usuários Devem Acessar

1. **Acesso direto**: `http://192.168.82.163:5173/`
2. **Login**: Usar as credenciais que você criar para eles
3. **Registro**: Podem se registrar diretamente na aplicação

## Verificações de Firewall

Se ainda houver problemas de acesso:

1. **Windows Firewall**: Certifique-se que as portas 3000 e 5173 estão liberadas
2. **Antivírus**: Verifique se não está bloqueando as conexões
3. **Rede**: Confirme que todas as máquinas estão na mesma rede local

## Comandos para Testar Conectividade

```bash
# Testar se a API está acessível de outra máquina
curl http://192.168.82.163:3000/health

# Testar se o frontend está acessível
# Abrir no navegador: http://192.168.82.163:5173/
```

## Notas Importantes

- O IP `192.168.82.163` é o IP atual da sua máquina
- Se o IP mudar, será necessário atualizar o arquivo `frontend/.env`
- Para produção, considere usar um domínio fixo ou configuração dinâmica