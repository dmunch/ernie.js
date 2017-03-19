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

describe("decode special cases", function() {
  it("should report more terms", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder());
    var buffer = new Uint8Array([131,108,0,0,0,2,97,25,98,0,0,1,1,106,131, 108]);
    var buffer2 = new Uint8Array([0,0,0,2,97,25,98,0,0,1,1,106]);

    decoder.nextBuffer(buffer);
    
    var result = decoder.decodeNext();

    expect(result.value).toEqual([25, 257]);
    expect(decoder.hasMoreTerms()).toEqual(true);
    
    decoder.nextBuffer(buffer2);
    result = decoder.decodeNext();
    expect(result.value).toEqual([25, 257]);
    expect(decoder.hasMoreTerms()).toEqual(false);
  });

  it("should allow a shortbuffer shorter then the buffer", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder(), 8);
    var buffer = new Uint8Array([131,108,0,0,0,2,97,25,98,0,0,1,1,106,131, 108]);
    var buffer2 = new Uint8Array([0,0,0,2,97,25,98,0,0,1,1,106]);

    decoder.nextBuffer(buffer);
    
    var result = decoder.decodeNext();
    expect(result.value).toEqual([25, 257]);
    expect(decoder.hasMoreTerms()).toEqual(true);
    
    result = decoder.decodeNext();

    decoder.nextBuffer(buffer2);
    result = decoder.decodeNext();
    expect(result.value).toEqual([25, 257]);
    expect(decoder.hasMoreTerms()).toEqual(false);
  });


  it("should decode a binary longer than the shortbuffer", function() {
    var decoder = new Bert.StreamingDecoder(new TextDecoder(), 8);
    var buffer = new Uint8Array([131,109,0,0,0,30,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32,97,115,100,102,32]);

    decoder.nextBuffer(buffer);
    var result = decoder.decodeNext();
    expect(result.value).toEqual("asdf asdf asdf asdf asdf asdf ");
    expect(decoder.hasMoreTerms()).toEqual(false);
  });
});
