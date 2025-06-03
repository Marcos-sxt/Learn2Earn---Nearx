import { useState, useEffect, useCallback } from 'react';
import { getPlacar, VotingResult } from '../services/multiversx';
import {
  useGetAccountInfo
} from '@multiversx/sdk-dapp/hooks';
import {
  sendTransactions
} from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import {
  refreshAccount
} from '@multiversx/sdk-dapp/utils/account';
import { Transaction, Address, ContractFunction } from '@multiversx/sdk-core';

// Substitua pelo endereço do seu Smart Contract na Testnet
const SMART_CONTRACT_ADDRESS = "erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv";

export const useVoting = () => {
  const [placar, setPlacar] = useState<VotingResult>({ ethereum: 0, bitcoin: 0 });
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { account } = useGetAccountInfo();

  const fetchPlacar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPlacar();
      setPlacar(result);
    } catch (err) {
      setError('Erro ao carregar o placar');
      console.error('Erro ao buscar placar:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const vote = useCallback(async (option: 'ethereum' | 'bitcoin') => {
    if (!account) {
      setError('Carteira não conectada. Por favor, faça login para votar.');
      console.error('Carteira não conectada');
      return;
    }

    try {
      setVoting(true);
      setError(null);
      
      const functionName = option === 'ethereum' ? 'votar_ethereum' : 'votar_bitcoin';

      const transaction = new Transaction({
        chainID: "T", // Chain ID da Testnet
        sender: new Address(account.address),
        receiver: new Address(SMART_CONTRACT_ADDRESS),
        gasLimit: BigInt(7000000), // Ajuste o gas limit conforme necessário
        data: Buffer.from(new ContractFunction(functionName).toString()),
        value: BigInt(0), // Votos geralmente não enviam EGLD, ajuste se necessário
        nonce: BigInt(account.nonce),
        version: 1, // ou a versão apropriada da transação
      });

      await sendTransactions({
        transactions: [transaction],
        // Opcional: adicionar callbackUrl para redirecionar após a transação
        // callbackUrl: `${window.location.origin}/`, 
      });

      // Atualizar o estado da conta e o placar após o envio da transação
      // A atualização do placar após a transação ser confirmada pode exigir
      // um watcher ou polling mais inteligente, mas por enquanto, atualizamos
      // imediatamente e contamos com o auto-refresh.
      await refreshAccount();
      // fetchPlacar(); // O useEffect já fará o polling

    } catch (err) {
      setError(`Erro ao enviar transação de voto ${option}`);
      console.error('Erro ao votar:', err);
    } finally {
      setVoting(false);
    }
  }, [account]); // Adicionar account como dependência

  useEffect(() => {
    fetchPlacar();
    
    // Auto-refresh do placar a cada 10 segundos
    const interval = setInterval(fetchPlacar, 10000);
    
    return () => clearInterval(interval);
  }, [fetchPlacar]);

  return {
    placar,
    loading,
    voting,
    error,
    vote,
    refreshPlacar: fetchPlacar
  };
};
