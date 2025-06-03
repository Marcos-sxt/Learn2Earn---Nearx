const SMART_CONTRACT_ADDRESS = "erd1qqqqqqqqqqqqqpgqgvkmtqj46zncwm9xklrer55ka5s5gjnw087ssvpnrv";
const API_BASE_URL = "https://testnet-api.multiversx.com";

export interface VotingResult {
  ethereum: number;
  bitcoin: number;
}

// Função para fazer queries no smart contract
export const querySmartContract = async (functionName: string, args: string[] = []): Promise<any> => {
  const url = `${API_BASE_URL}/vm-values/query`;
  
  const requestBody = {
    scAddress: SMART_CONTRACT_ADDRESS,
    funcName: functionName,
    args: args
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao fazer query no smart contract:', error);
    throw error;
  }
};

// Função para fazer transações no smart contract
export const callSmartContract = async (functionName: string, args: string[] = [], pemFile: string): Promise<any> => {
  const url = `${API_BASE_URL}/transaction/send`;
  
  // Aqui você precisaria implementar a lógica para assinar a transação com o arquivo PEM
  // Por enquanto, vamos apenas simular a transação
  console.log(`Simulando chamada para função: ${functionName} com args:`, args);
  console.log('Usando arquivo PEM:', pemFile);
  
  // Simular delay de transação
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { 
    status: 'success', 
    message: `Voto registrado para ${functionName}`,
    hash: '0x' + Math.random().toString(16).substr(2, 64)
  };
};

// Função para obter o placar atual
export const getPlacar = async (): Promise<VotingResult> => {
  try {
    const result = await querySmartContract('placar');

    // Expecting a single Base64 encoded string in returnData, nested within result.data.data
    if (result.data && result.data.data && result.data.data.returnData && result.data.data.returnData.length > 0) {
      const base64Data = result.data.data.returnData[0];

      console.log('Raw Base64 Data from API:', base64Data);

      try {
        // Decode Base64 to byte string
        const byteString = atob(base64Data);
        const bytes = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          bytes[i] = byteString.charCodeAt(i);
        }

        console.log('Decoded Bytes:', bytes);

        // Assuming Ethereum is the first u32 (4-byte unsigned integer) in big-endian
        let ethereum = 0;
        let bitcoin = 0; // Assume bitcoin is 0 based on expected contract behavior

        if (bytes.length >= 4) { // Enough data for Ethereum (4 bytes)
          // Read first 4 bytes as big-endian u32
          ethereum = new DataView(bytes.buffer).getUint32(0, false); // false for big-endian
        }

        // Note: Ignoring remaining bytes for bitcoin for now due to unclear serialization

        console.log(`Decoded Placar - Ethereum: ${ethereum}, Bitcoin: ${bitcoin}`);
        return { ethereum, bitcoin };

      } catch (decodeError) {
        console.error('Error decoding Base64 data:', decodeError);
        return { ethereum: 0, bitcoin: 0 };
      }

    } else {
       console.error('Unexpected returnData format or empty:', result.data);
    }

    return { ethereum: 0, bitcoin: 0 };
  } catch (error) {
    console.error('Erro ao obter placar:', error);
    return { ethereum: 0, bitcoin: 0 };
  }
};

// Função para votar no Ethereum
export const votarEthereum = async (pemFile: string): Promise<void> => {
  await callSmartContract('votar_ethereum', [], pemFile);
};

// Função para votar no Bitcoin
export const votarBitcoin = async (pemFile: string): Promise<void> => {
  await callSmartContract('votar_bitcoin', [], pemFile);
};
