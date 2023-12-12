import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { IconButton, Typography, TextField, InputAdornment, Input, InputLabel, FormControl } from '@mui/material';
import { PlayCircle as PlayIcon, Groups, AccountTree } from '@mui/icons-material';

const handleStyle = { left: 10 };

function StarterNode({ data }) {
    //console.log(data)

    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    const execute = () => {
        console.log("execute");
    }

    const [flowName, setFlowName] = useState(data.label);

    return (
        <>

            <Handle type="source" position={Position.Right} />
            <div
                className='custom-drag-handle'
                style={{ background: '#f3f3f3', borderRadius: '2rem', color: "black", padding: '1rem', display: 'flex', flexDirection: "column", alignItems: "flex-start" }}>
                
                <section style={{ display: 'flex' }}>
                <Typography sx={{ mb: 1.5, display:'flex' ,gap: '1rem'}} color="text.secondary" ><AccountTree/> {data.label}</Typography>
                {/* <IconButton size="large">
                        <PlayIcon />
                </IconButton> */}
                </section>
                <section style={{ display: 'flex' }}>

                    {/* <InputLabel htmlFor="input-with-icon-adornment">
                    With a start adornment
                    </InputLabel> */}
                    

                    {/* <TextField

                        label="Clients"
                        InputProps={{
                            inputMode:'numeric',
                            pattern: '[0-9]*',
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Groups />
                                </InputAdornment>
                            ),
                        }}

                        variant="outlined"
                    />
                     */}
                </section>
            </div>

        </>
    );
}

export default StarterNode