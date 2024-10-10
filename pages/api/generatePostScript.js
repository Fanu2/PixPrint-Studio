// components/PostScriptGenerator.js
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image'; // Importing Image from next/image

const PostScriptGenerator = () => {
  const handleGenerate = async () => {
    const element = document.getElementById('capture'); // Get the element to capture

    // Capture the element as a canvas
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png'); // Convert to image data
    const pdf = new jsPDF();

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    
    // Save the PDF
    pdf.save('generated-document.pdf');
  };

  return (
    <div>
      <div id="capture" style={{ width: '595px', height: '842px', position: 'relative' }}>
        {/* Use the Image component for the background image */}
        <Image
          src="/images/sample1.jpg" // Path to your image
          alt="Background"
          layout="fill" // Use layout="fill" for responsive behavior
          objectFit="cover" // Cover the entire area of the parent div
          style={{ position: 'absolute', top: 0 }}
        />
        
        {/* Text Overlay */}
        <h1 style={{ position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'Helvetica', fontSize: '36px' }}>
          Hopper
        </h1>
      </div>
      <button onClick={handleGenerate}>Generate PDF</button>
    </div>
  );
};

export default PostScriptGenerator;
