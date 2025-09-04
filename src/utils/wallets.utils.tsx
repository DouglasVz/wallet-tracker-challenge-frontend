export const truncateAddress = (address: string, start = 6, end = 4) => {
    if (!address) return '';
    return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const getNetworkName = (chainId: string) => {
    switch (chainId) {
        case '0x1':
        return 'Ethereum Mainnet';
        case '0x5':
        return 'Goerli Testnet';
        case '0xaa36a7':
        return 'Sepolia Testnet';
        case '0x3':
        return 'Ropsten Testnet';
        case '0x4':
        return 'Rinkeby Testnet';
        case '0x2a':
        return 'Kovan Testnet';
        // Add more networks as needed
        default:
        return `Unknown (${chainId})`;
    }
};