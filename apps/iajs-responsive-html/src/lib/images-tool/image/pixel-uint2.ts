/** @format */

import { Channel } from '../color/channel.js'
import { Color, ColorConvertOptions } from '../color/color.js'
import { ColorUtils } from '../color/color-utils.js'
import { Format } from '../color/format.js'
import { ArrayUtils } from '../common/array-utils.js'
import { MathUtils } from '../common/math-utils.js'
import { MemoryImage } from './image.js'
import { MemoryImageDataUint2 } from './image-data-uint2.js'
import { Palette } from './palette.js'
import { Pixel } from './pixel.js'

/**
 * Represents a pixel in a 2-bit memory image.
 */
export class PixelUint2 implements Pixel, Iterable<Pixel>, Iterator<Pixel> {
  private _index: number
  private _bitIndex: number
  private _rowOffset: number

  private readonly _image: MemoryImageDataUint2

  /**
   * Gets the image data associated with this pixel.
   */
  public get image(): MemoryImageDataUint2 {
    return this._image
  }

  private _x: number

  /**
   * Gets the x-coordinate of the pixel.
   */
  public get x(): number {
    return this._x
  }

  private _y: number

  /**
   * Gets the y-coordinate of the pixel.
   */
  public get y(): number {
    return this._y
  }

  /**
   * Gets the normalized x-coordinate of the pixel.
   */
  public get xNormalized(): number {
    return this.width > 1 ? this._x / (this.width - 1) : 0
  }

  /**
   * Gets the normalized y-coordinate of the pixel.
   */
  public get yNormalized(): number {
    return this.height > 1 ? this._y / (this.height - 1) : 0
  }

  /**
   * Gets or sets the index of the pixel.
   */
  public get index(): number {
    return this.getChannelInternal(0)
  }
  public set index(i: number) {
    this.setChannel(0, i)
  }

  /**
   * Gets the raw data of the image.
   */
  public get data(): Uint8Array {
    return this._image.data
  }

  /**
   * Checks if the pixel is within the valid range of the image.
   */
  public get isValid(): boolean {
    return this._x >= 0 && this._x < this._image.width - 1 && this._y >= 0 && this._y < this._image.height - 1
  }

  /**
   * Gets the width of the image.
   */
  public get width(): number {
    return this._image.width
  }

  /**
   * Gets the height of the image.
   */
  public get height(): number {
    return this._image.height
  }

  /**
   * Gets the number of channels in the pixel.
   */
  public get length(): number {
    return this.palette?.numChannels ?? this._image.numChannels
  }

  /**
   * Gets the number of channels in the image.
   */
  public get numChannels(): number {
    return this._image.numChannels
  }

  /**
   * Gets the maximum value for any channel in the image.
   */
  public get maxChannelValue(): number {
    return this._image.maxChannelValue
  }

  /**
   * Gets the maximum index value for the image.
   */
  public get maxIndexValue(): number {
    return this._image.maxIndexValue
  }

  /**
   * Gets the format of the image.
   */
  public get format(): Format {
    return Format.uint2
  }

  /**
   * Checks if the image is in LDR format.
   */
  public get isLdrFormat(): boolean {
    return this._image.isLdrFormat
  }

  /**
   * Checks if the image is in HDR format.
   */
  public get isHdrFormat(): boolean {
    return this._image.isLdrFormat
  }

  /**
   * Checks if the image has a palette.
   */
  public get hasPalette(): boolean {
    return this._image.hasPalette
  }

  /**
   * Gets the palette associated with the image, if any.
   */
  public get palette(): Palette | undefined {
    return this._image.palette
  }

  /**
   * Gets or sets the red channel value.
   */
  public get r(): number {
    return this.getChannel(0)
  }
  public set r(r: number) {
    this.setChannel(0, r)
  }

  /**
   * Gets or sets the green channel value.
   */
  public get g(): number {
    return this.getChannel(1)
  }
  public set g(g: number) {
    this.setChannel(1, g)
  }

  /**
   * Gets or sets the blue channel value.
   */
  public get b(): number {
    return this.getChannel(2)
  }
  public set b(b: number) {
    this.setChannel(2, b)
  }

  /**
   * Gets or sets the alpha channel value.
   */
  public get a(): number {
    return this.getChannel(3)
  }
  public set a(a: number) {
    this.setChannel(3, a)
  }

  /**
   * Gets or sets the normalized red channel value.
   */
  public get rNormalized(): number {
    return this.r / this.maxChannelValue
  }
  public set rNormalized(v: number) {
    this.r = v * this.maxChannelValue
  }

  /**
   * Gets or sets the normalized green channel value.
   */
  public get gNormalized(): number {
    return this.g / this.maxChannelValue
  }
  public set gNormalized(v: number) {
    this.g = v * this.maxChannelValue
  }

