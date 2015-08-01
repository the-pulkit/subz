/*
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

goog.provide('app.Constants');

/**
 * Playground scene constants
 *
 * @const
 */
app.Constants = {
  HOUSE_CSS_SELECTOR: '.js-house',
  HOUSE_NOSE_SELECTOR: '.js-house-nose',
  HOUSE_BG_SELECTOR: '.js-face-bg',
  HOUSE_IRIS_SELECTOR: '.js-iris',

  NOSE_TRANSITION_DURATION: 300,

  CLASS_PAUSE_ANIMATION: 'pause-eyes-animating',

  EASE_IN_QUAD: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
  EASE_OUT_QUAD: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
  EASE_IN_OUT_QUAD: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',

  COLOR_IN_DURATION: 200,
  COLOR_OUT_DURATION: 3000,
  COLOR_OUT_DELAY: 2000,

  SUPRISED_ANIMATION_DURATION: 150,

  SURPRISED_FACE_NOSE_DURATION: 800,
  SURPRISED_FACE_NOSE_DELAY: 0,

  SURPRISED_FACE_COLOR_DURATION: 2000,
  SURPRISED_FACE_COLOR_DELAY: 0,

  EYE_DIAMETER: 14, // px

  MOUTH_SURPRISED: {
    cx: 10,
    cy: 37,
    rx: 6,
    ry: 6
  }
};
