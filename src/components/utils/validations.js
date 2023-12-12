import { fabClasses } from '@mui/material';
import _ from 'lodash';



const isSubset = (aSubset, aSuperset) => (
    _.every(aSubset, (val, key) => _.isEqual(val, aSuperset[key]))
)


export const isValidJSON = (text)=>{ 

        try{
            if(JSON.parse(text))
            return true;
            else 
            return false;
        }catch(e){
            return false;
    }

}

export const validateNodeResult = (node, result) => {
    let checkList;
    console.log("result>>", result);
    try{ 
        if(node?.data?.checks) 
            checkList = JSON.parse(node?.data?.checks);
        else 
            checkList={};
    }catch(e){
            checkList={};
    }

    console.log("checkList",checkList);

    const checks = checkList?.expectedValues.map(expect=>{
        let success= false; 
        
        console.log("expect",expect, "1",_.get(result?.data, expect.path), "2",expect.value);
        
        if(expect.operation==='equals')
        //success= isSubset(expect.value,_.get(result?.data, expect.path))
        success=  _.isEqual(_.get(result.data, expect.path),expect.value) // _.get(res.data, expect.path)===expect.value
        
        //else if(expect.operation==='existsInArray')
        //success= _.find((_.get(result.data, expect.path)), x=>isSubset(_.get(x, expect.objPath),_.get(state, expect.value)))?true:false
        
        //success= _.find((_.get(res.data, expect.path)), x=>_.get(x, expect.objPath)===_.get(state, expect.value))?true:false
    
        

         return { 
             testcase: `${expect.value} ${expect.operation} ${expect.path}`, 
             success
         }
     })
     console.log(`node checks ${node.id}`,checks)

    
}


export const validationSuccess = ( nodes, node) => {
    //const { nodes } = useStore(selector, shallow);
    let checkList;

    console.log("validate", nodes, node);
    try{ 
        if(node?.data?.checks) 
            checkList = JSON.parse(node?.data?.checks);
        else 
            checkList={};
    }catch(e){
            checkList={};
    }

    //console.log("checkList",checkList);

    
    let checks = [];
    checks= checkList?.expectedValues?.map(expect=>{
        let success; 
        
        // fetch result for nodeLabel
        const result = nodes.find(x=>x.data.label===expect.nodeLabel);  
       // console.log("found Result", result);

        console.log("expect op check",result?.data.result.data,expect.path ,_.get(result?.data.result.data, expect.path),expect.value);
        
        if(expect.operation=='equals')
        success= expect.value==_.get(result?.data.result.data, expect.path)
        
        
        
        //success=  _.isEqual(_.get(res.data, expect.path),expect.value) // _.get(res.data, expect.path)===expect.value
        
        //else if(expect.operation==='existsInArray')
        //success= _.find((_.get(result.data, expect.path)), x=>isSubset(_.get(x, expect.objPath),_.get(state, expect.value)))?true:false
        
        //success= _.find((_.get(res.data, expect.path)), x=>_.get(x, expect.objPath)===_.get(state, expect.value))?true:false
    
        

         return success; 
         //{ 
             //testcase: `${expect.value} ${expect.operation} ${expect.path}`, 
            // success
         //}
     });
     console.log(`node checks ${node.id}`,checks)
     const r = checks.some(x=>x===false);
     console.log("checks response",r);
    
     return !r;

}