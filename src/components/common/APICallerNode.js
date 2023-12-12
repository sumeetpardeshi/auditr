import { useCallback, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import { TextField, Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails, LinearProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import JsonEditor from './JsonEditor';
import useStore from '../../store/store';
import { Circle, FiberManualRecord } from '@mui/icons-material';
import { isValidJSON, validateJSON } from '../utils/validations';
import ReactJson from 'react-json-view';

const handleStyle = { left: 10 };

function ApiCallerNode({ data, id }) {

  const updateNodeColor = useStore((s) => s.updateNodeColor);
  const updateNodeApiDetails = useStore((s) => s.updateNodeApiDetails);
  const [reqType, setReqType] = useState('GET');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [exectutionSuccess, setExcecutionSuccess] = useState(true);
  const [output, setOutput] = useState({});

  console.log("api caller data,id", data, id)




  const execute = async () => {
    setLoading(true);
    const res = await axios.get(url)
    setLoading(false);
    setOutput(res.data);
    console.log(res);
  }

  useEffect(() => {

    // find node by id

    // update

  }, [reqType, url])

  return (
    <Card style={{ borderRadius: '0.5rem', width: '350px' }}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      {/* <div style={{background:'#f3f3f3',borderRadius:'0.3rem' ,color: "black",  padding:'1rem', display:'flex', flexDirection: "column", alignItems:"flex-start"}}>
        <label htmlFor="text">id: {id}</label>
        <label htmlFor="text">label: {data?.label}</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div> */}
      {/* <Card sx={{ minWidth: 275 }}> */}
      {/* <CardContent style={{display:'flex', flexDirection: 'column',gap: '0.5rem'}}>
        
        </CardContent>  */}
       {data.loading && <LinearProgress />}
        {/*{!loading && exectutionSuccess &&<LinearProgress variant="determinate" value={100}/>}
        {!loading && !exectutionSuccess &&<LinearProgress color="error" variant="determinate" value={100}/>} */}

      <Accordion style={{ margin: '0' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className="custom-drag-handle"
          style={{ borderLeft: `0.7rem solid ${ data.color }` }}
        >
          <section style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
            <Typography color="text.secondary">{data.method} - API Call ({data.label}) </Typography>
            <section>
              {/* {data.loading?'loading..': '.'} */}
            {data && <FiberManualRecord color={data?.validated ? "success" : "error"} />}{/*error , success*/}
            </section>
          </section>
        </AccordionSummary>

        <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }} >

          {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
            API Call
          </Typography> */}
          {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Word of the Day
          </Typography> */}
          <section style={{ marginBottom: '1rem', display: 'flex' }}>

            <select name="requestType" id="requestType" value={data.method}
              onChange={(e) => {
                console.log(e.target.value);
                //setReqType(e.target.value);
                updateNodeApiDetails({ nodeId: id, method: e.target.value, url: data.url, payload: data.payload, headers: data.headers, result: data.result });
              }}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
            </select>
            <input type="text" style={{ width: '100%' }} value={data.url} onChange={(e) => updateNodeApiDetails({ nodeId: id, method: data.method, url: e.target.value, payload: data.payload, headers: data.headers, result: data.result })} />
          </section>

          {/* <Typography variant="h5" component="div">
            {data?.label}
          </Typography> */}

          {/* <Typography variant="body2"> */}

          {/* <JsonEditor value={data.headers} onChange={(text) => updateNodeApiDetails({ nodeId: id, method: data.method, url: data.url, payload: data.payload, headers: text, result: data.result,checks: data.checks  })} ></JsonEditor> */}
          <TextField
            label="headers"
            multiline
            rows={4}
            value={data.headers}
            error={!isValidJSON(data.headers)}
            
            style={{ marginTop: '1rem' }}
            onChange={(e) => updateNodeApiDetails({ nodeId: id, method: data.method, url: data.url, payload: data.payload, headers: e.target.value, result: data.result,checks: data.checks  })}
          />
          <TextField
            label="payload"
            multiline
            rows={4}
            value={data.payload}
            error={!isValidJSON(data.payload)}
            style={{ marginTop: '1rem' }}
            onChange={(e) => updateNodeApiDetails({ nodeId: id, method: data.method, url: data.url, payload: e.target.value, headers: data.headers, result: data.result,checks: data.checks  })}
          />
          <TextField
            label="output"
            multiline
            disabled
            rows={4}
            value={JSON.stringify(data.result,undefined,4)}
            style={{ marginTop: '1rem' }}
          />

          <TextField
            label="checks"
            multiline
            rows={4}
            value={data.checks}
            error={!isValidJSON(data.checks)}
            onChange={(e) => updateNodeApiDetails({ nodeId: id, method: data.method, url: data.url, payload: data.payload, headers: data.headers, result: data.result,checks: e.target.value })}
            style={{ marginTop: '1rem' }}
          />

         
         

         {/* <JsonEditor data={data.checks} onChange={(text)=> { 
          console.log("text",text);
          updateNodeApiDetails({ nodeId: id, method: data.method, url: data.url, payload: data.payload, headers: data.headers, result: data.result,checks: text})}
          }/> */}
        
          <section style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <input
              type="color"
              defaultValue={data.color}
              onChange={(evt) => updateNodeColor(id, evt.target.value)}
              className="nodrag"
              style={{ background: 'transparent', border: '0px', width: '2rem' }}
            />

          </section>

          {/* </Typography> */}
        </AccordionDetails>

      </Accordion>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
      {/* </Card> */}
    </Card>
  );
}

export default ApiCallerNode