/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxImage
 *
 * Encapsulates the URL, width and height of an image.
 *
 * Constructor: MxImage
 *
 * Constructs a new image.
 */
export default class MxImage {
  constructor(src, width, height) {
    this.src = src
    this.width = width
    this.height = height
  }
}

/**
 * Variable: src
 *
 * String that specifies the URL of the image.
 */
MxImage.prototype.src = null

/**
 * Variable: width
 *
 * Integer that specifies the width of the image.
 */
MxImage.prototype.width = null

/**
 * Variable: height
 *
 * Integer that specifies the height of the image.
 */
MxImage.prototype.height = null
