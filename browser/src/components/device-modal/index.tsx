import { useEffect, useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import {
  resolutionAtom,
  serialStateAtom,
  videoDeviceIdAtom,
  videoStateAtom
} from '@/jotai/device.ts';
import { camera } from '@/libs/camera';
import { device } from '@/libs/device';
import * as storage from '@/libs/storage';

type MediaDevice = {
  value: string;
  label: string;
};

export const DeviceModal = () => {
  const { t } = useTranslation();

  const resolution = useAtomValue(resolutionAtom);
  const [videoDeviceId, setVideoDeviceId] = useAtom(videoDeviceIdAtom);
  const [videoState, setVideoState] = useAtom(videoStateAtom);
  const [serialState, setSerialState] = useAtom(serialStateAtom);

  const [isOpen, setIsOpen] = useState(false);
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    getVideoDevices(false);
    checkSerial();
  }, []);

  useEffect(() => {
    if (videoState === 'connected') {
      if (serialState === 'notSupported' || serialState === 'connected') {
        setIsOpen(false);
        return;
      }
    }

    setIsOpen(true);
  }, [videoState, serialState]);

  // get video input devices
  async function getVideoDevices(autoOpen: boolean) {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = allDevices.filter((device) => device.kind === 'videoinput');

    setDevices(videoDevices.map((device) => ({ value: device.deviceId, label: device.label })));

    if (autoOpen) {
      const deviceId = storage.getVideoDevice();
      if (deviceId && videoDevices.some((device) => device.deviceId === deviceId)) {
        await selectVideo(deviceId);
      }
    }
  }

  // select video input device
  async function selectVideo(deviceId: string) {
    if (videoState === 'connecting') return;

    if (!deviceId) {
      setVideoDeviceId('');
      return;
    }

    setVideoState('connecting');
    setErrMsg('');

    try {
      const success = await camera.open(deviceId, resolution.width, resolution.height);
      if (!success) return;

      const video = document.getElementById('video') as HTMLVideoElement;
      if (!video) return;

      video.srcObject = camera.getStream();

      setVideoState('connected');
      setVideoDeviceId(deviceId);
      storage.setVideoDevice(deviceId);
    } catch (err) {
      console.log(err);
      setSerialState('disconnected');
      setErrMsg(t('camera.failed'));
    }
  }

  // check the web serial api
  function checkSerial() {
    const isWebSerialSupported = 'serial' in navigator;

    const state = isWebSerialSupported ? 'disconnected' : 'notSupported';
    setSerialState(state);
  }

  // select serial port
  async function selectSerial() {
    if (serialState === 'connecting') return;
    setSerialState('connecting');
    setErrMsg('');

    try {
      const port = await navigator.serial.requestPort();
      await device.serialPort.init(port);

      setSerialState('connected');
    } catch (err) {
      console.log(err);
      setSerialState('disconnected');
      setErrMsg(t('serial.failed'));
    }
  }

  return (
    <Modal open={isOpen} title={t('modal.title')} footer={null} closable={false} destroyOnClose>
      <div className="flex flex-col items-center justify-center space-y-5 py-10">
        <Select
          value={videoDeviceId || undefined}
          style={{ width: 250 }}
          options={devices}
          allowClear={true}
          loading={videoState === 'connecting'}
          placeholder={t('modal.selectVideo')}
          onChange={selectVideo}
          onClick={() => getVideoDevices(false)}
        />

        {serialState !== 'notSupported' && (
          <Button
            type="primary"
            className="w-[250px]"
            loading={serialState === 'connecting'}
            onClick={selectSerial}
          >
            {t('modal.selectSerial')}
          </Button>
        )}

        {errMsg && <span className="text-xs text-red-500">{errMsg}</span>}
      </div>
    </Modal>
  );
};
