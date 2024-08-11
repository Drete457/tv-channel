import React, { useEffect, useRef, useState } from 'react';
import { videos } from "./assets/videos.json";
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp } from "react-icons/fa";
import { VscMute, VscUnmute } from "react-icons/vsc"
import { LiaPlaySolid, LiaPauseSolid } from "react-icons/lia";
import musicTracks from "./assets/music";
import qrCodeArray from './assets/qr-code';

const App: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [qrCodeIndex, setQrCodeIndex] = useState<number>(0);

  const handleRandomQrCode = () => {
    const randomIndex = Math.floor(Math.random() * qrCodeArray.length);
    setQrCodeIndex(randomIndex);
  }

  const changeVideo = (direction: 'next' | 'prev') => {
    if (transitioning) return;

    setTransitioning(true);

    setTimeout(() => {
      setCurrentVideoIndex((prevIndex) => {
        if (direction === 'next') {
          return (prevIndex + 1) % videos.length;
        } else {
          return (prevIndex - 1 + videos.length) % videos.length;
        }
      });
      setTransitioning(false);
      handleRandomQrCode();
    }, 500);
  };


  const handleMusicEnded = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicTracks.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideoIndex(randomIndex);
  }, []);

  useEffect(() => {
    handleRandomQrCode();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current)
      audioRef.current.volume = isMuted ? 0 : 1;
  }, [isMuted]);

  return (
    <section className="flex items-center justify-center h-screen bg-gray-900">
      <section className="relative w-3/4 h-3/4 bg-gray-800 rounded-lg overflow-hidden">

        {/* TV Antennas */}
        <section className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center">
          <section className="h-20 w-1 bg-gray-600 rounded-full transform rotate-45 origin-bottom-left"></section>
          <section className="h-20 w-1 bg-gray-600 rounded-full transform -rotate-45 origin-bottom-right ml-4"></section>
        </section>

        {/* TV Frame */}
        <section className="absolute inset-0 flex items-center justify-center">
          <section className="relative w-10/12 h-5/6 bg-gray-900 border-8 border-gray-700 rounded-lg p-4">
            <section
              className={`w-full h-full bg-black transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'
                }`}
            >
              <iframe
                className="w-full h-full rounded-lg"
                src={`${videos[currentVideoIndex]}${videos[currentVideoIndex].includes('?') ? '&' : '?'}controls=0&mute=1&autoplay=1`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </section>

            <img src={qrCodeArray[qrCodeIndex]} alt="QR Code" className="absolute bottom-4 right-4 size-20" />
          </section>
        </section>

        {/* TV legs */}
        <section className="absolute bottom-0 left-1/4 transform -translate-x-1/2 w-4 h-20 bg-gray-700 rounded-full"></section>
        <section className="absolute bottom-0 right-1/4 transform translate-x-1/2 w-4 h-20 bg-gray-700 rounded-full"></section>
      </section>

      {/* TV Controller */}
      <section className="absolute bottom-6 right-10 transform flex space-x-4 text-sm">
        <button
          type="button"
          onClick={() => changeVideo('next')}
          className="bg-gray-700 text-white px-4 py-2 rounded-full size-16 flex items-center place-content-center hover:bg-gray-500"
        >
          <FaArrowUp size={25} />
          <span className='hidden'>Up</span>
        </button>
        <button
          type="button"
          onClick={() => changeVideo('prev')}
          className="bg-gray-700 text-white px-4 py-2 rounded-full size-16 flex items-center place-content-center hover:bg-gray-500"
        >
          <FaArrowLeft size={25} />
          <span className='hidden'>Left</span>
        </button>
        <button
          type="button"
          onClick={() => changeVideo('next')}
          className="bg-gray-700 text-white px-4 py-2 rounded-full size-16 flex items-center place-content-center hover:bg-gray-500"
        >
          <FaArrowRight size={25} />
          <span className='hidden'>Right</span>
        </button>
        <button
          type="button"
          onClick={() => changeVideo('prev')}
          className="bg-gray-700 text-white px-4 py-2 rounded-full size-16 flex items-center place-content-center hover:bg-gray-500"
        >
          <FaArrowDown size={25} />
          <span className='hidden'>Down</span>
        </button>
        <button
          onClick={toggleMute}
          className="bg-red-600 text-white px-4 py-2 size-16 rounded-lg flex items-center place-content-center hover:bg-red-500"
        >
          {isMuted ? <VscMute size={25} /> : <VscUnmute size={25} />}
        </button>
        <button
          onClick={togglePlay}
          className="bg-blue-600 text-white px-4 py-2 size-16 rounded-lg flex items-center place-content-center hover:bg-blue-500"
        >
          {isPlaying ? <LiaPauseSolid size={25} /> : <LiaPlaySolid size={25} />}
        </button>
      </section>

      {/* Audio Player */}
      <audio
        ref={audioRef}
        src={musicTracks[currentTrackIndex]}
        onEnded={handleMusicEnded}
        autoPlay
        loop={false}
      />
    </section>
  );
};

export default App;
