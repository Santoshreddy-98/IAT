import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Rect, Transformer } from 'react-konva';

const KonvaImageComponent = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            start: { x: e.target.x(), y: e.target.y() },
            end: {
              x: e.target.x() + shapeProps.width,
              y: e.target.y() + shapeProps.height,
            },
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            ...shapeProps,
            start: { x: node.x(), y: node.y() },
            end: {
              x: node.x() + Math.max(5, node.width() * scaleX),
              y: node.y() + Math.max(node.height() * scaleY),
            },
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default KonvaImageComponent;