import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DappProvider } from '@multiversx/sdk-dapp/wrappers'
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types'

const customNetworkConfig = {
  name: "local",
  walletConnectV2ProjectId: "ec1a30b19fdc9e8bd1a4aadfd17d2038",
  apiTimeout: 5000,
  network: {
    id: "T",
    name: "Testnet",
    egldLabel: "xEGLD",
    decimals: "18",
    digits: "4",
    gasPerDataByte: "1500",
    walletConnectDeepLink: "https://xportal.com/",
    walletAddress: "https://testnet-wallet.multiversx.com",
    apiAddress: "https://testnet-api.multiversx.com",
    explorerAddress: "https://testnet-explorer.multiversx.com",
  }
};

createRoot(document.getElementById("root")!).render(
  <DappProvider environment={EnvironmentsEnum.testnet} customNetworkConfig={customNetworkConfig}>
    <App />
  </DappProvider>
);
