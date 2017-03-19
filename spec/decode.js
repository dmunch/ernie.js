//ATTENTION
//ATTENTION: These are auto-generated specs based on ../specs.config and decode.js.mustache
//ATTENTION

var Bert = require('../');

//polyfill with NPM text-encoding
if(!TextDecoder) {
  var StringDecoder = require('string_decoder').StringDecoder;

  var TextDecoder = function() {
    this.decoder = new StringDecoder('utf8');
    this.decode = function(buffer) {
      var b = Buffer.from(buffer);
      return this.decoder.write(b);
    }
  };
}

describe("decoder", function() {
  it("should decode array", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,108,0,0,0,2,97,25,98,0,0,1,1,106]))).toEqual(eval(" v = [25, 257] "));
  });
  it("should decode smallint arrays", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,107,0,2,25,250]))).toEqual(eval(" v = [25, 250] "));
  });
  it("should decode small int", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,97,254]))).toEqual(eval(" i = 254 "));
  });
  it("should decode small big int", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,110,5,0,0,228,11,84,2]))).toEqual(eval(" i = 10000000000 "));
  });
  it("should decode int", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,98,0,1,226,64]))).toEqual(eval(" i = 123456 "));
  });
  it("should decode float", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,70,64,9,33,249,240,27,134,110]))).toEqual(eval(" i = 3.14159 "));
  });
  it("should decode binary as string", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,109,0,0,0,4,97,115,100,102]))).toEqual(eval(" i = 'asdf' "));
  });
  it("should decode long binary as string", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,109,0,0,0,30,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32]))).toEqual(eval(" i = 'asdf asdf asdf asdf asdf asdf ' "));
  });
  it("should decode array of binary as array of string1", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,108,0,0,0,1,109,0,0,0,5,114,101,115,101,116,106]))).toEqual(eval(" i = ['reset'] "));
  });
  it("should decode array of binary as array of string", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,108,0,0,0,2,109,0,0,0,4,97,115,100,102,109,0,0,0,4,97,115,100,102,106]))).toEqual(eval(" i = ['asdf', 'asdf'] "));
  });
  it("should decode tuple as array", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,104,2,97,1,97,2]))).toEqual(eval(" i = [1, 2] "));
  });
  it("should decode map as associative array", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,104,3,100,0,4,98,101,114,116,100,0,4,100,105,99,116,108,0,0,0,2,104,2,100,0,1,97,97,25,104,2,100,0,1,98,98,0,0,1,1,106]))).toEqual(eval(" v = {'a': 25, 'b': 257} "));
  });
  it("should decode atom as string", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,100,0,6,99,111,111,107,105,101]))).toEqual(eval(" i = 'cookie' "));
  });
  it("should decode nested terms", function() {
    var decoder = new Bert.Decoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,104,3,100,0,6,99,111,111,107,105,101,107,0,3,1,2,3,104,2,98,0,0,4,210,97,45]))).toEqual(eval(" i = ['cookie', [1, 2, 3], [1234, 45]] "));
  });
});

describe("streaming decoder", function() {
  it("should decode array", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,108,0,0,0,2,97,25,98,0,0,1,1,106]))).toEqual(eval(" v = [25, 257] "));
  });
  it("should decode smallint arrays", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,107,0,2,25,250]))).toEqual(eval(" v = [25, 250] "));
  });
  it("should decode small int", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,97,254]))).toEqual(eval(" i = 254 "));
  });
  it("should decode small big int", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,110,5,0,0,228,11,84,2]))).toEqual(eval(" i = 10000000000 "));
  });
  it("should decode int", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,98,0,1,226,64]))).toEqual(eval(" i = 123456 "));
  });
  it("should decode float", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,70,64,9,33,249,240,27,134,110]))).toEqual(eval(" i = 3.14159 "));
  });
  it("should decode binary as string", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,109,0,0,0,4,97,115,100,102]))).toEqual(eval(" i = 'asdf' "));
  });
  it("should decode long binary as string", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,109,0,0,0,30,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32]))).toEqual(eval(" i = 'asdf asdf asdf asdf asdf asdf ' "));
  });
  it("should decode array of binary as array of string1", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,108,0,0,0,1,109,0,0,0,5,114,101,115,101,116,106]))).toEqual(eval(" i = ['reset'] "));
  });
  it("should decode array of binary as array of string", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,108,0,0,0,2,109,0,0,0,4,97,115,100,102,109,0,0,0,4,97,115,100,102,106]))).toEqual(eval(" i = ['asdf', 'asdf'] "));
  });
  it("should decode tuple as array", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,104,2,97,1,97,2]))).toEqual(eval(" i = [1, 2] "));
  });
  it("should decode map as associative array", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,104,3,100,0,4,98,101,114,116,100,0,4,100,105,99,116,108,0,0,0,2,104,2,100,0,1,97,97,25,104,2,100,0,1,98,98,0,0,1,1,106]))).toEqual(eval(" v = {'a': 25, 'b': 257} "));
  });
  it("should decode atom as string", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,100,0,6,99,111,111,107,105,101]))).toEqual(eval(" i = 'cookie' "));
  });
  it("should decode nested terms", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    expect(decoder.decode(new Uint8Array([131,104,3,100,0,6,99,111,111,107,105,101,107,0,3,1,2,3,104,2,98,0,0,4,210,97,45]))).toEqual(eval(" i = ['cookie', [1, 2, 3], [1234, 45]] "));
  });
});

