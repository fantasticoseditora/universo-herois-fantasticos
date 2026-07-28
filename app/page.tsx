"use client";

import { useRef, useState } from "react";

const stories = [
  {
    number: "01",
    icon: "wing",
    image: "/images/stories/01-gaviao-real.webp",
    title: "Gavião Real",
    author: "Ana Júlia Cavalcante",
    tag: "Amazônia • Ação",
    synopsis:
      "Kauane é uma heroína amazonense, autista e alada. Quando recebe a missão de salvar um senador que representa tudo o que despreza, precisa decidir o que significa proteger um país que nem sempre a protege.",
  },
  {
    number: "02",
    icon: "ghost",
    image: "/images/stories/02-heroi-nao-existe.webp",
    title: "O Herói que Não Existe",
    author: "Athos Strife",
    tag: "Fantasia urbana • Horror",
    synopsis:
      "Hades trabalha como herói paranormal independente — embora preferisse não chamar atenção. Entre invisibilidade, ansiedade e contas a pagar, ele aceita salvar um pastor corrupto de algo que talvez nem pertença a este mundo.",
  },
  {
    number: "03",
    icon: "scales",
    image: "/images/stories/03-juizo-de-fogo.webp",
    title: "Juízo de Fogo",
    author: "Davi Misko",
    tag: "Drama jurídico • Vigilante",
    synopsis:
      "Ícaro defende pessoas com poderes diante da Justiça e esconde suas próprias chamas do mundo. Quando um novo cliente transforma sua vida num julgamento cruel, ele terá de escolher entre vingança e justiça.",
  },
  {
    number: "04",
    icon: "mic",
    image: "/images/stories/04-super-raps.webp",
    title: "Super Raps — Estilo Hip-Hop",
    author: "Djone Pereira",
    tag: "Periferia • Hip-hop",
    synopsis:
      "Anderson ensina aos jovens da comunidade que o hip-hop também é resistência. Mas, quando o Clã da Clave ameaça sua família, o veterano Super Raps precisa preparar uma nova geração para assumir o microfone e a luta.",
  },
  {
    number: "05",
    icon: "mask",
    image: "/images/stories/05-nao-nascido.webp",
    title: "O Não Nascido",
    author: "Eduardo César",
    tag: "Ficção científica • Crime",
    synopsis:
      "Luiz é um velho metamorfo que jamais teve uma identidade digital. Nas mãos de um criminoso capaz de controlar mentes e dados, o homem que não existe na rede pode ser a única falha num golpe aparentemente perfeito.",
  },
  {
    number: "06",
    icon: "scripture",
    image: "/images/stories/06-seminarista.webp",
    title: "O Seminarista",
    author: "Geancarlo Rodrigues",
    tag: "Ocultismo • Fantasia",
    synopsis:
      "João entrou no seminário para compreender sua sensibilidade espiritual. Ao investigar textos apócrifos, enfraquece uma barreira ancestral e descobre que algumas passagens foram escondidas por um motivo.",
  },
  {
    number: "07",
    icon: "helmet",
    image: "/images/stories/07-esquecido.webp",
    title: "O Esquecido",
    author: "João Tenório",
    tag: "Mitologia • São Paulo",
    synopsis:
      "Apagado da história de Troia, Alexios atravessou séculos ligado a uma criatura de outro mundo. Agora, em São Paulo, uma droga chamada Ambrosia ameaça despertar uma guerra que os mortais esqueceram.",
  },
  {
    number: "08",
    icon: "sun",
    image: "/images/stories/08-escolhido.webp",
    title: "Escolhido",
    author: "Lucas Lima",
    tag: "Salvador • Romance",
    synopsis:
      "Dani carrega a energia do sol, da lua e o dom de curar. Em Salvador, ao lado de um capoeirista por quem começa a se apaixonar, enfrenta uma líder religiosa que transforma fé, medo e preconceito em armas.",
  },
  {
    number: "09",
    icon: "mushroom",
    image: "/images/stories/09-proliferacao.webp",
    title: "Proliferação",
    author: "Niko Brasileo",
    tag: "Eco-horror • Ouro Preto",
    synopsis:
      "Nas montanhas de Ouro Preto, Pedro domina a terra e guarda dentro de si uma colônia impossível de destruir. Contra uma mineração que devora tudo, sobreviver pode exigir que ele se torne algo além de humano.",
  },
  {
    number: "10",
    icon: "arrow",
    image: "/images/stories/10-flecha.webp",
    title: "Flecha",
    author: "Rafael A. F. Silva",
    tag: "Niterói • Aventura",
    synopsis:
      "Escolhido pelo legado de Arariboia, Zeca descobre uma velocidade sobre-humana e um escudo que nasce de seus próprios braços. Seu primeiro desafio será impedir que a ganância apague a memória da terra.",
  },
  {
    number: "11",
    icon: "moon",
    image: "/images/stories/11-capacete-preto.webp",
    title: "Capacete Preto",
    author: "Rafael Odo",
    tag: "Fortaleza • Herói de rua",
    synopsis:
      "Na escuridão, Leonardo se torna mais rápido e mais forte. Para o bairro de Nova Messejana, ele é o herói que sempre aparece; para o Estado, é um poderoso não registrado que precisa ser controlado.",
  },
  {
    number: "12",
    icon: "wind",
    image: "/images/stories/12-declinio.webp",
    title: "Declínio",
    author: "Raphaela Rissoli",
    tag: "Tragédia • Superpoderes",
    synopsis:
      "Lastro, Zéfiro e Âmbar formam uma equipe capaz de desafiar gravidade, vento e força bruta. Mas um inimigo feito de fogo sabe que a maior fraqueza de um herói pode ser a necessidade de ser amado.",
  },
  {
    number: "13",
    icon: "fish",
    image: "/images/stories/13-povo-do-rio.webp",
    title: "Povo do Rio",
    author: "Rony Pacheco",
    tag: "Amazônia • Folclore",
    synopsis:
      "Um agente da ABIN que devora moedas investiga pescadores desaparecidos numa comunidade ribeirinha. À noite, uma canção atravessa o rio — e as criaturas que respondem a ela preparam algo maior que uma caçada.",
  },
  {
    number: "14",
    icon: "cat",
    image: "/images/stories/14-gata-de-rua.webp",
    title: "Uma Gata de Rua",
    author: "Thalles Weichart",
    tag: "Aventura juvenil • Autismo",
    synopsis:
      "Quando o mundo fica barulhento demais, Catarina se transforma numa gata vira-lata. O poder que parecia apenas uma forma de desaparecer será sua melhor chance de encontrar quem ninguém mais procura.",
  },
  {
    number: "15",
    icon: "flower",
    image: "/images/stories/15-aquele-que-carrega.webp",
    title: "Aquele Que Carrega",
    author: "Tiago Santoli",
    tag: "Brasília, 1985 • Suspense",
    synopsis:
      "Toda Quaresma, crianças desaparecem de quartos impecavelmente limpos em Brasília. Um policial que perdeu o próprio filho segue o rastro de flores roxas até uma verdade que ninguém está preparado para carregar.",
  },
  {
    number: "16",
    icon: "ball",
    image: "/images/stories/16-copa-do-brasil.webp",
    title: "Copa do Brasil: O Jogo Acabou",
    author: "Washington Lanfredi",
    tag: "Futebol • Tecno-thriller",
    synopsis:
      "Na final da Copa do Brasil, um estádio inteiro vira armadilha. A única pessoa capaz de mudar o placar é uma avó de 72 anos que transforma ondas eletromagnéticas e o canto da torcida em poder.",
  },
  {
    number: "17",
    icon: "knot",
    image: "/images/stories/17-linhas-e-nos.webp",
    title: "Linhas e Nós",
    author: "Wathson Machado",
    tag: "Drama social • Realismo fantástico",
    synopsis:
      "Depois de sobreviver ao Hospital Colônia de Barbacena, Jorge enxerga fios invisíveis ligando pessoas, emoções e destinos. Talvez o homem chamado de louco a vida inteira seja o único capaz de mudar uma tragédia.",
  },
  {
    number: "18",
    icon: "seal",
    image: "/images/stories/18-portador.webp",
    title: "O Portador",
    author: "Wesley Dória",
    tag: "Serra da Capivara • Cósmico",
    synopsis:
      "Setenta e dois nomes proibidos vivem dentro de Miguel, e seu toque pode destruir. Quando entidades celestiais chegam para julgá-lo, sua maior força será continuar escolhendo não se tornar um monstro.",
  },
  {
    number: "19",
    icon: "dog",
    image: "/images/stories/19-cane-corso.webp",
    title: "Cane Corso",
    author: "Willhelm Cruz",
    tag: "Curitiba • Noir gótico",
    synopsis:
      "Meninas são assassinadas enquanto a polícia protege os poderosos. Entre um Lobo escondido na cidade e um justiceiro movido pelo luto, a detetive Florence descobrirá de que lado a lei realmente está.",
  },
  {
    number: "20",
    icon: "flame",
    image: "/images/stories/20-chama-eterna.webp",
    title: "A Chama Eterna",
    author: "Yasmin Vitória",
    tag: "Sete Lagoas • Fantasia sombria",
    synopsis:
      "Na Gruta Rei do Mato, Plasma Negro tenta impedir que um inverno eterno alcance o Brasil. Cercado por gelo, plantas e segredos, o herói de fogo descobrirá quanto custa salvar um país sem ser lembrado.",
  },
  {
    number: "21",
    icon: "trident",
    image: "/images/stories/21-tridente.webp",
    title: "Tridente: O Cyber Exú",
    author: "Ed Zurique",
    tag: "Afrofuturismo • 3026",
    synopsis:
      "Num Brasil de 3026, um skatista e psicografiteiro torna-se avatar do Cyber Exú. Entre megacorporações e ancestralidade digital, Tridente precisa abrir caminhos para um futuro que tentaram programar.",
  },
];

