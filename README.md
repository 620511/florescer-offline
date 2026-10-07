# Florescer — versão offline (para instalar no celular)

Esta versão **não usa login nem internet no dia a dia**. Os dados ficam salvos
direto no celular (no navegador), e o app funciona como um aplicativo instalado,
mesmo sem conexão.

⚠️ Importante: o celular precisa de internet **só uma vez**, na primeira vez que
abrir o link, para baixar o app. Depois de instalado, funciona 100% offline.
Se depois quiser trocar de celular, os dados não vão junto sozinhos — dá pra
adicionar sincronização por nuvem depois, se precisar.

## Passo 1 — Colocar o app no ar (você faz isso, uma vez)

O jeito mais simples é o Vercel (gratuito):

1. Suba esta pasta para um repositório no GitHub.
2. Em https://vercel.com, clique em **New Project** → importe o repositório → **Deploy**.
   (Não precisa configurar nenhuma variável de ambiente, essa versão não usa Supabase.)
3. Você vai receber um link tipo `https://florescer-xxxx.vercel.app`.

## Passo 2 — Instalar no celular da sua esposa (Android)

1. Abra esse link no **Google Chrome** do celular dela (precisa de internet só
   nessa hora).
2. Vai aparecer um aviso "Adicionar Florescer à tela inicial" — toque em
   **Instalar** (ou toque nos 3 pontinhos do Chrome → **Instalar aplicativo**,
   se o aviso não aparecer sozinho).
3. Pronto — vai aparecer um ícone do Florescer na tela inicial, como um app
   normal. Pode abrir o modo avião: os dados salvos e o uso diário funcionam
   sem internet.

## O que fica salvo

- Medicamentos, horários, dias da semana
- Registro de "tomado" por dia
- Consultas médicas

Tudo isso fica guardado no navegador do celular. Não é enviado para nenhum
servidor — é só local, naquele aparelho.
