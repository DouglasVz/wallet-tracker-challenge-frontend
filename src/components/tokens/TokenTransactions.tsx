'use client';

import { useEffect, useState } from 'react';
import { Box, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { apiRequest } from '@/api/apiRequest';
import useWallet from '@/hooks/useWallet';


export default function TokenTransactions() {
	const [rows, setRows] = useState<any[]>([]);
	const {walletAddress, contractAddress} = useWallet();
	const [loadingData, setLoadingData] = useState<boolean>(false);

	useEffect(() => {
		if (!walletAddress || !contractAddress) return;
		const fetchTransactions = async () => {
			setLoadingData(true)
			const res = await apiRequest('GET', `/portfolio/wallets/${walletAddress?.id}/transactions?contract_address=${contractAddress}`);

			if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
				
				setRows(res.data);
			}else {
				setRows([])
			}
			setLoadingData(false)
		};
		fetchTransactions();
		
	}, [walletAddress]);

	const columns: GridColDef[] = [
		{ field: 'tx_hash', headerName: 'Tx Hash', flex: 2 },
		{ field: 'from_address', headerName: 'From', flex: 2 },
		{ field: 'to_address', headerName: 'To', flex: 2 },
		{ field: 'amount', headerName: 'Amount', flex: 1, align: "right" },
		{ field: 'direction', headerName: 'Direction', flex: 1 },
		{ field: 'created_at', headerName: 'Date', flex: 2, align: "right",
            valueFormatter: (value) => {
                
                if (!value) return '';

                const date = new Date(value);

                const pad = (n: number) => n.toString().padStart(2, '0');

                const MM = pad(date.getMonth() + 1); // Months are 0-indexed
                const DD = pad(date.getDate());
                const YYYY = date.getFullYear();

                const HH = pad(date.getHours());
                const mm = pad(date.getMinutes());
                const ss = pad(date.getSeconds());

                return `${MM}/${DD}/${YYYY} ${HH}:${mm}:${ss}`;
            },
        },
	];

	return (
		<Box sx={{ minHeight: 500, width: '100%' }}>
			{
				rows.length === 0 &&
				<Alert severity="info" sx={{mb:2}}>
					The API returned no data, so mock data is being displayed on the table instead.
				</Alert>
			}
			<DataGrid
				rows={rows }
				columns={columns}
				getRowId={row => row.id}
				initialState={{
					pagination: { paginationModel: { pageSize: 50, page: 0 } },
				}}
				loading={loadingData}
			/>
		</Box>
	);
}
