class NetWebRTC {
  constructor (pickup) {
    this.peer = new SimplePeer({ initiator: !pickup, trickle: false });
    this.dataCallbacks = [];

    this.init();

    if (pickup) {
      this.pickupSignalFromLocalStorage()
    }
  }

  init () {
    // Dump signal to console (initiator only? //TODO: find out..)
    this.peer.on('signal', data => {
      localStorage.signal = JSON.stringify(data);
    });

    this.peer.on('connect', this.onConnect.bind(this));
    this.peer.on('data', this.onData.bind(this));

    window.addEventListener('storage', e => {
      if (e.key === 'signal') this.signal(JSON.parse(e.newValue));
    });
  }

  pickupSignalFromLocalStorage () {
    this.signal(JSON.parse(localStorage.signal));
  }

  signal (signal) {
    this.peer.signal(signal);
  }

  send (obj) {
    var json = JSON.stringify(obj);

    try {
      this.peer.send(json);
      console.log('sent', json);
    } catch (e) {
      console.error(e);
    }
  }

  onConnect () {
    console.log('connect!');
  }

  addDataCallback (cb) {
    this.dataCallbacks.push(cb);
  }

  onData (data) {
    var d = JSON.parse(data);
    console.log('webrtc json data', d);
    this.dataCallbacks.forEach(cb => cb(d));
  }
}
