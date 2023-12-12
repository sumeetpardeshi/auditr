import React from 'react'
//import JsonFormatter from 'react-json-formatter'
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
//import { JSONEditor as Editor } from "react-json-editor-viewer";

import {JsonEditor as Editor} from "react-jsondata-editor"

function JsonEditor({value, onChange}) {
    
  return <JSONInput 
        id          = '123213-123123-12312'
        placeholder = { JSON.parse(value) }
        //colors      = { darktheme }
        locale      = { locale }
        width      = '315px'
  />


//       return <JSONInput
//       id          = {123}
//       placeholder = {JSON.parse(data) }
// //      colors      = { darktheme }
//       locale      = { locale }
//    // height      = '550px'
//       width ='100%'
//       onChange ={(obj)=> { console.log("changed", obj); onChange(obj)}}
//       confirmGood={false}
//   />
}

export default JsonEditor