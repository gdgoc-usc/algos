import { useCallback, useEffect, useState } from "react";
import { useSound } from "@/hooks/use-sound";
import type {
  SortingAlgorithmDefinition,
  SortingAnimationFrame,
  SortingSoundSelector,
} from "@/types/sorting";

export interface SortingPlaybackState {
  arraySize: number[];
  speed: number[];
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;
  frames: SortingAnimationFrame[];
  data: SortingAnimationFrame;
  isMuted: boolean;
  setArraySize: (value: number[]) => void;
  setSpeed: (value: number[]) => void;
  handlePlay: () => void;
  handlePause: () => void;
  handleReset: () => void;
  handleRandomize: () => void;
  handleScrub: (value: number[]) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleToggleMute: () => void;
}

const DEFAULT_ARRAY_SIZE = [20];
const DEFAULT_SPEED = [50];
const DEFAULT_SOUND_BASE_FREQUENCY = 110;

const getFallbackFrame = (): SortingAnimationFrame => ({
  array: [],
  activeIndices: null,
  sortedIndices: [],
  stats: { comparisons: 0, swaps: 0 },
  completed: false,
  description: "Initializing...",
});

const getDefaultFrameSoundValue: SortingSoundSelector = (frame) => {
  const preferredIndex = frame?.activeIndices?.[1] ?? frame?.activeIndices?.[0];

  return preferredIndex !== undefined
    ? frame?.array[preferredIndex]
    : undefined;
};

export function useSortingPlayback({
  generateFrames,
  getSoundValue = getDefaultFrameSoundValue,
}: Pick<
  SortingAlgorithmDefinition,
  "generateFrames" | "getSoundValue"
>): SortingPlaybackState {
  const [arraySize, setArraySizeState] = useState(DEFAULT_ARRAY_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [frames, setFrames] = useState<SortingAnimationFrame[]>(() =>
    generateFrames(DEFAULT_ARRAY_SIZE[0]),
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isMuted, setIsMuted, playValue, playSuccess } = useSound();

  const totalFrames = Math.max(frames.length, 1);
  const data = frames[currentFrame] ?? getFallbackFrame();

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (currentFrame >= totalFrames - 1) {
      playSuccess();
      const timeoutId = window.setTimeout(() => {
        setIsPlaying(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const nextFrame = frames[currentFrame + 1];
    const soundValue = getSoundValue(nextFrame);

    if (soundValue !== undefined) {
      playValue(soundValue, DEFAULT_SOUND_BASE_FREQUENCY);
    }

    const timeoutId = window.setTimeout(
      () => {
        setCurrentFrame((previousFrame) => previousFrame + 1);
      },
      Math.max(10, 510 - speed[0] * 5),
    );

    return () => window.clearTimeout(timeoutId);
  }, [
    currentFrame,
    frames,
    getSoundValue,
    isPlaying,
    playSuccess,
    playValue,
    speed,
    totalFrames,
  ]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const setArraySize = useCallback(
    (value: number[]) => {
      setArraySizeState(value);
      setFrames(generateFrames(value[0]));
      setCurrentFrame(0);
      setIsPlaying(false);
    },
    [generateFrames],
  );

  const handleRandomize = useCallback(() => {
    setFrames(generateFrames(arraySize[0]));
    setCurrentFrame(0);
    setIsPlaying(false);
  }, [arraySize, generateFrames]);

  const handlePlay = useCallback(() => {
    if (currentFrame >= totalFrames - 1) {
      setCurrentFrame(0);
    }

    setIsPlaying(true);
  }, [currentFrame, totalFrames]);

  const handlePause = useCallback(() => {
    stopPlayback();
  }, [stopPlayback]);

  const handleReset = useCallback(() => {
    stopPlayback();
    setCurrentFrame(0);
  }, [stopPlayback]);

  const handleScrub = useCallback(
    (value: number[]) => {
      stopPlayback();
      setCurrentFrame(value[0]);
    },
    [stopPlayback],
  );

  const handleNext = useCallback(() => {
    stopPlayback();
    setCurrentFrame((previousFrame) =>
      Math.min(previousFrame + 1, totalFrames - 1),
    );
  }, [stopPlayback, totalFrames]);

  const handlePrev = useCallback(() => {
    stopPlayback();
    setCurrentFrame((previousFrame) => Math.max(previousFrame - 1, 0));
  }, [stopPlayback]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((previousMuted) => !previousMuted);
  }, [setIsMuted]);

  return {
    arraySize,
    speed,
    currentFrame,
    totalFrames,
    isPlaying,
    frames,
    data,
    isMuted,
    setArraySize,
    setSpeed,
    handlePlay,
    handlePause,
    handleReset,
    handleRandomize,
    handleScrub,
    handleNext,
    handlePrev,
    handleToggleMute,
  };
}
