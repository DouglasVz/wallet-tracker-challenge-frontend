'use client';
import { Box, Typography, Button, Stack } from '@mui/material';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import TokenSummary from '@/components/tokens/TokenSummary';
import TokenTransactions from '@/components/tokens/TokenTransactions';
import { useState } from 'react';
import TokenTransferModal from '@/components/tokens/TokenTransferModal';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export default function TokenPage() {
    const [openTransfer,setOpenTransfer] = useState<boolean>(false);

    return (
        <AuthGuard>
        <DashboardLayout>
            <Box >
                <Box sx={{display:'flex', justifyContent:'space-between', mb:2}}>
                    <Typography variant="h5" >
                        Token Details
                    </Typography>
                    <Button startIcon={<ArrowOutwardIcon />} variant='contained' color='success' onClick={() => setOpenTransfer(true)}>
                        Transfer
                    </Button>
                </Box>
                <Stack spacing={2}>
                    <TokenSummary />
                    <TokenTransactions />
                </Stack>
                {
                    openTransfer &&
                    <TokenTransferModal open={openTransfer} onClose={() => setOpenTransfer(false)}/>
                }
            </Box>
        </DashboardLayout>
        </AuthGuard>
    );
}
