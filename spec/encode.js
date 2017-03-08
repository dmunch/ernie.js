//import BertClass from 'ernie.js';
var Bert = require('../');

//polyfill with NPM text-encoding
if(!TextEncoder) {
  var TextEncoder = require('text-encoding').TextEncoder;
}

describe("A suite", function() {
  it("should encode array", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" v = [25, 257] ")))).toEqual([131,108,0,0,0,2,97,25,98,0,0,1,1,106]);
  });
  it("should encode nested array", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" v = [[25, 257], [299, 300]] ")))).toEqual([131,108,0,0,0,2,108,0,0,0,2,97,25,98,0,0,1,1,106,108,0,0,0,2,98,0,0,1,43,98,0,0,1,44,106,106]);
  });
  it("should encode associative array as map", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" v = {'a': 25, 'b': 257} ")))).toEqual([131,104,3,100,0,4,98,101,114,116,100,0,4,100,105,99,116,108,0,0,0,2,104,2,109,0,0,0,1,97,97,25,104,2,109,0,0,0,1,98,98,0,0,1,1,106]);
  });
  it("should encode tuple", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" new Bert.BertTuple([25, 257]) ")))).toEqual([131,104,2,97,25,98,0,0,1,1]);
  });
  it("should encode strings as binary", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" 'asdf' ")))).toEqual([131,109,0,0,0,4,97,115,100,102]);
  });
  it("should encode atoms", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" new Bert.BertAtom('cookie') ")))).toEqual([131,100,0,6,99,111,111,107,105,101]);
  });
  it("should encode small ints", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" i = 254 ")))).toEqual([131,97,254]);
  });
  it("should encode ints", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" i = 123456 ")))).toEqual([131,98,0,1,226,64]);
  });
  it("should encode floats", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" i = 3.14159 ")))).toEqual([131,70,64,9,33,249,240,27,134,110]);
  });
  it("should encode SMALL_BIG", function() {
    var encoder = new Bert.Encoder(new TextEncoder());
    expect(Array.from(encoder.encode(eval(" i = 123456789101112 ")))).toEqual([131,110,6,0,56,58,15,134,72,112]);
  });
});
