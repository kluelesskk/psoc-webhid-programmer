import React, {useEffect, useState} from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Bootloadable from 'cybtldr-lib';


export default function BootloaderMessages(props) {
    const [messages, setMessages] = useState([]);

    const addMessage = (message) => {
        let timestamp = new Date();
        setMessages((messages) => [{timestamp, message}, ...messages]);
    };
    useEffect(() => Bootloadable.addMessageCallback(addMessage), []);

    return (
        <Box mx={3}>
            <Paper elevation={3}>
                <Table size="small">
                    <TableBody>
                        {messages.map((row, i) =>
                            <TableRow key={i} hover>
                                <TableCell>
                                    {row.timestamp.toISOString().slice(11, 23)}
                                </TableCell>
                                <TableCell>
                                    {row.message}
                                </TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
