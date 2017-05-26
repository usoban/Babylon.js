// ====================================
// Global clock facility.
// ====================================

class GTime {

  constructor () {
    this._frozenTime    = null;   // TODO?!
    this._frozenCounter = 0;

    this._serverTimeOffset =  0//100; // TODO: THIS RIGHT NOW SIMULATES 100ms delay only for testing purposes!!!
  }

  /**
   * Computes current time in ms adjusted to the offset from the server.
   *
   * This means this method does not give current local time, but an adjustment
   * to be as close as possible to the server's local time.
   */
  getCurrentTime () {
    return Date.now() + this._serverTimeOffset;
  }

  /**
   * Returns the frozen value of the clock; if clock is currently not frozen, it
   * returns the current time.
   *
   * All times are adjusted for the offset from the server.
   */
  getCurrentFrozenTime () {
    if (this._frozenCounter > 0) {
      return this._frozenTime;
    }

    return this.getCurrentTime();
  };

  /**
   * Freezes the clock so that relative time does not change.
   *
   * This method is used at the start of Draw/Render method of the engine to freeze
   * the time used by ngRTS clock and ensure that all values retrieved from a timeline
   * using the get() method are relative to the same time point.
   *
   * This method must always be used in conjunction with unfreeze() method.
   */
  freeze () {
    if (this._frozenCounter === 0) {
      this._frozenTime = this.getCurrentTime();
    }

    this._frozenCounter++;
  };

  /**
   * Unfreezes the clock so that relative time updates.
   *
   * This method is used at the end of the draw/render method in the engine
   * to unfreeze the time used by the ngRTS clock.
   *
   * This method must always be used in conjunction with the freeze() method.
   */
  unfreeze () {
    this._frozenCounter--;
  };

  debug (description) {
    console.log('===> ', description)
    if (this._frozenCounter > 0) {
      console.log('Frozen clock: ', this._frozenTime);
    }
  }
}

// TODO.
// Setting globals here for convenience only...
window.GlobalTime = new GTime();
