import { usePinataContext } from '../../../context/PinataContext'
import short from 'short-uuid'
import { useState } from 'react'

interface _File {
    ind: bigint
    url: string
    fileName: string
    time: number
    fileType: string
}

function ViewImages(): React.ReactElement {
    const [deleteFileNumber, setDeleteFileNumber] = useState<number | null>(-1)
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false)
    const pinataContext = usePinataContext()

    const handleDelete = async(ind: bigint[], hash: string[]): Promise<void> => {
        setDeleteLoader(true)
        
        await pinataContext?.handleDeleteFile(ind, hash, pinataContext)
        
        setDeleteLoader(false)
        setDeleteFileNumber(-1)
    }

    return (
        <div className={`grid ${pinataContext && pinataContext?.images.length === 0 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} w-full items-start justify-start gap-3`}>
            {pinataContext && pinataContext?.images.length === 0 &&
                <div className='mt-10 flex flex-col items-center justify-center text-gray-800 dark:text-gray-100'>
                    <i className="text-4xl md:text-6xl fa-regular fa-folder-open"></i>
                    <p className='mt-1'>No images uploaded yet</p>    
                </div>}

            {pinataContext && pinataContext?.images && pinataContext?.images.map((file: _File, index: number): React.ReactElement | null => {
                const filetype = file.fileType.split('/')

                if (filetype[0] === "" && file.fileName === "")
                    return null

                return (
                    <div key={short.generate()} className={`transition-all row-span-1 relative h-[150px] md:h-[300px] w-full rounded-lg shadow-lg outline-none bg-[#e8e8e8] dark:bg-[#2b2b2b] hover:cursor-pointer`}>
                        <div onClick={() => { 
                                if(deleteFileNumber === index)
                                    setDeleteFileNumber(-1) 
                                else setDeleteFileNumber(index)
                            }} className='absolute right-3 top-3 z-20 text-white flex items-center justify-center px-3 py-2 shadow-md rounded-full bg-[#3c3c3c]'>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </div>
                        
                        {deleteFileNumber === index && 
                            <div onClick={() => handleDelete([file.ind], [file.url.split('/')[4]?.split('?')[0]])} className='w-full inset-0 relative z-20 bg-black'>
                                <div className='absolute top-12 text-white font-semibold right-1 px-3 py-2 rounded-lg shadow-lg hover:opacity-70 bg-red-600'>
                                    {deleteLoader ? 
                                    <p>
                                        <div className="text-xs lds-ring"><div></div><div></div><div></div><div></div></div>
                                    </p>
                                    :<p>Delete</p>}
                                </div>
                            </div>}

                        <a href={file.url} target='_blank' className='hover:opacity-60'>
                            {filetype[0] === 'image' &&
                                <img src={file.url} alt="img" className='rounded-lg w-full h-full object-cover' />}
                        </a>
                        <div className='hidden flex-col items-start justify-start w-full gap-2 font-semibold'>
                            <p>Filename: {file.fileName}</p>
                            <p>Uploaded at: 3:06 pm Thursday, January, 2004</p>
                        </div>
                    </div>
                )
            })} 
        </div>
    )
}

export default ViewImages