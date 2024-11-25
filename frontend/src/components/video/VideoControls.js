import React, { useEffect, useRef, useState } from 'react';

const VideoControls = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Access the user's camera and microphone
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Clean up
      }
    };
  }, []);

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getTracks().find((track) => track.kind === 'video');
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getTracks().find((track) => track.kind === 'audio');
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} autoPlay muted className="w-full h-96 bg-black rounded-lg mb-4"></video>
      <div className="flex space-x-4">
        <button
          onClick={toggleVideo}
          className={`px-4 py-2 rounded-lg ${isVideoOn ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
        </button>
        <button
          onClick={toggleAudio}
          className={`px-4 py-2 rounded-lg ${isMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </div>
  );
};

export default VideoControls;
