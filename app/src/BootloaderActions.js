import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Bootloadable from 'cybtldr-lib';


export default function BootloaderActions(props) {
    const {device} = props;
    const devicePresent = (device !== undefined);

    const buttons = {
        'Program': async () => await Bootloadable.program(),
        'Verify': async () => await Bootloadable.verify(),
        'Erase': async () => await Bootloadable.erase(),
    }
    useEffect(() => Bootloadable.setDevice(device), [device]);

    return (
        <Grid container spacing={1}>
            {Object.entries(buttons).map((kv) =>
                <Grid item key={kv[0]} xs={3}>
                    <Button
                        onClick={kv[1]}
                        variant="contained"
                        color="primary"
                        fullWidth={true}
                        disabled={!devicePresent}
                    >
                        {kv[0]}
                    </Button>
                </Grid>
            )}
        </Grid>
    );
}
