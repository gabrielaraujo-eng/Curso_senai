# 🖥️ Sistemas Operacionais: Conteúdo das Aulas

## 1. Operação de Sistemas Operacionais (Conceitos Core)
*   **Gerenciamento de Processos**: Estados do processo, escalonamento de CPU, threads e concorrência.
*   **Gerenciamento de Memória**: Memória virtual, paginação, segmentação e alocação dinâmica.
*   **Sistema de Arquivos**: Estruturas de diretórios, permissões de acesso, metadados e journaling.
*   **Gerenciamento de E/S**: Drivers de dispositivos, buffering, spooling e interrupções de hardware.

---

## 2. Operação Prática: Windows vs. Linux

### Interface de Linha de Comando (CLI)
*   **Windows (PowerShell / CMD)**:
    *   Navegação e Arquivos: `dir`, `cd`, `mkdir`, `copy`, `del`.
    *   Rede e Diagnóstico: `ipconfig`, `ping`, `tracert`, `netstat`.
    *   Gerenciamento: `tasklist`, `taskkill`, `Get-Process`, `Get-Service`.
*   **Linux (Bash / Shell)**:
    *   Navegação e Arquivos: `ls`, `cd`, `mkdir`, `cp`, `rm`, `mv`.
    *   Rede e Diagnóstico: `ip a`, `ping`, `traceroute`, `ss`.
    *   Gerenciamento: `ps aux`, `kill`, `top`, `htop`, `systemctl`.

### Gerenciamento de Usuários e Permissões
*   **Windows**: Grupos Locais (Administradores, Usuários), Listas de Controle de Acesso (ACL) e NTFS.
*   **Linux**: Modelo POSIX (`chmod`, `chown`), arquivo `/etc/passwd` e superusuário (`root`/`sudo`).

### Instalação e Pacotes
*   **Windows**: Windows Installer (.msi), executáveis (.exe) e gerenciador `winget`.
*   **Linux**: Gerenciadores de pacotes nativos (`apt` para Debian/Ubuntu, `dnf` para RHEL/Fedora).

---

## 3. Segurança Cibernética no Sistema Operacional

### Ameaças Comuns ao S.O.
*   **Malware**: Funcionamento de vírus, worms, cavalos de troia, ransomware e rootkits.
*   **Exploits**: Vulnerabilidades de estouro de buffer (buffer overflow) e escalada de privilégios.

### Mecanismos de Proteção Nativos
*   **Windows**: 
    *   *Windows Defender*: Antivírus e proteção contra ameaças em tempo real.
    *   *UAC (User Account Control)*: Controle de conta de usuário para autorização de alterações.
    *   *BitLocker*: Criptografia de disco completo.
*   **Linux**:
    *   *Firewalls*: Configuração de tabelas de filtragem de pacotes com `iptables` ou `ufw`.
    *   *Módulos de Segurança*: Controle de acesso obrigatório com SELinux ou AppArmor.
    *   *Hardening*: Desativação de serviços desnecessários e proteção do carregador de inicialização (GRUB).

### Políticas de Segurança e Auditoria
*   **Princípio do Menor Privilégio**: Garantir apenas os acessos necessários para a execução da tarefa.
*   **Logs e Auditoria**: Monitoramento de eventos via *Visualizador de Eventos* (Windows) e `/var/log/*` (Linux).
*   **Atualizações (Patching)**: Importância do Windows Update e rotinas de atualização (`apt upgrade`).
