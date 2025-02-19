/** @format */

import { NeuralQuantizer } from '../image/neural-quantizer.js'
import { OutputBuffer } from '../common/output-buffer.js'
import { StringUtils } from '../common/string-utils.js'
import { Encoder, EncoderEncodeOptions } from './encoder.js'
import { QuantizerType } from '../image/quantizer-type.js'
import { MemoryImage } from '../image/image.js'
import { OctreeQuantizer } from '../image/octree-quantizer.js'
import { Quantizer } from '../image/quantizer.js'
import { Filter } from '../filter/filter.js'
import { LibError } from '../error/lib-error.js'
import { DitherKernel } from '../filter/dither-kernel.js'
import { BinaryQuantizer } from '../image/binary-quantizer.js'

/**
 * Interface for initializing GifEncoder options.
 */
export interface GifEncoderInitOptions {
  /** The delay between frames in milliseconds. */
  delay?: number
  /** The number of times the GIF should loop. 0 means infinite looping. */
  repeat?: number
  /**  The sampling factor for color quantization. */
  samplingFactor?: number
  /** The dithering kernel to use. */
  dither?: DitherKernel
  /** Whether to use serpentine dithering. */
  ditherSerpentine?: boolean
}

/**
 * Class for encoding GIF images.
 */
export class GifEncoder implements Encoder {
  /**
   * GIF89a identifier.
   */
  private static readonly _gif89Id = 'GIF89a'

  /**
   * Image Descriptor Record Type.
   */
  private static readonly _imageDescRecordType = 0x2c

  /**
   * Extension Record Type.
   */
  private static readonly _extensionRecordType = 0x21

  /**
   * Terminate Record Type.
   */
  private static readonly _terminateRecordType = 0x3b

  /**
   * Application Extension.
   */
  private static readonly _applicationExt = 0xff

  /**
   * Graphic Control Extension.
   */
  private static readonly _graphicControlExt = 0xf9

  /**
   * End of File.
   */
  private static readonly _eof = -1

  /**
   * Number of bits.
   */
  private static readonly _bits = 12

  /**
   * Hash table size.
   */
  private static readonly _hSize = 5003

  /**
   * Masks for bit operations.
   */
  private static readonly _masks = [
    0x0000, 0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff, 0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff,
    0x3fff, 0x7fff, 0xffff,
  ]

  /**
   * Delay between frames.
   */
  private _delay: number

  /**
   * Repeat count for the GIF.
   */
  private _repeat: number

  /**
   * Number of colors in the palette.
   */
  private _numColors: number

  /**
   * Type of quantizer to use.
   */
  private _quantizerType: QuantizerType

  /**
   * Sampling factor for the quantizer.
   */
  private _samplingFactor: number

  /**
   * Last image added to the encoder.
   */
  private _lastImage?: MemoryImage

  /**
   * Duration of the last image.
   */
  private _lastImageDuration?: number

  /**
   * Last color map used.
   */
  private _lastColorMap?: Quantizer

  /**
   * Width of the GIF.
   */
  private _width!: number

  /**
   * Height of the GIF.
   */
  private _height!: number

  /**
   * Number of encoded frames.
   */
  private _encodedFrames: number

  /**
   * Current accumulator for LZW encoding.
   */
  private _curAccum = 0

  /**
   * Current bits for LZW encoding.
   */
  private _curBits = 0

  /**
   * Number of bits for LZW encoding.
   */
  private _nBits = 0

  /**
   * Initial number of bits for LZW encoding.
   */
  private _initBits = 0

  /**
   * End of file code for LZW encoding.
   */
  private _eofCode = 0

  /**
   * Maximum code for LZW encoding.
   */
  private _maxCode = 0

  /**
   * Clear code for LZW encoding.
   */
  private _clearCode = 0

  /**
   * Free entry for LZW encoding.
   */
  private _freeEnt = 0

