import { createContext, useContext, useEffect, useState } from "react"
import { PinataSDK } from 'pinata'

interface Response {
    code: number
    msg: string
}

interface PinataContextInterface {
    isToast: boolean
    setIsToast: React.Dispatch<React.SetStateAction<boolean>>
    toastMessage: string
    setToastMessage: React.Dispatch<React.SetStateAction<string>>
    web3: any
    setWeb3(web3: any): void
    contract: any
    setContract(contract: any): void
    account: any
    setAccount(account: any): void
    files: _File[]
    setFiles(files: _File[]): void
    images: _File[]
    setImages(files: _File[]): void
    videos: _File[]
    setVideos(files: _File[]): void
    docs: _File[]
    setDocs(files: _File[]): void
    handleDeleteFile(ind: bigint[], hash: string[], pinataContext: PinataContextInterface): Promise<Response>
}

interface PinataContextProps {
    children: React.ReactNode
}

interface _File {
    ind: bigint
    url: string
    fileName: string
    time: number
    fileType: string
}

const PinataContext = createContext<PinataContextInterface | null>(null)

export const PinataProvider: React.FC<PinataContextProps> = (props) => {
    useEffect(() => {
        let themeMode = false
        const root = document.documentElement

        if (localStorage.getItem('theme') === 'false') 
            themeMode = Boolean(localStorage.getItem('theme'))

        if (themeMode) {
            root.classList.add('dark')
            localStorage.setItem('theme', 'true')
        } else {
            root.classList.remove('dark')
            localStorage.setItem('theme', 'false')
        }
    }, [])
    

    const [web3, setWeb3] = useState<any>()
    const [contract, setContract] = useState<any>()
    const [account, setAccount] = useState<any>()

    const [files, setFiles] = useState<_File[]>([])
    const [images, setImages] = useState<_File[]>([])
    const [videos, setVideos] = useState<_File[]>([])
    const [docs, setDocs] = useState<_File[]>([])

    const [isToast, setIsToast] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string>('')

    const handleDeleteFile = async(ind: bigint[], hash: string[], pinataContext: PinataContextInterface): Promise<Response> => {
        try {
            await pinataContext?.contract.methods.deleteFile(ind).send({ from: pinataContext?.account })
            
            let fetchedFiles = await pinataContext?.contract.methods.getFiles().call({ from : pinataContext?.account })
            fetchedFiles = fetchedFiles.filter((file: _File) => file.fileName !== '' && file.fileType !== '' && file)
            console.log('fetched', fetchedFiles)
            
            const fetchedImages = fetchedFiles.filter((file: _File) => file.fileType === 'image' || file.fileType.split('/')[0] === 'image' && file)
            const fetchedVideos = fetchedFiles.filter((file: _File) => file.fileType === 'video' || file.fileType.split('/')[0] === 'video' && file)
            let fetchedDocs = fetchedFiles.filter((file: _File) => (file.fileType !== 'video' && file.fileType !== 'image') && (file.fileType.split('/')[0] !== 'video' && file.fileType.split('/')[0] !== 'image') && file)
            fetchedDocs = fetchedDocs.filter((file: _File) => file.fileName && file.fileType && file)

            pinataContext?.setFiles(fetchedFiles)
            pinataContext?.setImages(fetchedImages)
            pinataContext?.setVideos(fetchedVideos)
            pinataContext?.setDocs(fetchedDocs)

            const pinata = new PinataSDK({
                pinataJwt: import.meta.env.VITE_APP_PINATA_JWT,
                pinataGatewayKey: import.meta.env.VITE_APP_PINATA_GATEWAY_KEY
            })

            const unpin = await pinata.unpin(hash)
            console.log(unpin[0].status)

            if (unpin[0].status) {
                pinataContext?.setToastMessage('Successfully deleted!')
                pinataContext?.setIsToast(true)
            } else {
                pinataContext?.setToastMessage('Something went wrong!')
                pinataContext?.setIsToast(true)
            }

            return { code: 1, msg: 'success'}
        } catch (err) {
            console.log(err)
            return { code: 0, msg: 'failure'}
        }
    }

    return (
        <PinataContext.Provider value={{ isToast, setIsToast, toastMessage, setToastMessage, contract, setContract, web3, setWeb3, account, setAccount, files, setFiles, handleDeleteFile, images, setImages, videos, setVideos, docs, setDocs }}>
            {props.children}
        </PinataContext.Provider>
    )
}

export const usePinataContext = (): PinataContextInterface | null => {
    return useContext(PinataContext)
}