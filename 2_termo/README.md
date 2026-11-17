# 2º Termo — materiais e estrutura

Este diretório reúne o material do segundo termo do curso Técnico em Desenvolvimento de Sistemas. Aqui estão as atividades de back-end, banco de dados, desenvolvimento de interfaces e projetos integradores.

## 1. Mapa rápido

| Número | Área | O que contém | Link |
| ---: | --- | --- | --- |
| 01 | Back-end | JavaScript, Node.js, módulos, arquivos, JSON, desafios e avaliações. | [Abrir BACKEND](./BACKEND/) |
| 02 | Banco de dados | MER, DER, dicionários, scripts SQL, atividades e materiais de apoio. | [Abrir BANCO_DADOS](./BANCO_DADOS/) |
| 03 | LIMA | HTML, CSS, páginas, wireframes, atividades e SmartCoffee. | [Abrir LIMA](./LIMA/) |
| 04 | Projetos | Páginas, jogos, protótipos, versões e projetos integradores. | [Abrir PROJETOS](./PROJETOS/) |

## 2. O que foi estudado

### 2.1 Back-end

Nesta área pratiquei JavaScript fora do navegador com Node.js. Os arquivos registram exercícios de lógica aplicada, leitura e gravação de arquivos, JSON, módulos, dependências, processamento assíncrono, orientação a objetos, desafios e operações de leitura em projetos pequenos. Também há materiais de avaliações, trabalhos em grupo e exemplos de situações como produção, estoque, manutenção, logística e oficina.

→ [README do Back-end](./BACKEND/README.md)

### 2.2 Banco de dados

Esta área reúne a passagem da modelagem para os comandos SQL. Há materiais sobre entidades, atributos, relacionamentos, MER, DER, dicionário de dados, DDL, DML, DQL, TCL, restrições, transações e projetos como SmartCoffee, Hotel e Oficina de Veículos.

→ [README de Banco de Dados](./BANCO_DADOS/README_BANCO_DADOS.md)

### 2.3 LIMA

Em LIMA pratiquei HTML e CSS, começando pela estrutura das páginas e avançando para semântica, tipografia, imagens, formulários, layouts, wireframes, identidade visual e responsividade. A pasta também reúne páginas do DevSolutions, SmartCoffee e atividades somativas.

→ [README de LIMA](./LIMA/README_LIMA.md)

### 2.4 Projetos

Aqui estão projetos individuais, projetos em grupo, jogos, páginas e versões diferentes das mesmas ideias. O conteúdo inclui arquivos HTML, CSS e JavaScript, imagens, protótipos, materiais de apoio e documentação.

→ [README de Projetos](./PROJETOS/README_PROJETOS.md)

## 3. Como navegar

