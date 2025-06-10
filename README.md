# Smart Contract de Votação MultiversX

Este é um smart contract de votação simples desenvolvido para a blockchain MultiversX, permitindo que usuários votem entre Ethereum e Bitcoin. O contrato mantém um placar on-chain e implementa verificações de segurança básicas.

## Visão Geral

O contrato implementa um sistema de votação com as seguintes características:
- Votação entre duas opções: Ethereum e Bitcoin
- Contagem persistente on-chain
- Prevenção de votos duplicados
- Função de consulta do placar

### Tecnologias Utilizadas
- **Linguagem**: Rust (nightly-2024-02-15)
- **Framework**: MultiversX Smart Contract Framework (0.58.0)
- **CLI**: mxpy (MultiversX CLI v11.0.0)
- **Rede**: MultiversX Testnet

## Estrutura do Projeto

```
votacao/
├── src/                    # Código fonte do contrato
│   └── votacao.rs         # Implementação principal do contrato
├── tests/                  # Testes do contrato
│   ├── votacao_scenario_rs_test.rs  # Testes em Rust
│   └── votacao_scenario_go_test.rs  # Testes em Go
├── scenarios/             # Cenários de teste
│   └── votacao.scen.json  # Definição dos cenários
├── output/                # Arquivos gerados na compilação
├── wallets/               # Carteiras para deploy e testes
├── meta/                  # Metadados do contrato
├── wasm/                  # Arquivos WebAssembly
├── target/                # Arquivos de build do Rust
├── Cargo.toml            # Configuração do projeto Rust
├── Cargo.lock            # Lock file das dependências
├── multiversx.json       # Configuração do MultiversX
└── .gitignore           # Arquivos ignorados pelo git
```

### Descrição dos Diretórios

