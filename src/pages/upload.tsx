import React, { useRef, useEffect } from 'react';

const UploadPage = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const form = formRef.current;

        if (!form) return;

        const handleFormSubmit = async (e: Event) => {
            e.preventDefault();

            const submitEvent = e as SubmitEvent; // Explicitly cast to SubmitEvent
            const formData = new FormData(form);
            try {
                const response = await fetch('https://upload-image.me-prompt-technology.com/', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                const imageUrl = data.url;
                const imageElement = imageRef.current;
                if (imageElement) {
                    imageElement.src = imageUrl;
                    imageElement.style.display = 'block';
                }
            } catch (error) {
                console.error('Error uploading the image:', error);
            }
        };

        form.addEventListener('submit', handleFormSubmit);

        return () => {
            form.removeEventListener('submit', handleFormSubmit);
        };
    }, []);

    return (
        <div>
            <form ref={formRef} action="/api/upload" method="post" encType="multipart/form-data">
                <input type="file" name="image" />
                <button>
                    <input type="submit" value="Upload" />
                </button>
            </form>
            <div>
                <img ref={imageRef} id="uploadedImage" src="" alt="Uploaded Image" style={{ display: 'none', width: '300px' }} />
            </div>
        </div>
    );
};

export default UploadPage;
