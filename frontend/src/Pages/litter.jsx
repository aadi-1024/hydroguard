import { useEffect, useRef } from 'react';
import axios from 'axios';
import './litter.css'
const Litter = () => {
  const videoRef = useRef(null);
//   const [detection, setDetection] = useState(null);

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
        const response = await axios.post('http://localhost:8080/detect', { image: imageData }, {
          responseType: 'blob', // Expecting a video blob from the backend
        });

        const videoBlob = new Blob([response.data], { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(videoBlob);

        if (videoRef.current) {
          videoRef.current.srcObject = null; // Clear the current stream
          videoRef.current.src = videoURL;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error sending image to backend or fetching video:', error);
      }
    }
  };

  return (
    <div className='full'>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '50vw', height: 'auto', marginTop: '10vh' ,}}
      ></video>
       <button className="capture-button" onClick={captureFrame}>Capture and Detect</button>
    </div>
  );
};

export default Litter;