const catalogUrl = "https://uiclap.bio/editorafantasticos";
const physicalBookUrl = "https://loja.uiclap.com/titulo/ua167109/";

const storyThemeByNumber: Record<string, string> = {
  "01": "mythic",
  "02": "occult",
  "03": "urban",
  "04": "future",
  "05": "future",
  "06": "occult",
  "07": "urban",
  "08": "mythic",
  "09": "occult",
  "10": "mythic",
  "11": "urban",
  "12": "human",
  "13": "mythic",
  "14": "mythic",
  "15": "human",
  "16": "future",
  "17": "human",
  "18": "occult",
  "19": "urban",
  "20": "occult",
  "21": "future",
};

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const step = Math.min(carousel.clientWidth * 0.88, 980);
    carousel.scrollLeft += direction * step;
  };

  return (
    <main>
      <PictogramSprite />
      <SoundtrackPlayer />
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Universo Heróis Fantásticos">
          <img
            className="brand-logo"
            src="/images/uhf-logo-cutout.png"
            alt=""
            width="82"
            height="82"
          />
          <span className="brand-copy">
            <strong>Universo Heróis</strong>
            <small>Fantásticos • Vol. I</small>
          </span>
        </a>

        <nav aria-label="Navegação principal">
          <a href="#universo">O universo</a>
          <a href="#todos-os-contos">Os 21 contos</a>
          <a href="#livro">O livro</a>
          <a className="nav-cta" href="#livro">
            Comprar o livro
          </a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="map-contours" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            Uma antologia. Um universo compartilhado.
          </p>
          <h1>
            O Brasil nunca
            <br />
            precisou importar
            <br />
            <em>seus heróis.</em>
          </h1>
          <p className="hero-lead">
            21 autores transformam nossas cidades, culturas, conflitos e lendas
            em um mesmo universo de poderes, monstros e escolhas impossíveis.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#livro">
              Quero meu exemplar
              <span aria-hidden="true">↓</span>
            </a>
            <a className="button button-secondary" href="#todos-os-contos">
              Explorar as histórias
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="hero-stats" aria-label="Informações do livro">
            <div><strong>21</strong><span>autores</span></div>
            <div><strong>21</strong><span>histórias</span></div>
            <div><strong>504</strong><span>páginas</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="sun-disc" aria-hidden="true" />
          <div className="book-wrap">
            <img
              src="/images/capa-uhf.jpg"
              alt="Capa do livro Universo Heróis Fantásticos, volume um"
              width="571"
              height="800"
            />
          </div>
          <p className="volume-seal"><span>Volume</span><strong>I</strong></p>
        </div>

        <div className="scroll-note" aria-hidden="true">
          <span />
          DESÇA PARA ENTRAR NO UNIVERSO
        </div>
      </section>

      <section className="manifesto section" id="universo">
        <SectionSilhouette
          src="/images/silhouettes/winged-guardian.webp"
          className="silhouette-winged"
          width={878}
          height={1300}
        />
        <div className="section-kicker">UM PAÍS. MUITAS ORIGENS.</div>
        <div className="manifesto-grid">
          <h2>
            Aqui, o Brasil
            <br />
            não é cenário.
            <br />
            <em>É a origem.</em>
          </h2>
          <div className="manifesto-copy">
            <p>
              Da Amazônia a Curitiba. De Salvador à Serra da Capivara. Do
              passado ao ano de 3026. Cada conto abre uma nova porta para o
              mesmo universo fantástico — e cada herói carrega as marcas do
              lugar de onde veio.
            </p>
            <p>
              Capoeira, hip-hop, futebol, religiosidade, comunidades
              ribeirinhas, periferias e metrópoles convivem com mutantes,
              entidades, vigilantes e ameaças capazes de mudar o país.
            </p>
          </div>
        </div>
        <div className="promise-strip">
          <span>Fantasia</span><i>✦</i><span>Ficção científica</span><i>✦</i>
          <span>Terror</span><i>✦</i><span>Afrofuturismo</span><i>✦</i>
          <span>Super-heróis</span>
        </div>
      </section>

      <HeroicDivider
        icons={["wing", "arrow", "fish", "sun", "cat"]}
        tone="paper"
      />

      <section className="visual-atlas section" aria-labelledby="atlas-title">
        <div className="atlas-heading">
          <p className="section-kicker">UM BRASIL ENTRE O MITO E O IMPOSSÍVEL</p>
          <h2 id="atlas-title">
            Cinco faces de um mesmo
            <br />
            <em>universo fantástico.</em>
          </h2>
          <p>
            Os 21 contos reunidos em territórios narrativos — todos diferentes,
            todos conectados pela mesma realidade fantástica.
          </p>
        </div>

        <div className="atlas-grid">
          <article className="atlas-card atlas-mythic">
            <img
              src="/images/brasil-mitico.webp"
              alt="Ilustração conceitual de um Brasil mítico, com natureza, rios e símbolos heroicos"
              width="1024"
              height="683"
              loading="lazy"
            />
            <div className="atlas-overlay">
              <span>Natureza • ancestralidade • território</span>
              <h3>Brasil mítico</h3>
              <ul>
                <li>Gavião Real</li>
                <li>Escolhido</li>
                <li>Flecha</li>
                <li>Povo do Rio</li>
                <li>Uma Gata de Rua</li>
              </ul>
            </div>
          </article>

          <article className="atlas-card atlas-future">
            <img
              src="/images/brasil-futurista.webp"
              alt="Ilustração conceitual do Brasil futurista, com tecnologia, grafite e luzes urbanas"
              width="1024"
              height="683"
              loading="lazy"
            />
            <div className="atlas-overlay">
              <span>Tecnologia • cidade • resistência</span>
              <h3>Brasil futurista</h3>
              <ul>
                <li>Super Raps — Estilo Hip-Hop</li>
                <li>Copa do Brasil: O Jogo Acabou</li>
                <li>O Não Nascido</li>
                <li>Tridente: O Cyber Exú</li>
              </ul>
            </div>
          </article>

          <article className="atlas-card atlas-occult">
            <img
              src="/images/brasil-oculto.webp"
              alt="Ilustração conceitual do Brasil oculto, com cavernas, fogo e símbolos ancestrais"
              width="1024"
              height="683"
              loading="lazy"
            />
            <div className="atlas-overlay">
              <span>Ocultismo • horror • escolhas</span>
              <h3>Brasil oculto</h3>
              <ul>
                <li>O Herói que Não Existe</li>
                <li>O Seminarista</li>
                <li>Proliferação</li>
                <li>O Portador</li>
                <li>A Chama Eterna</li>
              </ul>
            </div>
          </article>

          <article className="atlas-card atlas-urban">
            <img
              src="/images/brasil-urbano.webp"
              alt="Ilustração conceitual do Brasil urbano, com metrópole e símbolos de resistência"
              width="1024"
              height="683"
              loading="lazy"
            />
            <div className="atlas-overlay">
              <span>Vigilantes • justiça • ruas</span>
              <h3>Brasil urbano</h3>
              <ul>
                <li>Juízo de Fogo</li>
                <li>O Esquecido</li>
                <li>Capacete Preto</li>
                <li>Cane Corso</li>
              </ul>
            </div>
          </article>

          <article className="atlas-card atlas-human">
            <img
              src="/images/brasil-humano.webp"
              alt="Ilustração conceitual sobre vínculos, perdas e destinos extraordinários"
              width="1024"
              height="683"
              loading="lazy"
            />
            <div className="atlas-overlay">
              <span>Vínculos • memória • sacrifício</span>
              <h3>Brasil humano</h3>
              <ul>
                <li>Declínio</li>
                <li>Aquele Que Carrega</li>
                <li>Linhas e Nós</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="shared-world section">
        <SectionSilhouette
          src="/images/silhouettes/heroic-trio.webp"
          className="silhouette-team"
          width={867}
          height={1300}
        />
        <div className="shared-world-intro">
          <p className="section-kicker">TODOS EXISTEM NO MESMO MUNDO</p>
          <h2>Vinte e uma vozes.<br />Uma única realidade fantástica.</h2>
          <p>
            Não são versões brasileiras de heróis estrangeiros. São personagens
            que só poderiam ter nascido daqui — conectados por um Brasil onde o
            extraordinário já faz parte da história.
          </p>
        </div>
        <div className="world-pillars">
          <article>
            <span>01</span>
            <h3>Escala nacional</h3>
            <p>Das capitais aos rios, das cavernas às comunidades: o país inteiro se torna território heroico.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Heróis humanos</h3>
            <p>Poder não apaga medo, trauma, preconceito ou dúvida. É diante deles que cada protagonista se revela.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Um universo em expansão</h3>
            <p>O primeiro volume apresenta personagens, ameaças e possibilidades para uma mitologia compartilhada.</p>
          </article>
        </div>
      </section>

      <HeroicDivider
        icons={["scales", "mic", "helmet", "moon", "trident"]}
        tone="dark"
      />

      <section className="all-stories section" id="todos-os-contos">
        <div className="all-stories-heading">
          <div>
            <p className="section-kicker">21 CONTOS • 21 AUTORES</p>
            <h2>Escolha por onde<br /><em>entrar no universo.</em></h2>
          </div>
          <div className="stories-intro">
            <p>
              Cada história possui identidade própria. Juntas, elas revelam a
              dimensão de um Brasil fantástico, diverso e imprevisível.
            </p>
            <div className="carousel-controls" aria-label="Navegação das sinopses">
              <button
                type="button"
                onClick={() => moveCarousel(-1)}
                aria-label="Ver sinopses anteriores"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => moveCarousel(1)}
                aria-label="Ver próximas sinopses"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div
          className="stories-carousel"
          ref={carouselRef}
          aria-label="Carrossel com as 21 sinopses"
          tabIndex={0}
        >
          {stories.map((story) => (
            <StoryCard story={story} key={story.title} />
          ))}
        </div>
        <p className="carousel-hint">
          Arraste para o lado ou use as setas para conhecer todos os contos.
        </p>
      </section>

      <section className="reader-fit section">
        <SectionSilhouette
          src="/images/silhouettes/arrow-runner.webp"
          className="silhouette-arrow"
          width={867}
          height={1300}
        />
        <div className="reader-fit-copy">
          <p className="section-kicker">ESTE UNIVERSO É PARA VOCÊ SE...</p>
          <h2>Você procura mais do que capas e poderes.</h2>
        </div>
        <ul>
          <li><span>✦</span> Quer descobrir super-heróis com identidade brasileira verdadeira.</li>
          <li><span>✦</span> Gosta de fantasia, terror, ficção científica e ação na mesma leitura.</li>
          <li><span>✦</span> Prefere personagens falhos, dilemas difíceis e vitórias com consequências.</li>
          <li><span>✦</span> Busca representatividade integrada à história — e não usada apenas como decoração.</li>
          <li><span>✦</span> Quer acompanhar o nascimento de um universo literário compartilhado.</li>
        </ul>
      </section>

      <HeroicDivider
        icons={["flame", "knot", "seal", "ball", "scripture"]}
        tone="paper"
      />

      <section className="offer section" id="livro">
        <div className="offer-art">
          <div className="offer-disc" aria-hidden="true" />
          <img
            src="/images/capa-uhf.jpg"
            alt="Livro Universo Heróis Fantásticos, volume um"
            width="571"
            height="800"
          />
        </div>
        <div className="offer-copy">
          <p className="section-kicker">O PRIMEIRO VOLUME DA SAGA</p>
          <h2>Entre para o<br /><em>Universo Heróis Fantásticos.</em></h2>
          <p className="offer-lead">
            Um livro para quem acredita que o fantástico também pode falar com
            nossas vozes, caminhar por nossas ruas e enfrentar os nossos
            monstros.
          </p>
          <div className="offer-facts">
            <div><span>Formato</span><strong>Antologia</strong></div>
            <div><span>Conteúdo</span><strong>21 contos</strong></div>
            <div><span>Extensão</span><strong>504 páginas</strong></div>
            <div><span>Editora</span><strong>Fantásticos</strong></div>
          </div>
          <div className="purchase-options" aria-label="Opções de compra">
            <article className="purchase-card purchase-physical">
              <p>Livro físico</p>
              <strong>Universo para ter na estante</strong>
              <span>Impressão sob demanda pela UICLAP</span>
              <span className="physical-price">R$ 72,33</span>
              <a
                className="button button-primary"
                href={physicalBookUrl}
                target="_blank"
                rel="noreferrer"
              >
                Comprar versão física
                <b aria-hidden="true">↗</b>
              </a>
            </article>
            <form
              className="purchase-card purchase-digital"
              action="/api/checkout"
              method="post"
            >
              <p>Versão digital</p>
              <strong>eBook em EPUB</strong>
              <span className="digital-price">R$ 19,90</span>
              <button className="button button-digital" type="submit">
                Comprar versão digital
                <b aria-hidden="true">→</b>
              </button>
            </form>
          </div>
          <p className="offer-note">
            Pagamento digital processado com segurança pelo Mercado Pago.
            Download liberado após a confirmação.
          </p>
        </div>
      </section>

      <section className="faq section" id="duvidas">
        <SectionSilhouette
          src="/images/silhouettes/occult-flame.webp"
          className="silhouette-occult"
          width={800}
          height={1200}
        />
        <div>
          <p className="section-kicker">ANTES DE ABRIR O LIVRO</p>
          <h2>Perguntas frequentes</h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>Os contos fazem parte do mesmo universo?</summary>
            <p>Sim. As 21 histórias são oficialmente ambientadas no mesmo Universo Heróis Fantásticos, apresentando diferentes personagens, regiões, épocas e conflitos dessa realidade compartilhada.</p>
          </details>
          <details>
            <summary>Preciso ler os contos em uma ordem específica?</summary>
            <p>Não. Cada conto possui seu próprio núcleo narrativo e pode ser lido na ordem que o leitor preferir. Você pode seguir a sequência do livro ou começar pela história que mais despertar sua curiosidade.</p>
          </details>
          <details>
            <summary>Que tipos de histórias vou encontrar?</summary>
            <p>A antologia atravessa super-heróis, fantasia urbana, terror, ficção científica, afrofuturismo, investigação policial, mitologia e aventura juvenil.</p>
          </details>
          <details>
            <summary>É um livro infantil?</summary>
            <p>A obra reúne histórias de intensidades diferentes, incluindo conflitos sociais, violência, horror e temas maduros. Sua proposta se aproxima mais dos públicos jovem adulto e adulto.</p>
          </details>
          <details>
            <summary>Como recebo a versão digital?</summary>
            <p>Após o Mercado Pago confirmar o pagamento, você retorna ao site e recebe um link protegido para baixar o e-book em formato EPUB.</p>
          </details>
        </div>
      </section>

      <section className="closing-cta">
        <SectionSilhouette
          src="/images/silhouettes/trident-skater.webp"
          className="silhouette-trident"
          width={664}
          height={1400}
        />
        <p>O impossível já vive entre nós.</p>
        <h2>Agora falta você entrar neste universo.</h2>
        <a className="button closing-button" href="#livro">
          Escolher minha versão <span>↑</span>
        </a>
      </section>

      <footer>
        <a className="footer-brand" href="#inicio">
          <img
            className="footer-logo"
            src="/images/uhf-logo-cutout.png"
            alt=""
            width="72"
            height="72"
          />
          <span>Universo Heróis Fantásticos</span>
        </a>
        <a
          className="publisher-brand"
          href={catalogUrl}
          aria-label="Conheça a Editora Fantásticos"
        >
          <span>Uma publicação</span>
          <img
            src="/images/logo-fantasticos.webp"
            alt="Fantásticos"
            width="693"
            height="720"
          />
        </a>
        <a className="footer-catalog" href={catalogUrl}>Conheça o catálogo ↗</a>
        <p className="footer-support">
          Suporte e problemas com arquivos: {" "}
          <a href="mailto:fantasticoseditora@gmail.com">fantasticoseditora@gmail.com</a>
        </p>
      </footer>
    </main>
  );
}

function SoundtrackPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.32);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = volume;
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const changeVolume = (nextVolume: number) => {
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = nextVolume;
  };

  return (
    <aside className={`soundtrack-player${isPlaying ? " is-playing" : ""}`}>
      <audio
        ref={audioRef}
        src="/audio/o-legado-do-vale.mp3"
        loop
        preload="none"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <button
        className="soundtrack-toggle"
        type="button"
        onClick={togglePlayback}
        aria-label={
          isPlaying ? "Pausar O Legado do Vale" : "Ouvir O Legado do Vale"
        }
        aria-pressed={isPlaying}
        title={isPlaying ? "Pausar O Legado do Vale" : "Ouvir O Legado do Vale"}
      >
        <span className="soundtrack-icon" aria-hidden="true">
          {isPlaying ? (
            <span className="soundtrack-equalizer">
              <i />
              <i />
              <i />
            </span>
          ) : (
            "♪"
          )}
        </span>
        <span className="soundtrack-copy">
          <strong>{isPlaying ? "Trilha tocando" : "Ouvir trilha"}</strong>
        </span>
        <span className="soundtrack-action" aria-hidden="true">
          {isPlaying ? "Ⅱ" : "▶"}
        </span>
      </button>
      <label className="soundtrack-volume">
        <span>Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => changeVolume(Number(event.target.value))}
          aria-label="Volume da trilha sonora"
        />
      </label>
    </aside>
  );
}

