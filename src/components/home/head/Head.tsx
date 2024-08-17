import { usePinataContext } from '../../../context/PinataContext'
import connectMetaMask from '../../../utils/connectMetaMask'

function Head(): React.ReactElement {
    const pinataContext = usePinataContext()

    const handleConnectWeb3 = async (): Promise<void> => {
        if (pinataContext) 
            await connectMetaMask(pinataContext)
    }

    return (
        <div className="flex flex-col items-center justify-center w-full my-10">
            <h2 className="font-bold text-5xl font-moderustic">PinataDrive</h2>
            <p className="opacity-60 text-xs md:text-sm">Upload your files and keep it safe on blockchain</p>
            
            {pinataContext && !pinataContext?.account && <div className="w-full flex flex-col items-center justify-center mt-10">
                <p className="opacity-80">Connect your <span className="font-semibold text-orange-500">MetaMask</span> to view and upload files. Change network to Ethereum <span className='text-pink-500'>Sepolia</span> testnet of your wallet</p>
                <button onClick={handleConnectWeb3} className='text-xs md:text-sm hover:bg-transparent hover:text-gray-800 my-3 md:my-2 px-6 py-3 rounded-3xl border-[0.5px] border-orange-600 bg-orange-600 text-white shadow-lg dark:bg-[#151515] dark:hover:bg-orange-600 transition-all duration-200 font-semibold'>Connect Wallet</button>
            </div>}
        </div>
    )
}

export default Head