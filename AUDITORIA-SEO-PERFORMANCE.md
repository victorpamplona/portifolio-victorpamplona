# VX Creative — Auditoria técnica (prévia)

Data: 2026-11-10  
Escopo: homepage e seis páginas de projetos.  
Ambiente: branch `feat/vx-editorial-hero-projects-2026` (não é produção).

## Método e limitações

Auditoria estática do código-fonte, metadados, HTML, CSS e JavaScript obtidos no GitHub. Consultas automáticas ao Google PageSpeed Insights não retornaram relatórios utilizáveis neste ambiente. **Nenhuma nota Lighthouse, Core Web Vitals, LCP, CLS ou INP foi medida**; não tratar o status READY do Vercel como aprovação em Lighthouse.

## Diagnósticos e correções implementadas

- **SEO:** sete páginas com canonical para `https://victorpamplona.vercel.app/` e seus caminhos individuais; organização e website em JSON-LD na home; `CreativeWork` nos cases; Open Graph básico; sitemap e robots.
- **Acessibilidade:** atalho de teclado “Pular para o conteúdo”, destino `main` identificado; botão mobile com `aria-controls`; menu oculto marcado `inert`, visibilidade sincronizada e foco inicial; acordeão do FAQ já mantém `aria-expanded` sincronizado.
- **Performance:** fontes passam a carregar a família `Space Grotesk` usada no CSS, com `font-display: swap` fornecido pelo Google Fonts; JavaScript com `defer`; imagens com `decoding="async"` e dimensões de reserva.
- **Identidade e UX:** monograma, efeitos CSS, carrossel nativo e comportamento reduced-motion preservados.

## Pendências importantes (precisam de execução de navegador/medição)

1. Executar PageSpeed Insights/Lighthouse nas URLs de produção e da prévia, em mobile e desktop, e registrar notas de Performance, Acessibilidade, Boas Práticas e SEO.
2. Conferir Core Web Vitals (LCP, INP e CLS), recursos bloqueadores, contraste, navegação por teclado e console.
3. Otimizar a foto de perfil `assets/images/profile/victor-pamplona-foto.png` (aproximadamente **1,6 MB** no repositório): preparar versão WebP/AVIF com qualidade visual adequada; substituir depois de inspeção visual e testes.
4. Validar a disponibilidade e o tamanho das fotografias externas da AS Beauty e da Dra. Siglena; considerar cópias locais autorizadas para reduzir dependência de terceiros.
5. Testar se as canônicas devem permanecer no domínio Vercel ou passar para domínio definitivo, caso a VX Creative adote um.
6. Verificar cabeçalhos de proteção contra indexação em previews e indexação efetiva após merge. A prévia não deve competir com o endereço oficial.
7. Revisar alterações tipográficas e imagens em larguras de 320px, 375px, 768px, 1024px e desktop antes de publicar.

## Critério de conclusão

Somente declarar métricas de PageSpeed e conformidade com WCAG após medições reais e auditoria manual. Não fazer merge automático em `main`.
