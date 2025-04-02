export function getBit(number: number, bitPosition: number): number {
  return (number >> bitPosition) & 1;
}

export function setBit(number: number, bitPosition: number, value: boolean): number {
  if (value) {
    return number | (1 << bitPosition);
  } else {
    return number & ~(1 << bitPosition);
  }
}

export function intToLittleEndianList(number: number): number[] {
  const byteList: number[] = [];
  for (let i = 0; i < 2; i++) {
    byteList.push((number >> (i * 8)) & 0xff);
  }
  return byteList;
}
