'use client';

import useWallet from '@/hooks/useWallet';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert
} from '@mui/material';
import { useState } from 'react';

const erc20Abi = [
    'function transfer(address to, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address account) view returns (uint256)',
];

export default function TokenTransferModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const {contractAddress} = useWallet();

    const handleTransfer = async () => {
        if (!contractAddress){
            setError('A Contract Address is required.');
            return;
        }
        try {
            setLoading(true);
            const { ethers } = await import('ethers');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(contractAddress, erc20Abi, signer);

            // Validate recipient address
            if (!ethers.isAddress(recipient)) {
                setError('Invalid recipient address.');
                return;
            }

            // Validate amount
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                setError('Please enter a valid amount greater than zero.');
                return;
            }
            const decimals = await contract.decimals();
            const amountInWei = ethers.parseUnits(amount, decimals);

            const senderAddress = await signer.getAddress();
            const balance = await contract.balanceOf(senderAddress);
            if (amountInWei > balance) {
                setError('Insufficient token balance.');
            }

            const tx = await contract.transfer(recipient, amountInWei, {gasLimit: 100000});
            
            await tx.wait();
            setSuccess('Transfer successful!');
        } catch (err: any) {
            console.log(err);
            // Handle common errors
            if (err.code === 'CALL_EXCEPTION') {
                setError('Transaction reverted by contract. Please check your balance, recipient address, and token restrictions.');
            } else if (err.code === 'INSUFFICIENT_FUNDS') {
                setError('Insufficient ETH for gas fees.');
            } else if (err.message?.includes('user rejected transaction')) {
                setError('Transaction was rejected.');
            } else if (err.message?.includes('invalid address')) {
                setError('Recipient address is invalid.');
            } else {
                setError('The transfer attempt was unsuccessful. No funds were moved.');
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Transfer Tokens</DialogTitle>
        <DialogContent>
            <Stack spacing={2} mt={1}>
                <TextField
                    label="Recipient Wallet Address"
                    fullWidth
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <TextField
                    label="Amount"
                    fullWidth
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
                {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleTransfer} variant="contained" color='success' disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
            </Button>
        </DialogActions>
    </Dialog>
  );
}
