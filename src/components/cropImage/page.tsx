'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';
import { Modal } from '../ui/modal';

interface Props {
  file: File;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

export default function ImageCropModal({ file, onClose, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  const onCropCompleteInternal = useCallback((_: Area, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
    setLoading(false);
    onCropComplete(croppedImage);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="relative w-[90vw] h-[60vh] bg-black">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteInternal}
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>
        <button
          onClick={handleCrop}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Cắt ảnh'}
        </button>
      </div>
    </Modal>
  );
}