describe("stream decoding a single term", function() {
  it("should decode array", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,108,0,0,0,2,97,25,98,0,0,1,1,106]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" v = [25, 257] "));
  });
  it("should decode smallint arrays", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,107,0,2,25,250]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" v = [25, 250] "));
  });
  it("should decode small int", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,97,254]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = 254 "));
  });
  it("should decode small big int", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,110,5,0,0,228,11,84,2]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = 10000000000 "));
  });
  it("should decode int", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,98,0,1,226,64]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = 123456 "));
  });
  it("should decode float", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,70,64,9,33,249,240,27,134,110]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = 3.14159 "));
  });
  it("should decode binary as string", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,109,0,0,0,4,97,115,100,102]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = 'asdf' "));
  });
  it("should decode long binary as string", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,109,0,0,0,30,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = 'asdf asdf asdf asdf asdf asdf ' "));
  });
  it("should decode array of binary as array of string1", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,108,0,0,0,1,109,0,0,0,5,114,101,115,101,116,106]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = ['reset'] "));
  });
  it("should decode array of binary as array of string", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,108,0,0,0,2,109,0,0,0,4,97,115,100,102,109,0,0,0,4,97,115,100,102,106]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = ['asdf', 'asdf'] "));
  });
  it("should decode tuple as array", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,104,2,97,1,97,2]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = [1, 2] "));
  });
  it("should decode map as associative array", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,104,3,100,0,4,98,101,114,116,100,0,4,100,105,99,116,108,0,0,0,2,104,2,100,0,1,97,97,25,104,2,100,0,1,98,98,0,0,1,1,106]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" v = {'a': 25, 'b': 257} "));
  });
  it("should decode atom as string", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,100,0,6,99,111,111,107,105,101]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = 'cookie' "));
  });
  it("should decode nested terms", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,104,3,100,0,6,99,111,111,107,105,101,107,0,3,1,2,3,104,2,98,0,0,4,210,97,45]);

    var chunkSize = Math.floor(buffer.length / 3);
    var chunk1 = buffer.subarray(0,chunkSize); 
    var chunk2 = buffer.subarray(chunkSize, chunkSize * 2); 
    var chunk3 = buffer.subarray(chunkSize * 2, buffer.length);
    
    decoder.nextBuffer(chunk1);
    var val1 = decoder.decodeNext();
    
    decoder.nextBuffer(chunk2);
    var val2 = decoder.decodeNext();

    decoder.nextBuffer(chunk3);
    var val = decoder.decodeNext();
    
    expect(val.value).toEqual(eval(" i = ['cookie', [1, 2, 3], [1234, 45]] "));
  });
});

