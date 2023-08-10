import React, { useRef } from 'react';

const UploadPage = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null); // ระบุประเภทของ ref

    const handleUpload = async () => {
        if (fileInputRef.current) {
            const file = fileInputRef.current.files?.[0]; // เพิ่ม ? หลัง files เพื่อป้องกันค่า null หรือ undefined
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await fetch('https://upload-image.me-prompt-technology.com/', {
                        method: 'POST',
                        body: formData,
                    });

                    const responseData = await response.json();
                    console.log(responseData);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    return (
        <div>
            <input ref={fileInputRef} type="file" name="image" />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadPage;
