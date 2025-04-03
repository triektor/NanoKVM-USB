import { ReactElement, useEffect, useState } from 'react'
import { Select } from 'antd'
import { useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { resolutionAtom, videoDeviceIdAtom, videoStateAtom } from '@renderer/jotai/device'
import { camera } from '@renderer/libs/camera'
import { getVideoDevice, setVideoDevice } from '@renderer/libs/storage'

type MediaDevice = {
  value: string
  label: string
}

type VideoProps = {
  setMsg: (msg: string) => void
}

export const Video = ({ setMsg }: VideoProps): ReactElement => {
  const { t } = useTranslation()

  const resolution = useAtomValue(resolutionAtom)
  const [videoState, setVideoState] = useAtom(videoStateAtom)
  const [videoDeviceId, setVideoDeviceId] = useAtom(videoDeviceIdAtom)

  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([])

  useEffect(() => {
    getVideoDevices(true)
  }, [])

  async function getVideoDevices(autoOpen: boolean): Promise<void> {
    const allDevices = await navigator.mediaDevices.enumerateDevices()

    const devices = allDevices
      .filter((device) => device.kind === 'videoinput')
      .map((device) => ({ value: device.deviceId, label: device.label }))

    setVideoDevices(devices)

    if (autoOpen) {
      const deviceId = getVideoDevice()
      if (deviceId && devices.some((device) => device.value === deviceId)) {
        await selectVideo(deviceId)
      }
    }
  }

  async function selectVideo(deviceId: string): Promise<void> {
    if (!deviceId) {
      setVideoDeviceId('')
      return
    }

    if (videoState === 'connecting') return

    setVideoState('connecting')
    setMsg('')

    try {
      const success = await camera.open(deviceId, resolution.width, resolution.height)
      if (!success) return

      const video = document.getElementById('video') as HTMLVideoElement
      if (!video) return

      video.srcObject = camera.getStream()

      setVideoState('connected')
      setVideoDeviceId(deviceId)
      setVideoDevice(deviceId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('camera.failed')
      setMsg(msg)
    }
  }

  return (
    <Select
      value={videoDeviceId || undefined}
      style={{ width: 280 }}
      options={videoDevices}
      allowClear={true}
      loading={videoState === 'connecting'}
      placeholder={t('modal.selectVideo')}
      onChange={selectVideo}
      onClick={() => getVideoDevices(false)}
    />
  )
}
