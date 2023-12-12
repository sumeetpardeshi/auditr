import React, { useState, useCallback, useMemo, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  useReactFlow,
  useViewport
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextUpdaterNode from './common/TextUpdaterNode';
import ApiCallerNode from './common/APICallerNode';
import StarterNode from './common/StarterNode';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import { TextField, Accordion, AccordionSummary, AccordionDetails, IconButton, Box, AppBar, Toolbar, CardHeader } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Add as AddIcon, Menu as MenuIcon, PlayArrowRounded, AccountTree, Polyline, Widgets, AutoAwesome } from '@mui/icons-material';
import useStore from '../store/store';
import EndNode from './common/EndNode';
import axios from 'axios';
import { shallow } from 'zustand/shallow';
import { validationSuccess, validateNodeResult } from './utils/validations';
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});


function Flow() {

  const updateNodeApiResult = useStore((s) => s.updateNodeApiResult);
  const updateNodeLoading = useStore((s) => s.updateNodeLoading);
  const updateNodesEdges = useStore((s) => s.updateNodesEdges);
  const updateNodeValidated = useStore((s) => s.updateNodeValidated);
  const addNewNode = useStore((s) => s.addNewNode);
  const {x,y,zoom} = useViewport();

  //const {fitView}= useReactFlow();
  // {
  //   id: 'node-2',
  //   data: { label: 'Two' },
  //   position: { x: 100, y: 100 },
  //   type: 'apiCaller'
  // },


  //const [nodes, setNodes, onNodesChange] = useNodesState(localStorage.getItem('nodes') ? JSON.parse(localStorage.getItem('nodes')) : []);
  //const [edges, setEdges, onEdgesChange] = useEdgesState(localStorage.getItem('edges') ? JSON.parse(localStorage.getItem('edges')) : []);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

  const [nodeLabel, setNodeLabel] = useState('');
  const [startNodeLabel, setStartNodeLabel] = useState('');
  const nodeTypes = useMemo(() => ({ apiCaller: ApiCallerNode, starter: StarterNode, end: EndNode }), []);
  //const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const [flows, setFlows] = useState({});
  const [result, setResult] = useState({});
  //  const flow = useFlowsStore((state)=> state.flow);
  //  const updateFLow = useFlowsStore((state)=> state.updateFlow);

  // console.log("flow", flow);
  // //updateFLow(786);
  // console.log("au flow", flow);

  const addNode = (type) => {
    //const nm = `${ Date.now() }-${ type == 'starter' ? 'starter' : nodeLabel }`;
    let label, nmId;
    if (type === 'starter')
    {
      nmId = `${ Date.now() }-${ startNodeLabel }`;
      label = startNodeLabel;
    } else if (type === 'apiCaller')
    {
      nmId = `${ Date.now() }-${ nodeLabel }`;
      label = nodeLabel;
    }
    else if (type === 'end')
    {
      nmId = `${ Date.now() }-end`
      label = 'end';
    }

    addNewNode({
      id: nmId,
      data: { label },
      position: { x: -x+100, y: -y-450 },
      dragHandle: '.custom-drag-handle',
      type: type
    }
    )

    // setNodes([...nodes, {
    //   id: nmId,
    //   data: { label },
    //   position: { x: 200, y: 300 },
    //   dragHandle: '.custom-drag-handle',
    //   type: type
    // }])

    setNodeLabel('');
    setStartNodeLabel('');
  }


  useEffect(() => {
    console.log("nodes", nodes)
    console.log("edges", edges)

    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
  }, nodes, edges)


  useEffect(() => {
    console.log("res", result);
  }, [result]);

  const findNextEdges = (node) => {

    return edges.filter(x => x.source === node.id);


  }
  const traverse = async (currentNode, flowName) => {

    // process current if not start node  
    if (currentNode.type == 'starter')
    {
      const resultNew = result;
      //check if already flow already exists
      //if not create
      if (!resultNew[flowName])
      {
        resultNew[flowName] = {};
      }

      setResult(resultNew);

      console.log("result after start", result, resultNew);
    }
    else if (currentNode.type == 'end')
    {

      console.log("skipping end");
      // console.log("result after start", result, resultNew);
    }
    else if (currentNode.type == 'apiCaller')
    {
      const resultNew = result;
      console.log("process node ", currentNode)

      updateNodeLoading(currentNode.id,true);
      // exec and get result
      const res = await axios({
        method: currentNode.data.method,
        url: currentNode.data.url,
        headers: JSON.parse(currentNode?.data?.headers)
      });
      updateNodeLoading(currentNode.id,false);
      
      //validating
      //validateNodeResult(currentNode, res);

      updateNodeApiResult(currentNode.id, res);
      const isSuccess = validationSuccess(nodes,currentNode); 
      console.log("isSuccess", isSuccess)
      updateNodeValidated(currentNode.id,isSuccess);

     

      console.log("result after apiCaller", result, resultNew);
    }

    //find next node Ids and 
    const childEdges = findNextEdges(currentNode);

    //traverse them
    childEdges.map(n => {
      const childNode = nodes.find(x => x.id === n.target);
      traverse(childNode, flowName);

    });







  };

  const runAllFlows = useCallback(() => {

    // iterate over start nodes
    nodes.filter(x => x.type === 'starter').map(obj => traverse(obj, obj?.data?.label));


  }, [])



  const [ fileImportError, setFileImportError] = useState(null);
  
  const readFileOnUpload = (file) => {
    const fileReader = new FileReader();
   
   fileReader.onloadend = ()=>{
      try{
        
        const fileContent = JSON.parse(fileReader.result);
         console.log(fileContent);

         updateNodesEdges(fileContent.nodes,fileContent.edges);
         setFileImportError(null)
      }catch(e){
         setFileImportError("**Not valid JSON file!**");
      }
   }
   if(file)
       fileReader.readAsText(file);
  }


  return (
    <div style={{ height: '94vh', width: '100vw', display: 'flex' }}>

      
      <section style={{ display: 'flex', flexDirection: 'column', minWidth: '20vw', marginTop: '1rem' }}>
      <section>
        <Card style={{ margin: "1rem" }}>
          
        <CardHeader
            avatar={<AutoAwesome size="medium" />}
            title={<Typography style={{ textAlign: 'left' }}>Import file</Typography>} />
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}> 
          <Typography>import config file</Typography> 
        <input type="file"
        
  onChange={(e)=>{ console.log("file onchange",e.target.files); readFileOnUpload(e.target.files[0])} }/>
        </CardContent>

        </Card>
      </section>
        <Card style={{ margin: "1rem" }}>
          <CardHeader
            avatar={<Widgets size="medium" />}
            title={<Typography style={{ textAlign: 'left' }}>Add New</Typography>} />
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            <section style={{ display: 'flex' }}>
              {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
              API Call
            </Typography> */}

              {/* <Typography variant="h5" component="div">
            label
          </Typography> */}

              <section style={{ display: 'flex', flexDirection: "column", width: '100%', gap: '1rem' }}>
                <div>
                  <TextField
                    variant="outlined"
                    label="Flow name"
                    size='small'
                    value={startNodeLabel}
                    error={!startNodeLabel}
                    onChange={(e) => setStartNodeLabel(e.target.value)}

                  />
                  <IconButton
                    variant="contained"
                    onClick={() => addNode('starter')}
                    disabled={!startNodeLabel}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>

                  {/* <Fab variant="extended" size="medium" color="primary">
                  <AddIcon sx={{ mr: 1 }} />
                    Add StartNode
                  </Fab> */}
                </div>

                <div>
                  <TextField
                    variant="outlined"
                    label="API name"
                    size='small'
                    value={nodeLabel}
                    error={!nodeLabel}
                    onChange={(e) => setNodeLabel(e.target.value)} />
                  {/* <Button variant="outlined" onClick={() => addNode('apiCaller')} disabled={!nodeLabel}>add api</Button> */}

                  <IconButton
                    onClick={() => addNode('apiCaller')}
                    disabled={!nodeLabel}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>

                </div>
                <div>

                  <TextField
                    variant="outlined"
                    size='small'
                    disabled
                    defaultValue={"End Node"} />

                  <IconButton
                    onClick={() => addNode('end')}

                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>

                </div>


              </section>

            </section>

          </CardContent>
          {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
        </Card>
        <Card style={{ margin: "1rem" }}>
          <CardHeader
            avatar={<AutoAwesome size="medium" />}
            title={<Typography style={{ textAlign: 'left' }}>Actions</Typography>} />

          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<PlayArrowRounded />}
              onClick={runAllFlows}
            >
              Run all Flows
            </Button>
            <section>

              {result && Object.keys(result).map(flw => {
                //comms,pricing

                return <>
                  <Accordion style={{ margin: '0' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      className="custom-drag-handle"
                    >
                      <Typography sx={{ display: 'flex', gap: '1rem' }} color="text.secondary"> <AccountTree /> -{flw} </Typography>

                    </AccordionSummary>
                    <>
                      {Object.keys(result[flw]).map(point => <Typography>{result[flw][point].data.label}</Typography>)}
                    </>
                  </Accordion>
                </>
              })
              }
              {/* {getStartNodes().map(node => <Accordion style={{ margin: '0' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="custom-drag-handle"
              >
                <Typography sx={{ display:'flex' ,gap: '1rem'}} color="text.secondary"> <AccountTree/> {node.data.label} </Typography>

              </AccordionSummary>

              <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }} >
                <Typography>{JSON.stringify(node)}</Typography>
              </AccordionDetails>

            </Accordion>)} */}
            </section>
          </CardContent>
        </Card>
      </section>

      <ReactFlow
        onChange={() => "changed reactFlow"}
        style={{ backgroundColor: "#282c34" }}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </div>
  )
}

export default Flow