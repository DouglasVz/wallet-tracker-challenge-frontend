'use client';

import { createContext, useEffect, useState } from 'react';
import { apiRequest } from '@/api/apiRequest';
import useAuth from '@/hooks/useAuth';
import { getNetworkName } from '@/utils/wallets.utils';

type WalletContextType = {
    walletAddress: {id:string, name:string, address:string} | null;
    contractAddress: string | null;
    networkName: string | null;
    isConnected: boolean;
    isNotLoggedMeta: boolean;
    unAuthorizedWallet: boolean;
    onSetContractAddress: (contractAddress: string) => boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
	const [walletAddress, setWalletAddress] = useState<{id:string, name:string, address:string, networkName?: string} | null>(null);
	const [contractAddress, setcontractAddress] = useState<string | null>(null);
	const [networkName, setNetworkName] = useState<string | null>(null);
	const [unAuthorizedWallet, setUnauthorizedWallet] = useState<boolean>(false);
	const [isNotLoggedMeta, setIsNotLoggedMeta] = useState(false);
	const {isAuthenticated} = useAuth();

	const getWalletNetwork = async () => {
		if (window.ethereum) {
			const chainId = await window.ethereum.request({ method: 'eth_chainId' });
			return getNetworkName(chainId);
		}
		return null;
	};

	const connectWallet = async () => {
		try {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			const address = accounts[0];
			
			const _networkName = await getWalletNetwork();
			setNetworkName(_networkName);

			const res = await apiRequest('POST', '/portfolio/wallets', {
				address
			});

			if (!res.error) {
				setUnauthorizedWallet(false)
				setWalletAddress(res.data);
				localStorage.setItem('wallet', JSON.stringify(res.data));
			}else {
				const res = await apiRequest('GET', `/portfolio/wallets/${address}`);
				if (!res.error) {
					setUnauthorizedWallet(false)
					setWalletAddress(res.data);
					localStorage.setItem('wallet', JSON.stringify(res.data));
				}else if (res.status === 403) {
					setUnauthorizedWallet(true)
				}
			}
			
		} catch (err) {
			setIsNotLoggedMeta(true)
			console.error('Wallet connection failed:', err);
		}
	};

	const disconnectWallet = () => {
		setWalletAddress(null);
		localStorage.removeItem('wallet');
	};

	const onSetContractAddress = (contractAddress: string | null) => {
		setcontractAddress(contractAddress)
		localStorage.setItem('contract', contractAddress || '');
		return true
	}

	useEffect(() => {
		if (!isAuthenticated) return
		const fetchData = async () => {
		const stored = localStorage.getItem('wallet');
		if (stored) {
			const address = JSON.parse(stored).address;
			const res = await apiRequest('GET', `/portfolio/wallets/${address}`);
			if (!res.error) {
				setUnauthorizedWallet(false)
				setWalletAddress(res.data);
				localStorage.setItem('wallet', JSON.stringify(res.data));
				
			}else if (res.status === 403) {
				setUnauthorizedWallet(true)
			}
		}
		};
		fetchData();
		connectWallet();
		const cachedContractAddr = localStorage.getItem("contract");
		const contractAddr = cachedContractAddr ? cachedContractAddr : process.env.NEXT_PUBLIC_ERC20_TOKEN_ADDRESS || ''
		onSetContractAddress(contractAddr)
    	// Listen for Metamask account changes
    	if (window.ethereum) {
      
			const handleAccountsChanged = async (accounts: string[]) => {
				if (accounts.length > 0) {
					// Connect to the new wallet
					setIsNotLoggedMeta(false);
					const address = accounts[0];
					const _networkName = await getWalletNetwork();
					setNetworkName(_networkName);

					const res = await apiRequest('POST', '/portfolio/wallets', {
						address
					});
					if (!res.error) {
						setUnauthorizedWallet(false)
						setWalletAddress(res.data);
						localStorage.setItem('wallet', JSON.stringify(res.data));
					} else {
						const res = await apiRequest('GET', `/portfolio/wallets/${address}`);
						if (!res.error) {
							setUnauthorizedWallet(false)
							setWalletAddress(res.data);
							localStorage.setItem('wallet', JSON.stringify(res.data));
						}else if (res.status === 403) {
							setUnauthorizedWallet(true)
						}
					}
				} else {
					setWalletAddress(null);
					localStorage.removeItem('wallet');
				}
			};
			window.ethereum.on('accountsChanged', handleAccountsChanged);
			return () => {
				window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
			};
    	}
    
  	}, [isAuthenticated]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
		contractAddress,
		networkName,
		isNotLoggedMeta,
        isConnected: !!walletAddress,
		unAuthorizedWallet,
		onSetContractAddress,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export {WalletContext, WalletProvider}