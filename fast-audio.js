'use strict';
const FAST_AUDIO_BASE=new URL('.',document.currentScript.src);
async function createFastAudio(file,signal){
 const {Input,ALL_FORMATS,BlobSource,AudioSampleSink}=await import(new URL('vendor/mediabunny.mjs',FAST_AUDIO_BASE).href);
 const input=new Input({formats:ALL_FORMATS,source:new BlobSource(file)});let track;
 try{track=await input.getPrimaryAudioTrack();if(!track){input.dispose();throw Error('В видео нет аудиодорожки.')}if(!await track.canDecode()){input.dispose();throw Error('Браузер не поддерживает быстрое декодирование этого аудиокодека. Попробуйте Chrome или Edge и MP4 с AAC.')}}catch(e){input.dispose();throw e}
 const sink=new AudioSampleSink(track);let disposed=false;
 return {streaming:true,async extract(start,length,signal){
  const rate=16000,count=Math.ceil(length*rate),samples=new Int16Array(count);let lastUpdate=0;
  for await(const sample of sink.samples(start,start+length)){
   try{if(signal.aborted||disposed)throw new DOMException('Отменено','AbortError');const buffer=sample.toAudioBuffer(),from=Math.max(0,Math.ceil((sample.timestamp-start)*rate)),to=Math.min(count,Math.floor((sample.timestamp+sample.duration-start)*rate));for(let i=from;i<to;i++){const position=Math.min(buffer.length-1,Math.max(0,Math.floor((start+i/rate-sample.timestamp)*buffer.sampleRate)));let value=0;for(let c=0;c<buffer.numberOfChannels;c++)value+=buffer.getChannelData(c)[position];samples[i]=Math.round(Math.max(-1,Math.min(1,value/buffer.numberOfChannels))*32767)}if(performance.now()-lastUpdate>250){lastUpdate=performance.now();aiMessage(`Быстрое чтение только аудио: ${Math.floor(sample.timestamp-start)} / ${Math.ceil(length)} с фрагмента…`);await new Promise(resolve=>setTimeout(resolve,0))}}finally{sample.close()}
  }
  const bytes=new Uint8Array(44+count*2),v=new DataView(bytes.buffer);const str=(offset,text)=>{for(let i=0;i<text.length;i++)v.setUint8(offset+i,text.charCodeAt(i))};str(0,'RIFF');v.setUint32(4,bytes.length-8,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,count*2,true);for(let i=0;i<count;i++)v.setInt16(44+i*2,samples[i],true);return bytes;
 },terminate(){disposed=true;input.dispose()}};
}
