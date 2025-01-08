'use client';
import axios from 'axios';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { MyContext } from '@/context/vidoContext/VideoContext';
import { Suspense } from 'react';
interface Short {
  _id: string;
  description: string;
  videoUrl: string;
  publicId: string;
  userId: string;
  duration: number;
  title: string;
  category: string;
  isShort: boolean;
  createdAt: string;
}

interface MyContextType {
  isOpen: boolean;
}

type Channel = {
  _id: string;
  handle: string;
  name: string;
  profile: string;
  subscribers: string[];
  totalSubscribers: number;
  userId: string;
  __v: number;
};

function UserShorts() {

  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const context = useContext(MyContext) as unknown as MyContextType | null;
  const isOpen = context?.isOpen ?? false;

  const [channels, setChannels] = useState<Channel[]>([]);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentShortIndex, setCurrentShortIndex] = useState<number | null>(
    null
  );

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:5000/api/getChannelsByName',
          {
            params: { userName: username },
          }
        );
        setChannels(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error('Axios error:', err.response?.data || err.message);
        } else if (err instanceof Error) {
          console.error('Error:', err.message);
        } else {
          console.error('An unknown error occurred:', err);
        }
      }
    };

    if (username) {
      fetchChannels();
    }
  }, [username]);

  const user = channels.find((user) => user.name === username);

  useEffect(() => {
    const fetchShorts = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/shorts', {
          params: { userId: user.userId },
        });
        setShorts(response.data.shorts);
      } catch (err) {
        console.error('Error fetching shorts:', err);
        setError('Failed to fetch shorts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, [user?.userId]);

  const openModal = (index: number) => {
    setCurrentShortIndex(index);
  };

  const closeModal = () => {
    setCurrentShortIndex(null);
  };

  const handleScroll = (e: React.WheelEvent) => {
    if (currentShortIndex === null) return;

    const nextIndex =
      e.deltaY > 0
        ? Math.min(currentShortIndex + 1, shorts.length - 1)
        : Math.max(currentShortIndex - 1, 0);

    setCurrentShortIndex(nextIndex);
  };

  useEffect(() => {
    if (currentShortIndex !== null && modalRef.current) {
      modalRef.current.focus();
    }
  }, [currentShortIndex]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
          <Suspense fallback={<div>Loading User Shorts...</div>}>
    
    <div
      className={`flex flex-col p-6 transition-all duration-300 ${
        isOpen ? 'ml-64' : 'ml-16'
      } bg-white-100 min-h-screen`}
    >
      {Array.isArray(shorts) && shorts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {shorts.map((short, index) => (
            <div
              key={short._id}
              className="cursor-pointer"
              onClick={() => openModal(index)}
            >
              <video
                src={short.videoUrl}
                className="w-52 h-80 object-cover rounded-lg"
                autoPlay={false}
              ></video>
              <h3 className="text-md mt-1 font-semibold">
                {short.title}
              </h3>
              <p className="text-sm text-gray-600">{short.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No shorts available.</p>
      )}

      {currentShortIndex !== null && shorts[currentShortIndex] && (
        <div
          className="fixed inset-0 bg-white flex items-center justify-center z-50 overflow-hidden"
          onWheel={handleScroll}
          ref={modalRef}
          tabIndex={-1}
        >
          <div className="rounded-lg p-4 relative w-80">
            <button
              className="absolute top-2 right-2 text-black p-2 hover:bg-gray-300"
              onClick={closeModal}
            >
              &times;
            </button>

            <video
              src={shorts[currentShortIndex].videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-lg"
            ></video>

            <h3 className="text-lg font-semibold">
              {shorts[currentShortIndex].title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {shorts[currentShortIndex].description}
            </p>
          </div>
        </div>
      )}
    </div>
    </Suspense>
  );
}

export default UserShorts;
