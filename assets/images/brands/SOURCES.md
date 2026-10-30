# Logotipos da faixa — revisão local

Seleção ilustrativa: Swift, Coca-Cola, Friboi, Heineken, Maturatta e 1953 Friboi. A presença dessas marcas no restaurante ainda não foi confirmada. Não representa parceria comercial. Os logotipos pertencem aos respectivos titulares.

Fontes consultadas em 26/10/2026:

| Arquivo | Página de origem | Arquivo de origem |
| --- | --- | --- |
| swift.svg | https://www.swift.com.br/ | https://www.swift.com.br/icons/logo-primary.svg |
| coca-cola.svg | https://www.coca-cola.com/br/pt/brands/coca-cola | https://www.coca-cola.com/content/dam/onexp/br/pt/offerings/christmas/Coca-Cola-original-logo-co.svg |
| friboi.png | https://www.friboi.com.br/ | https://painel-friboi-production.s3.us-east-1.amazonaws.com/friboi_30df9d94b2.png |
| heineken.svg | https://www.heineken.com/ | https://www.heineken.com/media/zmnkoinc/heineken-logo.svg |
| maturatta.png | https://www.friboi.com.br/marcas/maturatta-friboi/ | https://painel-friboi-production.s3.us-east-1.amazonaws.com/logo3_91c147446f.png |
| friboi-1953.png | https://www.friboi.com.br/ | https://painel-friboi-production.s3.us-east-1.amazonaws.com/1953_final2_78cd08074b.png |

A pesquisa no Google Imagens foi tentada, mas encontrou CAPTCHA; o filtro Cores → Transparente não pôde ser aplicado. Os arquivos foram localizados nas páginas oficiais e a transparência foi verificada no navegador pelo canal alfa. Os primeiros PNGs do site institucional JBS tinham fundo branco e foram substituídos.

As margens transparentes são compensadas por CSS, mantendo as proporções. O SVG da Heineken recebeu preenchimento verde (#008200) no lugar do branco para leitura sobre fundo claro; a geometria vetorial foi preservada. O arquivo SVG da Coca-Cola contém um PNG transparente incorporado. A marca 1953 recebe ajuste de luminosidade por CSS para contraste.

## Manutenção

- Lista de marcas: seção `#excelencia` em `index.html` (editar somente a lista original; a cópia decorativa é criada automaticamente).
- Layout e velocidade: `assets/css/brands.css`, animação `brands-drift-right`, ciclo de 84 segundos.
- Pausa, cópia acessível e movimento reduzido: `assets/js/brands.js`.
- A faixa continua legível sem JavaScript. A cópia animada é ignorada por leitores de tela.
