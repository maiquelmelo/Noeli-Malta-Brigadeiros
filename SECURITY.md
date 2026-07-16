# Política de Segurança

## Dados que não devem ser enviados ao repositório

Nunca publique neste repositório:

- senhas, PINs ou códigos de recuperação;
- tokens de acesso, chaves de API ou arquivos `.env`;
- backups reais do aplicativo;
- dados reais de clientes, pedidos, pagamentos ou contratos;
- documentos, fotos de documentos ou comprovantes;
- arquivos contendo CPF, telefone, endereço ou informações bancárias de clientes.

## Comunicação de vulnerabilidades

Caso seja identificada uma falha de segurança, não publique detalhes sensíveis em uma Issue pública. Entre em contato diretamente com o responsável pelo repositório para que a correção seja preparada antes da divulgação.

## Boas práticas do projeto

- alterações em produção devem passar pelas branches `desenvolvimento` e `homologacao`;
- a branch `main` deve receber alterações preferencialmente por Pull Request;
- os workflows devem utilizar apenas as permissões necessárias;
- dados operacionais devem permanecer no dispositivo do usuário e nunca no código-fonte;
- antes de publicar, revisar se o commit contém arquivos de backup ou dados pessoais.

## Escopo

Esta política cobre o código do aplicativo, os workflows do GitHub Actions e a publicação no GitHub Pages.
