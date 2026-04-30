'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Server {
  _id?: string;
  name: string;
  description: string;
  logo?: string;
  backgroundImage?: string;
  country?: string;
  ping?: number;
  playersOnline?: number;
  previewImages?: string[];
  hostFile?: string;
  howToPlay?: {
    android?: string;
    windows?: string;
    ios?: string;
  };
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function AdminPage() {
  const [secretKey, setSecretKey] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [server, setServer] = useState<Server>({
    name: '',
    description: '',
    country: '',
    ping: 0,
    playersOnline: 0,
    previewImages: [],
    hostFile: '',
    howToPlay: {
      android: '',
      windows: '',
      ios: '',
    },
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
    document.body.appendChild(script);
  }, []);

  const handleAuth = () => {
    if (!secretKey) {
      setErrorMessage('Please enter a secret key');
      return;
    }
    setIsAuthed(true);
    setErrorMessage('');
  };

  const fetchServer = async () => {
    try {
      const res = await fetch('/api/server');
      if (res.ok) {
        const data = await res.json();
        setServer(data);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch server data');
    }
  };

  useEffect(() => {
    if (isAuthed) {
      fetchServer();
    }
  }, [isAuthed]);

  const handleInputChange = (field: string, value: any) => {
    setServer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHowToPlayChange = (platform: 'android' | 'windows' | 'ios', value: string) => {
    setServer((prev) => ({
      ...prev,
      howToPlay: {
        ...prev.howToPlay,
        [platform]: value,
      },
    }));
  };

  const handleHostFileUpload = async (file: File) => {
    try {
      const content = await file.text();
      handleInputChange('hostFile', content);
      setSuccessMessage('Host file loaded successfully');
    } catch (error) {
      setErrorMessage('Failed to load host file');
    }
  };

  const openCloudinaryWidget = (field: 'logo' | 'backgroundImage') => {
    if (!window.cloudinary) {
      setErrorMessage('Cloudinary widget not loaded. Please refresh the page.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset',
        folder: 'server-platform',
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          handleInputChange(field, imageUrl);
          setSuccessMessage(`${field} uploaded successfully`);
        }
      }
    );

    widget.open();
  };

  const openPreviewImageWidget = () => {
    if (!window.cloudinary) {
      setErrorMessage('Cloudinary widget not loaded. Please refresh the page.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset',
        folder: 'server-platform/previews',
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          setServer((prev) => ({
            ...prev,
            previewImages: [...(prev.previewImages || []), imageUrl],
          }));
          setSuccessMessage('Preview image added successfully');
        }
      }
    );

    widget.open();
  };

  const removePreviewImage = (index: number) => {
    setServer((prev) => ({
      ...prev,
      previewImages: prev.previewImages?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secretKey,
          data: server,
        }),
      });

      if (res.ok) {
        setSuccessMessage('Server updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to update server');
      }
    } catch (error) {
      setErrorMessage('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Secret Key
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              placeholder="Enter admin secret key"
            />
          </div>

          {errorMessage && (
            <div className="text-red-400 text-sm mb-4">{errorMessage}</div>
          )}

          <button
            onClick={handleAuth}
            className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition"
          >
            Access Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setIsAuthed(false)}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {errorMessage}
          </div>
        )}

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Server Name
                </label>
                <input
                  type="text"
                  value={server.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={server.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-32 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Country Code
                </label>
                <input
                  type="text"
                  value={server.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., US, ID, FR"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Ping (ms)
                  </label>
                  <input
                    type="number"
                    value={server.ping || 0}
                    onChange={(e) => handleInputChange('ping', parseInt(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Players Online
                  </label>
                  <input
                    type="number"
                    value={server.playersOnline || 0}
                    onChange={(e) => handleInputChange('playersOnline', parseInt(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Server Logo
                </label>
                {server.logo && (
                  <div className="mb-3 relative w-24 h-24 rounded-lg overflow-hidden border border-slate-600">
                    <Image
                      src={server.logo}
                      alt="logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <button
                  onClick={() => openCloudinaryWidget('logo')}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm font-semibold hover:bg-slate-600 transition"
                >
                  {server.logo ? 'Change Logo' : 'Upload Logo'}
                </button>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Background Image
                </label>
                {server.backgroundImage && (
                  <div className="mb-3 relative w-full h-32 rounded-lg overflow-hidden border border-slate-600">
                    <Image
                      src={server.backgroundImage}
                      alt="background"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <button
                  onClick={() => openCloudinaryWidget('backgroundImage')}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm font-semibold hover:bg-slate-600 transition"
                >
                  {server.backgroundImage ? 'Change Background' : 'Upload Background'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Host File Content
                </label>
                <textarea
                  value={server.hostFile || ''}
                  onChange={(e) => handleInputChange('hostFile', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-32 resize-none font-mono text-sm"
                  placeholder="Paste your hosts file content here..."
                />
                <input
                  type="file"
                  accept=".txt,.hosts"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleHostFileUpload(file);
                  }}
                  className="mt-2 text-sm text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  How To Play - Android
                </label>
                <textarea
                  value={server.howToPlay?.android || ''}
                  onChange={(e) => handleHowToPlayChange('android', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  How To Play - Windows
                </label>
                <textarea
                  value={server.howToPlay?.windows || ''}
                  onChange={(e) => handleHowToPlayChange('windows', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  How To Play - iOS
                </label>
                <textarea
                  value={server.howToPlay?.ios || ''}
                  onChange={(e) => handleHowToPlayChange('ios', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-24 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <label className="block text-slate-300 text-sm font-semibold mb-4">
              Preview Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {server.previewImages?.map((image, index) => (
                <div key={index} className="relative">
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-600">
                    <Image
                      src={image}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removePreviewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={openPreviewImageWidget}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm font-semibold hover:bg-slate-600 transition"
            >
              Add Preview Image
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
