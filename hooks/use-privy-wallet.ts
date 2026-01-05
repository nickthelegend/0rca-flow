import { useConnectWallet, useWallets, usePrivy } from "@privy-io/react-auth";

export function usePrivyWallet() {
    const { connectWallet } = useConnectWallet();
    const { wallets } = useWallets();
    const { authenticated, user, login, logout } = usePrivy();

    const activeWallet = wallets?.[0];
    const walletAddress = activeWallet?.address || "";
    const isConnected = !!walletAddress;

    const connect = async () => {
        try {
            if (!authenticated) {
                // connection usually handles login in Privy if configured, but let's stick to simple connectWallet first as requested
                connectWallet({
                    walletList: ["metamask", "wallet_connect", "coinbase_wallet", "rainbow"],
                });
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        }
    };

    const disconnect = async () => {
        if (activeWallet) {
            try {
                await activeWallet.disconnect();
            } catch (error) {
                console.error("Failed to disconnect wallet:", error);
            }
        }

        if (authenticated) {
            try {
                await logout();
            } catch (error) {
                console.error("Failed to logout from Privy:", error);
            }
        }
    }

    return {
        connect,
        disconnect,
        isConnected,
        walletAddress,
        wallets,
        user
    };
}
