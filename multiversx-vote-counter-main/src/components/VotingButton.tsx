
import React from 'react';
import { Bitcoin, Vote } from 'lucide-react';

interface VotingButtonProps {
  option: 'ethereum' | 'bitcoin';
  votes: number;
  onClick: () => void;
  disabled: boolean;
  isVoting: boolean;
}

const VotingButton: React.FC<VotingButtonProps> = ({
  option,
  votes,
  onClick,
  disabled,
  isVoting
}) => {
  const isEthereum = option === 'ethereum';
  
  const buttonClass = `
    relative overflow-hidden group
    w-full max-w-sm mx-auto p-8 rounded-2xl
    font-bold text-xl text-white
    transition-all duration-300 transform
    hover:scale-105 hover:shadow-2xl
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${isEthereum 
      ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
      : 'bg-gradient-to-br from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
    }
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      
      <div className="relative flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-3">
          {isEthereum ? (
            <Vote size={32} />
          ) : (
            <Bitcoin size={32} />
          )}
          <span>Votar {isEthereum ? 'Ethereum' : 'Bitcoin'}</span>
        </div>
        
        <div className="text-3xl font-bold">
          {votes} votos
        </div>
        
        {isVoting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </button>
  );
};

export default VotingButton;
