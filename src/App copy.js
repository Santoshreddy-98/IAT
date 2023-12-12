import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const currentPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (image) {
      updateCanvasSize();
    }
  }, [image]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setBoxes([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      drawImage();
      drawBoxes();
    };
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    startPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseUp = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      const endPoint = { ...currentPoint.current };
      setBoxes([...boxes, { start: startPoint.current, end: endPoint }]);
      drawBoxes();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    currentPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    drawBoxes();
    drawBox(startPoint.current, currentPoint.current);
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const drawBox = (start, end) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    ctx.stroke();
  };

  const drawBoxes = () => {
    drawImage(); // Redraw the image
    boxes.forEach((box) => {
      drawBox(box.start, box.end);
    });
  };

  const sendBoxesToBackend = () => {
    // Assuming you have a function to send boxes to the backend
    // You can use fetch or any other method to send data to the server
    console.log('Bounding boxes:', boxes);
  };

  return (
    <div className="App">
      <div className="container mt-5">
        <input type="file" onChange={handleImageUpload} />
        {image && (
          <div>
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            />
            <button onClick={sendBoxesToBackend} className="btn btn-primary mt-3">
              Send Boxes to Backend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
