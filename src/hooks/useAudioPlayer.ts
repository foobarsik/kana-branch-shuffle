import { useState, useRef, useEffect, useCallback } from 'react';

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration?: number;
}

// Список треков японской музыки без копирайта
// Эти треки можно заменить на реальные файлы
export const JAPANESE_AMBIENT_TRACKS: AudioTrack[] = [
  {
    id: 'sakura-breeze',
    name: 'Sakura Breeze',
    url: '/audio/sakura-breeze.mp3',
  },
  // {
  //   id: 'zen-garden',
  //   name: 'Zen Garden',
  //   url: '/audio/zen-garden.mp3',
  // },
  // {
  //   id: 'bamboo-forest',
  //   name: 'Bamboo Forest',
  //   url: '/audio/bamboo-forest.mp3',
  // },
  // {
  //   id: 'temple-bells',
  //   name: 'Temple Bells',
  //   url: '/audio/temple-bells.mp3',
  // },
];

// Проверка доступности аудиофайла
const checkAudioFile = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Получение доступных треков
const getAvailableTracks = async (): Promise<AudioTrack[]> => {
  const availableTracks: AudioTrack[] = [];
  
  for (const track of JAPANESE_AMBIENT_TRACKS) {
    const isAvailable = await checkAudioFile(track.url);
    if (isAvailable) {
      availableTracks.push(track);
    }
  }
  
  return availableTracks;
};

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [volume, setVolume] = useState(0.1); // Очень низкая громкость по умолчанию
  const [isEnabled, setIsEnabled] = useState(false); // Выключено по умолчанию
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [availableTracks, setAvailableTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Инициализация аудио элемента
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = false;
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [volume]);

  // Обновление громкости
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Сохранение настроек в localStorage
  useEffect(() => {
    localStorage.setItem('kana-audio-enabled', isEnabled.toString());
    localStorage.setItem('kana-audio-volume', volume.toString());
  }, [isEnabled, volume]);

  // Загрузка настроек из localStorage и проверка доступных треков
  useEffect(() => {
    const savedEnabled = localStorage.getItem('kana-audio-enabled');
    const savedVolume = localStorage.getItem('kana-audio-volume');
    
    if (savedEnabled !== null) {
      setIsEnabled(savedEnabled === 'true');
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }

    // Проверяем доступные треки
    const checkTracks = async () => {
      setIsLoading(true);
      try {
        const tracks = await getAvailableTracks();
        setAvailableTracks(tracks);
        if (tracks.length === 0) {
          console.warn('No audio files found. Please add MP3 files to public/audio/ directory.');
        }
      } catch (error) {
        console.warn('Could not check audio files:', error);
        // Fallback: используем все треки, но с обработкой ошибок
        setAvailableTracks(JAPANESE_AMBIENT_TRACKS);
      } finally {
        setIsLoading(false);
      }
    };

    checkTracks();
  }, []);

  const playTrack = useCallback(async (track: AudioTrack) => {
    if (!audioRef.current || !isEnabled) return;

    try {
      if (currentTrack?.id !== track.id) {
        audioRef.current.src = track.url;
        setCurrentTrack(track);
      }
      
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.warn('Could not play audio track:', error);
      setIsPlaying(false);
    }
  }, [isEnabled, currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(async () => {
    if (audioRef.current && isEnabled) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.warn('Could not resume audio:', error);
      }
    }
  }, [isEnabled]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const playNextTrack = useCallback(() => {
    if (availableTracks.length === 0) return;
    
    const nextIndex = (currentTrackIndex + 1) % availableTracks.length;
    setCurrentTrackIndex(nextIndex);
    const nextTrack = availableTracks[nextIndex];
    playTrack(nextTrack);
  }, [currentTrackIndex, playTrack, availableTracks]);

  const playPreviousTrack = useCallback(() => {
    if (availableTracks.length === 0) return;
    
    const prevIndex = currentTrackIndex === 0 
      ? availableTracks.length - 1 
      : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    const prevTrack = availableTracks[prevIndex];
    playTrack(prevTrack);
  }, [currentTrackIndex, playTrack, availableTracks]);

  const startPlaylist = useCallback(() => {
    if (!isEnabled || availableTracks.length === 0) return;
    
    const track = availableTracks[currentTrackIndex];
    playTrack(track);
  }, [isEnabled, currentTrackIndex, playTrack, availableTracks]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        resume();
      } else {
        startPlaylist();
      }
    }
  }, [isPlaying, currentTrack, pause, resume, startPlaylist]);

  const toggleEnabled = useCallback(() => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    
    if (!newEnabled && isPlaying) {
      stop();
    } else if (newEnabled && !isPlaying) {
      startPlaylist();
    }
  }, [isEnabled, isPlaying, stop, startPlaylist]);

  // Обработчик окончания трека
  useEffect(() => {
    if (!audioRef.current) return;

    const handleTrackEnded = () => {
      if (isEnabled) {
        playNextTrack();
      }
    };

    audioRef.current.addEventListener('ended', handleTrackEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleTrackEnded);
      }
    };
  }, [isEnabled, playNextTrack]);

  return {
    isPlaying,
    currentTrack,
    volume,
    isEnabled,
    tracks: availableTracks,
    currentTrackIndex,
    isLoading,
    hasAudioFiles: availableTracks.length > 0,
    setVolume,
    toggleEnabled,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
    startPlaylist,
    stop,
  };
};