  /**
   * Gets or sets the normalized blue channel value.
   */
  public get bNormalized(): number {
    return this.b / this.maxChannelValue
  }
  public set bNormalized(v: number) {
    this.b = v * this.maxChannelValue
  }

  /**
   * Gets or sets the normalized alpha channel value.
   */
  public get aNormalized(): number {
    return this.a / this.maxChannelValue
  }
  public set aNormalized(v: number) {
    this.a = v * this.maxChannelValue
  }

  /**
   * Gets the luminance of the pixel.
   */
  public get luminance(): number {
    return ColorUtils.getLuminance(this)
  }

  /**
   * Gets the normalized luminance of the pixel.
   */
  public get luminanceNormalized(): number {
    return ColorUtils.getLuminanceNormalized(this)
  }

  /**
   * Gets the bits per pixel.
   */
  public get bitsPerPixel(): number {
    return this._image.palette !== undefined ? 2 : this._image.numChannels << 1
  }

  /**
   * Constructs a new PixelUint2 instance.
   * @param {number} x - The x-coordinate of the pixel.
   * @param {number} y - The y-coordinate of the pixel.
   * @param {number} index - The index of the pixel.
   * @param {number} bitIndex - The bit index of the pixel.
   * @param {number} rowOffset - The row offset of the pixel.
   * @param {MemoryImageDataUint2} image - The image data associated with the pixel.
   */
  constructor(x: number, y: number, index: number, bitIndex: number, rowOffset: number, image: MemoryImageDataUint2) {
    this._image = image
    this._index = index
    this._bitIndex = bitIndex
    this._rowOffset = rowOffset
    this._x = x
    this._y = y
  }

  /**
   * Creates a new PixelUint2 instance from image data.
   * @param {MemoryImageDataUint2} image - The image data.
   * @returns {PixelUint2} A new PixelUint2 instance.
   */
  public static imageData(image: MemoryImageDataUint2): PixelUint2 {
    return new PixelUint2(-1, 0, 0, -2, 0, image)
  }

  /**
   * Creates a new PixelUint2 instance from an image.
   * @param {MemoryImage} image - The image.
   * @returns {PixelUint2} A new PixelUint2 instance.
   */
  public static image(image: MemoryImage): PixelUint2 {
    return new PixelUint2(
      -1,
      0,
      0,
      -2,
      0,
      image.data instanceof MemoryImageDataUint2
        ? (image.data as MemoryImageDataUint2)
        : new MemoryImageDataUint2(0, 0, 0),
    )
  }

  /**
   * Creates a new PixelUint2 instance from another PixelUint2 instance.
   * @param {PixelUint2} other - The other PixelUint2 instance.
   * @returns {PixelUint2} A new PixelUint2 instance.
   */
  public static from(other: PixelUint2): PixelUint2 {
    return new PixelUint2(other.x, other.y, other._index, other._bitIndex, other._rowOffset, other.image)
  }

  /**
   * Gets the internal channel value.
   * @param {number} channel - The channel index.
   * @returns {number} The internal channel value.
   */
  private getChannelInternal(channel: number): number {
    let i = this._index
    let bi = 6 - (this._bitIndex + (channel << 1))
    if (bi < 0) {
      bi += 8
      i++
    }
    return (this._image.data[i] >>> bi) & 0x3
  }

  /**
   * Advances the iterator to the next pixel.
   * @returns {IteratorResult<Pixel>} The result of the iteration.
   */
  public next(): IteratorResult<Pixel> {
    this._x++
    if (this._x === this.width) {
      this._x = 0
      this._y++
      this._bitIndex = 0
      this._index++
      this._rowOffset += this.image.rowStride
      return <IteratorResult<Pixel>>{
        done: this._y >= this.height,
        value: this,
      }
    }

    const nc = this.numChannels
    if (this.palette !== undefined || nc === 1) {
      this._bitIndex += 2
      if (this._bitIndex > 7) {
        this._bitIndex = 0
        this._index++
      }
    } else {
      const bpp = this.bitsPerPixel
      this._bitIndex = (this._x * bpp) & 0x7
      this._index = this._rowOffset + ((this._x * bpp) >>> 3)
    }
    return <IteratorResult<Pixel>>{
      done: this._index >= this.image.data.length,
      value: this,
    }
  }

  /**
   * Sets the position of the pixel.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   */
  public setPosition(x: number, y: number): void {
    this._x = x
    this._y = y
    const bpp = this.bitsPerPixel
    this._rowOffset = this._y * this._image.rowStride
    this._index = this._rowOffset + ((this._x * bpp) >>> 3)
    this._bitIndex = (this._x * bpp) & 0x7
  }

  /**
   * Sets the normalized position of the pixel.
   * @param {number} x - The normalized x-coordinate.
   * @param {number} y - The normalized y-coordinate.
   */
  public setPositionNormalized(x: number, y: number): void {
    return this.setPosition(Math.floor(x * (this.width - 1)), Math.floor(y * (this.height - 1)))
  }

