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

/**
 * @constructor
 */
function VillagePegman(el) {
  this.container_ = el;
  this.isPaused_ = true;

  this.pegman_ = this.container_.querySelector('#pegman');
  this.canShow_ =
      VillagePegman.LANGUAGES_.indexOf(document.documentElement.lang) != -1 &&
      Modernizr.webgl;

  if (!this.canShow_) {
    this.pegman_.parentNode.removeChild(this.pegman_);
  }
}

/**
 * @private
 * @type {Array.<string>}
 */
VillagePegman.LANGUAGES_ = ['en', 'en-GB'];

/**
 * @private
 * @type {number}
 */
VillagePegman.SKYDIVE_TIME_ = 25000;

/**
 * @private
 * @type {number}
 */
VillagePegman.FREEFALL_TIME_ = 0.305 * VillagePegman.SKYDIVE_TIME_;

/**
 * @private
 * @type {number}
 */
VillagePegman.MIN_SKYDIVE_TIME_ = 60000;

/**
 * @private
 * @type {number}
 */
VillagePegman.MAX_SKYDIVE_TIME_ = 120000;

/**
 * @private
 * @type {number}
 */
VillagePegman.LAND_TIME_ = 15000;

/**
 * Start a skydive
 */
VillagePegman.prototype.start = function() {
  if (!this.canShow_) return;
  this.isPaused_ = false;
  this.skyDive_();
};

VillagePegman.prototype.pause = function() {
  this.isPaused_ = true;
};

VillagePegman.prototype.resume = function() {
  if (!this.canShow_) return;
  this.isPaused_ = false;

  if (this.pegman_.classList.contains('landed')) {
    this.schedulePegmanPickup_();
  } else {
    this.skyDive_();
  }
};

/**
 * Stop skydiving
 */
VillagePegman.prototype.stop = function() {
  window.clearTimeout(this.pickupPegmanTimeoutID_);
};

/**
 * Sky dive
 * @param {!Element} snowMobile
 */
VillagePegman.prototype.skyDive_ = function() {
  if (this.isPaused_) return;

  var pegman = this.pegman_;

  pegman.classList.switch('landed', 'dive');
  pegman.classList.add('diving');
  pegman.classList.remove('takeoff');

  window.setTimeout(function() {
    pegman.classList.switch('dive', 'chute');
  }, VillagePegman.FREEFALL_TIME_);

  window.setTimeout(function() {
    pegman.classList.switch('chute', 'landed');
    pegman.classList.remove('diving');
  }, VillagePegman.SKYDIVE_TIME_);

  this.schedulePegmanPickup_();
};

VillagePegman.prototype.schedulePegmanPickup_ = function() {
  if (this.isPaused_) return;

  window.clearTimeout(this.pickupPegmanTimeoutID_);

  var pickupTime = VillagePegman.MIN_SKYDIVE_TIME_ +
      Math.random() * VillagePegman.MAX_SKYDIVE_TIME_;
  this.pickupPegmanTimeoutID_ = window.setTimeout(
      this.pickupPegman_.bind(this), pickupTime);
};

VillagePegman.prototype.pickupPegman_ = function() {
  if (this.isPaused_) return;

  var pegman = this.pegman_;

  var spaceship = this.container_.querySelector('#spaceship');
  spaceship.classList.add('to-space');

  var pegmanSpaceship = this.container_.querySelector('#pegman-spaceship');
  pegmanSpaceship.classList.add('land');

  var t = VillagePegman.LAND_TIME_ + 200;

  window.setTimeout(function() {
    pegman.classList.add('takeoff');
  }, t);

  t += 200;

  window.setTimeout(function() {
    pegmanSpaceship.classList.remove('land');
  }, t);

  t += VillagePegman.LAND_TIME_;

  window.setTimeout(function() {
    pegman.classList.remove('landed');
    spaceship.classList.remove('to-space');
  }, t);

  t += 5000;

  window.setTimeout(this.skyDive_.bind(this), t);
};