- **src/**: Contém o código fonte do contrato inteligente
- **tests/**: Contém os testes do contrato em Rust e Go
- **scenarios/**: Contém os cenários de teste em formato JSON
- **output/**: Armazena os arquivos gerados durante a compilação
- **wallets/**: Armazena as carteiras para deploy e testes
- **meta/**: Contém metadados do contrato
- **wasm/**: Armazena os arquivos WebAssembly compilados
- **target/**: Diretório de build do Rust

### Arquivos de Configuração

- **Cargo.toml**: Configuração do projeto Rust e dependências
- **multiversx.json**: Configuração específica do MultiversX
- **.gitignore**: Lista de arquivos ignorados pelo git

## Requisitos do Sistema

### Mínimos
- CPU: 2 cores
- RAM: 4GB
- Espaço em Disco: 10GB
- Sistema Operacional: Linux (Ubuntu 20.04+), macOS, ou Windows com WSL2

### Recomendados
- CPU: 4+ cores
- RAM: 8GB+
- Espaço em Disco: 20GB+
- IDE: Visual Studio Code com extensões Rust e MultiversX

## Pré-requisitos

1. **Rust Toolchain**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup default nightly
   ```
   > **Nota**: Para verificar as versões disponíveis do Rust Nightly, visite [rustup-components-history](https://rust-lang.github.io/rustup-components-history/). Se preferir não alterar seu ambiente global, use:
   ```bash
   cd votacao
   rustup override set nightly
   ```

2. **mxpy CLI**
   ```bash
   pip install multiversx-sdk-cli==11.0.0
   ```

3. **Dependências do Sistema**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install -y build-essential pkg-config libssl-dev

   # macOS
   brew install openssl pkg-config

   # Windows (WSL2)
   sudo apt-get update
   sudo apt-get install -y build-essential pkg-config libssl-dev
   ```

4. **Wallet MultiversX**
   - Crie uma conta na [MultiversX Testnet](https://testnet-wallet.multiversx.com)
   - Exporte sua chave privada (.pem)
   - Mantenha o arquivo .pem em local seguro

   > **Opções para criar/gerenciar carteiras**:
   ```bash
   # Criar nova carteira .pem
   mxpy wallet new --outfile=wallets/deploy-votacao.pem

   # OU converter carteira existente (se tiver mnemonic)
   mxpy wallet convert \
     --infile wallet.json \
     --in-format=mnemonic \
     --out-format=pem \
     --outfile=wallets/deploy-votacao.pem
   ```

## Instalação e Configuração


2. **Configure o mxpy**
   ```bash
   mxpy config set proxy https://testnet-api.multiversx.com
   mxpy config set chainID T
   ```

3. **Configure o Cargo.toml**
   ```toml
   [package]
   name = "votacao"
   version = "0.0.0"
   edition = "2021"
   publish = false

   [lib]
   path = "src/votacao.rs"

   [dependencies.multiversx-sc]
   version = "0.58.0"

   [dev-dependencies]
   num-bigint = "0.4"

   [dev-dependencies.multiversx-sc-scenario]
   version = "0.58.0"
   ```

4. **Configure o multiversx.json**
   ```json
   {
       "language": "rust"
   }
   ```

5. **Estrutura de Arquivos**
   ```bash
   # Crie a estrutura de diretórios necessária
   mkdir -p src output wallets meta
   ```

## Código Fonte do Contrato

O contrato está implementado em `src/votacao.rs`:

```rust
#![no_std]

use multiversx_sc::imports::*;

#[multiversx_sc::contract]
pub trait VotacaoContract {
    #[init]
    fn init(&self) {
        self.votos_ethereum().set(&BigUint::zero());
        self.votos_bitcoin().set(&BigUint::zero());
    }

    #[endpoint]
    fn votar_ethereum(&self) {
        let caller = self.blockchain().get_caller();
        require!(!self.ja_votou(&caller).get(), "Você já votou");

        let votos = self.votos_ethereum().get();
        self.votos_ethereum().set(&(votos + 1u32));
        self.ja_votou(&caller).set(true);
    }

    #[endpoint]
    fn votar_bitcoin(&self) {
        let caller = self.blockchain().get_caller();
        require!(!self.ja_votou(&caller).get(), "Você já votou");

        let votos = self.votos_bitcoin().get();
        self.votos_bitcoin().set(&(votos + 1u32));
        self.ja_votou(&caller).set(true);
    }

    #[view]
    fn placar(&self) -> (BigUint<Self::Api>, BigUint<Self::Api>) {
        (
            self.votos_ethereum().get(),
            self.votos_bitcoin().get(),
        )
    }

    #[storage_mapper("votos_ethereum")]
    fn votos_ethereum(&self) -> SingleValueMapper<BigUint<Self::Api>>;

    #[storage_mapper("votos_bitcoin")]
    fn votos_bitcoin(&self) -> SingleValueMapper<BigUint<Self::Api>>;

    #[storage_mapper("ja_votou")]
    fn ja_votou(&self, address: &ManagedAddress) -> SingleValueMapper<bool>;
}
```

## Compilação do Contrato

1. **Build do Contrato**
   ```bash
   # Limpe builds anteriores (opcional)
   rm -rf output/*

   # Build do contrato
   mxpy contract build
   ```
   Isso irá gerar:
   - `output/votacao.wasm`: Contrato compilado
   - `output/votacao.abi.json`: Interface do contrato

   > **Verificação**: Após o build, verifique se os arquivos foram gerados corretamente:
   ```bash
   ls -l output/
   ```

## Deploy do Contrato

1. **Verificar Saldo da Carteira**
   ```bash
   # Substitua <endereço> pelo endereço da sua carteira
   mxpy wallet balance <endereço>
   ```
   > **Importante**: Certifique-se de ter EGLD suficiente na testnet para o deploy (aproximadamente 0.05 EGLD)
   > Para obter EGLD de teste, use o [MultiversX Testnet Faucet](https://testnet-wallet.multiversx.com/faucet)

2. **Implantar na Testnet**
   ```bash
   mxpy contract deploy --bytecode=output/votacao.wasm \
                       --recall-nonce \
                       --gas-limit=50000000 \
                       --send \
                       --outfile=deploy-output.json
   ```

3. **Verificar o Deploy**
   - O endereço do contrato será salvo em `deploy-output.json`
   - Contrato atual: `erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv`
   > **Importante**: Guarde este endereço! Ele será necessário para configurar o frontend.

## Testes

O projeto inclui dois tipos de testes:

1. **Testes em Rust** (`tests/votacao_scenario_rs_test.rs`):
   ```rust
   #[test]
   fn test_votacao() {
       let mut b_mock = BlockchainStateWrapper::new();
       let owner_addr = b_mock.create_user_account(&rust_zero!());
       let contract = b_mock.create_sc_account(
           &rust_zero!(),
           Some(&owner_addr),
           rust_zero!(),
           "file:output/votacao.wasm",
       );
       // ... resto do teste
   }
   ```

2. **Testes em Go** (`tests/votacao_scenario_go_test.rs`):
   ```go
   func TestVotacao(t *testing.T) {
       // Configuração do teste
   }
   ```

3. **Cenários de Teste** (`scenarios/votacao.scen.json`):
   ```json
   {
     "name": "Votação Básica",
     "steps": [
       {
         "step": "setState",
         "comment": "Estado inicial"
       }
       // ... resto do cenário
     ]
   }
   ```

Para executar os testes:
```bash
# Testes unitários
cargo test

# Testes de cenário
mxpy contract test
```

## Interagindo com o Contrato

### Consultar o Placar

```bash
mxpy contract query erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv \
                    --function="placar"
```

O resultado será retornado como dois números inteiros (u32) em little-endian, representando os votos de Ethereum e Bitcoin respectivamente.

**Exemplo de resultado e interpretação**:
```bash
["0000000100000000"]
# Interpretação:
# - Primeiros 4 bytes: votos Ethereum (1)
# - Últimos 4 bytes: votos Bitcoin (0)
# Formato: little-endian (bytes menos significativos primeiro)
```

### Enviar Voto

1. **Votar em Ethereum**
   ```bash
   mxpy contract call erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv \
                     --function="votar_ethereum" \
                     --recall-nonce \
                     --gas-limit=7000000 \
                     --send
   ```

2. **Votar em Bitcoin**
   ```bash
   mxpy contract call erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv \
                     --function="votar_bitcoin" \
                     --recall-nonce \
                     --gas-limit=7000000 \
                     --send
   ```

## Boas Práticas de Segurança

1. **Chaves Privadas**
   - Nunca compartilhe seu arquivo .pem
   - Mantenha backups seguros das chaves
   - Use diferentes carteiras para desenvolvimento e produção
   - Considere usar um gerenciador de segredos

2. **Deploy**
   - Sempre teste em testnet antes de mainnet
   - Verifique o código fonte antes do deploy
   - Use gas limits apropriados
   - Mantenha um registro dos deploys

3. **Desenvolvimento**
   - Siga as melhores práticas de Rust
   - Use testes unitários e de integração
   - Documente o código
   - Mantenha as dependências atualizadas

## Debugging e Logging

1. **Habilitar Logs Detalhados**
   ```bash
   # Durante o deploy
   mxpy contract deploy --bytecode=output/votacao.wasm \
                       --recall-nonce \
                       --gas-limit=50000000 \
                       --send \
                       --outfile=deploy-output.json \
                       --verbose

   # Durante chamadas ao contrato
   mxpy contract call <endereço-contrato> \
                     --function="votar_ethereum" \
                     --recall-nonce \
                     --gas-limit=7000000 \
                     --send \
                     --verbose
   ```

2. **Verificar Transações**
   ```bash
   # Substitua <tx-hash> pelo hash da transação
   mxpy tx get <tx-hash>
   ```

## Troubleshooting

### Problemas Comuns

1. **Erro de Compilação**
   ```bash
   error: failed to run custom build command for `multiversx-sc`
   ```
   Solução: 
   - Verifique se está usando a versão correta do Rust nightly
   - Execute `rustup update`
   - Limpe o cache: `cargo clean`

2. **Erro no Deploy**
   ```bash
   Error: insufficient funds
   ```
   Solução: 
   - Obtenha mais EGLD de teste no faucet
   - Verifique o saldo: `mxpy wallet balance <endereço>`

3. **Erro na Query**
   ```bash
   Error: invalid contract address
   ```
   Solução: 
   - Verifique se o endereço do contrato está correto
   - Confirme se o contrato foi deployado com sucesso
   - Verifique a rede (testnet/mainnet)

4. **Erro de Permissão**
   ```bash
   Error: permission denied
   ```
   Solução: 
   - Verifique se está usando a carteira correta
   - Confirme se tem permissões suficientes
   - Verifique se a chave privada está correta

## Integração com Frontend

### Exemplo de Chamada à API
```javascript
// Exemplo de como chamar o contrato do frontend
const contract = new Contract(
    "erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv",
    abi,
    provider
);

// Consultar placar
const placar = await contract.methods.placar().call();

// Enviar voto
const tx = await contract.methods.votar_ethereum().send();
```

## Licença e Autoria

Este projeto foi desenvolvido como parte do programa educacional **Learn2Earn NearX**, focado em ensinar desenvolvimento de smart contracts na blockchain MultiversX.

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do [Discord do MultiversX](https://discord.gg/multiversx).

---

Agora que o backend está pronto e funcional, explore a integração com o frontend e experimente votar diretamente na blockchain MultiversX!

## CI/CD

### GitHub Actions
Crie um arquivo `.github/workflows/ci.yml` com o seguinte conteúdo:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: nightly-2024-02-15
        override: true
    
    - name: Install mxpy
      run: |
        pip install multiversx-sdk-cli==11.0.0
    
    - name: Build
      run: |
        mxpy contract build
    
    - name: Test
      run: |
        cargo test
        mxpy contract test
```

### Deploy Automatizado
Para automatizar o deploy, adicione ao workflow:

```yaml
    - name: Deploy to Testnet
      if: github.ref == 'refs/heads/main'
      env:
        PEM_FILE: ${{ secrets.PEM_FILE }}
      run: |
        echo "$PEM_FILE" > deploy.pem
        mxpy contract deploy --bytecode=output/votacao.wasm \
                            --recall-nonce \
                            --gas-limit=50000000 \
                            --send \
                            --outfile=deploy-output.json
```

## Monitoramento e Manutenção

### Logs e Eventos
Para monitorar o contrato em produção:

1. **Verificar Transações**:
   ```bash
   # Verificar uma transação específica
   mxpy tx get <tx-hash> --verbose
   
   # Verificar todas as transações do contrato
   mxpy contract query <endereço-contrato> --function="getAllTransactions"
   ```

2. **Monitorar Eventos**:
   ```bash
   # Verificar eventos do contrato
   mxpy contract query <endereço-contrato> --function="getEvents"
   ```

### Manutenção Regular

1. **Backup**:
   - Faça backup regular das chaves privadas
   - Mantenha um registro dos deploys
   - Documente todas as alterações

2. **Atualizações**:
   - Mantenha o Rust e mxpy atualizados
   - Verifique regularmente por atualizações de segurança
   - Teste atualizações em testnet antes de mainnet

3. **Monitoramento de Recursos**:
   - Verifique o uso de gas
   - Monitore o saldo do contrato
   - Verifique o número de transações

## Glossário

- **EGLD**: Moeda nativa da MultiversX
- **WASM**: WebAssembly, formato de bytecode usado para smart contracts
- **ABI**: Application Binary Interface, interface do contrato
- **Gas**: Unidade de computação na blockchain
- **Testnet**: Rede de teste da MultiversX
- **Mainnet**: Rede principal da MultiversX

## Recursos Adicionais

- [Documentação MultiversX](https://docs.multiversx.com)
- [Rust Book](https://doc.rust-lang.org/book/)
- [MultiversX Explorer](https://explorer.multiversx.com)
- [MultiversX Testnet Faucet](https://testnet-wallet.multiversx.com/faucet)

## FAQ

1. **Como obter EGLD para testes?**
   - Use o faucet da testnet: https://testnet-wallet.multiversx.com/faucet

2. **Como atualizar o contrato?**
   - Faça as alterações no código
   - Compile: `mxpy contract build`
   - Deploy: `mxpy contract upgrade <endereço-contrato> --bytecode=output/votacao.wasm`

3. **Como verificar o saldo do contrato?**
   ```bash
   mxpy wallet balance <endereço-contrato>
   ```

4. **Como resolver erros de compilação?**
   - Verifique a versão do Rust: `rustup show`
   - Limpe o cache: `cargo clean`
   - Atualize as dependências: `cargo update` 
