import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import Draggable from 'react-draggable';

export default function Home() {
    const [text, setText] = useState('Hopper'); // Default text
    const [bgImage, setBgImage] = useState(null); // Background image
    const [overlayImage, setOverlayImage] = useState(null); // Overlay image
    const [overlayDimensions, setOverlayDimensions] = useState({ width: 100, height: 100 }); // Default dimensions for overlay
    const [textSize, setTextSize] = useState(36); // Default text size
    const [fontColor, setFontColor] = useState('#ffffff'); // Default font color
    const [isResizingOverlay, setIsResizingOverlay] = useState(false); // State for overlay resizing
    const [isResizingText, setIsResizingText] = useState(false); // State for text resizing
    const overlayRef = useRef(null);
    const textRef = useRef(null);

    const handleBgImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBgImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOverlayImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOverlayImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResizeMouseDownOverlay = (e) => {
        e.preventDefault();
        setIsResizingOverlay(true); // Start overlay resizing
        const initialWidth = overlayRef.current.offsetWidth;
        const initialHeight = overlayRef.current.offsetHeight;
        const initialX = e.clientX;
        const initialY = e.clientY;

        const onMouseMove = (moveEvent) => {
            const newWidth = Math.max(20, initialWidth + (moveEvent.clientX - initialX));
            const newHeight = Math.max(20, initialHeight + (moveEvent.clientY - initialY));
            setOverlayDimensions({ width: newWidth, height: newHeight });
        };

        const onMouseUp = () => {
            setIsResizingOverlay(false); // Stop overlay resizing
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleResizeMouseDownText = (e) => {
        e.preventDefault();
        setIsResizingText(true); // Start text resizing
        const initialTextSize = textSize; // Store initial text size
        const initialY = e.clientY; // Store initial mouse Y position

        const onMouseMove = (moveEvent) => {
            const newSize = Math.max(10, initialTextSize + (moveEvent.clientY - initialY)); // Resize text
            setTextSize(newSize);
        };

        const onMouseUp = () => {
            setIsResizingText(false); // Stop text resizing
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const generatePDF = () => {
        const input = document.getElementById('pdf-content');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'pt', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save('download.pdf');
            })
            .catch((err) => {
                console.error('Error generating PDF:', err);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Create Your Composition</h1>
            <div>
                <label>
                    Background Image:
                    <input type="file" accept="image/*" onChange={handleBgImageChange} />
                </label>
                <label>
                    Overlay Image:
                    <input type="file" accept="image/*" onChange={handleOverlayImageChange} />
                </label>
                <label>
                    Text:
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text here"
                    />
                </label>
                <label>
                    Text Size:
                    <input
                        type="number"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        min={10}
                        max={100}
                    />
                </label>
                <label>
                    Font Color:
                    <input
                        type="color"
                        onChange={(e) => setFontColor(e.target.value)} // Use the color selected by the user
                        value={fontColor} // Bind to the font color state
                    />
                </label>
            </div>

            <div id="pdf-content" style={{ position: 'relative', width: '595px', height: '842px', marginTop: '20px', border: '1px solid #ccc' }}>
                {bgImage && (
                    <Image
                        src={bgImage}
                        alt="Background"
                        layout="fill"
                        objectFit="cover"
                        style={{ opacity: 0.5 }} // Adjust opacity for the background
                    />
                )}
                {overlayImage && (
                    <Draggable>
                        <div
                            ref={overlayRef}
                            style={{
                                position: 'absolute',
                                cursor: isResizingOverlay ? 'nwse-resize' : 'move', // Change cursor based on resizing state
                                width: `${overlayDimensions.width}px`,
                                height: `${overlayDimensions.height}px`,
                                border: isResizingOverlay ? '2px dashed rgba(0, 0, 255, 0.5)' : 'none',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                src={overlayImage}
                                alt="Overlay"
                                layout="fill"
                                objectFit="contain"
                                style={{ pointerEvents: 'none' }} // Prevent pointer events on image to allow resizing
                            />
                            <div
                                onMouseDown={handleResizeMouseDownOverlay}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: 'blue',
                                    cursor: 'nwse-resize',
                                }}
                            />
                        </div>
                    </Draggable>
                )}
                <Draggable>
                    <div
                        ref={textRef}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: fontColor, // Use the selected font color
                            fontSize: `${textSize}px`,
                            textAlign: 'center',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                            cursor: isResizingText ? 'nwse-resize' : 'move', // Change cursor based on resizing state
                        }}
                    >
                        {text}
                        <div
                            onMouseDown={handleResizeMouseDownText}
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                width: '10px',
                                height: '10px',
                                backgroundColor: 'blue',
                                cursor: 'nwse-resize',
                            }}
                        />
                    </div>
                </Draggable>
            </div>

            <button onClick={generatePDF} style={{ marginTop: '20px' }}>Generate PDF</button>
        </div>
    );
}
