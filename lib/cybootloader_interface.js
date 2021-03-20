class BootloadableDevice {
  // Selects an HID device to use with subsequent actions.
  //   - device: an HIDDevice instance [https://wicg.github.io/webhid/#device-usage]
  setDevice(device) {
    this.device = device;

    if (this.device !== undefined) {
      let self = this;
      this.device.addEventListener("inputreport",
        (report) => self.saveResponse(new Uint8Array(report.data.buffer)));
        this._message(`Selected device "${this.device.productName}"`);
      }
  }

  // Tries to enumerate devices matching a given filter, and selects the first match.
  // Note that this must be called from a user action context (e.g. a button click).
  //   - deviceFilter: an HIDDeviceFilter instance [https://wicg.github.io/webhid/#enumeration]
  async findDevice(deviceFilter) {
    let devices = await navigator.hid.requestDevice({filters: [deviceFilter]});
    if (devices.length === 0)
      return false;

    this.setDevice(devices[0]);
    return true;
  }

  // Returns whether an HID device has been selected.
  hasDevice() {
    return this.device !== undefined;
  }

  // Loads a bootloadable firmware from a file.
  //   - blob: a File object [https://developer.mozilla.org/en-US/docs/Web/API/File]
  async loadFile(blob) {
    let view = new Uint8Array(await blob.arrayBuffer());
    FS.writeFile(this.filename, view);
  }

  // Programs the currently loaded firmware into the currently selected device.
  async program() {
    return await this._action('Program');
  }

  // Verifies the currently loaded firmware against the currently selected device.
  async verify() {
    return await this._action('Verify');
  }

  // Erases the currently loaded firmware from the currently selected device.
  async erase() {
    return await this._action('Erase');
  }

  // Registers a function to be called for every status message.
  addMessageCallback(callback) {
    this.messageCallbacks.push(callback);
  }

  // Internal API functions below
  constructor() {
    this.device = undefined;
    this.filename = '/tmp/file';
    this.messageCallbacks = [console.log];
  }

  _message(text) {
    for (let callback of this.messageCallbacks)
      callback(text);
  }

  async _action(name) {
    let code = await Module.ccall(
      'Cybootloader_WebHid' + name, 'number', ['string'], [this.filename], {'async': true});
    if (code == 0)
      this._message(`${name} successful, done`);
    else
      this._message(`${name} error: return code ${code}`)
    return code;
  }

  async _open() {
    if (!this.hasDevice())
      throw Error("No HID device is currently selected");
    if (!this.device.opened) {
      await this.device.open();
      this._message(`Opened device "${this.device.productName}"`)
    }
    this.rxCount = this.txCount = 0;
  }

  async _close() {
    await this.device.close();
    this._message(`Closed device "${this.device.productName}"`)
  }

  async _read() {
    ++this.rxCount;
    assert(this.rxCount == this.txCount);
    return await this.readResponse;
  }

  async _write(buf) {
    ++this.txCount;
    this.readResponse = new Promise((resolve) => this.saveResponse = resolve);
    await this.device.sendReport(0, buf);
  }
}

let bootloadable = new BootloadableDevice();
Module.activeDevice = bootloadable;
module.exports = bootloadable;
