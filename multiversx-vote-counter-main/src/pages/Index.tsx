
import React from 'react';
import { useVoting } from '../hooks/useVoting';
import VotingButton from '../components/VotingButton';
import VotingResults from '../components/VotingResults';

const Index = () => {
  const { placar, loading, voting, error, vote, refreshPlacar } = useVoting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Votação Crypto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha sua criptomoeda favorita! Conectado à testnet MultiversX para votação descentralizada.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Voting Results */}
        <div className="mb-12">
          <VotingResults placar={placar} loading={loading} />
        </div>

        {/* Voting Buttons */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          <VotingButton
            option="ethereum"
            votes={placar.ethereum}
            onClick={() => vote('ethereum')}
            disabled={voting || loading}
            isVoting={voting}
          />
          <VotingButton
            option="bitcoin"
            votes={placar.bitcoin}
            onClick={() => vote('bitcoin')}
            disabled={voting || loading}
            isVoting={voting}
          />
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={refreshPlacar}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Atualizando...' : 'Atualizar Placar'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Smart Contract: erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv
          </p>
          <p className="text-sm">
            Rede: MultiversX Testnet
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
