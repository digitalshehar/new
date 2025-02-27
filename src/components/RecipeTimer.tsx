import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Step {
  step: string;
  time: number;
  description: string;
}

interface Timer {
  id: string;
  label: string;
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  soundType: 'bell' | 'buzzer' | 'chime';
  volume: number;
}

interface RecipeTimerProps {
  steps: Step[];
}

export default function RecipeTimer({ steps = [] }: RecipeTimerProps) {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [showAddTimer, setShowAddTimer] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'bell' | 'buzzer' | 'chime'>('bell');
  const [volume, setVolume] = useState(0.7);
  const [notification, setNotification] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Initialize audio elements
    const sounds = {
      bell: new Audio('/sounds/bell.mp3'),
      buzzer: new Audio('/sounds/buzzer.mp3'),
      chime: new Audio('/sounds/chime.mp3')
    };
    
    Object.entries(sounds).forEach(([key, audio]) => {
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        let anyTimerFinished = false;
        
        const updatedTimers = prevTimers.map(timer => {
          if (!timer.isRunning || timer.timeLeft === 0) return timer;
          
          const newTimeLeft = Math.max(0, timer.timeLeft - 1);
          
          if (newTimeLeft === 0) {
            playAlarm(timer);
            showNotification(timer);
            anyTimerFinished = true;
          }
          
          return { ...timer, timeLeft: newTimeLeft };
        });

        if (anyTimerFinished && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }

        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const playAlarm = (timer: Timer) => {
    const audio = audioRefs.current[timer.soundType];
    if (audio) {
      audio.volume = timer.volume;
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const showNotification = (timer: Timer) => {
    // Show in-app notification
    setNotification(`Timer "${timer.label}" is complete!`);
    setTimeout(() => setNotification(null), 5000);

    // Show system notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: `Your timer "${timer.label}" is done!`,
        icon: '/icons/timer.png',
        badge: '/icons/timer-badge.png',
        vibrate: [200, 100, 200]
      });
    }
  };

  const addTimer = (step: Step) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newTimer: Timer = {
      id,
      label: step.step,
      duration: step.time * 60,
      timeLeft: step.time * 60,
      isRunning: false,
      soundType: selectedSound,
      volume
    };
    setTimers(prev => [...prev, newTimer]);
    setShowAddTimer(false);
  };

  const toggleTimer = (id: string) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
      )
    );
  };

  const resetTimer = (id: string) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id ? { ...timer, timeLeft: timer.duration, isRunning: false } : timer
      )
    );
  };

  const deleteTimer = (id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recipe Timer</h3>
          <button
            onClick={() => setShowAddTimer(!showAddTimer)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {showAddTimer ? 'Close' : 'Add Timer'}
          </button>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Timer List */}
        <div className="space-y-4">
          {timers.map((timer) => (
            <motion.div
              key={timer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{timer.label}</h4>
                  <p className="text-2xl font-bold text-amber-600">{formatTime(timer.timeLeft)}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => toggleTimer(timer.id)}
                    className={`px-4 py-2 rounded ${
                      timer.isRunning
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white transition-colors`}
                  >
                    {timer.isRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={() => resetTimer(timer.id)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => deleteTimer(timer.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Timer Panel */}
        <AnimatePresence>
          {showAddTimer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="grid gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">Available Timers</h4>
                <div className="space-y-2">
                  {steps.filter(step => step.time > 0).map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{step.step}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                        <p className="text-sm text-amber-600 dark:text-amber-400">{step.time} minutes</p>
                      </div>
                      <button
                        onClick={() => addTimer(step)}
                        className="px-3 py-1 text-sm text-white bg-amber-600 rounded hover:bg-amber-700"
                      >
                        Add Timer
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Sound Settings */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Timer Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Alert Sound
                      </label>
                      <select
                        value={selectedSound}
                        onChange={(e) => setSelectedSound(e.target.value as 'bell' | 'buzzer' | 'chime')}
                        className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="bell">Bell</option>
                        <option value="buzzer">Buzzer</option>
                        <option value="chime">Chime</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Volume
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
