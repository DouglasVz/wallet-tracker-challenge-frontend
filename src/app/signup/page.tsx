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
import GuestGuard from '@/components/guards/GuestGuard';
import useAuth from '@/hooks/useAuth';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [responseError, setResponseError] = useState('');
    const {signup} = useAuth();

    const validateEmail = (value: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const handleRegister = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let valid = true;

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            valid = false;
        }

        if (!valid) return;

        const res = await signup(email, password);
        if (res?.error) {
            setResponseError(res.message)
        }
    };

    return (
        <GuestGuard>
            <AuthLayout>
                <Typography variant="h4" gutterBottom>
                Sign Up
                </Typography>
                <Card elevation={3} sx={{ width: '100%', padding: 2 }}>
                    <CardContent>
                    <Typography variant="h5" align="center" sx={{mb:3}} gutterBottom>
                        Create Your Account
                    </Typography>
                    
                        <form onSubmit={handleRegister}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) setEmailError('');
                                    }}
                                    error={!!emailError}
                                    helperText={emailError}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (passwordError) setPasswordError('');
                                    }}
                                />
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (passwordError) setPasswordError('');
                                    }}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                />
                                {
                                    responseError &&
                                    <Alert severity='error' onClose={() => {setResponseError('')}}>
                                        {responseError}
                                    </Alert>
                                }
                                <Button variant="contained" color="primary" type='submit' onClick={handleRegister}>
                                    Sign Up
                                </Button>
                                <Button variant="text" onClick={() => router.push('/login')}>
                                    Already have an account? Log In
                                </Button>
                            </Stack>
                        </form>
                    
                    </CardContent>
                </Card>
            </AuthLayout>
        </GuestGuard>
    );
}
