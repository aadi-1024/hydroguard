import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const Litter = () => {
  const videoRef = useRef(null);
  const [detection, setDetection] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    startCamera();
  }, []);

  const captureFrame = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');

      try {
        const response = await axios.post('http://localhost:8080/detect', { image: imageData });
        setDetection(response.data);
      } catch (error) {
        console.error('Error sending image to backend:', error);
      }
    }
  };

  return (
    <div>
     
      <video ref={videoRef} autoPlay playsInline style={{ width: '50vw', height: 'auto' , marginLeft:'25vw',marginTop:'10vh'}}></video>
      <button onClick={captureFrame}>Capture and Detect</button>
      {detection && (
        <div>
          <h2>Detection Result:</h2>
          <p>{detection.message}</p>
        </div>
      )}
    </div>
  );
};

export default Litter;
