import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react'
import backend from '@tensorflow/tfjs-backend-webgl'
import Webcam from 'react-webcam'
import { count } from '../../utils/music'; 
 
import Instructions from '../../components/Instrctions/Instructions';
import { poseInstructions } from '../../utils/data';

import './Yoga.css'
 
import DropDown from '../../components/DropDown/DropDown.tsx';
import { poseImages } from '../../utils/pose_images';
import { POINTS, keypointConnections } from '../../utils/data';
import { drawPoint, drawSegment } from '../../utils/helper'



let skeletonColor: string = 'rgb(255,255,255)';
const poseList: string[] = [
  'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog',
  'Shoulderstand', 'Traingle'
];

let interval: NodeJS.Timeout | undefined;

// flag variable is used to help capture the time when AI just detect 
// the pose as correct(probability more than threshold)
let flag: boolean = false;


function Yoga() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [startingTime, setStartingTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [poseTime, setPoseTime] = useState<number>(0);
  const [bestPerform, setBestPerform] = useState<number>(0);
  const [currentPose, setCurrentPose] = useState<string>('Tree');
  const [isStartPose, setIsStartPose] = useState<boolean>(false);

  
  useEffect(() => {
    const timeDiff = (currentTime - startingTime)/1000
    if(flag) {
      setPoseTime(timeDiff)
    }
    if((currentTime - startingTime)/1000 > bestPerform) {
      setBestPerform(timeDiff)
    }
  }, [currentTime])


  useEffect(() => {
    setCurrentTime(0)
    setPoseTime(0)
    setBestPerform(0)
  }, [currentPose])

  const CLASS_NO: Record<string, number> = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
  };

  function get_center_point(landmarks: any, left_bodypart: number, right_bodypart: number): tf.Tensor {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
    return center;
  }

  function get_pose_size(landmarks: any, torso_size_multiplier: number = 2.5): tf.Tensor {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    let shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center_new = tf.expandDims(pose_center_new, 1);
    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
    // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d, 'euclidean', 0));
    // normalize scale
    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
    return pose_size;
  }

  function normalize_pose_landmarks(landmarks: any): tf.Tensor {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, pose_center);
    let pose_size = get_pose_size(landmarks);
    landmarks = tf.div(landmarks, pose_size);
    return landmarks;
  }

  function landmarks_to_embedding(landmarks: any): tf.Tensor {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    let embedding = tf.reshape(landmarks, [1, 34]);
    return embedding;
  }

  const runMovenet = async (): Promise<void> => {
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel('https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json');
    const countAudio = new Audio(count);
    countAudio.loop = true;
    interval = setInterval(() => {
      detectPose(detector, poseClassifier, countAudio);
    }, 100);
  };

  const detectPose = async (
    detector: any,
    poseClassifier: any,
    countAudio: HTMLAudioElement
  ): Promise<void> => {
    if (
      webcamRef.current &&
      (webcamRef.current as any).video &&
      (webcamRef.current as any).video.readyState === 4
    ) {
      let notDetected = 0;
      const video = (webcamRef.current as any).video;
      const pose = await detector.estimatePoses(video);
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints;
        let input = keypoints.map((keypoint: any) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)');
              const connections = keypointConnections[keypoint.name as keyof typeof keypointConnections] as string[];
              try {
                connections.forEach((connection: string) => {
                  let conName = connection.toUpperCase();
                  const pointIdx = POINTS[conName as keyof typeof POINTS] as number;
                  drawSegment(
                    ctx,
                    [keypoint.x, keypoint.y],
                    [keypoints[pointIdx].x, keypoints[pointIdx].y],
                    skeletonColor
                  );
                });
              } catch (err) {}
            }
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });
        if (notDetected > 4) {
          skeletonColor = 'rgb(255,255,255)';
          return;
        }
        const processedInput = landmarks_to_embedding(input);
        const classification = poseClassifier.predict(processedInput);
        classification.array().then((data: any) => {
          const classNo = CLASS_NO[currentPose];
          console.log(data[0][classNo]);
          if (data[0][classNo] > 0.97) {
            if (!flag) {
              countAudio.play();
              setStartingTime(new Date(Date()).getTime());
              flag = true;
            }
            setCurrentTime(new Date(Date()).getTime());
            skeletonColor = 'rgb(0,255,0)';
          } else {
            flag = false;
            skeletonColor = 'rgb(255,255,255)';
            countAudio.pause();
            countAudio.currentTime = 0;
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };


  let countAudio: HTMLAudioElement | null = null;

  function startYoga(): void {
    setIsStartPose(true);
    runMovenet();
  }

  function stopPose(): void {
    setIsStartPose(false);
    if (interval) clearInterval(interval);
    if (countAudio) {
      countAudio.pause();
      countAudio.currentTime = 0;
    }
  }

    

  // Always show pose selector and instructions
  // Only show camera and performance when isStartPose is true
  return (
    <div className="yoga-container w-full px-2 sm:px-4 md:px-8 max-w-6xl mx-auto">
      <DropDown
        options={poseList}
        selectedOption={currentPose}
        onSelect={setCurrentPose}
        poseImages={poseImages}
      />
      {!isStartPose && (
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 mt-8 w-full">
          <div className="shadow-lg rounded-xl bg-white p-6 max-h-[350px] w-full md:w-[350px] overflow-y-auto flex-1">
            <Instructions
              currentPose={currentPose}
              instructions={poseInstructions}
            />
          </div>
          <div className="shadow-lg rounded-xl bg-white p-6 w-full md:w-[350px] flex items-center justify-center">
            <img
              src={(poseImages as Record<string, string>)[currentPose]}
              className="pose-img max-w-full max-h-[300px] object-contain"
              alt={currentPose}
            />
          </div>
        </div>
      )}
      {isStartPose && (
        <>
          <div className="w-full max-w-2xl mx-auto flex flex-wrap justify-between items-center py-6 gap-4">
            <button
              onClick={stopPose}
              className="secondary-btn min-w-[120px] flex-1"
            >Stop Pose</button>
            <div className="pose-performance text-left">
              <h4>Pose Time: {poseTime} s</h4>
              <h4>Best: {bestPerform} s</h4>
            </div>
          </div>
          <div className="relative w-full max-w-2xl mx-auto">
            {React.createElement(Webcam as any, {
              width: '100%',
              height: 'auto',
              id: 'webcam',
              ref: webcamRef,
              style: {
                width: '100%',
                maxWidth: '640px',
                height: 'auto',
                aspectRatio: '4/3',
                objectFit: 'cover',
                borderRadius: '24px',
                boxShadow: '0 4px 24px rgba(67,198,172,0.18)',
                display: 'block',
                margin: '0 auto',
              }
            })}
            <canvas
              ref={canvasRef}
              id="my-canvas"
              width='640px'
              height='480px'
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 1,
                width: '100%',
                maxWidth: '640px',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
            </canvas>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 mt-8 w-full">
            <div className="shadow-lg rounded-xl bg-white p-6 max-h-[350px] w-full md:w-[350px] overflow-y-auto flex-1">
              <Instructions
                currentPose={currentPose}
                instructions={poseInstructions}
              />
            </div>
            <div className="shadow-lg rounded-xl bg-white p-6 w-full md:w-[350px] flex items-center justify-center">
              <img
                src={(poseImages as Record<string, string>)[currentPose]}
                className="pose-img max-w-full max-h-[300px] object-contain"
                alt={currentPose}
              />
            </div>
          </div>
        </>
      )}
      {!isStartPose && (
        <button
          onClick={startYoga}
          className="secondary-btn mt-8 w-full sm:w-auto"
        >Start Pose</button>
      )}
    </div>
  );

  return (
    <div
      className="yoga-container"
    >
      <DropDown
        options={poseList}
        selectedOption={currentPose}
        onSelect={setCurrentPose}
        poseImages={poseImages}
      />
      <Instructions
        currentPose={currentPose}
        instructions={poseInstructions}
      />
      <button
          onClick={startYoga}
          className="secondary-btn"    
        >Start Pose</button>
    </div>
  )
}

export default Yoga;