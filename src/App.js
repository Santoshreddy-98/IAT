import React, { useEffect } from "react";
import "./App.css";
import KonvaImageComponent from "./KonvaImageComponent";
import { Stage, Layer, Image } from "react-konva";
import imageSrc from "./assets/car.jpg";

function App() {
  const initialRectangles = [
    {
      start: { x: 1359.4647216796875, y: 471.80963134765625 },
      end: { x: 1634.6993408203125, y: 593.5230407714844 },
      stroke: "red",
      id: "rect1",
    },
    {
      start: { x: 1192.4586181640625, y: 446.2545166015625 },
      end: { x: 1251.2003173828125, y: 513.5114440917969 },
      stroke: "red",
      id: "rect2",
    },
    {
      start: { x: 1195.328857421875, y: 456.91534423828125 },
      end: { x: 1258.85205078125, y: 547.1182861328125 },
      stroke: "red",
      id: "rect3",
    },
    {
      start: { x: 690.5734252929688, y: 412.3949279785156 },
      end: { x: 725.7766723632812, y: 435.9654846191406 },
      stroke: "red",
      id: "rect4",
    },
    {
      start: { x: 1225.0079345703125, y: 457.2879333496094 },
      end: { x: 1346.6864013671875, y: 556.0965270996094 },
      stroke: "red",
      id: "rect5",
    },
  ];

  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedId, selectShape] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });
  const [isDrawing, setDrawing] = React.useState(false);
  const [drawingStart, setDrawingStart] = React.useState({ x: 0, y: 0 });
  const [drawingRect, setDrawingRect] = React.useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      setImage(img);
      setImageSize({ width: img.width, height: img.height });
    };
  }, []);

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleRectChange = (index, newAttrs) => {
    const updatedRectangles = [...rectangles];
    updatedRectangles[index] = newAttrs;
    setRectangles(updatedRectangles);
  };

  const handleMouseDown = (e) => {
    if (!isDrawing) {
      setDrawing(true);
      setDrawingRect({
        start: { x: e.evt.layerX, y: e.evt.layerY },
        end: { x: e.evt.layerX, y: e.evt.layerY },
        stroke: "yellow",
        id: "drawingRect",
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing) {
      setDrawingRect((prevRect) => ({
        ...prevRect,
        end: { x: e.evt.layerX, y: e.evt.layerY },
      }));
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setDrawing(false);
      if (
        drawingRect &&
        drawingRect.start.x !== drawingRect.end.x &&
        drawingRect.start.y !== drawingRect.end.y
      ) {
        // Only add the rectangle if it's not just a click (without drag)
        setRectangles([...rectangles, drawingRect]);
      }
      setDrawingRect(null);
    }
  };

  return (
    <div className="App">
      <Stage
        width={imageSize.width}
        height={imageSize.height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {image && (
            <Image
              image={image}
              width={imageSize.width}
              height={imageSize.height}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            />
          )}
          {drawingRect && (
            <KonvaImageComponent
              shapeProps={{
                x: drawingRect.start.x,
                y: drawingRect.start.y,
                width: drawingRect.end.x - drawingRect.start.x,
                height: drawingRect.end.y - drawingRect.start.y,
                stroke: drawingRect.stroke,
                id: drawingRect.id,
              }}
              isSelected={drawingRect.id === selectedId}
              onSelect={() => {
                selectShape(drawingRect.id);
              }}
              onChange={(newAttrs) => {
                setDrawingRect({
                  ...drawingRect,
                  start: { x: newAttrs.x, y: newAttrs.y },
                  end: {
                    x: newAttrs.x + newAttrs.width,
                    y: newAttrs.y + newAttrs.height,
                  },
                });
              }}
              isDrawing
            />
          )}
          {rectangles.map((rect, i) => (
            <KonvaImageComponent
              key={i}
              shapeProps={{
                x: rect.start.x,
                y: rect.start.y,
                width: rect.end.x - rect.start.x,
                height: rect.end.y - rect.start.y,
                stroke: rect.stroke,
                id: rect.id,
              }}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs) => {
                handleRectChange(i, newAttrs);
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
