'use strict';
// Unicode letters match Python's isalpha() behavior for the input normalization.
function processTimecode(text){text=text.trim();if(!/^[1-4]/.test(text))return null;const number=Number(text[0]);let rest=text.slice(1).trim().toLowerCase();let capitalize=true;rest=Array.from(rest).map((ch,i,chars)=>{let result=ch;if(capitalize&&/\p{L}/u.test(ch)){result=ch.toUpperCase();capitalize=false}if(ch==='.'&&chars[i+1]===' ')capitalize=true;return result}).join('').replace(/[^\p{L}]+$/u,'');return rest?{number,text:rest}:null}
function formatTime(seconds){seconds=Math.max(0,Math.floor(seconds||0));return [Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':')}
if(typeof module!=='undefined')module.exports={processTimecode,formatTime};
