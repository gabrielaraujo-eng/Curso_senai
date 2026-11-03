# ⚔️ Aethra Online 2.5D — A Lenda do Cristal da Aurora

RPG de ação em 2.5D que roda direto no navegador, feito com **HTML, CSS e JavaScript puro + three.js**.
Crie seu herói, explore o reino de Aethra, derrote os cinco guardiões corrompidos e enfrente Malvorath, o Devorador, no fundo do Abismo.

> Projeto de RPG — `2_termo / PROJETOS / Aulas / Gabriel / RPG`

---

## 📖 História

Há mil anos o **Cristal da Aurora** mantém as trevas do Abismo presas sob a terra. Numa noite sem estrelas, uma sombra chamada Malvorath rompeu o selo: o cristal se partiu em cinco fragmentos e os guardiões de Aethra foram corrompidos.

Pelo caminho você segue a trilha do **diário de Darius**, o guarda desaparecido, e descobre — fragmento por fragmento — quem Malvorath realmente foi. As cenas ficam salvas no **Diário de Aethra**, dentro da janela de Missões.

## 🎮 Recursos

- **3 classes:** Guerreiro, Arqueiro e Mago, cada uma com habilidades, passiva e estilo de jogo próprios
- **Mundo em anéis:** Vila de Aethra, Planície Verde, Floresta Sombria, Deserto Dourado, Tundra Gélida, Vulcão Infernal e a Fenda do Abismo
- **6 chefes:** Rei Slime, Ent Ancião, Faraó Imortal, Rainha Gélida, Dragão Rubro e Malvorath (com áreas de ataque no chão para desviar)
- **História principal com 34 etapas**, missões secundárias, contratos de caça e conquistas
- **Atributos e habilidades:** distribua pontos em Poder, Vitalidade, Agilidade e Sabedoria (com botão para gastar vários pontos de uma vez) e evolua cada habilidade até o nível 10
- **Equipamentos:** itens de 5 raridades (Comum a Lendário), forja da Brunhilda e refino até +10
- **Arena Infinita** com ondas cada vez mais fortes e chefe a cada 5 ondas
- **Novo Jogo+** com monstros mais fortes e loot melhor
- **5 dificuldades:** Fácil, Normal, Difícil, Impossível e **Ultra Impossível**
- **Até 6 personagens salvos** por navegador, com **exportar/importar** para jogar em outro aparelho
- **Funciona no celular**, com joystick virtual e botões de toque

## 🕹️ Controles

| Ação | Tecla / gesto |
|---|---|
| Andar | `W A S D` / setas, ou clique no chão |
| Atacar | Clique no monstro (ataque automático) · `F` ou `Tab` seleciona o alvo mais próximo |
| Habilidades | `1` a `5` |
| Esquiva | `Espaço` ou `Shift` |
| Poções | `Q` vida · `R` mana |
| Interagir | `E` (falar, teleportar, portal) |
| Câmera | Botão direito + arrastar para girar · Roda do mouse para zoom |
| Janelas | `I` mochila · `C` personagem · `K` habilidades · `J` missões · `M` mapa |
| Outros | `B` pergaminho de retorno · `Enter` chat · `Esc` menu |
| Celular | Joystick à esquerda, botões à direita; arraste a tela para girar a câmera |

💡 As áreas vermelhas no chão mostram onde o ataque do chefe vai cair. Saia delas!

## 💾 Salvamento e troca de aparelho

O progresso é salvo automaticamente no `localStorage` do navegador, então cada aparelho tem seus próprios personagens.

Para levar um personagem para outro dispositivo:

1. No aparelho de origem, clique em **📤 Exportar** no personagem (tela de título) ou use **Exportar personagem** no menu (`Esc`).
2. Copie o código (começa com `AETHRA1:`) ou baixe o arquivo.
3. No outro aparelho, clique em **📥 Importar personagem** na tela de título e cole o código ou escolha o arquivo.

## ▶️ Como rodar

1. Baixe ou clone a pasta com os três arquivos: `index.html`, `style.css` e `game.js`.
2. Abra o `index.html` no navegador (Chrome, Edge ou Firefox atualizados).
3. É preciso estar conectado à internet, porque o three.js e as fontes são carregados de CDNs.

Nenhuma instalação é necessária. Para publicar, basta hospedar os três arquivos em qualquer serviço de páginas estáticas, como o GitHub Pages.

## 🚀 Futuras atualizações

- ☁️ **Salvamento na nuvem com login**, para abrir o mesmo personagem em qualquer aparelho sem exportar e importar.

### 💡 Caixa de ideias

Tem uma sugestão (classe, chefe, missão, item, melhoria)? Dentro do jogo, abra **🚀 Futuras atualizações** na tela de título ou no menu (`Esc`) e use a caixa de ideias. Ela abre uma *issue* neste repositório com o texto preenchido. Também dá para [abrir uma issue direto aqui](https://github.com/gabrielaraujo-eng/Curso_senai/issues/new).

## 🗂️ Estrutura

```
RPG/
├── index.html   # estrutura da página e carregamento das bibliotecas
├── style.css    # visual da interface (HUD, janelas, título)
├── game.js      # todo o jogo: mundo 2.5D, combate, missões, itens, interface
└── README.md
```

## 🛠️ Tecnologias

- [three.js](https://threejs.org/) r128, com pós-processamento (bloom)
- JavaScript, HTML5 e CSS3, sem frameworks
- Fontes Cinzel e Nunito (Google Fonts)

## 👤 Créditos

**Gabriel Lúcio De Araújo** — [github.com/gabrielaraujo-eng](https://github.com/gabrielaraujo-eng)
