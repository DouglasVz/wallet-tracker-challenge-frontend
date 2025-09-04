'use client';

import { Box, Typography, IconButton, Button, Tooltip, useMediaQuery, Chip, TextField, InputAdornment, Snackbar, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from '@/hooks/useAuth';
import { truncateAddress } from '@/utils/wallets.utils';
import useWallet from '@/hooks/useWallet';
import WalletIcon from '@mui/icons-material/Wallet';
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from 'react';

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const [contract, setContract] = useState<null | string>(null)
    const { logout } = useAuth();
    const {walletAddress, isConnected, networkName, contractAddress, onSetContractAddress} = useWallet();
    const isMobile = useMediaQuery('(max-width:900px)');

    useEffect(() => {
       setContract(contractAddress) 
    },[contractAddress])

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={4}
            px={3}
            py={2}
            bgcolor="grey.200"
            ml={{md:'270px', xs: 0,borderBottom:"solid 1px #d8d8d8"}}
        >
            <Box display="flex" alignItems="center" flex={1} gap={2}>
                {
                    isMobile &&
                    <IconButton onClick={onToggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                }
                {
                    isConnected && walletAddress?.address && !isMobile &&
                    <Box sx={{width:'85%', maxWidth:"800px",display:'flex', gap:1, alignItems:'center'}}>
                        <Tooltip title={walletAddress.address}>
                        
                            <Box >
                                <Box 
                                    sx={{border:"3px solid #ffffff", borderRadius:"10px", mb:0.5, p:1, display:"flex", gap: 2}}
                                >
                                    <Box sx={{display: "flex", gap:0.5}}>
                                        <WalletIcon />
                                        <Typography>{ truncateAddress(walletAddress.address)}</Typography>
                                    </Box>
                                    
                                    <Chip 
                                        size='small' 
                                        sx={{bgcolor: "#a1afffff", p:"2px"}}
                                        label={
                                            <Typography 
                                                variant='caption' 
                                                color='#1b3cfbfd' 
                                                fontSize="10.5px"
                                                fontWeight="bolder"
                                            >
                                                {networkName}
                                            </Typography> 
                                        }
                                    />
                                </Box>
                            </Box>
                        </Tooltip>

                            <TextField 
                                fullWidth
                                slotProps={{input: {
                                    sx: {bgcolor: theme => theme.palette.background.default},
                                    endAdornment: <InputAdornment position='end'>
                                        <Button size='small' variant='outlined' onClick={() => {
                                            onSetContractAddress(contract);
                                        }}>Set</Button>
                                    </InputAdornment>
                                }}}
                                label="Contract Address"
                                size='small'
                                value={contract}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setContract(value)
                                }}
                                error={!contractAddress}
                            />

                    </Box>
                }
            </Box>
            
            <Box display="flex" alignItems="center" gap={2}>
                <Button startIcon={<LogoutIcon />} color='error' variant="outlined" onClick={logout}>
                    Logout
                </Button>
            </Box>
        </Box>
    );
}
