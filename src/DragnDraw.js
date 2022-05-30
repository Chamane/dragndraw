import * as React from 'react';
import { Stage, Layer, Image} from 'react-konva';
import {Table, Button} from 'react-bootstrap';
import useImage from 'use-image';
import overview from './static/overview.jpeg';
import ogi from './static/ogi.png';
import multisensor from './static/multisensor.png';
import './DragnDraw.css'

const URLImage = ({ image, dragstart, dragend }) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      // I will use offset to set origin to the center of the image
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
      draggable
      onDragStart={dragstart}
      onDragEnd={dragend}
    />
  );
};

const BackgroundImage = ({width, height}) => {
  const [backgroundImage, setBackgroundImage] = React.useState(null)

  React.useEffect(() => {loadImage()}, []);

  const loadImage = () => {
    // save to "this" to remove "load" handler on unmount
    const bImage = new window.Image();
    bImage.src = overview;
    setBackgroundImage(bImage)
   
  }
 
  return (
      <Image
        x={0}
        y={0}
        image={backgroundImage}
        height={height}
        width={width}
      />
    );
}

function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const DragnDraw = ({width, height}) => {

  const dragUrl = React.useRef();
  const stageRef = React.useRef();
  const [images, setImages] = React.useState([]);

  const dragStart = (e)=>{
    console.log('drag start...');
  }

  const dragEnd = (e)=>{
    // modifying position of the dragged image
    images[e.target.index-1].x=e.target.attrs.x;
    images[e.target.index-1].y=e.target.attrs.y;
    console.log(images[e.target.index-1]);
  }

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    console.log(uri);
    downloadURI(uri, 'stage.png');
  };

  return (
    <>
      <div className='d-flex flex-row justify-content-between p-2'>
        <div className='d-flex flex-row p-2'>
          <img 
            className='mx-2'
            src={multisensor} 
            alt='multi-sensor'
            draggable='true'
            onDrag={(e)=>{
              dragUrl.current = e.target.src;
              dragUrl.alt = e.target.alt;
            }}
          ></img>
          <img 
            className='mx-2'
            src={ogi} 
            alt='ogi' 
            draggable='true'
            onDrag={(e)=>{
              dragUrl.current = e.target.src;
              dragUrl.alt = e.target.alt;
            }}
            ></img>
        </div>
        <Button variant='primary' onClick={handleExport}>Download</Button>
      </div>
      <div
        onDrop={(e)=>{
          // console.log(stageRef.current);
          stageRef.current.setPointersPositions(e);
          // add image 
          setImages(
            images.concat([
              {
                ...stageRef.current.getPointerPosition(),
                src:dragUrl.current,
                type:dragUrl.alt
              },
            ])
          );
          console.log(images);
          e.preventDefault();
        }}
        onDragOver={(e)=>{
          e.preventDefault();
        }}
      >
        <Stage ref={stageRef} width={width} height={height}>
          <Layer>
            <BackgroundImage width={width} height={height}/>
            {images.map((image, index) => {
                return <URLImage 
                        key={index}
                        image={image}  
                        dragstart={dragStart}
                        dragend={dragEnd}
                      />;
              })}
          </Layer>
        </Stage>
      </div>
      <div className='py-2'>
        <Table hover>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>x</th>
              <th>y</th>
              <th>type</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image, index)=>(
              <tr>
                <td>{index+1}</td>
                <td>sensor-{index+1}</td>
                <td>{image.x}</td>
                <td>{image.y}</td>
                <td>{image.type}</td>
                <td><Button variant="outline-secondary">remove</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

