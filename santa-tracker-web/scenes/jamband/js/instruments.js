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

goog.provide('app.Instruments');

goog.require('app.Audio');
goog.require('app.Fallback');

/**
 * @typedef {{beat: number}}
 */
app.InstrumentOptions;

/**
 * @param {string} name of instrument
 * @param {!app.InstrumentOptions} options of instrument
 * @constructor
 */
app.Instrument = function(name, options) {
  this.name = name;
  this.el = this.elem.find('.Instrument-' + name.toLowerCase());
  this.container = this.el.closest('.InstrumentContainer');

  if (app.Audio.isSupported()) {
    this.audio = new app.Audio(name, options.beat);
  } else {
    this.audio = new app.Fallback(name);
  }

  this.el.on('dropped', (function(e, data) {
    this.drop(data);
  }).bind(this));

  this.el.on('returned', this.reset.bind(this));
  this.el.on('dragging', this.drag.bind(this));
  this.el.on('mousedown.jamband touchstart.jamband', this.preview.bind(this));
};

/**
 * Preview this Instrument.
 */
app.Instrument.prototype.preview = function() {
  // Play preview sound if the instrument is in the drawer or if we're in fallback mode.
  if (this.el.parent().is(this.container) || !app.Audio.isSupported()) {
    this.audio.preview();
  }
};

/**
 * Start this instrument playing.
 * @param {object} data
 */
app.Instrument.prototype.play = function(data) {
  var onPlaying = (function() {
    // Check we are still on stage
    if (this.el.parent().hasClass('Stage')) {
      this.el.removeClass('playing-0 playing-1').addClass('playing playing-' + data.pattern);
      this.elem.trigger('playing');
    }

    this.countOnStage();
  }).bind(this);

  this.audio.play(data.pattern, data.volume, onPlaying);
};

/**
 * Called when this Instrument is being dragged.
 */
app.Instrument.prototype.drag = function() {
  this.container.removeClass('collapse');
  this.el.removeClass('Instrument--small');
};

/**
 * Called when this Instrument is dropped.
 */
app.Instrument.prototype.drop = function(data) {
  this.play(data);
  this.container.addClass('collapse');
  this.el.addClass('waiting');
};

/**
 * Reset this Instrument. Called as part of being removed from the stage.
 */
app.Instrument.prototype.reset = function() {
  this.audio.stop();
  this.el.addClass('Instrument--small');
  this.el.removeClass('waiting playing playing-0 playing-1');
  this.countOnStage();
};

/**
 * Places this Instrument on a specific stage.
 * @param {!jQuery} stage to place on
 */
app.Instrument.prototype.putOnStage = function(stage) {
  this.el.trigger('dragging');
  this.el.appendTo(stage);
  this.el.trigger('dropped', stage.data());
};

/**
 * Return this Instrument to the drawer.
 */
app.Instrument.prototype.putInDrawer = function() {
  this.el.trigger('dragging');
  this.el.appendTo(this.container);
  this.el.trigger('returned');
};

/**
 * Trigger the stage count event, which informs listeners of how many
 * instruments are on the stage.
 */
app.Instrument.prototype.countOnStage = function() {
  var count = this.elem.find('.Stage .Instrument').length;
  this.elem.trigger('stagechanged.jamband', {count: count});
};

/**
 * Game instruments
 *
 * @param {!Element} elem A DOM element.
 * @constructor
 */
app.Instruments = function(elem) {
  this.elem = elem;
  app.Instrument.prototype.elem = elem;
  this.stages = elem.find('.Stage');

  this.bass = new app.Instrument('Bass', { beat: 32 });
  this.drums = new app.Instrument('Drums', { beat: 16 });
  this.bell = new app.Instrument('Bell', { beat: 16 });
  this.boombox = new app.Instrument('Boombox', { beat: 32 });
  this.guitar = new app.Instrument('Guitar', { beat: 32 });
  this.rap = new app.Instrument('Rap', { beat: 32 });
  this.sax = new app.Instrument('Sax', { beat: 32 });
  this.synth = new app.Instrument('Synth', { beat: 32 });
  this.tamb = new app.Instrument('Tamb', { beat: 16 });
  this.xylo = new app.Instrument('Xylo', { beat: 32 });

  this.instruments = [
    this.bass,
    this.drums,
    this.bell,
    this.boombox,
    this.guitar,
    this.rap,
    this.sax,
    this.synth,
    this.tamb,
    this.xylo
  ];

  if (app.Audio.isSupported()) {
    this.elem.on('dropped returned randomize reset restore', this.checkIfAllEmpty.bind(this));

    var random = elem.find('#drawer-button--random');
    random.on('mouseup.jamband touchend.jamband', this.randomize.bind(this));

    this.elem.trigger('reset');
  } else {
    this.restore('7,1,4,9,0,5');

    this.elem.find('.Drawer').hide();
  }
};

/**
 * Show help arrows if no instruments on stage
 */
app.Instruments.prototype.checkIfAllEmpty = function() {
  var count = this.elem.find('.Stage .Instrument').length;
  this.elem.toggleClass('is-allEmpty', count === 0);
};

/**
 * Put a random selection of instruments on stage
 */
app.Instruments.prototype.randomize = function() {
  function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  this.reset();

  var chosenInstruments = shuffle(this.instruments.slice()).slice(0, this.stages.length);

  this.stages.each(function(i, stage) {
    chosenInstruments[i].putOnStage($(stage));
  });

  this.elem.trigger('randomize');
};

/**
 * Remove all the instruments from the stage
 */
app.Instruments.prototype.reset = function() {
  this.instruments.forEach(function(instrument) {
    instrument.putInDrawer();
  });
};

/**
 * Save serializes the current configuration of instruments to a string.
 *
 * @return {string} serialized config of instruments
 */
app.Instruments.prototype.save = function() {
  if (!app.Audio.isSupported()) {
    return false;
  }

  var instruments = [];

  var instrumentElements = this.instruments.map(function(instrument) {
    return instrument.el[0];
  });

  this.stages.each(function(i, element) {
    var index = instrumentElements.indexOf($(element).find('.Instrument')[0]);
    instruments.push(index);
  });

  var noInstrumentsOnStage = instruments.every(function(i) {
    return i === -1;
  });

  if (noInstrumentsOnStage) {
    return false;
  }

  return instruments.join(',');
};

/**
 * Restores a previously serialized configuration of instruments.
 *
 * @param {string} instrumentString to restore
 */
app.Instruments.prototype.restore = function(instrumentString) {
  this.reset(); // clear stage

  var data = instrumentString.split(',').map(function(i) {
    return parseInt(i, 10);
  });

  var chosenInstruments = data.map(function(i) {
    return this.instruments[i];
  }, this);

  this.stages.each(function(i, element) {
    if (chosenInstruments[i]) {
      chosenInstruments[i].putOnStage($(element));
    }
  });

  this.elem.trigger('restore');
};