  /**
   * Flag indicating if the clear code was used.
   */
  private _clearFlag = false

  /**
   * Block of bytes for LZW encoding.
   */
  private _block!: Uint8Array

  /**
   * Size of the block for LZW encoding.
   */
  private _blockSize = 0

  /**
   * Output buffer for the encoded GIF.
   */
  private _outputBuffer?: OutputBuffer

  /**
   * Dither kernel to use.
   */
  private _dither: DitherKernel

  /**
   * Flag indicating if serpentine dithering is used.
   */
  private _ditherSerpentine: boolean

  /**
   * Does this encoder support animation?
   */
  private readonly _supportsAnimation = true

  /**
   * Getter for supportsAnimation.
   */
  public get supportsAnimation(): boolean {
    return this._supportsAnimation
  }

  /**
   * Constructor for GifEncoder.
   * @param {GifEncoderInitOptions} [opt] - Initialization options.
   * @param {number} [opt.delay] - The delay between frames in milliseconds. Default is 80.
   * @param {number} [opt.repeat] - The number of times the animation should repeat. Default is 0 (infinite).
   * @param {number} [opt.samplingFactor] - The factor by which to downsample the image. Default is 10.
   * @param {string} [opt.dither] - The dithering algorithm to use. Default is Floyd-Steinberg.
   * @param {boolean} [opt.ditherSerpentine] - Whether to use serpentine dithering. Default is false.
   */
  constructor(opt?: GifEncoderInitOptions) {
    this._delay = opt?.delay ?? 80
    this._repeat = opt?.repeat ?? 0
    this._numColors = 256
    this._quantizerType = QuantizerType.neural
    this._samplingFactor = opt?.samplingFactor ?? 10
    this._dither = opt?.dither ?? DitherKernel.floydSteinberg
    this._ditherSerpentine = opt?.ditherSerpentine ?? false
    this._encodedFrames = 0
  }

  /**
   * Adds an image to the GIF.
   * @param {MemoryImage} image - The image to add.
   * @param {number} width - The width of the image.
   * @param {number} height - The height of the image.
   * @throws {LibError} Throws an error if the image does not have a palette.
   */
  private addImage(image: MemoryImage, width: number, height: number): void {
    if (!image.hasPalette) {
      throw new LibError('GIF can only encode palette images.')
    }

    const palette = image.palette!
    const numColors = palette.numColors

    const out = this._outputBuffer!

    // Image desc
    out.writeByte(GifEncoder._imageDescRecordType)
    // image position x,y = 0,0
    out.writeUint16(0)
    out.writeUint16(0)
    // image size
    out.writeUint16(width)
    out.writeUint16(height)

    const paletteBytes = palette.toUint8Array()

    // Local Color Map
    // (0x80: Use LCM, 0x07: Palette Size (7 = 8-bit))
    out.writeByte(0x87)

    const numChannels = palette.numChannels
    if (numChannels === 3) {
      out.writeBytes(paletteBytes)
    } else if (numChannels === 4) {
      for (let i = 0, pi = 0; i < numColors; ++i, pi += 4) {
        out.writeByte(paletteBytes[pi])
        out.writeByte(paletteBytes[pi + 1])
        out.writeByte(paletteBytes[pi + 2])
      }
    } else if (numChannels === 1 || numChannels === 2) {
      for (let i = 0, pi = 0; i < numColors; ++i, pi += numChannels) {
        const g = paletteBytes[pi]
        out.writeByte(g)
        out.writeByte(g)
        out.writeByte(g)
      }
    }

    for (let i = numColors; i < 256; ++i) {
      out.writeByte(0)
      out.writeByte(0)
      out.writeByte(0)
    }

    this.encodeLZW(image)
  }

