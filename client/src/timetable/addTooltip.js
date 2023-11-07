import React, { useState } from 'react';
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function addTooltip({id,content}){
  console.log("add",id,content)
    return (
        <ReactTooltip
        id={id}
        place="bottom"
        content={content}
      />
    )
};