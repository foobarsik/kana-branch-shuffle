import React from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { useAudioContext } from '../../contexts/AudioContext';

interface AudioControlsProps {
  className?: string;
  compact?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const {
    isPlaying,
    currentTrack,
    volume,
    isEnabled,
    currentTrackIndex,
    tracks,
    isLoading,
    hasAudioFiles,
    setVolume,
    toggleEnabled,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
  } = useAudioContext();

  if (compact) {
    if (isLoading) {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="p-2 rounded-lg bg-gray-100 text-gray-400">
            <Music className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      );
    }

    if (!hasAudioFiles) {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <button
            className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
            title="Нет аудиофайлов. Добавьте MP3 файлы в папку public/audio/"
            disabled
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={toggleEnabled}
          className={`p-2 rounded-lg transition-colors ${
            isEnabled 
              ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
          title={isEnabled ? 'Отключить музыку' : 'Включить музыку'}
        >
          <Music className="w-4 h-4" />
        </button>
        
        {isEnabled && (
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
            title={isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
        <div className="flex items-center justify-center">
          <Music className="w-5 h-5 text-purple-600 animate-pulse mr-2" />
          <span className="text-gray-600">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!hasAudioFiles) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-600">Фоновая музыка</span>
          </div>
          <span className="text-xs text-red-500">Недоступно</span>
        </div>
        <div className="text-sm text-gray-500 text-center py-4">
          <p className="mb-2">Аудиофайлы не найдены</p>
          <p className="text-xs">Добавьте MP3 файлы в папку public/audio/</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-gray-800">Фоновая музыка</span>
        </div>
        
        <button
          onClick={toggleEnabled}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            isEnabled 
              ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {isEnabled ? 'Вкл' : 'Выкл'}
        </button>
      </div>

      {isEnabled && (
        <>
          {/* Информация о треке */}
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              {currentTrack ? currentTrack.name : 'Выберите трек'}
            </div>
            <div className="text-xs text-gray-500">
              {currentTrackIndex + 1} из {tracks.length}
            </div>
          </div>

          {/* Управление воспроизведением */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <button
              onClick={playPreviousTrack}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Предыдущий трек"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              title={isPlaying ? 'Пауза' : 'Воспроизвести'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={playNextTrack}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Следующий трек"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Регулятор громкости */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.3)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              {volume > 0 ? (
                <Volume2 className="w-4 h-4 text-gray-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-600" />
              )}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <span className="text-xs text-gray-500 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </>
      )}
    </div>
  );
};
