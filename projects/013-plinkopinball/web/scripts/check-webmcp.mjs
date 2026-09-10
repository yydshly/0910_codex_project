import assert from 'node:assert/strict';
import {registerExperiment,validateExperiment} from '../public/webmcp.mjs';
let tool,applied=0;const cleanup=registerExperiment({registerTool(t){tool=t;}},input=>{applied++;return input;});
assert.equal(tool.name,'configure_physics_experiment');assert.equal(tool.annotations.readOnlyHint,false);
assert.deepEqual(tool.execute({gravity:1.2,balls:10}),{gravity:1.2,balls:10});assert.equal(applied,1);
for(const bad of [null,[],{gravity:NaN},{gravity:3},{bounce:-1},{balls:1.2},{reset:'yes'},{unexpected:1}])assert.throws(()=>tool.execute(bad));assert.equal(applied,1);
assert.deepEqual(validateExperiment({}),{});cleanup();
console.log('Optional WebMCP module unit checks passed; real browser registry and live application binding not verified.');