function StoryCard({
  story,
}: {
  story: (typeof stories)[number];
}) {
  const theme = storyThemeByNumber[story.number] ?? "human";
  const territory = story.tag.split(" • ")[0];

  return (
    <article className={`story-card story-theme-${theme}`}>
      <div className="story-visual">
        <img
          className="story-scene"
          src={story.image}
          alt=""
          width="960"
          height="640"
          loading="lazy"
        />
        <div className="story-number">{story.number}</div>
        <StorySymbol type={story.icon} />
        <span className="story-territory">{territory}</span>
      </div>
      <StorySymbol type={story.icon} variant="watermark" />
      <p className="story-tag">{story.tag}</p>
      <h3>{story.title}</h3>
      <p className="story-author">por {story.author}</p>
      <p className="story-synopsis">{story.synopsis}</p>
      <span className="story-link">Um portal deste universo <b>✦</b></span>
    </article>
  );
}

function SectionSilhouette({
  src,
  className,
  width,
  height,
}: {
  src: string;
  className: string;
  width: number;
  height: number;
}) {
  return (
    <img
      className={`section-silhouette ${className}`}
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  );
}

function HeroicDivider({
  icons,
  tone,
}: {
  icons: string[];
  tone: "paper" | "dark";
}) {
  return (
    <div className={`heroic-divider heroic-divider-${tone}`} aria-hidden="true">
      <span className="heroic-divider-line" />
      <div className="heroic-divider-emblems">
        {icons.map((icon) => (
          <span className="heroic-divider-emblem" key={icon}>
            <svg viewBox="0 0 64 64" role="presentation">
              <use href={`#icon-${icon}`} />
            </svg>
          </span>
        ))}
      </div>
      <span className="heroic-divider-line" />
    </div>
  );
}

