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
goog.provide('Constants');

/**
 * These are gameplay and UI related constants used by the code.
 * Please tweak them to improve gameplay and game balance.
 */
app.Constants = {
  INITIAL_COUNTDOWN: 60, // in seconds

  COUNTDOWN_TRACK_LENGTH: 60, // in seconds
  COUNTDOWN_TRACK_MAX_X: 150, // pixels
  COUNTDOWN_FLASH: 10, // seconds left when countdown starts flashing

  EVENT_ORIGIN: 'localhost',

  CLASS_PAUSED: 'paused',

  VARITALK_URL: 'https://www.sendacallfromsanta.com'
};

Constants = app.Constants;
