# Frontend do Sistema de Votação MultiversX

Este é o frontend do sistema de votação desenvolvido para a blockchain MultiversX. O projeto permite que usuários votem entre Ethereum e Bitcoin através de uma interface web moderna e responsiva.

## Exemplo do projeto em questao
🔗 [Acesse o projeto online]([https://seu-link.vercel.app](https://learn2-earn-nearx.vercel.app/)) – deploy na testnet MultiversX


## Tecnologias Utilizadas

- **Framework**: React + Vite
- **Linguagem**: TypeScript
- **UI Components**: shadcn-ui
- **Estilização**: Tailwind CSS
- **Blockchain**: MultiversX SDK

## Pré-requisitos

- Node.js 18+ (recomendado usar nvm)
- npm ou yarn
- Carteira MultiversX (xPortal ou Web Wallet)


## Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
├── hooks/         # Custom hooks
├── lib/           # Utilitários e configurações
├── pages/         # Páginas da aplicação
├── services/      # Serviços e integrações
└── App.tsx        # Componente principal
```

## Integração com o Smart Contract (MultiversX)

Este tutorial explica como o frontend se integra com o smart contract de votação na MultiversX.

### Configuração do DappProvider

O DappProvider é configurado no arquivo principal da aplicação (`main.tsx`) com as configurações da testnet:

```typescript
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { customNetworkConfig } from './config';

const App = () => {
  return (
    <DappProvider
      environment={EnvironmentsEnum.testnet}
      customNetworkConfig={customNetworkConfig}
    >
      {/* ... resto da aplicação ... */}
    </DappProvider>
  );
};
```

### Componentes do SDK MultiversX

Os componentes necessários do SDK são importados no `App.tsx`:

```typescript
import {
  SignTransactionsModals,
  TransactionsToastList
} from '@multiversx/sdk-dapp/UI';

// ... dentro do componente App
<SignTransactionsModals />
<TransactionsToastList />
```

### Conexão com a Carteira

Para obter informações da carteira conectada, utilize o hook `useGetAccountInfo`:

```typescript
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

const YourComponent = () => {
  const { address } = useGetAccountInfo();
  
  return (
    <div>
      Carteira conectada: {address}
    </div>
  );
};
```

### Envio de Votos

Para enviar um voto, construa uma transação usando o SDK:

```typescript
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { ContractFunction, SmartContract, Address } from '@multiversx/sdk-core';

const sendVote = async (voteType: 'ethereum' | 'bitcoin') => {
  const provider = new ProxyNetworkProvider('https://testnet-api.multiversx.com');
  const contract = new SmartContract({
    address: new Address('erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv'),
    abi: contractAbi
  });

  const transaction = contract.methods
    .execute({
      function: new ContractFunction(`votar_${voteType}`),
      value: 0
    })
    .withGasLimit(7000000)
    .withChainID('T');

  await sendTransactions({
    transactions: [transaction],
    callbackRoute: '/'
  });
};
```

### Consulta do Placar

Para consultar o placar, faça uma chamada ao endpoint de query:

```typescript
const fetchPlacar = async () => {
  const response = await fetch(
    'https://testnet-api.multiversx.com/vm-values/query',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scAddress: 'erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv',
        funcName: 'placar',
        args: []
      })
    }
  );

  const data = await response.json();
  const bytes = Buffer.from(data.data, 'base64');
  const view = new DataView(bytes.buffer);
  
  // Decodifica os valores em little-endian
  const votosEthereum = view.getUint32(0, true);
  const votosBitcoin = view.getUint32(4, true);

  return { votosEthereum, votosBitcoin };
};
```

### Endereço do Contrato

O endereço do contrato está definido como uma constante no arquivo de configuração:

```typescript
// config.ts
export const CONTRACT_ADDRESS = 'erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv';
```

> **Nota**: O endereço do contrato pode ser atualizado conforme necessário. O endereço atual foi obtido do arquivo `deploy-output.json` após o deploy do contrato na testnet.

## Deploy

Para fazer o deploy do frontend:

1. Configure as variáveis de ambiente necessárias
2. Execute o build de produção:
   ```bash
   npm run build
   ```
3. O diretório `dist` conterá os arquivos otimizados para produção
4. Faça o deploy para seu serviço de hospedagem preferido (Vercel, Netlify, etc.)

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do [Discord do MultiversX](https://discord.gg/multiversx).





