'use client';

import useAuth from '@/hooks/useAuth';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Box,
    useMediaQuery,
    Divider,
    Avatar,
    Typography
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import Walletconnection from '../wallets/WalletConnection';

const navItems = [
    { label: 'Overview', path: '/' },
    { label: 'Tokens', path: '/token' },
];

export default function Sidebar({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const {user} = useAuth();
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width:900px)');
    const pathname = usePathname();

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 270,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
        <Box p={2}>
            <Box sx={{display:"flex", justifyContent:'center'}}>
                <Walletconnection />
            </Box>
            <Divider/>
            <List>
                {navItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        onClick={() => {
                            router.push(item.path);
                            if (isMobile) onClose();
                        }}
                        selected={pathname === item.path}
                        sx={{
                            bgcolor: pathname === item.path ? 'action.selected' : undefined,
                        }}
                    >
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
        <Box>
            <Divider/>
            <Box p={2} display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#000', color: 'white' }}>
                    {user?.email?.charAt(0).toUpperCase() || '?'}
                </Avatar>
                <Typography variant="caption" noWrap>
                    {user?.email}
                </Typography>
            </Box>
        </Box>
        </Drawer>
    );
}
