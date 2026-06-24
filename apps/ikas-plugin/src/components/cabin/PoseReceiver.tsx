"use client";

// Architecture stub for PoseNet/TF.js webcam pose input.
// Not active — wire up in a future phase when webcam integration is needed.
// This interface is stable; consumers can subscribe now.

export type Keypoint = {
  name: string;
  x: number;
  y: number;
  score: number;
};

export type PoseFrame = {
  keypoints: Keypoint[];
  score: number;
};

export type PoseCallback = (frame: PoseFrame) => void;

export interface PoseReceiverHandle {
  subscribe: (cb: PoseCallback) => () => void;
  start: () => Promise<void>;
  stop: () => void;
}

// Null implementation — replace with TF.js MoveNet/PoseNet when activating webcam.
export function createPoseReceiver(): PoseReceiverHandle {
  const subscribers = new Set<PoseCallback>();
  return {
    subscribe(cb) {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    async start() {
      console.info("[PoseReceiver] Webcam pose estimation not yet activated.");
    },
    stop() {},
  };
}