describe("stream decoding multiple terms", function() {
  it("should decode multiple terms from one stream", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffers = [
      new Uint8Array([131,108,0,0,0,2,97,25,98,0,0,1,1,106]),
      new Uint8Array([131,107,0,2,25,250]),
      new Uint8Array([131,97,254]),
      new Uint8Array([131,110,5,0,0,228,11,84,2]),
      new Uint8Array([131,98,0,1,226,64]),
      new Uint8Array([131,70,64,9,33,249,240,27,134,110]),
      new Uint8Array([131,109,0,0,0,4,97,115,100,102]),
      new Uint8Array([131,109,0,0,0,30,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32]),
      new Uint8Array([131,108,0,0,0,1,109,0,0,0,5,114,101,115,101,116,106]),
      new Uint8Array([131,108,0,0,0,2,109,0,0,0,4,97,115,100,102,109,0,0,0,4,97,115,100,102,106]),
      new Uint8Array([131,104,2,97,1,97,2]),
      new Uint8Array([131,104,3,100,0,4,98,101,114,116,100,0,4,100,105,99,116,108,0,0,0,2,104,2,100,0,1,97,97,25,104,2,100,0,1,98,98,0,0,1,1,106]),
      new Uint8Array([131,100,0,6,99,111,111,107,105,101]),
      new Uint8Array([131,104,3,100,0,6,99,111,111,107,105,101,107,0,3,1,2,3,104,2,98,0,0,4,210,97,45]),
    ];

    var sum = 0;
    for(var i = 0; i < buffers.length; i++) {
      sum += buffers[i].length;  
    }
    var buffer = new Uint8Array(sum);
    var offset = 0;
    for(var i = 0; i < buffers.length; i++) {
      buffer.set(buffers[i], offset);
      offset += buffers[i].length;  
    }

    expect(decoder.decode(buffer, true)).toEqual(eval(" v = [25, 257] "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" v = [25, 250] "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = 254 "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = 10000000000 "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = 123456 "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = 3.14159 "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = 'asdf' "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = 'asdf asdf asdf asdf asdf asdf ' "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = ['reset'] "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = ['asdf', 'asdf'] "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = [1, 2] "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" v = {'a': 25, 'b': 257} "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = 'cookie' "));
    expect(decoder.decode(buffer, true)).toEqual(eval(" i = ['cookie', [1, 2, 3], [1234, 45]] "));
  });
});

describe("stream decoding multiple terms chunked", function() {
  it("should decode multiple terms from one stream", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffers = [
      new Uint8Array([131,108,0,0,0,2,97,25,98,0,0,1,1,106]),
      new Uint8Array([131,107,0,2,25,250]),
      new Uint8Array([131,97,254]),
      new Uint8Array([131,110,5,0,0,228,11,84,2]),
      new Uint8Array([131,98,0,1,226,64]),
      new Uint8Array([131,70,64,9,33,249,240,27,134,110]),
      new Uint8Array([131,109,0,0,0,4,97,115,100,102]),
      new Uint8Array([131,109,0,0,0,30,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32]),
      new Uint8Array([131,108,0,0,0,1,109,0,0,0,5,114,101,115,101,116,106]),
      new Uint8Array([131,108,0,0,0,2,109,0,0,0,4,97,115,100,102,109,0,0,0,4,97,115,100,102,106]),
      new Uint8Array([131,104,2,97,1,97,2]),
      new Uint8Array([131,104,3,100,0,4,98,101,114,116,100,0,4,100,105,99,116,108,0,0,0,2,104,2,100,0,1,97,97,25,104,2,100,0,1,98,98,0,0,1,1,106]),
      new Uint8Array([131,100,0,6,99,111,111,107,105,101]),
      new Uint8Array([131,104,3,100,0,6,99,111,111,107,105,101,107,0,3,1,2,3,104,2,98,0,0,4,210,97,45]),
    ];
    
    var assertions = [
      eval(" v = [25, 257] "),
      eval(" v = [25, 250] "),
      eval(" i = 254 "),
      eval(" i = 10000000000 "),
      eval(" i = 123456 "),
      eval(" i = 3.14159 "),
      eval(" i = 'asdf' "),
      eval(" i = 'asdf asdf asdf asdf asdf asdf ' "),
      eval(" i = ['reset'] "),
      eval(" i = ['asdf', 'asdf'] "),
      eval(" i = [1, 2] "),
      eval(" v = {'a': 25, 'b': 257} "),
      eval(" i = 'cookie' "),
      eval(" i = ['cookie', [1, 2, 3], [1234, 45]] "),
    ];

    var sum = 0;
    for(var i = 0; i < buffers.length; i++) {
      sum += buffers[i].length;  
    }
    var buffer = new Uint8Array(sum);
    var offset = 0;
    for(var i = 0; i < buffers.length; i++) {
      buffer.set(buffers[i], offset);
      offset += buffers[i].length;  
    }

 
    var n = 115; 
    var chunkSize = Math.floor(buffer.length / n);
    //console.log("chunksize " + chunkSize + " l " + buffer.length);
    var chunks = [];
    for(var i = 0; i < n; i++) {
      var sub = buffer.subarray(i * chunkSize, i == n-1 ? buffer.length : (i + 1) * chunkSize);     
      chunks.push(sub);
    }
   
    var val;
    var c = 0;
    var a = 0;
    var chunk = chunks[c];
    decoder.nextBuffer(chunk);

    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
    
    do {
      val = decoder.decodeNext();
      if(val.value) {
        expect(val.value).toEqual(assertions[a++]);
      } else 
      {
        chunk = chunks[++c];
        decoder.nextBuffer(chunk);
      }
    }
    while(c < n);
    
  });
});
