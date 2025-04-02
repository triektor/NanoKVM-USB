import { Modifiers } from './keyboard.ts';
import { Key as MouseKey, Mode as MouseMode } from './mouse.ts';
import { CmdEvent, CmdPacket } from './proto.ts';
import { SerialPort } from './serial-port.ts';
import { intToLittleEndianList } from './utils.ts';

export class Device {
  addr: number;
  serialPort: SerialPort;

  constructor() {
    this.addr = 0x00;
    this.serialPort = new SerialPort();
  }

  async sendKeyboardData(modifiers: Modifiers, keys: number[]) {
    if (keys.length !== 6) {
      throw new Error('keyboard keys length must be 6');
    }

    const data = [modifiers.encode(), 0x00, ...keys];
    const cmdData = new CmdPacket(this.addr, CmdEvent.SEND_KB_GENERAL_DATA, data).encode();

    await this.serialPort.write(cmdData);
  }

  async sendMouseAbsoluteData(
    key: MouseKey,
    width: number,
    height: number,
    x: number,
    y: number,
    scroll: number
  ) {
    const xAbs = width === 0 ? 0 : Math.floor((x * 4096) / width);
    const yAbs = width === 0 ? 0 : Math.floor((y * 4096) / height);

    const data = [
      MouseMode.ABSOLUTE,
      key.encode(),
      ...intToLittleEndianList(xAbs),
      ...intToLittleEndianList(yAbs),
      scroll
    ];
    const cmdData = new CmdPacket(this.addr, CmdEvent.SEND_MS_ABS_DATA, data).encode();
    await this.serialPort.write(cmdData);
  }

  async sendMouseRelativeData(msKey: MouseKey, x: number, y: number, scroll: number) {
    function intToByte(value: number): number {
      if (value < -128 || value > 127) {
        throw new Error('value must be in range -128 to 127 for a signed byte');
      }
      return (value + 256) % 256;
    }

    const xByte = intToByte(x);
    const yByte = intToByte(y);

    const data = [MouseMode.RELATIVE, msKey.encode(), xByte, yByte, scroll];
    const cmdData = new CmdPacket(this.addr, CmdEvent.SEND_MS_REL_DATA, data).encode();
    await this.serialPort.write(cmdData);
  }
}

export const device = new Device();
