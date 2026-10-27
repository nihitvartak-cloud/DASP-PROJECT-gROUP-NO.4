"""Linked List Learning Simulator — run with: python tree_traversal_simulator.py"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import webbrowser

PAGE = r'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Linked List Learning Simulator</title>
<style>
:root{--navy:#111b31;--navy2:#1b2944;--blue:#3867e8;--purple:#7954db;--ink:#19243a;--muted:#66738b;--bg:#f3f6fc;--card:#fff;--line:#e2e8f2;--green:#16875d;--red:#c63c53}*{box-sizing:border-box}body{margin:0;font:15px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink)}button,input,select{font:inherit}button{cursor:pointer;border:0;border-radius:9px;background:var(--blue);color:white;padding:10px 14px;font-weight:650}button:hover{filter:brightness(.94)}button.secondary{background:#e9eefb;color:#2849a4}button.ghost{background:transparent;color:#d7e1f7;text-align:left;width:100%}button.ghost.active,button.ghost:hover{background:#2a3957}button.danger{background:#fff0f1;color:#b82e44}.layout{min-height:100vh;display:flex}.sidebar{width:245px;background:var(--navy);color:#fff;padding:22px 15px;display:flex;flex-direction:column;gap:18px;flex-shrink:0}.brand{font-size:17px;font-weight:800;padding:4px 8px 13px}.brand span{display:block;color:#a9badb;font-size:12px;font-weight:500}.navgroup{color:#91a1bf;text-transform:uppercase;letter-spacing:.1em;font-size:10px;padding:4px 9px}.nav{display:grid;gap:4px}.main{padding:28px;max-width:1440px;width:100%;margin:auto}.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:25px}.topbar h1{margin:0;font-size:25px}.topbar p{margin:4px 0 0;color:var(--muted)}.badge{background:#e6edff;color:#2f55b9;border-radius:99px;padding:6px 10px;font-size:12px;font-weight:700}.view{display:none}.view.active{display:block}.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;box-shadow:0 5px 18px #17264a08}.span12{grid-column:span 12}.span8{grid-column:span 8}.span7{grid-column:span 7}.span6{grid-column:span 6}.span5{grid-column:span 5}.span4{grid-column:span 4}.card h2,.card h3{margin:0 0 10px}.muted{color:var(--muted)}.hero{background:linear-gradient(125deg,#263e80,#6448b5);color:white;padding:27px;border-radius:16px}.hero h2{font-size:25px;margin:0 0 7px}.hero p{max-width:740px;color:#e0e8ff}.row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.row.space{justify-content:space-between}.control{display:flex;flex-direction:column;gap:5px;color:#46536c;font-size:12px;font-weight:700}input,select{border:1px solid #d7dfed;border-radius:8px;padding:9px 10px;background:white;color:var(--ink);min-width:95px}input:focus,select:focus,button:focus-visible{outline:3px solid #a9bcff;outline-offset:2px}.toolbar{display:flex;gap:9px;flex-wrap:wrap;margin:15px 0}.diagram{min-height:155px;display:flex;align-items:center;gap:10px;overflow-x:auto;padding:20px 6px}.node{min-width:120px;border:2px solid #aebdf1;border-radius:11px;background:#f8f9ff;box-shadow:0 4px 12px #17264a12;position:relative;text-align:center;transition:.25s}.node.current{border-color:#ef9f32;background:#fff9e9;transform:translateY(-5px)}.node.found{border-color:#18a56f;background:#effcf6}.node .tag{font-size:10px;color:#687590;padding:4px 5px;border-bottom:1px solid #e3e7f1}.node .data{font-weight:800;font-size:18px;padding:9px}.node .ptr{font-size:11px;color:#65738e;padding:5px;border-top:1px solid #e3e7f1}.arrow{color:#5368bb;font-size:23px;flex-shrink:0}.headtail{color:#475b9d;font-size:10px;font-weight:800;text-align:center}.nodewrap{display:flex;align-items:center;gap:8px}.status{padding:11px;border-radius:9px;background:#f1f5fc;color:#4e5c75;margin-top:10px}.status.ok{background:#eaf8f1;color:#126a49}.status.error{background:#fff0f1;color:#a52c40}.pill{display:inline-block;background:#f0f3fa;border-radius:99px;padding:4px 9px;font-size:12px;margin:2px}.steps{display:grid;gap:8px}.step{padding:10px;border-radius:8px;background:#f4f6fb;color:#5b6780}.step.on{background:#e8edff;color:#304fa8;font-weight:700}.code{white-space:pre-wrap;overflow-wrap:anywhere;background:#111b31;color:#e5edff;padding:15px;border-radius:10px;font:12px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace;min-height:110px}.progressbar{height:9px;background:#e8edf6;border-radius:8px;overflow:hidden}.progressbar i{height:100%;display:block;background:linear-gradient(90deg,var(--blue),var(--purple));width:0}.metric{font-size:26px;font-weight:800;color:#304eaa}.question{font-size:18px;font-weight:750}.answer{display:block;width:100%;text-align:left;margin:8px 0;background:#f1f4fb;color:#273650}.answer:hover{background:#e4eaff}.small{font-size:12px}.tablewrap{overflow:auto}table{border-collapse:collapse;width:100%;min-width:570px}th,td{text-align:left;padding:11px;border-bottom:1px solid var(--line)}th{background:#f4f6fb;color:#46536c}.menuBtn{display:none}.notice{padding:10px;background:#fff7e5;color:#77551c;border-radius:9px}.footer{margin-top:22px;color:#8190a7;font-size:12px}
@media(max-width:850px){.sidebar{width:205px}.main{padding:20px}.span8,.span7,.span6,.span5,.span4{grid-column:span 12}}
@media(max-width:650px){.layout{display:block}.sidebar{width:100%;padding:12px;position:sticky;top:0;z-index:5}.brand{padding:3px}.navgroup{display:none}.nav{display:flex;overflow:auto}.nav button{white-space:nowrap;width:auto;padding:8px 10px}.main{padding:16px}.topbar h1{font-size:21px}.diagram{min-height:140px}}
</style></head><body><div class="layout"><aside class="sidebar"><div class="brand">🔗 List Lab <span>Linked List Learning Simulator</span></div><div class="navgroup">Learning workspace</div><nav class="nav" aria-label="Main navigation">
<button class="ghost active" data-view="home">⌂ &nbsp;Home</button><button class="ghost" data-view="learn">▤ &nbsp;Learn lists</button><button class="ghost" data-view="simulator">⛓ &nbsp;Simulator</button><button class="ghost" data-view="study">◷ &nbsp;Study mode</button><button class="ghost" data-view="code">⌘ &nbsp;Algorithm & code</button><button class="ghost" data-view="complexity">▦ &nbsp;Complexity</button><button class="ghost" data-view="quiz">✎ &nbsp;Quiz & practice</button><button class="ghost" data-view="progress">◉ &nbsp;Progress</button><button class="ghost" data-view="about">ⓘ &nbsp;About / tests</button></nav><div class="footer">Learn by building, tracing, and testing.</div></aside><main class="main"><header class="topbar"><div><h1 id="pageTitle">Welcome to List Lab</h1><p>Explore pointers, one operation at a time.</p></div><span class="badge" id="listBadge">Singly Linked List</span></header>
<section class="view active" id="home"><div class="hero"><h2>Make pointers make sense.</h2><p>Build linked lists, watch pointer links change, and practice the algorithms with a visual, hands-on learning lab.</p><button onclick="go('simulator')">Open the simulator →</button></div><div class="grid" style="margin-top:16px"><div class="card span4"><h3>📚 Learn the structures</h3><p class="muted">Compare four list types and understand their pointer rules.</p><button class="secondary" onclick="go('learn')">Explore list types</button></div><div class="card span4"><h3>🧪 Try an operation</h3><p class="muted">Insert, delete, search, traverse, update, or reverse.</p><button class="secondary" onclick="go('simulator')">Start experimenting</button></div><div class="card span4"><h3>🎯 Check your progress</h3><p class="muted">Lessons, challenges, and quiz results save on this device.</p><div class="metric" id="homeScore">0%</div></div><div class="card span7"><h3>Quick start</h3><ol><li>Choose a list type in the simulator.</li><li>Use the operation controls and inspect the arrows.</li><li>Open Study Mode to trace each algorithm step.</li><li>Take a quiz or verify a practice challenge.</li></ol></div><div class="card span5"><h3>Learning path</h3><div id="homeProgress"></div></div></div></section>
<section class="view" id="learn"><div class="grid"><div class="card span12"><h2>Learn linked list types</h2><p class="muted">A linked list stores values in nodes. Links (pointers) connect nodes; unlike an array, nodes need not sit next to one another in memory.</p><label class="control">Choose a structure<select id="learnType"></select></label><div id="learnDetails" style="margin-top:16px"></div><button onclick="markLesson()">Mark this lesson complete ✓</button></div><div class="card span12"><h3>Pointer vocabulary</h3><p><b>HEAD</b> references the first node. <b>TAIL</b> references the last. <b>NEXT</b> points forward, <b>PREV</b> points backward. <b>NULL</b> means no node. In circular lists, the last link returns to the first instead of NULL.</p></div></div></section>
<section class="view" id="simulator"><div class="grid"><div class="card span12"><div class="row space"><div><h2>Interactive simulator</h2><p class="muted">The diagram is rendered from the live node pointers.</p></div><label class="control">List type<select id="typeSelect"></select></label></div><div class="row" style="margin-top:14px"><label class="control">Value<input id="valueInput" placeholder="e.g. 42" aria-label="Node value"></label><label class="control">Position (1-based)<input id="positionInput" type="number" min="1" placeholder="e.g. 2"></label><label class="control">Search / update value<input id="targetInput" placeholder="value"></label></div><div class="toolbar"><button onclick="perform('insertBeginning')">Insert beginning</button><button onclick="perform('insertEnd')">Insert end</button><button onclick="perform('insertAt')">Insert at position</button><button class="secondary" onclick="perform('deleteBeginning')">Delete beginning</button><button class="secondary" onclick="perform('deleteEnd')">Delete end</button><button class="secondary" onclick="perform('deleteAt')">Delete at position</button><button class="secondary" onclick="perform('search')">Search</button><button class="secondary" onclick="perform('traverse')">Traverse</button><button class="secondary" onclick="perform('update')">Update value</button><button class="secondary" onclick="perform('reverse')">Reverse</button><button class="danger" onclick="clearList()">Clear list</button></div><div class="row space"><span class="pill" id="lengthLabel">Length: 0</span><span class="muted small">Position counting starts at 1.</span></div><div class="diagram" id="diagram" aria-live="polite"></div><div class="status" id="simStatus" role="status">Ready. Insert a value to begin.</div></div><div class="card span6"><h3>What to notice</h3><p id="pointerNote" class="muted">Each node owns data and a next reference.</p></div><div class="card span6"><h3>Operation complexity</h3><div id="liveComplexity" class="muted">Choose an operation to see its time and auxiliary space.</div></div></div></section>
<section class="view" id="study"><div class="grid"><div class="card span12"><h2>Step-by-step study mode</h2><p class="muted">Select an operation, then step through the pointer plan. Use Play/Pause to animate the explanation.</p><div class="row"><label class="control">Operation<select id="studyOp"></select></label><label class="control">Animation speed<input id="speed" type="range" min="300" max="1800" step="100" value="900"></label><button class="secondary" onclick="studyReset()">Reset</button><button class="secondary" onclick="studyPrev()">← Previous step</button><button onclick="studyNext()">Next step →</button><button class="secondary" id="playBtn" onclick="togglePlay()">▶ Play</button></div></div><div class="card span7"><h3>Pointer trace</h3><div class="diagram" id="studyDiagram"></div><div class="steps" id="stepList"></div></div><div class="card span5"><h3 id="studyObjective">Objective</h3><div id="studyComplexity" class="muted"></div><h3 style="margin-top:16px">Pseudocode</h3><pre class="code" id="studyPseudo"></pre></div></div></section>
<section class="view" id="code"><div class="grid"><div class="card span12"><h2>Algorithm and code viewer</h2><div class="row"><label class="control">Operation<select id="codeOp"></select></label><label class="control">Language<select id="language"><option>Pseudocode</option><option>JavaScript</option><option>C</option><option>C++</option><option>Python</option></select></label><button class="secondary" onclick="renderCode()">Show algorithm</button></div><p class="muted" id="codeIntro"></p><pre class="code" id="codeBlock"></pre></div><div class="card span12"><h3>Simple algorithm steps</h3><ol id="algorithmSteps"></ol><p class="small muted">Code is illustrative and assumes a head pointer; end insertion is O(n) here unless a tail pointer is maintained.</p></div></div></section>
<section class="view" id="complexity"><div class="grid"><div class="card span12"><h2>Complexity comparison</h2><p class="muted">n is the number of nodes. Insertion/deletion at a known node can be O(1); locating a position or value generally takes O(n). This simulator maintains both head and tail pointers.</p><div class="tablewrap"><table><thead><tr><th>Operation</th><th>Singly</th><th>Doubly</th><th>Circular singly</th><th>Circular doubly</th></tr></thead><tbody id="complexityRows"></tbody></table></div><p class="small muted">Auxiliary space for these in-place operations is O(1); traversal/search uses O(1) extra space. Reversal also uses O(1) extra space.</p></div><div class="card span12"><h3>Why the costs differ</h3><p><b>O(1)</b> means a fixed number of pointer updates. <b>O(n)</b> means we may visit each node to find a position or value. A tail pointer makes append O(1); without it, a singly linked list must walk from HEAD and append is O(n). Doubly linked lists allow backward traversal and constant-time unlinking only after the node is known.</p></div></div></section>
<section class="view" id="quiz"><div class="grid"><div class="card span5"><h2>Quiz & practice</h2><label class="control">Difficulty<select id="difficulty"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><button style="margin-top:12px" onclick="startQuiz()">Start / new quiz</button><div id="quizScore" class="muted" style="margin-top:12px"></div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><h3>Practice challenges</h3><label class="control">Challenge<select id="challengeSelect"><option value="insert">Insert a node at position 3</option><option value="delete">Delete the specified value</option><option value="reverse">Reverse the list</option><option value="middle">Find the middle node</option><option value="cycle">Detect a cycle</option><option value="merge">Merge two sorted lists</option></select></label><p id="challengeText" class="muted"></p><button class="secondary" onclick="showHint()">Show hint</button> <button onclick="verifyChallenge()">Verify my work</button><div id="challengeFeedback" class="status">Set up the list in the simulator, then verify.</div></div><div class="card span7"><div class="row space"><h3 id="questionTitle">Choose a difficulty and start a quiz</h3><span id="quizCounter" class="badge"></span></div><div id="questionArea" class="muted">Questions include concept checks, output prediction, pointer tracing, and bug finding.</div><div id="answerFeedback"></div></div></div></section>
<section class="view" id="progress"><div class="grid"><div class="card span4"><h3>Lessons complete</h3><div class="metric" id="lessonMetric">0 / 4</div></div><div class="card span4"><h3>Best quiz score</h3><div class="metric" id="bestMetric">0%</div></div><div class="card span4"><h3>Challenges solved</h3><div class="metric" id="challengeMetric">0 / 6</div></div><div class="card span12"><h2>Your learning progress</h2><div class="progressbar"><i id="progressFill"></i></div><p id="progressText" class="muted"></p><button class="danger" onclick="resetProgress()">Reset saved progress</button></div></div></section>
<section class="view" id="about"><div class="grid"><div class="card span7"><h2>About this project</h2><p>List Lab is a browser-based, study-oriented linked list lab. It runs locally with no backend or third-party libraries. This one-file delivery embeds the web interface in a small Python standard-library HTTP server.</p><h3>Architecture</h3><ul><li>Python serves the single-page application on localhost.</li><li>JavaScript node and list classes maintain real next/prev references for all four types.</li><li>Rendering reads those live links; operation handlers validate input and report errors.</li><li>Learning progress and best score are stored in browser localStorage.</li></ul><h3>Run locally</h3><p>Save this file, run <code>python tree_traversal_simulator.py</code>, then open <code>http://127.0.0.1:8000</code>. Stop with Ctrl+C.</p><h3>Future improvements</h3><p>Possible additions: import/export list snapshots, keyboard-driven pointer tracing, more quizzes, and user-authored algorithm tests.</p></div><div class="card span5"><h2>Core operation test checklist</h2><p class="muted">Run quick invariant tests for all four list types.</p><button onclick="runTests()">Run automated checks</button><div id="testResults" class="status" style="margin-top:12px">No tests run yet.</div><h3 style="margin-top:18px">Expected cases</h3><ul class="small"><li>Insert and remove first/last node.</li><li>Position bounds reject 0 and n+1.</li><li>Reverse preserves length and node values.</li><li>Circular tail points back to head.</li><li>Doubly linked prev/next links agree.</li><li>Searching a missing value returns not found.</li></ul></div></div></section>
</main></div>
<script>
const TYPES={singly:{name:'Singly Linked List',desc:'Each node stores data and one NEXT pointer. Only forward traversal is possible; the last NEXT is NULL.',rules:'HEAD references the first node; TAIL points to the last node whose NEXT is NULL.',fields:['NEXT'],circular:false,doubly:false},doubly:{name:'Doubly Linked List',desc:'Each node stores data, PREV, and NEXT. Traversal can move in both directions, at the cost of an extra pointer per node.',rules:'HEAD.PREV and TAIL.NEXT are NULL. Adjacent nodes must point to one another in both directions.',fields:['PREV','NEXT'],circular:false,doubly:true},csingly:{name:'Circular Singly Linked List',desc:'Like a singly list, but the last node points to HEAD instead of NULL. Traversal must stop after visiting the start node once.',rules:'TAIL.NEXT === HEAD. Empty list has no head or tail.',fields:['NEXT'],circular:true,doubly:false},cdoubly:{name:'Circular Doubly Linked List',desc:'A doubly linked ring: each node has PREV and NEXT, and both ends connect around the circle.',rules:'TAIL.NEXT === HEAD and HEAD.PREV === TAIL.',fields:['PREV','NEXT'],circular:true,doubly:true}};
const OPS={insertBeginning:'Insert at beginning',insertEnd:'Insert at end',insertAt:'Insert at position',deleteBeginning:'Delete from beginning',deleteEnd:'Delete from end',deleteAt:'Delete from position',search:'Search',traverse:'Traverse',update:'Update value',reverse:'Reverse'};
class Node{constructor(data){this.data=data;this.next=null;this.prev=null}}
class LinkedList{constructor(type){this.type=type;this.head=null;this.tail=null;this.length=0;this.circular=TYPES[type].circular;this.doubly=TYPES[type].doubly}
 at(index){if(index<0||index>=this.length)return null;let n=this.head;for(let i=0;i<index;i++)n=n.next;return n}
 insert(index,value){if(!Number.isInteger(index)||index<0||index>this.length)throw Error('Position must be between 1 and '+(this.length+1)+'.');const n=new Node(value);if(!this.length){this.head=this.tail=n;this.length=1;this.fix();return}if(index===0){n.next=this.head;if(this.doubly)this.head.prev=n;this.head=n}else if(index===this.length){n.prev=this.tail;this.tail.next=n;if(this.doubly)n.prev=this.tail;this.tail=n}else{const after=this.at(index),before=after.prev||this.at(index-1);n.next=after;after.prev=n;if(before)before.next=n;if(this.doubly)n.prev=before}this.length++;this.fix()}
 remove(index){if(!this.length)throw Error('The list is empty.');if(!Number.isInteger(index)||index<0||index>=this.length)throw Error('Position must be between 1 and '+this.length+'.');const n=this.at(index),value=n.data;if(this.length===1)this.head=this.tail=null;else if(index===0){this.head=n.next;if(this.doubly)this.head.prev=null}else if(index===this.length-1){this.tail=this.doubly?n.prev:this.at(index-1);this.tail.next=null;if(this.doubly)this.tail.prev=this.tail.prev||null}else{const before=this.at(index-1),after=n.next;before.next=after;if(this.doubly)after.prev=before}this.length--;n.next=n.prev=null;this.fix();return value}
 fix(){if(!this.length){this.head=this.tail=null;return}if(this.circular){this.tail.next=this.head;if(this.doubly){this.head.prev=this.tail;this.tail.next=this.head}}else{this.tail.next=null;if(this.doubly){this.head.prev=null;this.tail.next=null}}}
 find(value){let n=this.head;for(let i=0;i<this.length;i++){if(String(n.data)===String(value))return {node:n,index:i};n=n.next}return null}
 values(){let a=[],n=this.head;for(let i=0;i<this.length;i++){a.push(n.data);n=n.next}return a}
 reverse(){if(this.length<2)return;let nodes=this.values().map(v=>this.findByIndex(v));/* preserve actual node references below */let list=[],p=this.head;for(let i=0;i<this.length;i++){list.push(p);p=p.next}list.reverse();this.head=list[0];this.tail=list[list.length-1];for(let i=0;i<list.length;i++){list[i].next=list[i+1]||null;list[i].prev=this.doubly?(list[i-1]||null):null}this.fix()}
 findByIndex(){return null}}
let list=new LinkedList('singly'),highlight=-1,found=-1,interval=null,studyIndex=0,studySteps=[],quizItems=[],quizAt=0,quizRight=0;
const $=id=>document.getElementById(id);function go(view){document.querySelectorAll('.view').forEach(e=>e.classList.toggle('active',e.id===view));document.querySelectorAll('.nav button').forEach(e=>e.classList.toggle('active',e.dataset.view===view));const names={home:'Welcome to List Lab',learn:'Learn linked lists',simulator:'Interactive simulator',study:'Step-by-step study mode',code:'Algorithm and code viewer',complexity:'Complexity comparison',quiz:'Quiz & practice',progress:'Progress dashboard',about:'About the project'};$('pageTitle').textContent=names[view];if(view==='progress')renderProgress();if(view==='study')buildStudy();if(view==='code')renderCode()}
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>go(b.dataset.view));
function setType(type){if(!TYPES[type])return;list=new LinkedList(type);$('typeSelect').value=type;$('learnType').value=type;$('listBadge').textContent=TYPES[type].name;highlight=found=-1;render();renderLearn();buildStudy()}
function render(){const d=$('diagram');d.innerHTML='';$('lengthLabel').textContent='Length: '+list.length;let n=list.head;for(let i=0;i<list.length;i++){let wrap=document.createElement('div');wrap.className='nodewrap';let el=document.createElement('div');el.className='node'+(i===highlight?' current':'')+(i===found?' found':'');let tag=document.createElement('div');tag.className='tag';tag.textContent=(i===0?'HEAD · ':'')+(i===list.length-1?'TAIL':'NODE '+(i+1));let data=document.createElement('div');data.className='data';data.textContent=n.data;let ptr=document.createElement('div');ptr.className='ptr';ptr.textContent=list.doubly?'PREV: '+(n.prev?n.prev.data:'NULL')+'  |  NEXT: '+(n.next?n.next.data:(list.circular?'HEAD':'NULL')):'NEXT: '+(n.next?n.next.data:(list.circular?'HEAD':'NULL'));el.append(tag,data,ptr);wrap.append(el);d.append(wrap);if(i<list.length-1){let a=document.createElement('span');a.className='arrow';a.textContent='→';d.append(a)}n=n.next}if(list.circular&&list.length){let a=document.createElement('span');a.className='arrow';a.textContent=list.doubly?'↶ ↔ HEAD':'↶ HEAD';a.title='Tail connects back to head';d.append(a)}if(!list.length)d.innerHTML='<span class="muted">Empty list — HEAD = NULL, TAIL = NULL</span>';const type=TYPES[list.type];$('pointerNote').textContent=type.rules}
function showStatus(message,ok=true){$('simStatus').textContent=message;$('simStatus').className='status '+(ok?'ok':'error')}
function getValue(){let v=$('valueInput').value.trim();if(!v)throw Error('Enter a value first.');return v}
function perform(op){try{let value='',idx=0,result='',complex='';highlight=found=-1;const n=list.length,pos=Number($('positionInput').value);if(['insertBeginning','insertEnd','insertAt'].includes(op)){value=getValue();idx=op==='insertBeginning'?0:op==='insertEnd'?list.length:pos-1;if(op==='insertAt'&&(!Number.isInteger(pos)||pos<1||pos>list.length+1))throw Error('Insert position must be 1 through '+(list.length+1)+'.');list.insert(idx,value);highlight=idx;result='Inserted '+value+' at position '+(idx+1)+'.';complex=op==='insertBeginning'?'O(1)':op==='insertEnd'?'O(1) with maintained tail':'O(n) to locate position'}else if(['deleteBeginning','deleteEnd','deleteAt'].includes(op)){if(!list.length)throw Error('The list is empty.');idx=op==='deleteBeginning'?0:op==='deleteEnd'?list.length-1:pos-1;if(op==='deleteAt'&&(!Number.isInteger(pos)||pos<1||pos>list.length))throw Error('Delete position must be 1 through '+list.length+'.');value=list.remove(idx);highlight=Math.min(idx,list.length-1);result='Deleted '+value+' from position '+(idx+1)+'.';complex=op==='deleteBeginning'?'O(1)':op==='deleteEnd'&&list.doubly?'O(1) with tail and prev':'O(n) to locate predecessor'}else if(op==='search'){value=$('targetInput').value.trim();if(!value)throw Error('Enter a search value.');const f=list.find(value);if(f){found=highlight=f.index;result='Found '+value+' at position '+(f.index+1)+'.'}else result='Value '+value+' was not found.';complex='O(n) worst case'}else if(op==='traverse'){if(!list.length)throw Error('The list is empty.');result='Traversal: '+list.values().join(' → ')+(list.circular?' → (back to HEAD)':' → NULL');highlight=0;complex='O(n)'}else if(op==='update'){let target=$('targetInput').value.trim();value=getValue();if(!target)throw Error('Enter the existing value in Search / update value.');let f=list.find(target);if(!f)throw Error('Value '+target+' was not found.');f.node.data=value;highlight=f.index;result='Updated position '+(f.index+1)+' from '+target+' to '+value+'.';complex='O(n) to find; O(1) to change'}else if(op==='reverse'){if(list.length<2)throw Error('Add at least two nodes to reverse.');list.reverse();result='List reversed.';highlight=0;complex='O(n) time, O(1) auxiliary space'}render();showStatus(result,true);$('liveComplexity').textContent='Time: '+complex+'. Auxiliary space: O(1).';prepareStudy(op)}catch(e){showStatus(e.message,false)}}
function clearList(){list=new LinkedList(list.type);highlight=found=-1;render();showStatus('List cleared.');$('liveComplexity').textContent='Ready.'}
function renderLearn(){let t=TYPES[$('learnType').value||list.type];$('learnDetails').innerHTML='<h3>'+t.name+'</h3><p>'+t.desc+'</p><p><b>Pointer rules:</b> '+t.rules+'</p><p><b>Node fields:</b> '+t.fields.join(', ')+' plus data. <b>Supported:</b> insertion, deletion, search, traversal, update, and reversal.</p><p><b>Remember:</b> '+(t.circular?'visit no more than length nodes; circular traversal has no NULL end.':'follow NEXT until NULL.')+'</p>'}
function markLesson(){let p=loadProgress();p.lessons=p.lessons||[];let t=$('learnType').value;if(!p.lessons.includes(t))p.lessons.push(t);saveProgress(p);showStatus('Lesson marked complete: '+TYPES[t].name,true)}
const opSteps={insertBeginning:['Create a new node containing the value.','Set new.next to the current HEAD.','For a doubly list, set old HEAD.prev to the new node.','Move HEAD to the new node; if empty, it is also TAIL.'],insertEnd:['Create a new node.','Link the current TAIL to the new node (and set new.prev if doubly linked).','Move TAIL to the new node.','Set its next link to NULL, or to HEAD for a circular list.'],insertAt:['Check that the 1-based position is from 1 through n + 1.','Walk to the node currently at that position.','Link the new node between its predecessor and successor.','Update HEAD/TAIL if insertion is at either end.'],deleteBeginning:['Check that HEAD is not NULL.','Save the current HEAD node/value.','Move HEAD to HEAD.next.','Clear new HEAD.prev when doubly linked; fix the circular tail link.'],deleteEnd:['Check that TAIL is not NULL.','Find the previous node (or use TAIL.prev in a doubly list).','Set that node as TAIL and end its forward link.','For a circular list, connect TAIL.next back to HEAD.'],deleteAt:['Validate the 1-based position.','Walk to the target node.','Connect its predecessor directly to its successor.','Update HEAD/TAIL and both directions as needed.'],search:['Start at HEAD and set position to 1.','Compare the current node data with the target.','If equal, report the position and stop.','Otherwise follow NEXT; stop after n nodes or NULL.'],traverse:['Start at HEAD.','Visit and display the current node data.','Follow NEXT to the next node.','Stop at NULL, or after exactly n visits for a circular list.'],update:['Search from HEAD for the old value.','Stop when a matching node is found.','Replace that node data with the new value.','If no match exists, report not found.'],reverse:['Keep a reference to the previous node (initially NULL).','For each node, save its NEXT before changing links.','Point NEXT backward; swap PREV/NEXT as appropriate.','Set the old tail as HEAD and restore circular links.']};
function complexity(op){if(op==='insertBeginning'||op==='deleteBeginning')return 'Time O(1); auxiliary space O(1).';if(op==='insertEnd')return 'Time O(1) with maintained tail; auxiliary space O(1).';if(op==='deleteEnd')return list.doubly?'Time O(1) with tail.prev; auxiliary space O(1).':'Time O(n) to find the predecessor; auxiliary space O(1).';if(op==='reverse')return 'Time O(n); auxiliary space O(1), in place.';if(op==='traverse')return 'Time O(n); auxiliary space O(1).';return 'Time O(n) to locate a node/value; auxiliary space O(1).'}
function buildStudy(){if(!$('studyOp'))return;const opts=Object.entries(OPS).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('');$('studyOp').innerHTML=opts;$('codeOp').innerHTML=opts;prepareStudy($('studyOp').value||'insertBeginning')}
function prepareStudy(op){if(!$('studyOp'))return;$('studyOp').value=op;studySteps=opSteps[op]||[];studyIndex=0;$('studyObjective').textContent=OPS[op]+': change links without losing access to the rest of the list.';$('studyComplexity').textContent=complexity(op);$('studyPseudo').textContent='1. '+studySteps.join('\n2. ');renderStudySteps()}
function renderStudySteps(){if(!$('stepList'))return;$('stepList').innerHTML=studySteps.map((s,i)=>'<div class="step '+(i===studyIndex?'on':'')+'">'+(i+1)+'. '+s+'</div>').join('');$('studyDiagram').innerHTML=$('diagram').innerHTML;const nodes=$('studyDiagram').querySelectorAll('.node');nodes.forEach((n,i)=>n.classList.toggle('current',i===studyIndex%Math.max(nodes.length,1)))}
function studyNext(){studyIndex=Math.min(studyIndex+1,studySteps.length-1);renderStudySteps()}function studyPrev(){studyIndex=Math.max(0,studyIndex-1);renderStudySteps()}function studyReset(){if(interval)clearInterval(interval);interval=null;$('playBtn').textContent='▶ Play';studyIndex=0;renderStudySteps()}function togglePlay(){if(interval){clearInterval(interval);interval=null;$('playBtn').textContent='▶ Play';return}$('playBtn').textContent='⏸ Pause';interval=setInterval(()=>{if(studyIndex>=studySteps.length-1){studyReset();return}studyNext()},Number($('speed').value))}
function renderCode(){const op=$('codeOp').value||'insertBeginning',lang=$('language').value,base=opSteps[op].map((s,i)=>(i+1)+'. '+s).join('\n');let snippets={Pseudocode:base,JavaScript:'// '+OPS[op]+'\n'+(op.includes('insert')?'function insertAt(index, value) {\n  // validate index; locate neighbors\n  const node = new Node(value);\n  // connect predecessor, node, and successor\n  // update head/tail and circular links\n}':op.includes('delete')?'function deleteAt(index) {\n  // validate; locate target and neighbors\n  // bypass target in next (and prev) links\n  // update head/tail and circular links\n}':'function '+op+'() {\n  // '+base.replaceAll('\n','\n  // ')+'\n}'),C:'/* '+OPS[op]+'; Node has data, next'+(list.doubly?', prev':'')+' */\nvoid '+op+'(Node **head, int value) {\n    /* validate inputs and locate the required node */\n    /* update links; handle empty and boundary cases */\n}', 'C++':'// '+OPS[op]+'; keep head/tail consistent\nvoid '+op+'(int value) {\n    // validate, locate node, then update pointer links\n    // restore NULL or circular boundary links\n}',Python:'class Node:\n    def __init__(self, data):\n        self.data, self.next, self.prev = data, None, None\n\ndef '+op+'(head, value):\n    # '+base.replaceAll('\n','\n    # ')+'\n    pass'};$('codeIntro').textContent=OPS[op]+' — '+complexity(op);$('codeBlock').textContent=snippets[lang];$('algorithmSteps').innerHTML=opSteps[op].map(s=>'<li>'+s+'</li>').join('')}
function complexityTable(){let rows=[['Access / search','O(n)','O(n)','O(n)','O(n)'],['Insert at head','O(1)','O(1)','O(1)','O(1)'],['Insert at tail (tail kept)','O(1)','O(1)','O(1)','O(1)'],['Delete tail','O(n)','O(1)','O(n)','O(1)'],['Insert/delete at known node','O(1)*','O(1)','O(1)*','O(1)'],['Traverse all nodes','O(n)','O(n)','O(n)','O(n)'],['Reverse','O(n)','O(n)','O(n)','O(n)']];$('complexityRows').innerHTML=rows.map(r=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')}
const BANK={Beginner:[['What does HEAD refer to?',['The first node','The last node','The list length'],'The first node','HEAD stores the entry point to the list.'],['In a normal singly list, what follows the tail?',['NULL','HEAD always','The previous node'],'NULL','A non-circular list ends when NEXT is NULL.'],['True or false: a circular singly list tail points to HEAD.',['True','False'],'True','That link forms the cycle.']],Intermediate:[['A list has 4 nodes. How many nodes should circular traversal visit?',['4','5','Until NULL'],'4','Visit exactly the list length to avoid looping forever.'],['What is the time to search an unsorted linked list?',['O(1)','O(n)','O(log n)'],'O(n)','In the worst case every node must be checked.'],['Bug hunt: after inserting before node B, which link must also change in a doubly list?',['B.prev','HEAD only','TAIL.next always'],'B.prev','Both forward and backward links must agree.']],Advanced:[['With tail.prev available, deleting the tail of a doubly linked list is…',['O(1)','O(n)','O(log n)'],'O(1)','The predecessor is directly available.'],['For circular traversal, a safe stopping rule is…',['Stop after n visits','Wait for NULL','Stop at any repeated value'],'Stop after n visits','Values can repeat, so use the node count or starting-node reference.'],['Reverse a singly list in place using…',['prev/current/next references','A sorted array','Recursion only'],'prev/current/next references','Three references allow each next pointer to be reversed in O(n) time and O(1) extra space.']]};
function startQuiz(){quizItems=BANK[$('difficulty').value].slice().sort(()=>Math.random()-.5);quizAt=quizRight=0;$('answerFeedback').innerHTML='';renderQuestion()}
function renderQuestion(){if(quizAt>=quizItems.length){let score=Math.round(100*quizRight/quizItems.length);$('questionTitle').textContent='Quiz complete';$('quizCounter').textContent='';$('questionArea').innerHTML='Final score: <b>'+quizRight+' / '+quizItems.length+' ('+score+'%)</b>';let p=loadProgress();p.best=Math.max(p.best||0,score);saveProgress(p);$('quizScore').textContent='Best saved score: '+p.best+'%';return}let q=quizItems[quizAt];$('questionTitle').textContent=q[0];$('quizCounter').textContent=(quizAt+1)+' / '+quizItems.length;$('questionArea').innerHTML=q[1].map(a=>'<button class="answer" data-answer="'+a.replaceAll('"','&quot;')+'">'+a+'</button>').join('');document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>answer(b.dataset.answer));}
function answer(a){let q=quizItems[quizAt],ok=a===q[2];if(ok)quizRight++;$('answerFeedback').innerHTML='<div class="status '+(ok?'ok':'error')+'">'+(ok?'Correct. ':'Not quite. ')+q[3]+'</div><button style="margin-top:8px" onclick="quizAt++;renderQuestion()">Next question</button>';document.querySelectorAll('.answer').forEach(b=>b.disabled=true)}
function showHint(){const hints={insert:'Start with an empty list. Insert two values, then put a third value at position 3.',delete:'Search first so you know the matching value and its 1-based position.',reverse:'Use the Reverse button; compare HEAD and TAIL before and after.',middle:'For an even number of nodes, this challenge accepts the first of the two middle nodes.',cycle:'Circular list types already contain a cycle by definition; a non-circular list should end in NULL.',merge:'Sort each list, then repeatedly take the smaller next value. This challenge checks understanding, not a two-list editor.'};$('challengeFeedback').textContent='Hint: '+hints[$('challengeSelect').value]}
function verifyChallenge(){let c=$('challengeSelect').value,ok=false,msg='';if(c==='insert'){ok=list.length>=3;msg='Expected at least 3 nodes; position 3 contains '+(list.at(2)?.data??'no value')+'.'}if(c==='delete'){ok=true;msg='Use Delete at position after locating the requested value. This challenge is considered attempted.'}if(c==='reverse'){let a=list.values();ok=a.length>=2&&a[0]!==a[a.length-1];msg=ok?'The list has been reversed.':'Use a list with at least two distinct end values, then Reverse.'}if(c==='middle'){ok=list.length>0;msg=ok?'Middle node (first middle for even length): '+list.at(Math.floor((list.length-1)/2)).data+'.':'Add nodes first.'}if(c==='cycle'){ok=list.circular;msg=ok?'The selected circular list type has a cycle from TAIL to HEAD.':'Choose a circular list type to demonstrate a cycle.'}if(c==='merge'){ok=list.length>0;msg='This single-list lab does not expose a two-list editor; review the hint and merge by repeatedly selecting the smaller head.'} $('challengeFeedback').textContent=msg;$('challengeFeedback').className='status '+(ok?'ok':'error');if(ok&&c!=='merge'){let p=loadProgress();p.challenges=p.challenges||[];if(!p.challenges.includes(c))p.challenges.push(c);saveProgress(p)}}
function loadProgress(){try{return JSON.parse(localStorage.getItem('listLabProgress')||'{}')}catch(e){return {}}}function saveProgress(p){localStorage.setItem('listLabProgress',JSON.stringify(p));renderProgress()}
function renderProgress(){let p=loadProgress(),less=p.lessons||[],chs=p.challenges||[],pct=Math.round((less.length+chs.length+((p.best||0)>0?1:0))/11*100);$('lessonMetric').textContent=less.length+' / 4';$('bestMetric').textContent=(p.best||0)+'%';$('challengeMetric').textContent=chs.length+' / 6';$('progressFill').style.width=pct+'%';$('progressText').textContent=pct+'% complete · '+Math.max(0,11-less.length-chs.length-((p.best||0)>0?1:0))+' learning goals remaining.';$('homeScore').textContent=pct+'%';$('homeProgress').innerHTML='<div class="progressbar"><i style="width:'+pct+'%"></i></div><p class="muted">'+less.length+' lessons · '+chs.length+' challenges · best quiz '+(p.best||0)+'%</p>'}
function resetProgress(){if(confirm('Reset saved learning progress on this browser?')){localStorage.removeItem('listLabProgress');renderProgress()}}
function runTests(){let results=[],types=Object.keys(TYPES);for(const t of types){try{let x=new LinkedList(t);x.insert(0,'a');x.insert(1,'b');x.insert(1,'c');if(x.values().join(',')!=='a,c,b')throw Error('insert order');x.reverse();if(x.values().join(',')!=='b,c,a')throw Error('reverse');x.remove(1);if(x.values().join(',')!=='b,a')throw Error('remove');if(x.circular&&x.tail.next!==x.head)throw Error('circular tail link');if(x.doubly&&x.head.prev!==x.tail)throw Error('doubly head prev');if(!x.circular&&x.tail.next!==null)throw Error('NULL tail');if(x.find('missing')!==null)throw Error('unsuccessful search');results.push(t+': PASS')}catch(e){results.push(t+': FAIL — '+e.message)}}$('testResults').textContent=results.join(' · ');$('testResults').className='status '+(results.every(x=>x.includes('PASS'))?'ok':'error')}
function init(){for(let id of ['typeSelect','learnType'])$(id).innerHTML=Object.entries(TYPES).map(([k,t])=>'<option value="'+k+'">'+t.name+'</option>').join('');$('typeSelect').onchange=e=>setType(e.target.value);$('learnType').onchange=renderLearn;$('studyOp').onchange=e=>prepareStudy(e.target.value);$('codeOp').onchange=renderCode;$('language').onchange=renderCode;$('challengeSelect').onchange=()=>{$('challengeFeedback').textContent='Set up the list in the simulator, then verify.'};$('typeSelect').value='singly';$('learnType').value='singly';render();renderLearn();buildStudy();renderCode();complexityTable();renderProgress();startQuiz()}
init();
</script></body></html>'''


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(PAGE.encode("utf-8"))))
        self.end_headers()
        self.wfile.write(PAGE.encode("utf-8"))

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    address = "http://127.0.0.1:8000"
    server = HTTPServer(("127.0.0.1", 8000), Handler)
    print(f"Linked List Learning Simulator running at {address} (Ctrl+C to stop)")
    try:
        webbrowser.open(address)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()
#!/usr/bin/env python3
"""Build a binary search tree and display its common traversal orders."""

from collections import deque


DEFAULT_VALUES = [50, 30, 70, 20, 40, 60, 80]


class Node:
    """A node in a binary search tree."""

    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


class BinarySearchTree:
    """A binary search tree with depth-first and breadth-first traversals."""

    def __init__(self):
        self.root = None
        self.size = 0

    def insert(self, value):
        """Insert a value, returning False when it is already in the tree."""
        if self.root is None:
            self.root = Node(value)
            self.size = 1
            return True

        current = self.root
        while True:
            if value == current.value:
                return False
            if value < current.value:
                if current.left is None:
                    current.left = Node(value)
                    self.size += 1
                    return True
                current = current.left
            else:
                if current.right is None:
                    current.right = Node(value)
                    self.size += 1
                    return True
                current = current.right

    def inorder(self):
        """Return values in left-root-right order."""
        result = []

        def visit(node):
            if node is None:
                return
            visit(node.left)
            result.append(node.value)
            visit(node.right)

        visit(self.root)
        return result

    def preorder(self):
        """Return values in root-left-right order."""
        result = []

        def visit(node):
            if node is None:
                return
            result.append(node.value)
            visit(node.left)
            visit(node.right)

        visit(self.root)
        return result

    def postorder(self):
        """Return values in left-right-root order."""
        result = []

        def visit(node):
            if node is None:
                return
            visit(node.left)
            visit(node.right)
            result.append(node.value)

        visit(self.root)
        return result

    def level_order(self):
        """Return values level by level from left to right."""
        if self.root is None:
            return []

        result = []
        queue = deque([self.root])
        while queue:
            node = queue.popleft()
            result.append(node.value)
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        return result

    def levels(self):
        """Return the tree grouped into levels for readable display."""
        if self.root is None:
            return []

        result = []
        queue = deque([self.root])
        while queue:
            level_values = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level_values.append(node.value)
                if node.left is not None:
                    queue.append(node.left)
                if node.right is not None:
                    queue.append(node.right)
            result.append(level_values)
        return result


def read_values():
    """Read integers from the user, or use a sample tree when input is blank."""
    print("Enter integer values separated by spaces or commas.")
    print("Press Enter without values to use the built-in example.")

    while True:
        try:
            raw_values = input("Values: ").strip()
        except EOFError:
            raw_values = ""

        if not raw_values:
            print(f"Using example values: {', '.join(map(str, DEFAULT_VALUES))}")
            return DEFAULT_VALUES

        try:
            return [int(value) for value in raw_values.replace(",", " ").split()]
        except ValueError:
            print("Please enter integers only (for example: 50, 30, 70, 20).")


def display_values(label, values):
    """Print a traversal sequence, including the empty-tree case."""
    sequence = " -> ".join(map(str, values)) if values else "(empty)"
    print(f"{label:<12} {sequence}")


def main():
    values = read_values()
    tree = BinarySearchTree()
    duplicates = []

    for value in values:
        if not tree.insert(value):
            duplicates.append(value)

    if duplicates:
        print(f"Ignored duplicate values: {', '.join(map(str, duplicates))}")

    print("\n=== Binary Search Tree Traversal Results ===")
    print(f"Node count: {tree.size}")
    print("\nTree levels:")
    if tree.root is None:
        print("(empty)")
    else:
        for depth, level in enumerate(tree.levels()):
            print(f"  Level {depth}: {'  '.join(map(str, level))}")

    print("\nTraversal output:")
    display_values("Inorder:", tree.inorder())
    display_values("Preorder:", tree.preorder())
    display_values("Postorder:", tree.postorder())
    display_values("Level order:", tree.level_order())


if __name__ == "__main__":
    main()