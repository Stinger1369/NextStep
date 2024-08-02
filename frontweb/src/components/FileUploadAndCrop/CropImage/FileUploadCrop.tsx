import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Area } from 'react-easy-crop/types';
import { FiCheck, FiX } from 'react-icons/fi';
import 'react-image-crop/dist/ReactCrop.css';
import './FileUploadCrop.css';

interface FileUploadCropProps {
  imageSrc: string;
  onCropComplete: (croppedImage: Blob) => void;
  onClose: () => void;
}

const FileUploadCrop: React.FC<FileUploadCropProps> = ({ imageSrc, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(4 / 3);
  const [freeCrop, setFreeCrop] = useState<Crop | undefined>(undefined);
  const [useEasyCrop, setUseEasyCrop] = useState(true);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, crop: Area | PixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width!;
    canvas.height = crop.height!;

    ctx.drawImage(
      image,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    });
  };

  const handleCropComplete = async () => {
    if (useEasyCrop) {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    } else {
      if (freeCrop) {
        const croppedImage = await getCroppedImg(imageSrc, freeCrop);
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    }
  };

  return (
    <div className="FileUploadCrop-container">
      {useEasyCrop ? (
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect ?? undefined}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteInternal}
        />
      ) : (
        <ReactCrop
          crop={freeCrop}
          onChange={(newCrop) => setFreeCrop(newCrop)}
          onComplete={(c) => setFreeCrop(c)}
        >
          <img src={imageSrc} alt="Crop" />
        </ReactCrop>
      )}
      <div className="FileUploadCrop-controls">
        <button onClick={onClose}>
          <FiX size={24} />
        </button>
        <button onClick={handleCropComplete}>
          <FiCheck size={24} />
        </button>
      </div>
      <div className="FileUploadCrop-aspectRatioButtons">
        <button
          onClick={() => {
            setAspect(4 / 3);
            setUseEasyCrop(true);
            setFreeCrop(undefined);
          }}
        >
          4:3
        </button>
        <button
          onClick={() => {
            setAspect(16 / 9);
            setUseEasyCrop(true);
            setFreeCrop(undefined);
          }}
        >
          16:9
        </button>
        <button
          onClick={() => {
            setAspect(undefined);
            setUseEasyCrop(false);
            setFreeCrop({ unit: 'px', x: 0, y: 0, width: 100, height: 100 });
          }}
        >
          Libre
        </button>
      </div>
    </div>
  );
};

export default FileUploadCrop;
