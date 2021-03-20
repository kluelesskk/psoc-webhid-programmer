import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Bootloadable from 'cybtldr-lib';


export default function FirmwareSelector(props) {
    const {onComplete} = props;
    const [filename, setFilename] = useState('');

    const openFile = (change) => {
        if (change.target.files.length === 1) {
            let file = change.target.files[0];
            Bootloadable.loadFile(file);
            onComplete(true);
            setFilename(file.name);
        }
    };

    return (
        <Grid container alignItems="center">
            <Grid item xs={4}>
                <input style={{display: 'none'}} id="open-file-input" type="file" accept=".cyacd" onChange={openFile} />
                <label htmlFor="open-file-input">
                    <Button variant="outlined" color="primary" component="span">
                    Choose file...
                    </Button>
                </label>
            </Grid>
            <Grid item xs={8}>
                <Box fontFamily="Monospace">
                    {filename}
                </Box>
            </Grid>
        </Grid>
    );
}
