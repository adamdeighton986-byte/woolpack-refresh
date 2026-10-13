const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000, ADMIN_KEY=process.env.ADMIN_KEY||'change-me-before-launch', DATA=process.env.DATA_FILE||path.join(__dirname,'data.json');
const questions=[
 {q:'Which city is the capital of Wales?',a:['Cardiff','Swansea','Newport','Bangor'],correct:0},
 {q:'Which band released the album Abbey Road?',a:['Queen','The Beatles','Oasis','Blur'],correct:1},
 {q:'How many players start on the pitch for one football team?',a:['9','10','11','12'],correct:2},
 {q:'Which river flows through London?',a:['Severn','Trent','Thames','Tyne'],correct:2},
 {q:'What is the chemical symbol for gold?',a:['Ag','Au','Fe','Pb'],correct:1},
 {q:'In which sport is the Ashes contested?',a:['Rugby','Cricket','Tennis','Golf'],correct:1},
 {q:'What is the largest planet in our solar system?',a:['Earth','Saturn','Jupiter','Neptune'],correct:2},
 {q:'Which Yorkshire city is known for its Minster?',a:['Leeds','York','Bradford','Wakefield'],correct:1},
 {q:'How many sides does a hexagon have?',a:['5','6','7','8'],correct:1},
 {q:'Which author wrote Pride and Prejudice?',a:['Charlotte Brontë','Jane Austen','Mary Shelley','George Eliot'],correct:1},
 {q:"What is the capital of Scotland?",a:["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],correct:0},
 {q:"Which ocean lies west of Ireland?",a:["Pacific", "Atlantic", "Indian", "Arctic"],correct:1},
 {q:"Who painted the Mona Lisa?",a:["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"],correct:2},
 {q:"How many minutes are in two hours?",a:["90", "100", "120", "150"],correct:2},
 {q:"What is the smallest prime number?",a:["1", "2", "3", "5"],correct:1},
 {q:"Which country is home to the city of Barcelona?",a:["Portugal", "France", "Italy", "Spain"],correct:3},
 {q:"Which instrument has black and white keys?",a:["Violin", "Piano", "Trumpet", "Flute"],correct:1},
 {q:"What is the chemical formula for water?",a:["CO2", "H2O", "O2", "NaCl"],correct:1},
 {q:"Which British monarch reigned immediately before Charles III?",a:["Elizabeth II", "George VI", "Edward VIII", "Victoria"],correct:0},
 {q:"What is the currency of Japan?",a:["Won", "Yuan", "Yen", "Baht"],correct:2},
 {q:"Which continent contains Kenya?",a:["Asia", "Africa", "Europe", "South America"],correct:1},
 {q:"How many legs does a spider have?",a:["6", "8", "10", "12"],correct:1},
 {q:"Which novel features Sherlock Holmes?",a:["The Hound of the Baskervilles", "Dracula", "The Hobbit", "Oliver Twist"],correct:0},
 {q:"What colour do you get by mixing blue and yellow paint?",a:["Orange", "Purple", "Green", "Brown"],correct:2},
 {q:"What is the square root of 81?",a:["7", "8", "9", "10"],correct:2},
 {q:"Which city hosted the 2012 Summer Olympics?",a:["Paris", "London", "Tokyo", "Rio de Janeiro"],correct:1},
 {q:"What is the largest mammal?",a:["African elephant", "Blue whale", "Giraffe", "Hippopotamus"],correct:1},
 {q:"Which gas do plants absorb during photosynthesis?",a:["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],correct:2},
 {q:"Which UK nation has Belfast as its capital?",a:["Wales", "Scotland", "England", "Northern Ireland"],correct:3},
 {q:"What is the longest river in the UK?",a:["River Thames", "River Severn", "River Trent", "River Tyne"],correct:1},
 {q:"Which artist released the album 21?",a:["Adele", "Dua Lipa", "Amy Winehouse", "Ellie Goulding"],correct:0},
 {q:"Which planet is closest to the Sun?",a:["Venus", "Mars", "Mercury", "Earth"],correct:2},
 {q:"How many degrees are in a right angle?",a:["45", "60", "90", "180"],correct:2},
 {q:"What is the capital of Italy?",a:["Milan", "Naples", "Rome", "Turin"],correct:2},
 {q:"In snooker, how many points is the black ball worth?",a:["5", "6", "7", "8"],correct:2},
 {q:"Which English county is home to Stonehenge?",a:["Wiltshire", "Kent", "Devon", "Norfolk"],correct:0},
 {q:"What is the main ingredient in guacamole?",a:["Cucumber", "Avocado", "Pea", "Courgette"],correct:1},
 {q:"Which composer wrote The Four Seasons?",a:["Mozart", "Bach", "Vivaldi", "Beethoven"],correct:2},
 {q:"What is the largest desert in the world?",a:["Sahara", "Gobi", "Antarctic Desert", "Arabian Desert"],correct:2},
 {q:"Which metal is liquid at typical room temperature?",a:["Copper", "Mercury", "Tin", "Zinc"],correct:1},
 {q:"Which football club plays home games at Anfield?",a:["Everton", "Liverpool", "Arsenal", "Chelsea"],correct:1},
 {q:"What is the capital of Canada?",a:["Toronto", "Vancouver", "Ottawa", "Montreal"],correct:2},
 {q:"Which organ pumps blood around the body?",a:["Liver", "Kidney", "Lung", "Heart"],correct:3},
 {q:"What is the traditional birthstone for April?",a:["Emerald", "Ruby", "Diamond", "Sapphire"],correct:2},
 {q:"Which Shakespeare play features the characters Rosencrantz and Guildenstern?",a:["Macbeth", "Hamlet", "Othello", "King Lear"],correct:1},
 {q:"How many sides does an octagon have?",a:["6", "7", "8", "9"],correct:2},
 {q:"What is the name of the galaxy containing our Solar System?",a:["Andromeda", "Milky Way", "Triangulum", "Whirlpool"],correct:1},
 {q:"Which sea separates Great Britain and Norway?",a:["Irish Sea", "North Sea", "Baltic Sea", "Mediterranean Sea"],correct:1},
 {q:"Which film features the song My Heart Will Go On?",a:["Titanic", "The Bodyguard", "Ghost", "Pretty Woman"],correct:0},
 {q:"What is the first element in the periodic table?",a:["Helium", "Hydrogen", "Lithium", "Oxygen"],correct:1}
];
let db={venues:[{id:'woolpack',name:process.env.VENUE_NAME||'The Woolpack, Esholt'}],teams:[],answers:{},game:{id:1,status:'waiting',index:-1,startsAt:null,endsAt:null,questionSeconds:20,breakSeconds:30,questions}};
try {let saved=JSON.parse(fs.readFileSync(DATA)); if(saved&&saved.game&&Array.isArray(saved.venues)){db=saved;db.venues=[{id:'woolpack',name:process.env.VENUE_NAME||'The Woolpack, Esholt'}];db.teams=db.teams.filter(t=>t.venueId==='woolpack');if(db.game.status==='waiting'){db.game.questions=questions;db.game.index=-1;}if(!Number.isInteger(db.game.revealStep))db.game.revealStep=0;}}catch{}
const clients=new Set();function save(){fs.writeFileSync(DATA,JSON.stringify(db,null,2));}function uid(){return crypto.randomBytes(8).toString('hex');}
function send(res,status,obj){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj));}
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',d=>{s+=d;if(s.length>100000)reject(Error('Too large'));});req.on('end',()=>{try{resolve(JSON.parse(s||'{}'))}catch{reject(Error('Invalid JSON'))}})});}
function phase(){
 let g=db.game,now=Date.now(),changed=false;
 if(!Number.isFinite(g.breakSeconds)||g.breakSeconds<0)g.breakSeconds=30;
 // Advance using the scheduled boundary, not the moment a browser polls.
 while(g.endsAt!=null&&now>=g.endsAt){
  if(g.status==='question'){
   if(g.index>=g.questions.length-1){g.status='ceremony';g.revealStep=0;g.startsAt=g.endsAt;g.endsAt=null;}
   else{g.status='break';g.startsAt=g.endsAt;g.endsAt=g.startsAt+g.breakSeconds*1000;}changed=true;
  }else if(g.status==='break'){
   if(g.index>=g.questions.length-1){g.status='ceremony';g.revealStep=0;g.startsAt=g.endsAt;g.endsAt=null;}
   else{g.index++;g.status='question';g.startsAt=g.endsAt;g.endsAt=g.startsAt+g.questionSeconds*1000;}
   changed=true;
  }else break;
 }
 if(changed){save();broadcast();}return g.status;
}
function scores(){return db.teams.filter(t=>t.gameId===db.game.id).map(t=>({id:t.id,name:t.name,venueId:t.venueId,score:t.score})).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));}
function state(teamId,admin=false){phase();let g=db.game;let q=g.questions[g.index];let published=g.status==='finished';let a=g.status==='question'&&q?{q:q.q,a:q.a}:null;let team=db.teams.find(t=>t.id===teamId&&t.gameId===g.id);let ranked=scores();let winners=ranked.slice(0,3).map((t,i)=>({...t,place:i+1}));let step=g.revealStep||0;let podium=step===0?[]:winners.filter(w=>w.place>=4-step).sort((x,y)=>y.place-x.place);return {serverTime:Date.now(),gameId:g.id,status:g.status,index:g.index,total:g.questions.length,endsAt:g.endsAt,question:a,venues:db.venues,revealStep:step,podium:g.status==='ceremony'||published?podium:[],leaderboard:published?ranked:[],team:team?{id:team.id,name:team.name,venueId:team.venueId,score:published?team.score:null,answered:!!db.answers[g.id+':'+g.index+':'+team.id]}:null,answerKey:published?g.questions.map((item,i)=>({number:i+1,question:item.q,answer:item.a[item.correct]})):null,...(admin?{admin:true,questionSeconds:g.questionSeconds,breakSeconds:g.breakSeconds,privateLeaderboard:g.status==='ceremony'?ranked:[]}:{} )};}
function broadcast(){for(let c of clients){try{c.write('data: update\n\n')}catch{clients.delete(c)}}}
function isAdmin(req){return req.headers['x-admin-key']===ADMIN_KEY;}
function clean(v,max=50){return String(v||'').trim().slice(0,max).replace(/[<>]/g,'');}
const server=http.createServer(async(req,res)=>{let url=new URL(req.url,'http://localhost');try{
 if(url.pathname==='/api/events'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write('data: connected\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;}
 if(url.pathname==='/api/state'&&req.method==='GET')return send(res,200,state(url.searchParams.get('teamId'),isAdmin(req)));
 if(url.pathname==='/api/join'&&req.method==='POST'){let b=await body(req),v=db.venues[0],name=clean(b.name);if(!v||name.length<2)return send(res,400,{error:'Choose a venue and a team name of at least 2 characters.'});if(['ceremony','finished'].includes(db.game.status))return send(res,400,{error:'The quiz has finished. Please wait for the next game.'});if(db.teams.some(t=>t.gameId===db.game.id&&t.venueId===v.id&&t.name.toLowerCase()===name.toLowerCase()))return send(res,409,{error:'That team name is already in use at this venue.'});let t={id:uid(),gameId:db.game.id,venueId:v.id,name,score:0};db.teams.push(t);save();broadcast();return send(res,200,{teamId:t.id});}
 if(url.pathname==='/api/answer'&&req.method==='POST'){let b=await body(req);phase();let g=db.game,t=db.teams.find(t=>t.id===b.teamId&&t.gameId===g.id);if(!t)return send(res,403,{error:'Join this game first.'});if(g.status!=='question'||Date.now()>=g.endsAt)return send(res,409,{error:'Answers are closed.'});let choice=Number(b.choice),key=g.id+':'+g.index+':'+t.id;if(!Number.isInteger(choice)||choice<0||choice>3)return send(res,400,{error:'Invalid answer.'});if(db.answers[key])return send(res,409,{error:'Answer already submitted.'});let correct=choice===g.questions[g.index].correct;db.answers[key]={choice,at:Date.now(),correct};if(correct)t.score+=100;save();broadcast();return send(res,200,{ok:true});}
 if(url.pathname.startsWith('/api/admin/')){if(!isAdmin(req))return send(res,401,{error:'Incorrect admin key.'});if(req.method!=='POST')return send(res,405,{error:'POST required'});let b=await body(req),action=url.pathname.split('/').pop(),g=db.game;
 if(action==='venue'){return send(res,403,{error:'This edition supports one venue only.'});}
 else if(action==='start'){if(g.status==='question')return send(res,409,{error:'Question already live.'});if(['ceremony','finished'].includes(g.status))return send(res,409,{error:'Reset for a new game first.'});if(g.index>=g.questions.length-1)return send(res,409,{error:'No questions remaining.'});g.index++;g.status='question';g.startsAt=Date.now();g.endsAt=g.startsAt+g.questionSeconds*1000;}
 
 else if(action==='reveal'){phase();if(g.status!=='ceremony')return send(res,409,{error:'Wait until all 50 questions are complete.'});if((g.revealStep||0)>=3)return send(res,409,{error:'All three winners have already been announced.'});g.revealStep=(g.revealStep||0)+1;}
 else if(action==='publish'){phase();if(g.status!=='ceremony'||g.revealStep!==3)return send(res,409,{error:'Reveal third, second and first place before publishing all scores.'});g.status='finished';}
 else if(action==='finish'){return send(res,409,{error:'The quiz finishes automatically after question 50.'});}
 else if(action==='settings'){if(g.status!=='waiting')return send(res,409,{error:'Change timers before the quiz begins.'});let qs=Number(b.questionSeconds),bs=Number(b.breakSeconds);if(!Number.isInteger(qs)||qs<5||qs>300||!Number.isInteger(bs)||bs<5||bs>300)return send(res,400,{error:'Timers must be whole seconds from 5 to 300.'});g.questionSeconds=qs;g.breakSeconds=bs;}
 else if(action==='reset'){db.game={id:g.id+1,status:'waiting',index:-1,startsAt:null,endsAt:null,questionSeconds:20,breakSeconds:30,questions,revealStep:0};db.answers={};db.teams=[];}
 else return send(res,404,{error:'Unknown action'});save();broadcast();return send(res,200,{ok:true});}
 if(req.method!=='GET')return send(res,405,{error:'Method not allowed'});
 let p=url.pathname==='/'?'/index.html':url.pathname;let file=path.resolve(__dirname,'public','.'+p);if(!file.startsWith(path.join(__dirname,'public')+path.sep))return send(res,403,{error:'Forbidden'});fs.readFile(file,(err,data)=>{if(err)return send(res,404,{error:'Not found'});let ext=path.extname(file);res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml'})[ext]||'application/octet-stream'});res.end(data);});
 }catch(e){send(res,400,{error:e.message||'Request failed'});}});
setInterval(()=>{phase();for(let c of clients){try{c.write(': ping\n\n')}catch{clients.delete(c)}}},3000);
server.listen(PORT,()=>console.log('Single Venue Quiz on http://localhost:'+PORT+' | Set ADMIN_KEY before deploying'));
