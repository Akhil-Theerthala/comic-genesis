
// Use global jspdf from CDN
declare const jspdf: any;

export const createMangaPdf = (images: string[], title: string): void => {
    const { jsPDF } = jspdf;
    // Using a common manga/comic book aspect ratio (3:4) for PDF pages.
    const pdfWidth = 150; // mm
    const pdfHeight = 200; // mm to maintain 3:4 aspect ratio
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
    });

    images.forEach((imgData, index) => {
        if (index > 0) {
            doc.addPage();
        }
        const imgProps = doc.getImageProperties(`data:image/jpeg;base64,${imgData}`);
        const aspectRatio = imgProps.width / imgProps.height;
        
        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / aspectRatio;

        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * aspectRatio;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        doc.addImage(`data:image/jpeg;base64,${imgData}`, 'JPEG', x, y, imgWidth, imgHeight);
    });

    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeTitle}_manga.pdf`);
};
