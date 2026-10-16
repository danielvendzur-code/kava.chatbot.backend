const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('coffee-jolka-app.js','utf8');
function harness(){
 const timers=[],messages=[],classes=new Set();
 const context={state:{busy:false,stage:'questions',step:0,answers:{},advisorVersion:0,chatVersion:0,chatPreferences:{},history:[]},
  steps:[{key:'taste'},{key:'prep'}],advisor:{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},
  $$:()=>[],$:()=>null,setTimeout:fn=>{timers.push(fn);},renderAdvisor:()=>{},syncChatStarted:()=>{},setChipsDisabled:()=>{},
  startChat:()=>{},addMessage:html=>{const bubble={innerHTML:html};const row={isConnected:true,querySelector:()=>bubble};messages.push({html,bubble});return row;},
  input:{value:''},showTyping:()=>{},parseCoffeeRequest:()=>({}),fallbackAnswer:()=> 'offline',esc:x=>x,PATIENCE_MS:4500,
  requestReply:()=>new Promise(resolve=>{context.resolveReply=resolve;})};
 vm.createContext(context);
 for(const [start,end] of [['  function select(value)','  function renderResult()'],['  function resetAdvisor()','  advisor.addEventListener'],['  function resetChat()','  function openWidget()'],['  async function send(text)','  function renderChips()']]){
  vm.runInContext(source.slice(source.indexOf(start),source.indexOf(end)),context);
 }
 return {context,timers,messages,classes};
}
test('reset during either selection animation cannot advance a fresh questionnaire',()=>{
 for(const firstTimerRan of [false,true]){
  const {context:c,timers,classes}=harness();
  c.select('chocolate');
  if(firstTimerRan)timers.shift()();
  c.resetAdvisor();
  while(timers.length)timers.shift()();
  assert.equal(c.state.step,0);
  assert.equal(c.state.stage,'questions');
  assert.equal(c.state.busy,false);
  assert.equal(classes.has('is-leaving'),false);
  assert.deepEqual(Object.keys(c.state.answers),[]);
 }
});
test('reply arriving after chat reset cannot enter the new conversation',async()=>{
 const {context:c,messages}=harness();
 const pending=c.send('Ahoj');
 c.resetChat();
 c.state.history=[];
 c.resolveReply('old answer');
 await pending;
 assert.equal(messages.length,1);
 assert.equal(c.state.history.length,0);
 assert.equal(c.state.busy,false);
});
test('late AI upgrade cannot overwrite a reply after chat reset',async()=>{
 const {context:c,timers,messages}=harness();
 const pending=c.send('Ahoj');
 timers.shift()();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(messages[1].bubble.innerHTML,'offline');
 c.resetChat();
 c.resolveReply('old AI answer');
 await pending;
 assert.equal(messages[1].bubble.innerHTML,'offline');
});