function StorySymbol({
  type,
  variant = "medallion",
}: {
  type: string;
  variant?: "medallion" | "watermark";
}) {
  return (
    <span
      className={variant === "watermark" ? "story-watermark" : "story-symbol"}
      aria-hidden="true"
    >
      {variant === "medallion" && <i className="symbol-star">✦</i>}
      <svg viewBox="0 0 64 64" role="presentation">
        <use href={`#icon-${type}`} />
      </svg>
    </span>
  );
}

function PictogramSprite() {
  return (
    <svg className="pictogram-sprite" aria-hidden="true">
      <defs>
        <symbol id="icon-wing" viewBox="0 0 64 64">
          <path d="M5 48 30 9l3 16 25-15-11 23 12-2-22 25-5-18-13 16 4-18L5 48Z" />
          <path d="m26 32 7-7 4 13-5 8-6-14Z" />
        </symbol>
        <symbol id="icon-ghost" viewBox="0 0 64 64">
          <path d="M32 5 51 19l-8 8 12 11-19 21-2-18-18 12 6-19-13-7L32 5Z" />
          <path d="m27 19 13 7-8 11-9-8 4-10Z" />
        </symbol>
        <symbol id="icon-scales" viewBox="0 0 64 64">
          <path d="M29 7h6v43h15v7H14v-7h15V7Z" />
          <path d="m9 18 23-8 23 8-3 6-20-7-20 7-3-6Zm4 5L3 43h20L13 23Zm38 0L41 43h20L51 23Z" />
        </symbol>
        <symbol id="icon-mic" viewBox="0 0 64 64">
          <path d="M25 5h14l6 8v25l-9 9v10h11v5H17v-5h11V47l-9-9V13l6-8Zm1 10v19l6 6 6-6V15H26Z" />
          <path d="m7 31 10-7v8l-10 7v-8Zm50-7v8l-10 7v-8l10-7Z" />
        </symbol>
        <symbol id="icon-trident" viewBox="0 0 64 64">
          <path d="m32 3 8 13-5-2v43h-6V14l-5 2 8-13ZM8 10l12 8-5 2c1 11 5 16 14 18v7C16 42 10 34 9 22l-5 3 4-15Zm48 0 4 15-5-3c-1 12-7 20-20 23v-7c9-2 13-7 14-18l-5-2 12-8Z" />
        </symbol>
        <symbol id="icon-mask" viewBox="0 0 64 64">
          <path d="m32 5 24 11-6 30-18 13-18-13-6-30L32 5Zm-15 18 4 12 9-4-5-8h-8Zm30 0h-8l-5 8 9 4 4-12ZM25 44l7 8 7-8-7 2-7-2Z" />
        </symbol>
        <symbol id="icon-scripture" viewBox="0 0 64 64">
          <path d="M8 8h35l13 13v35H8V8Zm8 8v32h32V25L39 16H16Z" />
          <path d="m32 19 4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1 4-9Z" />
        </symbol>
        <symbol id="icon-helmet" viewBox="0 0 64 64">
          <path d="M7 49V31C7 14 18 5 34 5c13 0 21 7 24 18l-16 8v21H28V36H14v13H7Zm9-21h21l12-6c-4-7-10-10-18-10-9 0-14 6-15 16Z" />
          <path d="M46 38h14v7H46z" />
        </symbol>
        <symbol id="icon-sun" viewBox="0 0 64 64">
          <path d="m32 2 7 13 14-4-4 14 13 7-13 7 4 14-14-4-7 13-7-13-14 4 4-14-13-7 13-7-4-14 14 4 7-13Z" />
          <path d="M32 20a12 12 0 1 0 0 24 8 8 0 1 1 0-24Z" />
        </symbol>
        <symbol id="icon-mushroom" viewBox="0 0 64 64">
          <path d="M4 34C6 14 17 4 32 4s26 10 28 30H38l4 24H22l4-24H4Zm14-8h8l-2-8-6 8Zm20-10-3 10h10l-7-10Z" />
          <path d="M7 47h10l-5 12-5-12Zm40 0h10l-5 12-5-12Z" />
        </symbol>
        <symbol id="icon-arrow" viewBox="0 0 64 64">
          <path d="m5 53 31-31-7-7L59 5 49 35l-7-7-31 31-6-6Z" />
          <path d="m11 37 16 16-5 5L6 42l5-5Z" />
        </symbol>
        <symbol id="icon-moon" viewBox="0 0 64 64">
          <path d="M52 48C29 46 20 26 31 7 15 8 4 19 4 34c0 16 13 27 28 27 9 0 16-5 20-13Z" />
          <path d="m34 15 8 8-5 11 11 8-6 9-16-11 8-25Z" />
        </symbol>
        <symbol id="icon-wind" viewBox="0 0 64 64">
          <path d="M4 18h32l8-12 7 5-10 15H4v-8Zm0 11h53v8H4v-8Zm0 19h30l9 11 7-5-12-14H4v8Z" />
          <path d="m50 16 10 17-10 17-7-4 8-13-8-13 7-4Z" />
        </symbol>
        <symbol id="icon-fish" viewBox="0 0 64 64">
          <path d="M3 32C17 10 37 9 50 24L62 13v38L50 40C37 55 17 54 3 32Zm14 0 14 9 13-9-13-9-14 9Z" />
          <path d="m25 12 8 9-14 2 6-11Zm0 40 8-9-14-2 6 11Z" />
        </symbol>
        <symbol id="icon-cat" viewBox="0 0 64 64">
          <path d="m8 7 19 12h10L56 7l-5 25 7 17-19 11H25L6 49l7-17L8 7Zm12 25 12 20 12-20-12 7-12-7Z" />
          <path d="m2 38 21 4-1 5-20-2v-7Zm60 0v7l-20 2-1-5 21-4Z" />
        </symbol>
        <symbol id="icon-flower" viewBox="0 0 64 64">
          <path d="M32 29C7 11 5 34 21 38 5 49 25 62 32 44c7 18 27 5 11-6 16-4 14-27-11-9Z" />
          <path d="M28 36h8v26h-8zM6 8l20 19-5 5L1 13l5-5Zm52 0 5 5-20 19-5-5L58 8Z" />
        </symbol>
        <symbol id="icon-ball" viewBox="0 0 64 64">
          <path d="M32 3 53 15l8 23-14 20H17L3 38l8-23L32 3Zm0 13-12 9 5 15h14l5-15-12-9Z" />
          <path d="m9 18 12 8-4 6L5 25l4-7Zm46 0 4 7-12 7-4-6 12-8ZM17 49l10-10 5 5-8 13-7-8Zm30 0-7 8-8-13 5-5 10 10Z" />
        </symbol>
        <symbol id="icon-knot" viewBox="0 0 64 64">
          <path d="M12 7h11l30 43-7 7L12 7Zm29 0h11L18 57l-7-7L41 7Z" />
          <path d="M22 25h20v14H22z" />
        </symbol>
        <symbol id="icon-seal" viewBox="0 0 64 64">
          <path d="m32 2 8 8 11-1 4 10 9 6-5 10 2 11-11 3-7 10-11-6-11 6-7-10-11-3 2-11-5-10 9-6 4-10 11 1 8-8Z" />
          <path d="m32 13 6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2 6-13Z" />
        </symbol>
        <symbol id="icon-dog" viewBox="0 0 64 64">
          <path d="M4 5 25 18h14L60 5l-7 32-9 19-12 6-12-6-9-19L4 5Zm15 25 9 9-5-16-4 7Zm26 0-4-7-5 16 9-9ZM25 49l7 7 7-7-7-4-7 4Z" />
        </symbol>
        <symbol id="icon-flame" viewBox="0 0 64 64">
          <path d="M34 1c9 16-3 20 5 31 3-10 11-14 12-24 16 19 14 40 1 50H13C-2 43 8 23 25 7c-2 13 2 20 8 24 7-11 5-20 1-30Zm-2 32c-11 10-13 19-6 26h13c7-7 4-17-2-24-1 6-4 9-7 12 2-5 2-9 2-14Z" />
        </symbol>
      </defs>
    </svg>
  );
}
