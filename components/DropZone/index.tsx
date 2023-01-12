import React, { ChangeEvent, DragEvent } from 'react'
import ShowFile from './ShowFile'
import DropZoneData from './DropZoneData';

export default function DropZone({ data, dispatch }: { data: DropZoneData, dispatch: React.Dispatch<any> }) {

    //onDragEnter sets inDropZone to true
    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "setDropZone", inDropZone: true, })
    };

    // onDragLeave sets inDropZone to false
    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "setDropZone", inDropZone: false })
    }

    // onDragOver sets inDropZone to true
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "copy";
            dispatch({ type: "setDropZone", inDropZone: true })
        }
    }

    // onDrop sets inDropZone to false and adds files to fileList
    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            let files = [...Array.from(e.dataTransfer.files)];
            if (files && files.length > 0) {
                const existingFiles = data.fileList.map((f) => f.name);
                files = files.filter((f) => !existingFiles.includes(f.name));
                dispatch({ type: "addFileToList", files });
                dispatch({ type: "setDropZone", inDropZone: false });
            }
        }
    };

    // handle file selection via input element
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target);
        console.log(e);
        if (e.target.files) {
            let files = [...Array.from(e.target.files)];
            if (files && files.length > 0) {
                const existingFiles = data.fileList.map((f) => f.name);
                files = files.filter((f) => !existingFiles.includes(f.name));
                dispatch({ type: "addFileToList", files })
            }
        }
    }

    const uploadFiles = async () => {
        let files = data.fileList;
        const formData = new FormData();
        files.forEach((file) => formData.append('file', file));

        //upload the files as a post request to the server using fetch
        // Note : /api/fileupload is not a real endpoint, it is just an example
        const response = await fetch("/api/upload/profileupload", {
            method: "POST",
            body: formData,
        })
        if (response.ok) {
            alert('Files uploaded successfully')
        }
        else {
            alert('Error uploading files, please try again later !! ')
            console.log(response)
        }
    }
    return (
        <div>
            <div
                className='bg-secondary-main p-3 h-[10rem] rounded-lg my-2 items-center flex justify-center'
                onDragEnter={(e) => handleDragEnter(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e)}
            >
                <div>
                    <h2 className='text-[24px] font-light'>⤴️upload file</h2>
                    <h3>or drag & drop your files here</h3>
                </div>
            </div>
            {/* passing the selected file as props */}
            <h4>Simply upload the report generated by devProfiler.</h4>
            <ShowFile fileData={data} />
            <div className='flex justify-between sm:w-[40%] mt-5'>
                <label htmlFor="selectFile" className='bg-primary-main text-primary-light p-2 rounded-lg cursor-pointer'>
                    Choose File
                    <input type="file" id='selectFile'
                        onChange={(e) => handleFileSelect(e)}
                        className='hidden'
                    />
                </label>
                <button onClick={() => uploadFiles()} className='bg-primary-dark text-primary-light p-2 rounded-lg'>Upload file</button>
            </div>
        </div>
    )
}