'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Server {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  backgroundImage?: string;
  country?: string;
  ping?: number;
  playersOnline?: number;
  previewImages?: string[];
  howToPlay?: {
    android?: string;
    windows?: string;
    ios?: string;
  };
}

export default function HomePage() {
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'android' | 'windows' | 'ios'>('android');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchServer();
  }, []);

  const fetchServer = async () => {
    try {
      const res = await fetch('/api/server');
      if (res.ok) {
        const data = await res.json();
        setServer(data);
      }
    } catch (error) {
      console.error('Failed to fetch server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHost = async () => {
    try {
      const res = await fetch('/api/download/host');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hosts.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const copyPowerTunnelLink = () => {
    const link = `${window.location.origin}/api/raw/host`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (!server) {
    return <div className="flex justify-center items-center h-screen text-white">Server not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
            <span className="text-white font-semibold">Server Hub</span>
          </div>
          <Link href="/admin" className="text-sm text-slate-400 hover:text-white transition">
            Admin
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 py-3 text-xs text-slate-500 flex gap-2">
          <span>Home</span>
          <span>/</span>
          <span>Servers</span>
          <span>/</span>
          <span className="text-slate-300">{server.name}</span>
        </div>
      </div>

      {/* Share Button */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 py-2 text-right">
          <button className="text-xs text-slate-400 hover:text-white transition">
            Share
          </button>
        </div>
      </div>

      {/* Server Header */}
      <div className="relative">
        {server.backgroundImage && (
          <div className="absolute inset-0 h-80">
            <Image
              src={server.backgroundImage}
              alt="background"
              fill
              className="object-cover opacity-20"
            />
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="flex items-start gap-6">
            {server.logo && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                <Image
                  src={server.logo}
                  alt={server.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 pt-2">
              <h1 className="text-4xl font-bold text-white mb-2">{server.name}</h1>
              <p className="text-slate-300 mb-4">{server.description}</p>

              <div className="flex gap-6 text-sm">
                <div>
                  <div className="text-cyan-400 font-semibold">{server.playersOnline || 0}</div>
                  <div className="text-slate-500 text-xs">Players Online</div>
                </div>
                <div>
                  <div className="text-cyan-400 font-semibold">{server.ping || '-'}ms</div>
                  <div className="text-slate-500 text-xs">Ping</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadHost}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition"
            >
              Download Host
            </button>
            <button
              onClick={copyPowerTunnelLink}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition"
            >
              Copy PowerTunnel Link
            </button>
          </div>
        </div>
      </div>

      {/* How To Play */}
      {server.howToPlay && (
        <div className="border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-xl font-bold text-white mb-4">How To Play</h2>

            <div className="flex gap-4 mb-6 border-b border-slate-800">
              {['android', 'windows', 'ios'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-3 px-1 font-semibold text-sm transition ${
                    activeTab === tab
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="text-slate-300 whitespace-pre-wrap">
              {server.howToPlay[activeTab as keyof typeof server.howToPlay] || 'No instructions yet.'}
            </div>
          </div>
        </div>
      )}

      {/* Preview Images */}
      {server.previewImages && server.previewImages.length > 0 && (
        <div className="border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-xl font-bold text-white mb-4">Server Preview</h2>

            <div className="relative bg-slate-800 rounded-lg overflow-hidden">
              <div className="relative w-full h-80">
                <Image
                  src={server.previewImages[currentImageIndex]}
                  alt={`Preview ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? server.previewImages!.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-lg transition"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === server.previewImages!.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-lg transition"
              >
                →
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {server.previewImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentImageIndex ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Server */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-white mb-4">About Server</h2>
          <p className="text-slate-300 whitespace-pre-wrap">{server.description}</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">
          <p>Made with ❤️ by Server Hub</p>
        </div>
      </footer>
    </div>
  );
}
