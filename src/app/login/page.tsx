'use client';

import { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import AuthLayout from '@/components/AuthLayout';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import GuestGuard from '@/components/guards/GuestGuard';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fieldError, setFieldError] = useState<string>('');
    const [responseError, setResponseError] = useState<string>('');
    const {login} = useAuth();

    const validateEmail = (value: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validateEmail(email)) {
            setFieldError('Please enter a valid email address');
            return;
        }
        const res = await login(email, password);
        if (res?.error) {
            setResponseError(res.message)
        }
    };

    return (
        <GuestGuard>
        <AuthLayout>
            <Typography variant="h4" gutterBottom>
            Welcome Back
            </Typography>
            <Card elevation={3} sx={{ width: '100%', padding: 2 }}>
                <CardContent>
                <Typography variant="h5" align="center" sx={{mb:3}} gutterBottom>
                    Log In to Your Account
                </Typography>
                <form onSubmit={handleLogin}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFieldError('')}
                            error={!!fieldError}
                            helperText={fieldError}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {
                            responseError &&
                            <Alert severity='error' onClose={() => {setResponseError('')}}>
                                {responseError}
                            </Alert>
                        }
                        <Button variant="contained" color="primary" onClick={() => handleLogin()} type="submit">
                            Log In
                        </Button>
                        <Button variant="text" onClick={() => router.push('/signup')}>
                            Don’t have an account? Sign Up
                        </Button>
                    </Stack>
                </form>
                </CardContent>
            </Card>
        </AuthLayout>
        </GuestGuard>
    );
}
