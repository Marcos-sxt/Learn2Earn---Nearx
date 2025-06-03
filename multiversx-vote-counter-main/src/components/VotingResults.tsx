
import React from 'react';
import { VotingResult } from '../services/multiversx';

interface VotingResultsProps {
  placar: VotingResult;
  loading: boolean;
}

const VotingResults: React.FC<VotingResultsProps> = ({ placar, loading }) => {
  const totalVotes = placar.ethereum + placar.bitcoin;
  const ethereumPercentage = totalVotes > 0 ? (placar.ethereum / totalVotes) * 100 : 0;
  const bitcoinPercentage = totalVotes > 0 ? (placar.bitcoin / totalVotes) * 100 : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Resultado da Votação
      </h2>
      
      <div className="space-y-6">
        {/* Ethereum */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-blue-600">Ethereum</span>
            <span className="text-sm text-gray-600">
              {placar.ethereum} votos ({ethereumPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${ethereumPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Bitcoin */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-orange-600">Bitcoin</span>
            <span className="text-sm text-gray-600">
              {placar.bitcoin} votos ({bitcoinPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${bitcoinPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Total de votos: <span className="font-bold text-gray-800">{totalVotes}</span>
        </p>
      </div>
    </div>
  );
};

export default VotingResults;
