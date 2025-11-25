# Script de Reset de Senha

Este script permite redefinir a senha de um usuário no banco de dados.

## Uso

```bash
cd src/backend
go run scripts/reset_password.go <email> <nova_senha>
```

## Exemplo

```bash
go run scripts/reset_password.go rusbe@gmail.com minhaNovaSenha123
```

## O que o script faz

1. Conecta ao banco de dados MongoDB
2. Busca o usuário pelo email (case-insensitive)
3. Hasheia a nova senha usando bcrypt
4. Atualiza a senha no banco de dados
5. Exibe uma mensagem de sucesso

## Nota

Este script é útil quando:
- A senha foi salva incorretamente no banco
- O hash da senha está corrompido
- Você precisa resetar a senha de um usuário

Após executar o script, o usuário poderá fazer login com a nova senha.