  /**
   * Encodes the image using LZW compression.
   * @param {MemoryImage} image - The image to encode.
   */
  private encodeLZW(image: MemoryImage): void {
    this._curAccum = 0
    this._curBits = 0
    this._blockSize = 0
    this._block = new Uint8Array(256)

    const initCodeSize = 8
    this._outputBuffer!.writeByte(initCodeSize)

    const hTab = new Int32Array(GifEncoder._hSize)
    const codeTab = new Int32Array(GifEncoder._hSize)
    const pIter = image[Symbol.iterator]()
    let pIterRes = pIter.next()

    this._initBits = initCodeSize + 1
    this._nBits = this._initBits
    this._maxCode = (1 << this._nBits) - 1
    this._clearCode = 1 << (this._initBits - 1)
    this._eofCode = this._clearCode + 1
    this._clearFlag = false
    this._freeEnt = this._clearCode + 2
    let pFinished = false

    const nextPixel = (): number => {
      if (pFinished) {
        return GifEncoder._eof
      }
      const r = Math.trunc(pIterRes.value.index)
      if (((pIterRes = pIter.next()), pIterRes.done)) {
        pFinished = true
      }
      return r
    }

    let ent = nextPixel()

    let hShift = 0
    for (let fCode = GifEncoder._hSize; fCode < 65536; fCode *= 2) {
      hShift++
    }
    hShift = 8 - hShift

    const hSizeReg = GifEncoder._hSize
    for (let i = 0; i < hSizeReg; ++i) {
      hTab[i] = -1
    }

    this.output(this._clearCode)

    let outerLoop = true
    while (outerLoop) {
      outerLoop = false

      let c = nextPixel()
      while (c !== GifEncoder._eof) {
        const fcode = (c << GifEncoder._bits) + ent
        // xor hashing
        let i = (c << hShift) ^ ent

        if (hTab[i] === fcode) {
          ent = codeTab[i]
          c = nextPixel()
          continue
        } else if (hTab[i] >= 0) {
          // non-empty slot
          // secondary hash (after G. Knott)
          let disp = hSizeReg - i
          if (i === 0) {
            disp = 1
          }
          do {
            if ((i -= disp) < 0) {
              i += hSizeReg
            }

            if (hTab[i] === fcode) {
              ent = codeTab[i]
              outerLoop = true
              break
            }
          } while (hTab[i] >= 0)
          if (outerLoop) {
            break
          }
        }

        this.output(ent)
        ent = c

        if (this._freeEnt < 1 << GifEncoder._bits) {
          // code -> hashtable
          codeTab[i] = this._freeEnt++
          hTab[i] = fcode
        } else {
          for (let i = 0; i < GifEncoder._hSize; ++i) {
            hTab[i] = -1
          }
          this._freeEnt = this._clearCode + 2
          this._clearFlag = true
          this.output(this._clearCode)
        }

        c = nextPixel()
      }
    }

    this.output(ent)
    this.output(this._eofCode)

    this._outputBuffer!.writeByte(0)
  }

  /**
   * Outputs the given code.
   * @param {number | undefined} code - The code to output.
   */
  private output(code: number | undefined): void {
    this._curAccum &= GifEncoder._masks[this._curBits]

    if (this._curBits > 0) {
      this._curAccum |= code! << this._curBits
    } else {
      this._curAccum = code!
    }

    this._curBits += this._nBits

    while (this._curBits >= 8) {
      this.addToBlock(this._curAccum & 0xff)
      this._curAccum >>>= 8
      this._curBits -= 8
    }

    // If the next entry is going to be too big for the code size,
    // then increase it, if possible.
    if (this._freeEnt > this._maxCode || this._clearFlag) {
      if (this._clearFlag) {
        this._nBits = this._initBits
        this._maxCode = (1 << this._nBits) - 1
        this._clearFlag = false
      } else {
        ++this._nBits
        if (this._nBits === GifEncoder._bits) {
          this._maxCode = 1 << GifEncoder._bits
        } else {
          this._maxCode = (1 << this._nBits) - 1
        }
      }
    }

    if (code === this._eofCode) {
      // At EOF, write the rest of the buffer.
      while (this._curBits > 0) {
        this.addToBlock(this._curAccum & 0xff)
        this._curAccum >>>= 8
        this._curBits -= 8
      }
      this.writeBlock()
    }
  }

