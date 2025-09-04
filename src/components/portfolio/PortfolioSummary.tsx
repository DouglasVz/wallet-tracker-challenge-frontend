'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Stack, TextField } from '@mui/material';
import { apiRequest } from '@/api/apiRequest';
import useWallet from '@/hooks/useWallet';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function PortfolioSummary() {
    const [summary, setSummary] = useState({
        totalValue: '0',
        walletCount: 0,
        // tokenCount: 0,
    });
    const [ethPrice, setEthPrice] = useState(0.00)
    const {walletAddress, networkName, contractAddress} = useWallet();
    const [ethHistory, setEthHistory] = useState<[Number, number][]>([]);
    const [alert, setAlert] = useState<null | string>(null);

    async function getEthHistory() {
    try {
        const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7'
        );
        const data = await res.json();
        setEthHistory(data.prices);
    } catch (err) {
        console.error('Failed to fetch ETH history', err);
    }
    }

    const ethChartData = {
        labels: ethHistory.map(([timestamp]) => new Date(timestamp).toLocaleDateString()),
        datasets: [
            {
            label: 'ETH Price (USD)',
            data: ethHistory.map(([_, price]) => price),
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
            },
        ],
    };

     const mockBalanceData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
            label: 'Wallet Balance (USDC)',
            data: [0.0, 0.6, 0.55, 5, 0.65, 2, parseInt(summary.totalValue)],
            borderColor: '#673ab7',
            fill: false,
            },
        ],
    };


    async function getEthPrice() {
        try {
            const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
            );
            const data = await response.json();
            const ethPrice = data.ethereum.usd;
            
            setEthPrice(ethPrice)
            return ethPrice;
        } catch (error) {
            console.error("Error fetching ETH price:", error);
            return null;
        }
        
    }

    useEffect(() => {
        if (!walletAddress || !contractAddress) {
            setAlert('Contract and Wallet Address are required to navigato on this app.')
            return
        }
        const fetchData = async () => {
        const walletsTransactions = await apiRequest('GET', `/portfolio/wallets/${walletAddress?.id}/transactions?contract_address=${contractAddress}`);
        const Balance = await apiRequest('GET', `/portfolio/wallets/${walletAddress?.id}/balance?contract_address=${contractAddress}`);

        const totalValue = Balance.data?.balance + " " + Balance?.data.symbol || '0';
        const walletCount = walletsTransactions.data?.length || 0;
        // const tokenCount = walletsRes.data?.reduce((acc, w) => acc + w.tokens.length, 0);
        
        setSummary({ totalValue, walletCount });
        };
        fetchData();
        getEthPrice();
        getEthHistory();
    }, [walletAddress, contractAddress]);

    return (
        <Stack spacing={3}>
            <Box>
                <Typography>Wallet Address:</Typography>
                <TextField
                    slotProps={{input: {sx:{bgcolor:theme => theme.palette.background.default}}}}
                    fullWidth
                    value={walletAddress?.address}
                />
            </Box>
            <Grid container spacing={2} mb={3}>
                <Grid  size={{xs:12,md:4}}>
                    <Paper elevation={0} variant='outlined' sx={{ p: 2 }}>
                        <Typography variant="subtitle2">{networkName}</Typography>
                        <Typography variant="h6">${ethPrice} USD</Typography>
                    </Paper>
                </Grid>
                {[
                    { label: 'Balance', value: `$${summary.totalValue}` },
                    { label: 'Wallet Transactions', value: summary.walletCount },
                    // { label: 'Tokens Tracked', value: summary.tokenCount },
                ].map((item) => (
                    <Grid  size={{xs:12,md:4}} key={item.label}>
                        <Paper elevation={0} variant='outlined' sx={{ p: 2 }}>
                            <Typography variant="subtitle2">{item.label}</Typography>
                            <Typography variant="h6">{item.value}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12, md:6}}>
                    <Paper elevation={0} variant='outlined' sx={{ p: 2 }}>
                    <Typography variant="subtitle2">ETH Price (Last 7 Days)</Typography>
                    <Line data={ethChartData} />
                    </Paper>
                </Grid>
                <Grid size={{xs:12, md:6}}>
                    <Paper elevation={0} variant='outlined' sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Wallet Balance Trend</Typography>
                    <Line data={mockBalanceData} />
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}
