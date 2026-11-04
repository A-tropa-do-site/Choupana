# Direção visual — Choupana

A sequência de liderança até localização usa fundo carvão quente (`--surface-charcoal-warm`) para reduzir a luminosidade e valorizar os painéis. A fumaça clara permanece discreta sobre esse fundo, com fotografia lateral transparente. Uma linha dourada horizontal separa os cardápios da liderança; a fumaça fica recortada entre essa divisória e o fim do mapa.

Preservar a composição editorial existente: títulos serifados, fotografias grandes, painéis alternados de família, aniversário e localização, linhas douradas e fumaça discreta até o mapa.

## Autoridade dos estilos

- `assets/css/style.css`: tokens de identidade, tipografia auxiliar, espaçamentos, movimento e controles comuns.
- `assets/css/visit-journey.css`: fonte única dos layouts, cores e versões responsivas da sequência família/aniversário/localização. A antiga `journey-palette.css` deixou de ser carregada.
- Demais folhas: regras específicas de marcas, cardápios, liderança, conexões entre seções e cascata.

Preferir os tokens existentes a novas cores literais. Evitar `!important` e corrigir o componente de origem quando houver conflito. Os estilos antigos fora deste recorte ainda podem ser consolidados progressivamente.

## Identidade e leitura

- Vinho: `--color-wine`; madeira: `--color-wood`; destaque: `--color-gold-border`.
- Fundos: `--surface-ivory`, `--surface-paper`, `--surface-stone`, `--surface-stone-deep`, `--surface-wood`, `--surface-menu`.
- Texto auxiliar: `--type-label` e `--type-note` (13 px na base de 16 px); texto pequeno: `--type-small` (14 px). Não usar esses tokens para espaçamentos.
- Títulos mantêm a escala fluida de cada componente. Um H1 identifica semanticamente o restaurante; o logotipo continua com sua composição visual.

## Movimento e interação

- O controle “Pausar animações” pausa a abertura, marcas e fumaça e revela imediatamente itens de cascata pendentes.
- `prefers-reduced-motion` prevalece sobre a retomada manual. A abertura e a fumaça permanecem estáticas; os conteúdos continuam disponíveis.
- A cascata ocorre uma vez, em intervalos de 80 ms, com duração `--motion-enter` e curva `--motion-ease`.
- Fumaça decorativa: WebP sem perdas, com alfa; apenas camadas próximas da janela recebem promoção de composição. Fora da área visível ou com aba oculta, o movimento pausa.
- Menu lateral: navegação dentro de diálogo, fundo inerte quando aberto, ciclo de foco, fechamento por Escape, retorno de foco e estado de expansão no acionador.
- Links de seção transferem o foco ao destino; há atalho para o conteúdo principal.

## Conteúdo

Imagens ilustrativas não devem ser atribuídas a pessoas reais. Fotografias e relatos próprios da equipe podem substituir o material ilustrativo quando fornecidos. Manter os estados honestos dos PDFs enquanto os arquivos não estiverem disponíveis.

As correções de 27/10/2026 preservaram todos os destinos externos. Testes locais estão em `.local-review/` e não são publicados como parte do site.

## Seção de 1978

Texto central preservado, sem os quatro cartões fotográficos. Fundo `--surface-heritage` em bege quase branco com ilustração rupestre gastronômica original (`assets/images/heritage/cave-feast.webp`) nas laterais. A arte é decorativa, com centro livre e opacidade reduzida em telas estreitas.

A decoração de 1978 usa seis imagens independentes com transparência em `assets/images/heritage/icons/`: forno de pizza, churrasqueira, pizza, costela, tomahawk e espetos. Não usar recortes de uma imagem composta. Cada desenho é exibido inteiro com `object-fit: contain`, margem da borda e entrada individual de 600 ms, alternando esquerda/direita com intervalo mínimo de 220 ms. A sequência avança conforme a rolagem e ocorre uma vez. Pausa, movimento reduzido, impressão e ausência de JS mantêm a arte disponível. Em telas pequenas, a opacidade é reduzida para preservar a leitura.

A composição usa 12 posições (seis por coluna) com os seis desenhos alternados e repetidos, menores e próximos do texto central. As colunas mantêm 24 px de distância da largura central no desktop; os ícones permanecem independentes e com entrada individual.

A composição atual tem 18 posições com nove variações de desenhos (incluindo fatia de pizza, pá com pizza e pinça de BBQ). As laterais formam grupos soltos, com altura, deslocamento, tamanho e rotação definidos individualmente. Evitar colunas rígidas ou elementos alinhados em pares. Preservar a área central de leitura e as margens externas.

A versão mais preenchida usa 32 posições e 12 desenhos diferentes. Pão de alho, cortador de pizza e linguiças completam a coleção. As peças formam agrupamentos irregulares mais próximos, preservando a leitura central e as margens externas.

## Acabamento dos cardápios

Manter dois cartões verticais por idioma, títulos serifados, fundo escuro com microtextura discreta e cartões em marrom quente. Moldura dupla fina e pequeno detalhe dourado no topo dão acabamento sem movimento extra. As categorias têm espaçamento consistente e destaque em tom de palha. PDFs indisponíveis mantêm estado desabilitado em bronze suave; o WhatsApp continua como alternativa existente.

