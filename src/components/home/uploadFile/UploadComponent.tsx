import { useState, useRef } from "react"
import short from 'short-uuid'
import { usePinataContext } from '../../../context/PinataContext'
import './style.css'
import uploadFile from "../../../utils/uploadFile"

function UploadComponent(): React.ReactElement {
    const pinataContext = usePinataContext()
    const [inFiles, setInFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadingLoader, setUploadingLoader] = useState<boolean>(false)
    const [uploadedFileCounter, setUploadedFileCounter] = useState<number>(0)

    const [insideDragArea, setInsideDragArea] = useState<boolean>(false)

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        const file = e.dataTransfer.files
        if (file && file.length > 0 && inFiles.length < 5) {
            setInFiles(prev => [...prev, file[0]])
            setInsideDragArea(false)
        } else {
            pinataContext?.setToastMessage('Only 5 files can be uploaded at a time')
            pinataContext?.setIsToast(true)
            window.scrollTo(0, 0)
        }
    }

    const handleOnDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        setInsideDragArea(true)
    }

    const handleOnDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        setInsideDragArea(false)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        const file = e.target.files;
        console.log('trying')
        if (file && file.length > 0 && inFiles.length < 5) {
            console.log('taking')
            setInFiles(prev => [...prev, file[0]])
            setInsideDragArea(false)
        } else {
            pinataContext?.setToastMessage('Only 5 files can be uploaded at a time')
            pinataContext?.setIsToast(true)
        }
    }

    const openDialog = (): void => {
        fileInputRef.current?.click()
    }

    const handleClearFiles = (): void => {
        setInFiles([])
    }

    const handleUploadFiles = async (): Promise<void> => {
        if (pinataContext)
            await uploadFile(pinataContext, inFiles, setInFiles, setUploadingLoader, setUploadedFileCounter)
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-start w-[90%] md:w-[60%] gap-16 mt-7 md:mt-24 text-gray-700 dark:text-gray-400 transition-all duration-300">
            <div className="relative flex mt-12 w-[250px] z-10 md:w-[35%] items-center justify-center">
                <img src="/assets/pin.png" className="z-30 animate-pinata-anim w-full h-auto object-cover" />
                <img src="/assets/svg-blob.svg" className="absolute w-[60%] opacity-40 -top-1 blur-2xl" />
                <img src="/assets/svg-blob.svg" className="absolute w-[20%] opacity-60 rotate-45 blur-2xl -bottom-8 left-8" />
            </div>

            <div className="w-full md:w-[65%] z-10 flex flex-col items-center justify-center text-xs md:text-sm">
                <p className="w-full px-2 my-1">Drag and drop your file which is to be uploaded or click on the below box to open the file dialogue</p>

                <div className={`${uploadingLoader ? 'block' : 'hidden'} flex flex-col items-center justify-center w-full p-2 bg-[#1a1a1a] rounded-lg shadow-lg`}>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    <p>Uploading, wait for a while</p>
                    <p className="mb-5">Uploaded files : {uploadedFileCounter}/{inFiles.length}</p>
                </div>

                <div onClick={openDialog} onDrop={handleDrop} onDragEnter={handleOnDragEnter} onDragLeave={handleOnDragLeave} onDragOver={handleOnDragEnter} className={`${(inFiles.length > 0 && !uploadingLoader) ? 'block' : 'hidden'} w-full flex flex-col items-center justify-center p-2 ${insideDragArea ? 'bg-[#eaeaea] dark:bg-[#424242]' : 'bg-[#fff] dark:bg-[#1a1a1a]'} hover:bg-[#eaeaea] dark:hover:bg-[#424242] rounded-lg shadow-lg hover:cursor-pointer`}>
                    <div className="w-full p-3 flex flex-col items-center justify-center rounded-lg border-dashed border-[3px] border-purple-500">
                        <div className="md:text-sm w-[98%] h-full rounded-lg">
                            <div className="flex items-center justify-center gap-3">
                                <i className="text-3xl mt-1 fa-brands fa-dropbox mb-2"></i>
                                <p className="hidden md:block">Drop your file or click to upload more</p>
                                <p className="md:hidden">Click to upload more</p>
                            </div>
                            {
                                inFiles.length > 0 && inFiles.map((file: File): React.ReactElement => {
                                    console.log(file)
                                    let name = file.name

                                    if (name.length > 20)
                                        name = name.slice(0, 5) + '...' + name.slice(name.length - 9, name.length)

                                    const size = (file.size * 0.001).toFixed(2)
                                    return (
                                        <div key={short.generate()} className="shadow-lg text-xs md:text-sm w-full my-2 px-4 py-3 flex items-center justify-between bg-[#eaeaea] dark:bg-[#2f2f2f] rounded-lg">
                                            <p>{name}</p>
                                            <p>{size} kb</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div onClick={openDialog} onDrop={handleDrop} onDragEnter={handleOnDragEnter} onDragLeave={handleOnDragLeave} onDragOver={handleOnDragEnter} className={`${inFiles.length > 0 ? 'hidden' : 'block'} w-full flex flex-col items-center justify-center p-2 ${insideDragArea ? 'bg-[#eaeaea] dark:bg-[#424242]' : 'bg-[#fff] dark:bg-[#1a1a1a]'} hover:bg-[#eaeaea] dark:hover:bg-[#424242] rounded-lg shadow-lg hover:cursor-pointer`}>
                    <div className="w-full py-5 md:py-20 flex flex-col items-center justify-center rounded-lg border-dashed border-[3px] border-purple-500">
                        <i className="text-3xl md:text-6xl fa-brands fa-dropbox mb-2"></i> 
                        <p className="hidden md:block text-sm">Drop your image or video</p>
                        <p className="hidden md:block text-xs md:text-sm">Or click to drop</p>
                        <p className="md:hidden text-xs md:text-sm">Click to upload</p>
                        <input
                            type="file"
                            onChange={handleFileInput}
                            className="hidden"
                            ref={fileInputRef}
                        />
                    </div>
                </div>

                <button onClick={handleClearFiles} className={`${inFiles.length > 0 ? 'block' : 'hidden'} mt-4 md:mt-6 px-4 py-2.5 rounded-lg border-[1px] w-full md:text-sm bg-[#ffffff] hover:bg-[#eaeaea] hover:border-[#eaeaea] dark:hover:bg-[#222222] dark:bg-[#2f2f2f] font-medium shadow-lg border-[#fdfdfd] dark:border-[#2f2f2f]`}>
                    Clear Dropbox
                </button>

                <button onClick={handleUploadFiles} className={`${inFiles.length > 0 ? 'block' : 'hidden'} mt-3 w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden md:text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800`}>
                    <span className="w-full relative px-4 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Upload
                    </span>
                </button>
            </div>
        </div>
    )
}   

export default UploadComponent