  /**
   * Gets the value of a specific channel.
   * @param {number | Channel} channel - The channel index or type.
   * @returns {number} The value of the specified channel.
   */
  public getChannel(channel: number | Channel): number {
    if (this.palette !== undefined) {
      return this.palette.get(this.getChannelInternal(0), channel)
    } else {
      if (channel === Channel.luminance) {
        return this.luminance
      } else {
        return channel < this.numChannels ? this.getChannelInternal(channel) : 0
      }
    }
  }

  /**
   * Gets the normalized value of a specific channel.
   * @param {Channel} channel - The channel type.
   * @returns {number} The normalized value of the specified channel.
   */
  public getChannelNormalized(channel: Channel): number {
    return this.getChannel(channel) / this.maxChannelValue
  }

  /**
   * Sets the value of a specific channel.
   * @param {number} channel - The channel index.
   * @param {number} value - The value to set.
   */
  public setChannel(channel: number, value: number): void {
    if (channel >= this.image.numChannels) {
      return
    }

    let i = this._index
    let bi = 6 - (this._bitIndex + (channel << 1))
    if (bi < 0) {
      bi += 8
      i++
    }

    let v = this.data[i]

    const vi = MathUtils.clampInt(value, 0, 3)
    const msk = [0xfc, 0xf3, 0xcf, 0x3f]
    const mask = msk[bi >>> 1]
    v = (v & mask) | (vi << bi)
    this.data[i] = v
  }

  /**
   * Sets the pixel color.
   * @param {Color} color - The color to set.
   */
  public set(color: Color): void {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    this.a = color.a
  }

  /**
   * Sets the RGB values of the pixel.
   * @param {number} r - The red value.
   * @param {number} g - The green value.
   * @param {number} b - The blue value.
   */
  public setRgb(r: number, g: number, b: number): void {
    const nc = this.image.numChannels
    if (nc > 0) {
      this.setChannel(0, r)
      if (nc > 1) {
        this.setChannel(1, g)
        if (nc > 2) {
          this.setChannel(2, b)
        }
      }
    }
  }

  /**
   * Sets the RGBA values of the pixel.
   * @param {number} r - The red value.
   * @param {number} g - The green value.
   * @param {number} b - The blue value.
   * @param {number} a - The alpha value.
   */
  public setRgba(r: number, g: number, b: number, a: number): void {
    const nc = this.image.numChannels
    if (nc > 0) {
      this.setChannel(0, r)
      if (nc > 1) {
        this.setChannel(1, g)
        if (nc > 2) {
          this.setChannel(2, b)
          if (nc > 3) {
            this.setChannel(3, a)
          }
        }
      }
    }
  }

  /**
   * Checks if the pixel is equal to another pixel or array of values.
   * @param {Pixel | number[]} other - The other pixel or array of values.
   * @returns {boolean} True if the pixel is equal to the other pixel or array of values, false otherwise.
   */
  public equals(other: Pixel | number[]): boolean {
    if (other instanceof PixelUint2) {
      return ArrayUtils.equals(this.toArray(), other.toArray())
    }
    if (Array.isArray(other)) {
      return ArrayUtils.equals(this.toArray(), other)
    }
    return false
  }

  /**
   * Converts the pixel to an array of channel values.
   * @returns {number[]} An array of channel values.
   */
  public toArray(): number[] {
    return ArrayUtils.generate<number>(this.length, (i) => this.getChannel(i))
  }

  /**
   * Clones the pixel.
   * @returns {PixelUint2} A clone of the pixel.
   */
  public clone(): PixelUint2 {
    return PixelUint2.from(this)
  }

  /**
   * Converts the pixel to a color.
   * @param {ColorConvertOptions} opt - The color conversion options.
   * @param {string} opt.format - The format to convert the color to (e.g., 'rgb', 'hex').
   * @param {number} opt.numChannels - The number of color channels (e.g., 3 for RGB, 4 for RGBA).
   * @param {number} [opt.alpha] - The alpha value for the color (optional).
   * @returns {Color} The converted color.
   */
  public convert(opt: ColorConvertOptions): Color {
    return ColorUtils.convertColor({
      from: this,
      format: opt.format,
      numChannels: opt.numChannels,
      alpha: opt.alpha,
    })
  }

  /**
   * Converts the pixel to a string representation.
   * @returns {string} The string representation of the pixel.
   */
  public toString(): string {
    return `${this.constructor.name} (${this.toArray()})`
  }

  /**
   * Returns an iterator for the pixel.
   * @returns {Iterator<Pixel>} An iterator for the pixel.
   */
  public [Symbol.iterator](): Iterator<Pixel> {
    return this
  }
}
