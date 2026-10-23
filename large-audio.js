'use strict';
// Bounded-memory audio capture. Video remains a browser-managed local file URL.
async function createLargeAudio(file,signal){
 const media=document.createElement('video');media.preload='metadata';media.playsInline=true;const url=URL.createObjectURL(file);media.src=url;
 await new Promise((resolve,reject)=>{media.onloadedmetadata=resolve;media.onerror=()=>reject(Error('Браузер не поддерживает кодек этого видео. Попробуйте MP4 H.264/AAC.'));signal.addEventListener('abort',()=>reject(new DOMException('Отменено','AbortError')),{once:true})});
 const context=new AudioContext(),source=context.createMediaElementSource(media),processor=context.createScriptProcessor(4096,2,1),gain=context.createGain();gain.gain.value=0;source.connect(processor);processor.connect(gain);gain.connect(context.destination);await context.resume();
 return {streaming:true,async extract(start,length,signal){
  media.pause();if(Math.abs(media.currentTime-start)>.02)await new Promise((resolve,reject)=>{media.onseeked=resolve;media.onerror=()=>reject(Error('Не удалось перейти к аудиофрагменту.'));media.currentTime=start});
  const rate=16000,total=Math.ceil(length*rate),samples=new Int16Array(total);let count=0,position=0;
  await new Promise((resolve,reject)=>{let timer;const cleanup=()=>{clearInterval(timer);processor.onaudioprocess=null;media.onended=null;signal.removeEventListener('abort',abort);media.pause()};const finish=()=>{cleanup();resolve()};const abort=()=>{cleanup();reject(new DOMException('Отменено','AbortError'))};signal.addEventListener('abort',abort,{once:true});media.onended=finish;
   processor.onaudioprocess=e=>{if(media.paused)return;const input=e.inputBuffer,channels=input.numberOfChannels,step=context.sampleRate/rate;for(;position<input.length&&count<total;position+=step){const i=Math.floor(position);let value=0;for(let c=0;c<channels;c++)value+=input.getChannelData(c)[i];samples[count++]=Math.round(Math.max(-1,Math.min(1,value/channels))*32767)}position-=input.length;if(count>=total)finish()};
   let previous=media.currentTime,stalled=0;timer=setInterval(()=>{if(signal.aborted)return abort();if(media.currentTime===previous)stalled++;else stalled=0;previous=media.currentTime;if(stalled>60){cleanup();reject(Error('Чтение большого видео остановилось. Держите вкладку открытой и проверьте файл.'))}},1000);media.play().catch(e=>{cleanup();reject(Error('Браузер запретил обработку аудио. Нажмите анализ повторно: '+e.message))})
  });
  const bytes=new Uint8Array(44+total*2),v=new DataView(bytes.buffer);const str=(offset,text)=>{for(let i=0;i<text.length;i++)v.setUint8(offset+i,text.charCodeAt(i))};str(0,'RIFF');v.setUint32(4,bytes.length-8,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,total*2,true);for(let i=0;i<total;i++)v.setInt16(44+i*2,samples[i],true);return bytes;
 },terminate(){media.pause();media.removeAttribute('src');media.load();processor.disconnect();source.disconnect();context.close();URL.revokeObjectURL(url)}}
}
