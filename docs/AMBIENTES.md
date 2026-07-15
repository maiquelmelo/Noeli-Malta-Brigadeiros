# Ambientes do projeto

O projeto utiliza três branches permanentes:

| Ambiente | Branch | Endereço previsto |
|---|---|---|
| Produção | `main` | `/Noeli-Malta-Brigadeiros/` |
| Homologação | `homologacao` | `/Noeli-Malta-Brigadeiros/homologacao/` |
| Desenvolvimento | `desenvolvimento` | `/Noeli-Malta-Brigadeiros/desenvolvimento/` |

## Fluxo recomendado

1. Novas funções são criadas e testadas em `desenvolvimento`.
2. Quando o pacote estiver estável, as alterações seguem para `homologacao`.
3. Após o teste final no celular e no tablet, é aberto um Pull Request para `main`.
4. A branch `main` deve conter somente versões aprovadas para uso diário.

## Publicação no GitHub Pages

O workflow `pages-environments.yml` monta os três ambientes em uma única publicação do GitHub Pages. No repositório, acesse **Settings → Pages** e selecione **GitHub Actions** como fonte de publicação.

## Atualização do aplicativo instalado

Como o sistema funciona offline, uma versão antiga pode permanecer em cache. Depois de uma publicação:

1. Feche e abra o aplicativo novamente.
2. Aguarde alguns segundos com internet.
3. Se a versão não atualizar, remova o aplicativo instalado e limpe os dados do site no Chrome.
4. Instale novamente pela página do ambiente desejado.

## Promoção entre ambientes

- `desenvolvimento` → `homologacao`: teste funcional.
- `homologacao` → `main`: liberação para produção.

Nunca faça testes diretamente na `main`.