1. Escolha uma das quatro áreas no [mapa rápido](#1-mapa-rápido).
2. Leia o README específico quando ele existir.
3. Entre nas pastas `Aulas`, `Somativas`, `DESAFIOS`, `Trabalho_grupo` ou nos projetos individuais.
4. Para abrir páginas, mantenha os arquivos HTML, CSS, JavaScript e imagens nos caminhos relativos originais.
5. Execute scripts SQL somente em um banco de testes.
6. Em projetos Node.js, observe o `package.json` e instale as dependências no ambiente adequado.

## 4. Sitemap completo

O mapa abaixo lista todos os arquivos do segundo termo, exceto o conteúdo interno de `node_modules`. As próprias pastas de dependências são registradas no repositório, mas foram omitidas para o sitemap continuar útil para estudar o material.

```text
2_termo/
├── BACKEND/
│   ├── AtividadesComplementares/
│   │   ├── revisaoProva/
│   │   │   ├── manutencao/
│   │   │   │   ├── app.js
│   │   │   │   └── funcoesManutencao.js
│   │   │   ├── ex1.js
│   │   │   ├── ex2.js
│   │   │   ├── ex3.js
│   │   │   ├── ex4.js
│   │   │   └── Revisao_Pre_Prova_Backend_5_Exercicios_SENAI.pdf
│   │   ├── ex1.js
│   │   ├── package-lock.json
│   │   └── package.json
│   ├── Aulas/
│   │   ├── AULA_1/
│   │   │   └── AULA_1/
│   │   │       ├── app1.js
│   │   │       ├── app2.js
│   │   │       ├── app3.js
│   │   │       ├── app4.js
│   │   │       └── app5.js
│   │   ├── AULA_10(5)/
│   │   │   └── AULA_10(5)/
│   │   │       ├── desafios/
│   │   │       │   ├── desafio1.js
│   │   │       │   └── Exercício 3 — Controle de Qualidade.pdf
│   │   │       ├── app12.js
│   │   │       ├── ex1.js
│   │   │       ├── ex2.js
│   │   │       ├── ex3.js
│   │   │       └── ex4.js
│   │   ├── AULA_11/
│   │   │   ├── desafio1.js
│   │   │   ├── desafio2.js
│   │   │   ├── desafio3.js
│   │   │   ├── desafio4.js
│   │   │   ├── desafio5.js
│   │   │   ├── ex1.js
│   │   │   ├── ex2.js
│   │   │   ├── ex3.js
│   │   │   ├── ex4.js
│   │   │   └── ex5.js
│   │   ├── AULA_12/
│   │   │   ├── logistica/
│   │   │   │   ├── calculadoraFrete.js
│   │   │   │   ├── package-lock.json
│   │   │   │   ├── package.json
│   │   │   │   └── sistemaEntrega.js
│   │   │   └── oficina/
│   │   │       ├── app.js
│   │   │       ├── funcoesOficina.js
│   │   │       ├── package-lock.json
│   │   │       └── package.json
│   │   ├── Aula_13/
│   │   │   ├── dados/
│   │   │   │   ├── app.js
│   │   │   │   └── maquinas.json
│   │   │   ├── Exemplos/
│   │   │   │   ├── exemplo_gravacao.js
│   │   │   │   ├── Manual de Aula - Persistência JSON.pdf
│   │   │   │   └── maquinas.json
│   │   │   └── Exercicios/
│   │   │       ├── exercicio1_sensores.js
│   │   │       ├── exercicio2_ferramentas.js
│   │   │       ├── exercicio3_inspecao.js
│   │   │       ├── ferramentas.json
│   │   │       ├── inspecaoQualidade.json
│   │   │       ├── package-lock.json
│   │   │       ├── package.json
│   │   │       └── sensores.json
│   │   ├── Aula_14/
│   │   │   ├── laboratorio-read/
│   │   │   │   ├── laboratorio.js
│   │   │   │   └── maquinas.json
│   │   │   ├── leitura_gravacao_info/
│   │   │   │   ├── gavacao.js
│   │   │   │   ├── ler_maquinas.js
│   │   │   │   ├── ler_maquinas.json
│   │   │   │   └── maquinas.json
│   │   │   ├── Projeto_Aluno_READ/
│   │   │   │   └── Projeto_Aluno/
│   │   │   │       ├── app.js
│   │   │   │       ├── maquinas.json
│   │   │   │       ├── package.json
│   │   │   │       ├── README.txt
│   │   │   │       └── testes.js
│   │   │   ├── Dia2GABRIEL LÚCIO DE ARAUJO - Modelo_Relatorio_CRUD_READ_Aluno.docx
│   │   │   ├── Dia2GABRIEL LÚCIO DE ARAUJO - Modelo_Relatorio_CRUD_READ_Aluno.pdf
│   │   │   ├── Evidencias.docx
│   │   │   ├── GABRIEL LÚCIO DE ARAUJO - Modelo_Relatorio_CRUD_READ_Aluno.docx
│   │   │   ├── GABRIEL LÚCIO DE ARAUJO - Modelo_Relatorio_CRUD_READ_Aluno.pdf
│   │   │   ├── Manual_Pratico_CRUD_READ_JavaScript_NodeJS.pdf
│   │   │   └── Projeto_Aluno_READ.zip
│   │   ├── AULA_2/
│   │   │   └── AULA_2/
│   │   │       ├── imc.js
│   │   │       ├── package-lock.json
│   │   │       ├── package.json
│   │   │       ├── padaria_nova.js
│   │   │       └── strings.js
│   │   ├── AULA_3/
│   │   │   └── AULA_3/
│   │   │       └── backend1_aula_autonoma/
│   │   │           ├── atividade_final.js
│   │   │           ├── aula1.js
│   │   │           ├── aula2.js
│   │   │           ├── aula3.js
│   │   │           ├── aula4.js
│   │   │           ├── desafio1.js
│   │   │           ├── desafio2.js
│   │   │           ├── GABRIEL LÚCIO DE ARAUJO_1.0 - Folha_de_Respostas_BackEnd1_Aluno.pdf
│   │   │           ├── package-lock.json
│   │   │           └── package.json
│   │   ├── AULA_4/
│   │   │   └── AULA_4/
│   │   │       ├── app10.js
│   │   │       ├── app11.js
│   │   │       ├── app6.js
│   │   │       ├── app7.js
│   │   │       ├── app8.js
│   │   │       ├── app9.js
│   │   │       ├── desafio1.js
│   │   │       ├── package-lock.json
│   │   │       └── package.json
│   │   └── Aulas_zip/
│   │       ├── AULA_1.zip
│   │       ├── AULA_10(5).zip
│   │       ├── AULA_11.zip
│   │       ├── AULA_12 E 13.zip
│   │       ├── AULA_2.zip
│   │       ├── AULA_3.zip
│   │       └── AULA_4.zip
│   ├── DESAFIOS/
│   │   ├── desafio03_manutencao/
│   │   │   ├── app.js
│   │   │   └── funcoesManutencao.js
│   │   ├── desafio01_producao.js
│   │   ├── desafio02_estoque.js
│   │   ├── Desafios_Avancados_JavaScript_Aluno_Castello.docx
│   │   ├── Desafios_Avancados_JavaScript_Aluno_Castello.pdf
│   │   ├── package-lock.json
│   │   └── package.json
│   ├── Somativas/
│   │   └── soma_01/
│   │       ├── ex10_manutencao/
│   │       │   └── ex10_manutencao/
│   │       │       ├── app.js
│   │       │       └── funcoesManutencao.js
│   │       ├── Avaliacao_Somativa_PBE1_HandsOn_100p_com_Conceituais (1).docx
│   │       ├── Avaliacao_Somativa_PBE1_HandsOn_100p_com_Conceituais (1).pdf
│   │       ├── ex01_producao.js
│   │       ├── ex02_compra.js
│   │       ├── ex03_qualidade.js
│   │       ├── ex04_temperatura.js
│   │       ├── ex05_ciclos.js
│   │       ├── ex06_media_medicoes.js
│   │       ├── ex07_operadores.js
│   │       ├── ex08_estoque.js
│   │       ├── ex09_eficiencia.js
│   │       ├── package-lock.json
│   │       └── package.json
│   ├── Trabalho_grupo/
│   │   ├── 11slides_modelo.pdf
│   │   ├── 2.0Relacionamentos_entre_Objetos_&_POO_no_Back-End2.0.pdf
│   │   ├── 2.1Relacionamentos_entre_Objetos_&_POO_no_Back-End (1).zip
│   │   ├── 2.2Relacionamentos_entre_Objetos_&_POO_no_Back-End.zip
│   │   ├── Explicar_associa├º├úo_agrega├º├úo_composicao_GJ.pdf
│   │   ├── Explicar_associa├º├úo_agrega├º├úo_composicao_GJ_2.0.pdf
│   │   ├── Grupo_4_Gabrieljac├│_Relacionamentos_entre_Objetos_&_POO_no_Back-End (1).pdf
│   │   ├── Relacionamentos_entre_Objetos_&_POO_no_Back-End.pdf
│   │   ├── Relacionamentos_entre_Objetos_&_POO_no_Back-End.pdf.pdf
│   │   └── Relacionamentos_entre_Objetos_&_POO_no_Back-End.zip
│   └── README.md
├── BANCO_DADOS/
│   ├── Aulas/
│   │   ├── Aula_1/
│   │   │   ├── 01_ÔÇô_O_MUNDO_FUNCIONA_GRACAS_AO_BANCO_DE_DADOS.pdf
│   │   │   ├── 02_-_O_INICIO_A_CONFIGURACAO_E_A_INSTALACAO_DE_UM_BANCO_DE_DADOS.htmlHTML.url
│   │   │   ├── MySQL -- Begin Your Downloadhttps---dev.mysql.com-downloads-file--id=552804.url
│   │   │   └── SMARTCOFFEE_CONCEITUAL.brM
│   │   ├── Aula_10/
│   │   │   ├── AULA_10_-_TCL_TRANSACOES_E_INTEGRIDADE_REFERENCIAL.pdf
│   │   │   ├── DESAFIOS_TCL.SQL
│   │   │   └── TCL.SQL
│   │   ├── Aula_11/
│   │   │   └── index.sql
│   │   ├── Aula_2/
│   │   │   └── 02_-_O_INICIO_A_CONFIGURACAO_E_A_INSTALACAO_DE_UM_BANCO_DE_DADOS.html
│   │   ├── Aula_3/
│   │   │   └── AULA_03_ÔÇô_MER_E_DER.html
│   │   ├── Aula_4/
│   │   │   ├── AULA_04_ÔÇô_CONCEITOS_APLICADOS_AO_DER.pdf
│   │   │   ├── Davi Guerra e Gabriel L├║cio 2.0.brM
│   │   │   ├── Script_exemplo_comando.sql
│   │   │   └── SMARTCOFFEE_CONCEITUAL.2.1.brM
│   │   ├── Aula_5/
│   │   │   ├── AULA_05_-_DICION├üRIO_DE_DADOS_-_A_DOCUMENTA├ç├âO_DO_PROJETO.pdf
│   │   │   ├── Gabriel_hotel_3.0.brM
│   │   │   ├── Gabriel_hotel_3.0.rtf
│   │   │   ├── Script_exemplo_comando.sql
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.1.brM
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.1.rtf
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.2.brM
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.2.rtf
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.brM
│   │   │   └── SMARTCOFFEE_CONCEITUAL.3.rtf
│   │   ├── Aula_6/
│   │   │   ├── AULA_06_-_DATA_DEFINITION_LANGUAGE_(DDL).pdf
│   │   │   ├── Script_Comandos1.sql
│   │   │   ├── Script_Comandos_2_Gabriel.sql
│   │   │   ├── Script_Comandos_Gabriel2.1.sql
│   │   │   ├── Script_Comandos_Gabriel2.2.sql
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.3.brM
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.4.brM
│   │   │   ├── smartcoffee_fisico_gabriel.sql
│   │   │   └── smartcoffee_fisico_gabriel2.sql
│   │   ├── Aula_7/
│   │   │   ├── apoio/
│   │   │   │   ├── Captura de tela 2026-08-26 074119.png
│   │   │   │   ├── Captura de tela 2026-08-26 074215.png
│   │   │   │   ├── Captura de tela 2026-08-26 074304.png
│   │   │   │   ├── Captura de tela 2026-08-26 074312.png
│   │   │   │   ├── Captura de tela 2026-08-26 074522.png
│   │   │   │   ├── Captura de tela 2026-08-26 074531.png
│   │   │   │   ├── Captura de tela 2026-08-26 074539.png
│   │   │   │   ├── oficina_veiculo.txt
│   │   │   │   └── tipagem.txt
│   │   │   ├── Atividade_somativa.brM
│   │   │   ├── Atividade_somativa2.0.brM
│   │   │   └── Atividade_somativa3.0.rtf
│   │   ├── Aula_8/
│   │   │   └── castelo.sql
│   │   ├── Aula_9/
│   │   │   ├── Atividade_Teorica_Revisao_Banco_de_Dados_Terico.docx
│   │   │   ├── CORRECAO_PROJETO_SMARTCOFFEE_AULAS_01_A_07.pdf
│   │   │   ├── LOGICO_.brM
│   │   │   ├── logico_2.3.brM
│   │   │   ├── LOGICO_projeto.brM
│   │   │   ├── script.sql
│   │   │   ├── script_2.0.sql
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.5.brM
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.6.brM
│   │   │   ├── SMARTCOFFEE_CONCEITUAL.3.7.brM
│   │   │   └── SMARTCOFFEE_CONCEITUAL.3.7_dicionario.rtf
│   │   ├── Aula_9.1/
│   │   │   ├── DESAFIOS_DML.sql
│   │   │   ├── DML.SQL
│   │   │   └── DML_REVISAO.SQL
│   │   └── Aula_9.2/
│   │       ├── AULA_09_-_DQL_CONSULTAS_SQL.pdf
│   │       ├── DESAFIOS_DQL.sql
│   │       └── DQL.sql
│   ├── SOMATIVA_03/
│   │   └── CENARIOS_BANCO_DE_DADOS_360_MODELO_ENTREGA_PREENCHIVEL.docx
│   ├── SOMATIVA_1/
│   │   ├── Atividade_somativa3.0.brM
│   │   ├── coreção_somativa_1.sql
│   │   ├── dicionario_dados1.0.rtf
│   │   └── Script_oficina_veiculo_gabriel1.0.sql
│   ├── SOMATIVA_2/
│   │   └── soma2.sql
│   └── README_BANCO_DADOS.md
├── LIMA/
│   ├── Aulas/
│   │   ├── Aula_1/
│   │   │   ├── PAGINAS/
│   │   │   │   ├── index.html
│   │   │   │   └── treino.html
│   │   │   └── 01_-_O_INICIO_DE_TUDO.html
│   │   ├── Aula_10/
│   │   │   ├── exercicios.html
│   │   │   ├── index.html
│   │   │   ├── style.css
│   │   │   └── style2.css
│   │   ├── Aula_11/
│   │   │   ├── exercicio.css
│   │   │   ├── exercicio.html
│   │   │   ├── index.html
│   │   │   ├── index2.html
│   │   │   ├── style.css
│   │   │   └── style2.css
│   │   ├── Aula_12/
│   │   │   ├── index.html
│   │   │   └── style.css
│   │   ├── Aula_2/
│   │   │   ├── PAGINAS/
│   │   │   │   ├── equipe.html
│   │   │   │   └── index.html
│   │   │   └── AULA_02_-_CONSTRUINDO_A_PRIMEIRA_PAGINA_WEB.html
│   │   ├── Aula_3/
│   │   │   ├── IMAGENS/
│   │   │   │   ├── Berserk.jpg
│   │   │   │   ├── Berserk.png
│   │   │   │   ├── Berserk_leve.ico
│   │   │   │   └── Berserk_leve.png
│   │   │   ├── PAGINAS/
│   │   │   │   └── index.html
│   │   │   └── AULA_03_-_ORGANIZANDO_INFORMA├ç├òES_COM_O_HTML.pdf
│   │   ├── Aula_4/
│   │   │   ├── PAGINAS/
│   │   │   │   ├── index.html
│   │   │   │   └── sobre.html
│   │   │   └── AULA_04_-_FAVICON_E_IMAGENS.pdf
│   │   ├── Aula_5/
│   │   │   ├── ATIVIDADE/
│   │   │   │   ├── PAGINAS/
│   │   │   │   │   ├── contato.html
│   │   │   │   │   ├── index.html
│   │   │   │   │   ├── ler_mais_css.html
│   │   │   │   │   ├── ler_mais_html.html
│   │   │   │   │   ├── sobre.html
│   │   │   │   │   └── temos.html
│   │   │   │   └── PAGINAS.zip
│   │   │   ├── PAGINAS/
│   │   │   │   ├── curriculo.html
│   │   │   │   ├── index.html
│   │   │   │   └── index2.html
│   │   │   └── AULA_05_-_HTML_SEM├éNTICO_TIPOGRAFIA_E_LAYOUT_VISUAL.pdf
│   │   ├── Aula_6/
│   │   │   ├── PAGINAS/
│   │   │   │   ├── exercicio.css
│   │   │   │   ├── index.css
│   │   │   │   ├── index.html
│   │   │   │   ├── index_extrerno.html
│   │   │   │   ├── index_inline.html
│   │   │   │   ├── index_interno.html
│   │   │   │   └── style.css
│   │   │   └── AULA_06_-_CSS_(CASCADING_STYLE_SHEETS).pdf
│   │   ├── Aula_7/
│   │   │   ├── index.css
│   │   │   ├── index_listas.html
│   │   │   └── link_suporte.html
│   │   ├── Aula_7e8/
│   │   │   ├── altaFidelidade.png
│   │   │   ├── AULA_07_-_WIREFRAME_(PLANEJANDO_A_INTERFACE).pdf
│   │   │   ├── AULA_08_-_Gabriel_pdf_WIREFRAME_DIGITAL_COM_FIGMA_IDENTIDADE_VISUAL (1).pdf
│   │   │   ├── AULA_08_-_pdf_WIREFRAME_DIGITAL_COM_FIGMA_IDENTIDADE_VISUAL (1).pdf
│   │   │   ├── AULA_08_-_WIREFRAME_DIGITAL_COM_FIGMA_IDENTIDADE_VISUAL.pdf
│   │   │   └── baixaFidelidade.png
│   │   └── Aula_9/
│   │       ├── CSS/
│   │       │   └── style.css
│   │       ├── IMG/
│   │       │   ├── ambiente.jpg
│   │       │   ├── banner_imagem.png
│   │       │   ├── cafe_caramelo.jpg
│   │       │   ├── cafe_especial.jpg
│   │       │   ├── cafe_tradicional.jpg
│   │       │   └── imagem_sobre.jpg
│   │       └── index.html
│   ├── DEVSOLUTIONS/
│   │   └── PAGINAS/
│   │       ├── IMAGENS/
│   │       │   ├── 1.jpg
│   │       │   ├── 2.jpg
│   │       │   └── images.jpg
│   │       ├── equipe.html
│   │       ├── index.html
│   │       └── memes.html
│   ├── SmartCoffee/
│   │   ├── IMG/
│   │   │   ├── ambiente.jpg
│   │   │   ├── banner_imagem.png
│   │   │   ├── cafe_caramelo.jpg
│   │   │   ├── cafe_especial.jpg
│   │   │   ├── cafe_tradicional.jpg
│   │   │   └── imagem_sobre.jpg
│   │   ├── index.html
│   │   └── style.css
│   ├── SOMATIVA/
│   │   ├── s01/
│   │   │   ├── corecao.css
│   │   │   ├── corecao.html
│   │   │   ├── index2.html
│   │   │   ├── SOMATIVA_01_-_CRIANDO_A_PRIMEIRA_P├üGINA.pdf
│   │   │   └── style2.css
│   │   └── s02/
│   │       ├── 02_-_NOSTALGIA_PLAY.svg
│   │       ├── index.html
│   │       ├── SOMATIVA_02_-_NOSTALGIA.pdf
│   │       └── style.css
│   └── README_LIMA.md
├── PROJETOS/
│   ├── Aulas/
│   │   ├── Aula_0/
│   │   │   ├── IMAGENS/
│   │   │   │   ├── adere├ºos.png
│   │   │   │   ├── adere├ºos2.png
│   │   │   │   ├── Baneer.png
│   │   │   │   ├── beta_site.png
│   │   │   │   ├── logo.png
│   │   │   │   └── slogan.txt
│   │   │   └── Paginas_atual/
│   │   │       ├── style.css
│   │   │       ├── teste.html
│   │   │       ├── teste2.html
│   │   │       └── texte3.html
│   │   ├── Aula_1/
│   │   │   └── Projetos_grupo/
│   │   │       ├── site/
│   │   │       │   ├── index.html
│   │   │       │   └── style.css
│   │   │       └── ideias.txt
│   │   ├── Aula_2/
│   │   │   └── index.html
│   │   └── Gabriel/
│   │       ├── 5hNoBanheiro/
│   │       │   ├── boi1.0/
│   │       │   │   ├── index.html
│   │       │   │   ├── script.js
│   │       │   │   └── style.css
│   │       │   ├── boi1.1/
│   │       │   │   ├── index.html
│   │       │   │   ├── script.js
│   │       │   │   └── style.css
│   │       │   └── boi2.0/
│   │       │       ├── index.html
│   │       │       ├── script.js
│   │       │       └── style.css
│   │       ├── cassino/
│   │       │   ├── game.js
│   │       │   ├── index.html
│   │       │   └── style.css
│   │       ├── chess/
│   │       │   ├── chess2.0/
│   │       │   │   ├── style.css
│   │       │   │   ├── styleReserva.css
│   │       │   │   └── xadrez.html
│   │       │   └── readme.md
│   │       ├── clicker/
│   │       │   ├── clicker1.0/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── clicker1.1/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── clicker2.0/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   └── readme.md
│   │       ├── jaco/
│   │       │   ├── boi1.0/
│   │       │   │   ├── index.html
│   │       │   │   ├── script.js
│   │       │   │   └── style.css
│   │       │   └── boi1.1/
│   │       │       ├── index.html
│   │       │       ├── script.js
│   │       │       └── style.css
│   │       ├── primeiraPessoa/
│   │       │   ├── game.js
│   │       │   ├── index.html
│   │       │   └── style.css
│   │       ├── probabilidade/
│   │       │   └── probabilidade1.0/
│   │       │       ├── index.html
│   │       │       ├── script.js
│   │       │       └── style.css
│   │       ├── RPG/
│   │       │   ├── rpg1.0/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.0/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.1/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.2/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.3/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.4/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.5/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.6/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.6.1/
│   │       │   │   ├── files/
│   │       │   │   │   ├── game.js
│   │       │   │   │   ├── index.html
│   │       │   │   │   └── style.css
│   │       │   │   ├── files.zip
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.6.2/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   ├── rpg2.6.3/
│   │       │   │   ├── game.js
│   │       │   │   ├── index.html
│   │       │   │   └── style.css
│   │       │   └── readme.md
│   │       ├── SuperMauricio/
│   │       │   ├── mauricio1.0/
│   │       │   │   └── mauricio.html
│   │       │   ├── mauricio2.0/
│   │       │   │   ├── index.html
│   │       │   │   ├── script.js
│   │       │   │   └── style.css
│   │       │   ├── mauricio2.1/
│   │       │   │   ├── index.html
│   │       │   │   ├── script.js
│   │       │   │   └── style.css
│   │       │   ├── mauricio2.2/
│   │       │   │   ├── index.html
│   │       │   │   ├── script.js
│   │       │   │   └── style.css
│   │       │   ├── mauricio2.2.1/
│   │       │   │   ├── index.html
│   │       │   │   ├── script.js
│   │       │   │   └── style.css
│   │       │   └── mauricio2.3/
│   │       │       ├── index.html
│   │       │       ├── script.js
│   │       │       └── style.css
│   │       └── tower/
│   │           ├── tower1.0/
│   │           │   ├── index.html
│   │           │   ├── script.js
│   │           │   └── style.css
│   │           ├── tower2.0/
│   │           │   ├── game.js
│   │           │   ├── index.html
│   │           │   └── style.css
│   │           ├── tower2.1/
│   │           │   ├── game.js
│   │           │   ├── index.html
│   │           │   └── style.css
│   │           ├── tower2.2/
│   │           │   ├── game.js
│   │           │   ├── index.html
│   │           │   └── style.css
│   │           ├── tower2.3/
│   │           │   ├── game.js
│   │           │   ├── index.html
│   │           │   └── style.css
│   │           └── tower2.4/
│   │               ├── game.js
│   │               ├── index.html
│   │               └── style.css
│   └── README_PROJETOS.md
└── README.md
```

## 5. Observação sobre a organização

Os nomes das pastas e dos arquivos acompanham a organização das aulas e, em alguns casos, preservam nomes antigos, espaços, acentos ou versões diferentes. Por isso, o sitemap mostra os nomes reais em vez de renomear tudo e quebrar os caminhos dos arquivos.

Este diretório continua em construção conforme o curso avança.
