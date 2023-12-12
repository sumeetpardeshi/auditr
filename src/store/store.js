import { create } from 'zustand'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

const useStore = create((set,get) => ({ 
  //{
    // name: "flowName",
    // type: "apiCalller",
    // input: {
    //     send: true,
    //     type: "PUSH",
    //     title: "test notification 1",
    //     body: "check your notification 1"}
    // ,
    // output: {},
    // validate:[
    //     { 
    //         operation : "equals", 
    //         path : "payload",
    //         value : {
    //         success : true
    //         }  
    //      }
    // ]

  nodes: localStorage.getItem('nodes') ? JSON.parse(localStorage.getItem('nodes')):[],
  edges: localStorage.getItem('edges') ? JSON.parse(localStorage.getItem('edges')):[],
 
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  updateNodeColor: (nodeId, color) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = { ...node.data, color };
        }
  
        return node;
      }),
    });
  },

  updateNodeApiDetails: ({nodeId, method, url, payload,headers,checks}) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, method,url,payload ,headers,checks};
        }
  
        return node;
      }),
    });
  },
  updateNodeApiResult: (nodeId, payload) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data,result:payload };
        }
  
        return node;
      }),
    });
  },
  updateNodeLoading: (nodeId, loading) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data,loading};
        }
  
        return node;
      }),
    });
  },
  addNewNode: (newNode) => {
    set({
      nodes: [...get().nodes, newNode]
    });
  },
  updateNodeValidated: (nodeId, payload) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data,validated:payload };
        }
  
        return node;
      }),
    });
  },
  updateNodesEdges: (nodes,edges) => {
    set({
      nodes: nodes?nodes:[], 
      edges: edges?edges:[]
    });
  },


}))

export default useStore;