import React, { useEffect, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Box from '@material-ui/core/Box';


function toHex(num) {
    if (isNaN(num)) return "";
    return ("0000" + num.toString(16)).slice(-4);
}

function fromHex(text) {
    return parseInt(text, 16);
}

function OpenNewDevice(props) {
    const {open, onClose} = props;
    const [vendorId, setVendorId] = useState(0x04b4);
    const [productId, setProductId] = useState(0xf13b);

    const connect = async () => {
        let devices = await navigator.hid.requestDevice({filters: [{vendorId, productId}]});
        if (devices.length > 0)
            onClose(devices[0]);
    };

    return (
        <Dialog open={open}>
            <DialogTitle>
                Connect to a new device
            </DialogTitle>
            <DialogContent>
                <Box mb={2}>
                    Connect the PSoC device to USB and put it into bootloader mode. The specifics of
                    how to do that will depend on the device; for KitProg devices you need to hold
                    the button while you plug it into the USB port. Once the bootloader is active,
                    an LED should flash.
                </Box>
                <Box mb={2}>
                    Enter the VID/PID of the device below, then click 'Connect' to authorize it with
                    your browser.
                </Box>
                <Box display="flex">
                    <Box mr={1} width="5em">
                        <InputLabel shrink={true}>Vendor ID</InputLabel>
                        <Input
                            required={true}
                            defaultValue={toHex(vendorId)}
                            onChange={(val) => setVendorId(fromHex(val))}
                            startAdornment={<InputAdornment position="start">0x</InputAdornment>}
                        />
                    </Box>
                    <Box width="5em">
                        <InputLabel shrink={true}>Product ID</InputLabel>
                        <Input
                            required={true}
                            defaultValue={toHex(productId)}
                            onChange={(val) => setProductId(fromHex(val))}
                            startAdornment={<InputAdornment position="start">0x</InputAdornment>}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={connect}>Connect...</Button>
                <Button onClick={() => onClose(undefined)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function DeviceSelector(props) {
    const NoDevice = "";
    const AddDevice = "-1";
    const {onSelect} = props;
    const [devices, setDevices] = useState([]);
    const [selected, setSelected] = useState(NoDevice);

    useEffect(() => {
        const reload = async () => setDevices(await navigator.hid.getDevices());
        reload();
        navigator.hid.addEventListener("connect", reload);
        navigator.hid.addEventListener("disconnect", reload);
        return () => {
            navigator.hid.removeEventListener("connect", reload);
            navigator.hid.removeEventListener("disconnect", reload);
        };
    }, []);
    useEffect(() => {
        if (selected === NoDevice && devices.length > 0)
            setSelected(devices.length - 1);
        if (selected >= devices.length)
            setSelected(NoDevice);
    }, [devices, selected]);
    useEffect(() => {
        if (selected >= 0)
            onSelect(devices[selected]);
    }, [devices, selected, onSelect]);

    const onDeviceChange = (change) => {
        setSelected(change.target.value);
    };
    const onDeviceAdd = (device) => {
        setSelected(NoDevice);
        // NOTE: The last device will automatically get selected by one of the effects
        if (device !== undefined)
            setDevices([...devices, device]);
    };

    return <>
        <Select
            value={selected}
            variant="outlined"
            style={{minWidth: '12em'}}
            onChange={onDeviceChange}
        >
            {devices.map((device, i) => (
                <MenuItem key={i} value={i}>
                    {device.productName} [{toHex(device.vendorId)}:{toHex(device.productId)}]
                </MenuItem>))}
            <MenuItem value={AddDevice}>Open new device...</MenuItem>
        </Select>
        <OpenNewDevice open={selected === AddDevice} onClose={onDeviceAdd} />
    </>
}