## Modelo de celular

Em larguras até 760 CSS px, `assets/css/mobile.css` mantém somente Hero, história de 1978, Carnes & bebidas, Cardápio, aniversário, localização/mapa e footer. Liderança, galeria familiar e chamada final ficam disponíveis no modelo de computador, sem exclusão de conteúdo. A composição muda por largura de tela; não usa detecção de aparelho nem páginas duplicadas.

`assets/js/mobile.js` começa em português e oferece um botão acima do cartão com a bandeira americana para inglês. Ao mostrar inglês, oferece a bandeira brasileira para voltar ao português. O cartão fora de uso fica oculto inclusive para teclado e leitores de tela. No computador, ambos voltam a aparecer lado a lado. Sem JavaScript, os dois ficam disponíveis como alternativa.

No celular, navegação e footer não oferecem links para seções ocultas; o menu inclui aniversário. Formulário e mapa usam largura disponível sem sobreposição. A fumaça começa no aniversário e termina no mapa. Cabeçalho e barra inferior têm espaço de rolagem para evitar encobrir controles focados. Alterações desta versão são locais, sem publicação e sem mudar os destinos externos.

O botão global de pausar animações foi removido das duas versões a pedido do usuário. O estado de movimento continua seguindo `prefers-reduced-motion`, com pausa da abertura quando a aba está oculta ou fora da tela.

## Mosaico de hospitalidade

24 fotografias diferentes formam uma malha de cacos triangulares irregulares, com frestas discretas e sem repetição de fotos. O balão branco foi ampliado para até 680 px, com mais espaço interno e frase em destaque. Material ilustrativo; manter a seção exclusiva do modelo de computador.

O fundo dos cardápios agora usa textura original de madeira escura (`assets/images/menu/dark-walnut.webp`), suavizada e misturada à base carvão. Os cartões opacos usam `--menu-card-surface` em marrom quente mais claro; desfoque e transparência ficam restritos à camada de fundo.

O fundo dos cardápios foi atualizado para madeira carbonizada em preto e cinza (`charred-wood.webp`), com veios discretos. Cartões em grafite opaco (#252728), base neutra #111213, mantendo textos creme e detalhes dourados.

## Fotografias do restaurante

Fotografias genéricas substituídas por imagens do Instagram oficial e pela fotografia de espeto enviada pelo usuário. A seleção otimizada está em `assets/images/restaurant/`, com origem e dimensões em `sources.json`. Abertura: três composições de carnes, reconstruídas em formato horizontal com IA a partir de publicações reais de 2020 (picanha, churrasco e costela). Essas versões são edições, não arquivos originais de câmera; a resolução entregue pelo gerador é 1672 × 941. O espeto enviado pelo usuário permanece somente no fundo lateral da jornada.

Mosaico: 24 imagens distintas, sem reutilizar as quatro fotos da galeria. As versões em `restaurant/edited/` removem marcas e textos promocionais com edição assistida por IA, mantendo os originais. Quatro pizzas têm recortes adicionais para concentrar o foco nos pratos. Cada caco recebe um deslocamento de foco conforme sua geometria. A galeria mostra salão, churrasco, pizza e sobremesa em cartões quadrados, com imagem inteira e sem ampliação ao selecionar. Aniversário: publicação específica de comemorações, em moldura quadrada sem faixas, inclusive no celular. Fechamento: fachada real da publicação de 12/07/2020 (horário de São Paulo), recortada para retirar o anúncio de reabertura. O vídeo de 13/10/2020 foi localizado e guardado no acervo local de revisão. Origem e tratamentos das novas versões estão em `restaurant/edited/sources.json`.

A galeria passou de batidas para sobremesas porque o lote não contém uma foto limpa de batidas. A menção às batidas na história e nos cardápios permanece. O retrato genérico da assinatura foi retirado em favor de um monograma. As fotografias antigas não devem ser atribuídas à aparência atual de reformas ou à equipe atual. Ilustrações, logotipos, textura de madeira e fumaça foram preservados.

A abertura agora começa com a mesma fachada da chamada final, por solicitação do usuário, seguida das três imagens de carnes. O intervalo entre imagens é de 3,5 segundos. Os cartões de pizza e sobremesa preenchem a área quadrada com foco individual, sem faixas laterais. As demais fotografias continuam sem repetição entre seções.

## Desempenho no Firefox de computador

A textura de fumaça recebe cor e transparência uma vez em canvas, compartilhando uma imagem preparada, sem filtros e máscaras ativos na rolagem. No Firefox com largura inicial acima de 760 px, a fumaça é pré-composta com o fundo em uma imagem estática; a foto lateral recebe seu acabamento antecipadamente e o mosaico mantém os 24 recortes em um canvas, redesenhado apenas ao mudar de tamanho. O parallax da chamada final fica desativado nesse navegador. Edge e os demais navegadores mantêm a fumaça animada, com até duas camadas simultâneas. Em falha do preparo, o conteúdo permanece acessível. Testar no Firefox real, além do Edge; limitar camadas não foi suficiente para corrigir o custo das máscaras e filtros no Firefox.