  /**
   * Writes the current block to the output buffer.
   */
  private writeBlock(): void {
    if (this._blockSize > 0) {
      this._outputBuffer!.writeByte(this._blockSize)
      this._outputBuffer!.writeBytes(this._block, this._blockSize)
      this._blockSize = 0
    }
  }

  /**
   * Adds a byte to the current block.
   * @param {number} c - The byte to add.
   */
  private addToBlock(c: number): void {
    this._block[this._blockSize++] = c
    if (this._blockSize >= 254) {
      this.writeBlock()
    }
  }

  /**
   * Writes the application extension block.
   */
  private writeApplicationExt(): void {
    this._outputBuffer!.writeByte(GifEncoder._extensionRecordType)
    this._outputBuffer!.writeByte(GifEncoder._applicationExt)
    // Data block size
    this._outputBuffer!.writeByte(11)
    const appCodeUnits = StringUtils.getCodePoints('NETSCAPE2.0')
    // App identifier
    this._outputBuffer!.writeBytes(appCodeUnits)
    this._outputBuffer!.writeBytes(new Uint8Array([0x03, 0x01]))
    // Loop count
    this._outputBuffer!.writeUint16(this._repeat)
    // Block terminator
    this._outputBuffer!.writeByte(0)
  }

  /**
   * Writes the graphics control extension block.
   * @param {MemoryImage} image - The image for which the extension is written.
   */
  private writeGraphicsCtrlExt(image: MemoryImage): void {
    this._outputBuffer!.writeByte(GifEncoder._extensionRecordType)
    this._outputBuffer!.writeByte(GifEncoder._graphicControlExt)
    // data block size
    this._outputBuffer!.writeByte(4)

    let transparentIndex = 0
    let hasTransparency = 0
    const palette = image.palette!
    const nc = palette.numChannels
    const pa = nc - 1
    if (nc === 4 || nc === 2) {
      const p = palette.toUint8Array()
      const l = palette.numColors
      for (let i = 0, pi = pa; i < l; ++i, pi += nc) {
        const a = p[pi]
        if (a === 0) {
          hasTransparency = 1
          transparentIndex = i
          break
        }
      }
    }

    // dispose: 0 = no action, 2 = clear
    const dispose = 2

    // 1:3 reserved
    const fields =
      0 |
      // 4:6 disposal
      (dispose << 2) |
      // 7   user input - 0 = none
      0 |
      // 8   transparency flag
      hasTransparency

    // packed fields
    this._outputBuffer!.writeByte(fields)

    // delay x 1/100 sec
    this._outputBuffer!.writeUint16(this._lastImageDuration ?? this._delay)
    // transparent color index
    this._outputBuffer!.writeByte(transparentIndex)
    // block terminator
    this._outputBuffer!.writeByte(0)
  }

  /**
   * Writes the GIF header and Logical Screen Descriptor.
   * @param {number} width - The width of the GIF.
   * @param {number} height - The height of the GIF.
   */
  private writeHeader(width: number, height: number): void {
    const idCodeUnits = StringUtils.getCodePoints(GifEncoder._gif89Id)
    this._outputBuffer!.writeBytes(idCodeUnits)
    this._outputBuffer!.writeUint16(width)
    this._outputBuffer!.writeUint16(height)
    // global color map parameters (not being used).
    this._outputBuffer!.writeByte(0)
    // Background color index.
    this._outputBuffer!.writeByte(0)
    // Aspect
    this._outputBuffer!.writeByte(0)
  }

