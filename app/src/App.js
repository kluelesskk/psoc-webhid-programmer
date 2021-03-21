import React, {useState} from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Alert from '@material-ui/lab/Alert';
import DeviceSelector from './DeviceSelector';
import FirmwareSelector from './FirmwareSelector';
import BootloaderActions from './BootloaderActions';
import BootloaderMessages from './BootloaderMessages';


export default function App() {
    const [device, setDevice] = useState(undefined);
    const [firmwareSelected, setFirmwareSelected] = useState(false);

    const step = (device === undefined) ? 0
        : !firmwareSelected ? 1
        : 2;

    return <>
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6">
                    PSoC Bootloadable Firmware Programmer
                </Typography>
                <Box px={3}>
                    <Button
                        variant="outlined" size="small" color="inherit"
                        href="https://github.com/kluelesskk/psoc-webhid-programmer">
                        View on GitHub
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
        <Box maxWidth={800}>
            <Stepper orientation="vertical" nonLinear={true} activeStep={step}>
                <Step expanded={true} completed={step > 0}>
                    <StepLabel>Select device</StepLabel>
                    <StepContent>
                        {'hid' in navigator ?
                            <DeviceSelector onSelect={setDevice} /> :
                            <Alert severity="error">
                                Your browser doesn't support WebHid. <br />
                                Currently only Chrome 89 or later supports this functionality.
                            </Alert>}
                    </StepContent>
                </Step>
                <Step expanded={true} completed={step > 1}>
                    <StepLabel>Select firmware</StepLabel>
                    <StepContent><FirmwareSelector onComplete={setFirmwareSelected} /></StepContent>
                </Step>
                <Step expanded={true}>
                    <StepLabel>Choose an action</StepLabel>
                    <StepContent><BootloaderActions device={device} /></StepContent>
                </Step>
            </Stepper>
            <BootloaderMessages />
        </Box>
    </>
}
