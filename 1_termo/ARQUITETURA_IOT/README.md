# 🌐 Arquitetura de Redes e IoT: Conteúdo das Aulas

## 1. Ativos e Passivos de Rede
*   **Ativos de Rede**: Dispositivos que processam e direcionam dados na rede.
    *   *Exemplos*: Switches, roteadores, pontos de acesso (Access Points) e modems.
*   **Passivos de Rede**: Componentes físicos que servem de meio ou suporte para a transmissão dos dados.
    *   *Exemplos*: Cabos de par trançado, racks, patch panels, calhas e conectores.
*   **Conectividade Física (RJ45)**: 
    *   Conector padrão para interfaces de rede Ethernet (padrão de cabeamento EIA/TIA 568A e 568B).
    *   Estrutura e crimpagem de cabos de rede para interconexão de dispositivos.

---

## 2. Plataformas de Hardware e Drivers (Arduino e ESP32)

### Arduino
*   **Características**: Microcontrolador voltado para prototipagem eletrônica geral.
*   **Conectividade**: Nativamente limitado (necessita de Shields Ethernet RJ45 ou módulos Wi-Fi externos).

### ESP32
*   **Características**: Microcontrolador SoC de alto desempenho focado em IoT.
*   **Conectividade Nativa**: Módulos integrados de Wi-Fi de 2.4 GHz e Bluetooth (Classic e BLE).
*   **Drivers de Comunicação**: Instalação do ambiente de placas (Core ESP32) na IDE do Arduino para gravação e comunicação via porta Serial/COM (drivers CP210x ou CH340).

---

## 3. Periféricos: Sensores e Atuadores

### Sensores em Geral (Entradas)
*   **Conceito**: Dispositivos que capturam grandezas físicas do ambiente e as transformam em sinais elétricos.
*   **Tipos**:
    *   *Analógicos*: Sensor de luminosidade (LDR), sensor de umidade do solo.
    *   *Digitais*: Sensor de temperatura e umidade (DHT11/DHT22), sensor de presença (PIR), sensores ultrassônicos.

### Atuadores (Saídas)
*   **Conceito**: Dispositivos que recebem comandos elétricos do microcontrolador e realizam uma ação física no ambiente.
*   **Tipos**: Relés (para acionamento de cargas AC como lâmpadas e motores), servo motores, LEDs e buzzers.

---

## 4. Protocolos de Comunicação: MQTT

### Arquitetura MQTT (Message Queuing Telemetry Transport)
*   **Modelo**: Baseado em Publicação e Inscrição (Publish/Subscribe).
*   **Características**: Leve, baixo consumo de banda, ideal para redes instáveis e dispositivos limitados (IoT).

### Componentes Principais
*   **Broker**: O servidor central que gerencia e distribui as mensagens (ex: Mosquitto, HiveMQ, EMQX).
*   **Publish (Publicar)**: Dispositivo (ex: ESP32 com sensor) envia dados para um tópico específico no Broker.
*   **Subscribe (Inscrever)**: Dispositivo (ex: Dashboard ou atuador) se inscreve em um tópico para receber os dados enviados.
*   **Tópicos**: Estrutura em árvore usada para filtrar mensagens (ex: `casa/sala/temperatura`).
