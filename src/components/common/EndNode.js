import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import {Typography} from '@mui/material';

const handleStyle = { left: 10 };

function EndNode({ data }) {
    //console.log(data)

    
    return (
        <>

            <Handle type="target" position={Position.Left} />
            <div
                className='custom-drag-handle'
                style={{ background: '#f3f3f3', borderRadius: '2rem', color: "black", padding: '1rem', display: 'flex', flexDirection: "column", alignItems: "flex-start" }}>
               <Typography sx={{ mb: 1.5 }}  color="text.secondary">End</Typography>
            </div>

        </>
    );
}

export default EndNode