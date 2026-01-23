import { useState } from "react"
import { usePrivyWallet } from "@/hooks/use-privy-wallet"
import {
    createPublicClient,
    createWalletClient,
    custom,
    parseEther,
    encodeFunctionData,
    stringToHex,
    hexToBytes
} from "viem"
import { cronosTestnet } from "viem/chains"
import {
    IDENTITY_REGISTRY_ADDRESS,
    IDENTITY_REGISTRY_ABI,
    COMMISSION_ADDRESS,
    COMMISSION_AMOUNT_CRO,
    AGENT_WALLET_BYTECODE,
    AGENT_WALLET_ABI,
    AGENT_WALLET_DEPLOY_ABI
} from "@/lib/onchain-config"
import { toast } from "sonner"

import { RegistrationStep } from "@/components/registration-modal"

export function useAgentRegistration() {
    const { walletAddress } = usePrivyWallet()
    const [isRegistering, setIsRegistering] = useState(false)
    const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('idle')
    const [txHashes, setTxHashes] = useState<{ commission?: string, deployment?: string, registration?: string }>({})
    const [agentContractAddress, setAgentContractAddress] = useState<string>("")
    const [error, setError] = useState<string>("")

    const resetRegistration = () => {
        setRegistrationStep('idle')
        setTxHashes({})
        setAgentContractAddress("")
        setError("")
        setIsRegistering(false)
    }

    const registerAgent = async (agentName: string, agentDescription: string) => {
        if (!walletAddress) {
            toast.error("Please connect your wallet first")
            return
        }

        setIsRegistering(true)
        setError("")
        const toastId = toast.loading("Starting agent registration...")

        try {
            // 1. Setup Clients
            if (!window.ethereum) throw new Error("No ethereum provider found")

            const publicClient = createPublicClient({
                chain: cronosTestnet,
                transport: custom(window.ethereum)
            })

            const walletClient = createWalletClient({
                chain: cronosTestnet,
                transport: custom(window.ethereum),
                account: walletAddress as `0x${string}`
            })

            // 1.1 Verify Chain
            const currentChainId = await walletClient.getChainId()
            if (currentChainId !== cronosTestnet.id) {
                toast.loading(`Switching to ${cronosTestnet.name}...`, { id: toastId })
                try {
                    await walletClient.switchChain({ id: cronosTestnet.id })
                } catch (switchError: any) {
                    if (switchError.code === 4902) {
                        await walletClient.addChain({ chain: cronosTestnet })
                    } else {
                        throw switchError
                    }
                }
            }

            // 2. Pay Commission (1 CRO)
            setRegistrationStep('commission')
            toast.loading("Step 1/3: Paying commission (1 CRO)...", { id: toastId })
            const commissionTx = await walletClient.sendTransaction({
                to: COMMISSION_ADDRESS as `0x${string}`,
                value: parseEther(COMMISSION_AMOUNT_CRO),
                chain: cronosTestnet
            })
            setTxHashes(prev => ({ ...prev, commission: commissionTx }))
            await publicClient.waitForTransactionReceipt({ hash: commissionTx })

            // 3. Deploy Individual Agent Contract
            setRegistrationStep('deploy_contract')
            toast.loading("Step 2/3: Deploying individual agent contract...", { id: toastId })

            const deployHash = await walletClient.deployContract({
                abi: AGENT_WALLET_DEPLOY_ABI,
                bytecode: AGENT_WALLET_BYTECODE,
                args: [walletAddress as `0x${string}`],
                chain: cronosTestnet
            })
            setTxHashes(prev => ({ ...prev, deployment: deployHash }))

            const deployReceipt = await publicClient.waitForTransactionReceipt({ hash: deployHash })
            const contractAddr = deployReceipt.contractAddress
            if (!contractAddr) throw new Error("Agent contract deployment failed - no address returned")
            setAgentContractAddress(contractAddr)

            // 4. Register on IdentityRegistry
            setRegistrationStep('register_identity')
            toast.loading("Step 3/3: Registering on Identity Registry...", { id: toastId })

            const metadata = [
                { key: "name", value: stringToHex(agentName) },
                { key: "creatorName", value: stringToHex("Project 0rca") },
                { key: "description", value: stringToHex(agentDescription) },
                { key: "createdAt", value: stringToHex(new Date().toISOString()) },
                { key: "status", value: stringToHex("active") },
                { key: "address", value: stringToHex(contractAddr) },
                { key: "reputationScore", value: stringToHex("0") },
                { key: "validationScore", value: stringToHex("0") }
            ]

            const { request } = await publicClient.simulateContract({
                address: IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
                abi: IDENTITY_REGISTRY_ABI,
                functionName: 'register',
                args: ["", metadata],
                account: walletAddress as `0x${string}`,
                chain: cronosTestnet
            })

            const registerHash = await walletClient.writeContract({
                ...request,
                chain: cronosTestnet
            })
            setTxHashes(prev => ({ ...prev, registration: registerHash }))
            await publicClient.waitForTransactionReceipt({ hash: registerHash })

            setRegistrationStep('success')
            toast.success("Agent registered successfully on-chain!", { id: toastId })
            return { agentContractAddress: contractAddr, registerHash }

        } catch (error: any) {
            console.error("Registration error:", error)
            const msg = error.shortMessage || error.message
            setError(msg)
            setRegistrationStep('error')
            toast.error(`Registration failed: ${msg}`, { id: toastId })
            return null
        } finally {
            setIsRegistering(false)
        }
    }

    return {
        registerAgent,
        isRegistering,
        registrationStep,
        txHashes,
        agentContractAddress,
        error,
        resetRegistration
    }
}
