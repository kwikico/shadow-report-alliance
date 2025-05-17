
import { toast } from "sonner";

interface WalletAuth {
  address: string;
  signature: string;
}

export async function connectWallet(): Promise<WalletAuth | null> {
  try {
    // Check if MetaMask or other Ethereum provider is available
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];

        // Request message signing to verify ownership
        const message = `Sign this message to authenticate with ShadowReport: ${Date.now()}`;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address],
        });

        return { address, signature };
      } catch (error) {
        console.error('Error connecting to wallet:', error);
        toast.error('Failed to connect wallet. Please try again.');
        return null;
      }
    } else {
      toast.error('No Ethereum wallet detected. Please install MetaMask or another wallet.');
      return null;
    }
  } catch (error) {
    console.error('Wallet connection error:', error);
    toast.error('An error occurred while connecting to wallet.');
    return null;
  }
}