  /**
   * Encode the images that were added with **addFrame**.
   * After this has been called (returning the finished GIF),
   * calling **addFrame** for a new animation or image is safe again.
   *
   * **addFrame** will not encode the first image passed and after that
   * always encode the previous image. Hence, the last image needs to be
   * encoded here.
   *
   * @returns {Uint8Array | undefined} The encoded GIF as a byte array, or undefined if there was an error.
   */
  private finish(): Uint8Array | undefined {
    let bytes: Uint8Array | undefined = undefined
    if (this._outputBuffer === undefined) {
      return bytes
    }

    if (this._encodedFrames === 0) {
      this.writeHeader(this._width, this._height)
      this.writeApplicationExt()
    }
    this.writeGraphicsCtrlExt(this._lastImage!)

    this.addImage(this._lastImage!, this._width, this._height)

    this._outputBuffer.writeByte(GifEncoder._terminateRecordType)

    this._lastImage = undefined
    this._lastColorMap = undefined
    this._encodedFrames = 0

    bytes = this._outputBuffer.getBytes()
    this._outputBuffer = undefined
    return bytes
  }

  /**
   * This adds the frame passed to **image**.
   * After the last frame has been added, **finish** is required to be called.
   * Optional frame **duration** is in 1/100 sec.
   *
   * @param {MemoryImage} image - The image to add as a frame.
   * @param {number} [duration] - Optional duration of the frame in 1/100 sec.
   */
  public addFrame(image: MemoryImage, duration?: number): void {
    if (this._outputBuffer === undefined) {
      this._outputBuffer = new OutputBuffer()

      if (!image.hasPalette) {
        if (this._quantizerType === QuantizerType.neural) {
          this._lastColorMap = new NeuralQuantizer(image, this._numColors, this._samplingFactor)
        } else if (this._quantizerType === QuantizerType.octree) {
          this._lastColorMap = new OctreeQuantizer(image, this._numColors)
        } else {
          this._lastColorMap = new BinaryQuantizer()
        }

        this._lastImage = Filter.ditherImage({
          image: image,
          quantizer: this._lastColorMap,
          kernel: this._dither,
          serpentine: this._ditherSerpentine,
        })
      } else {
        this._lastImage = image
      }

      this._lastImageDuration = duration

      this._width = image.width
      this._height = image.height
      return
    }

    if (this._encodedFrames === 0) {
      this.writeHeader(this._width, this._height)
      this.writeApplicationExt()
    }

    this.writeGraphicsCtrlExt(this._lastImage!)

    this.addImage(this._lastImage!, this._width, this._height)
    this._encodedFrames++

    if (!image.hasPalette) {
      if (this._quantizerType === QuantizerType.neural) {
        this._lastColorMap = new NeuralQuantizer(image, this._numColors, this._samplingFactor)
      } else if (this._quantizerType === QuantizerType.octree) {
        this._lastColorMap = new OctreeQuantizer(image, this._numColors)
      } else {
        this._lastColorMap = new BinaryQuantizer()
      }

      this._lastImage = Filter.ditherImage({
        image: image,
        quantizer: this._lastColorMap!,
        kernel: this._dither,
        serpentine: this._ditherSerpentine,
      })
    } else {
      this._lastImage = image
    }

    this._lastImageDuration = duration
  }

  /**
   * Encode a single frame image.
   * @param {EncoderEncodeOptions} opt - The options for encoding.
   * @param {MemoryImage} opt.image - The image to encode.
   * @param {boolean} [opt.singleFrame] - Optional flag to encode a single frame.
   * @returns {Uint8Array} The encoded image as a Uint8Array.
   */
  public encode(opt: EncoderEncodeOptions): Uint8Array {
    const image = opt.image
    const singleFrame = opt.singleFrame ?? false

    if (!image.hasAnimation || singleFrame) {
      this.addFrame(image)
      return this.finish()!
    }

    this._repeat = image.loopCount
    for (const f of image.frames) {
      // Convert ms to 1/100 sec.
      this.addFrame(f, Math.trunc(f.frameDuration / 10))
    }
    return this.finish()!
  }
}
