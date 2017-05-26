// Represents a value at given timepoint.
// Times are stored in absolute form (ms since epoch aka UNIX timestamp).
// However, the getter for property `t` returns the time in relative form
// (relative to the current time).
// Times are also adjusted by server time offset so that all times are based
// on server time.

class TimeValue {

  constructor () {
    this._t = 0;
  }

  get t () {
    return this._t - GlobalTime.getCurrentFrozenTime();
  }

  set t (val) {
    this._t = val + GlobalTime.getCurrentFrozenTime();
  }

  get realT () {
    return this._t;
  }

  set realT (val) {
    this._t = val;
  }
}
