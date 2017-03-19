// ernie.js
// Copyright (c) 2017 Daniel Münch (@dmunch)

// Based on previous work 
// BERT-JS
// Copyright (c) 2009 Rusty Klophaus (@rklophaus)
// Contributions by Ben Browning (@bbrowning)
// See MIT-LICENSE for licensing information.


// BERT-JS is a Javascript implementation of Binary Erlang Term Serialization.
// - http://github.com/rklophaus/BERT-JS
//
// References:
// - http://www.erlang-factory.com/upload/presentations/36/tom_preston_werner_erlectricity.pdf
// - http://www.erlang.org/doc/apps/erts/erl_ext_dist.html#8


let _Encoder = require('./Encoder.js');
let _StreamingDecoder = require('./StreamingDecoder.js');
let _Decoder = require('./Decoder.js');

let Encoder = _Encoder.Encoder;
let BertTuple = _Encoder.BertTuple;
let BertAtom = _Encoder.BertAtom;
let Decoder = _Decoder.Decoder;
let StreamingDecoder = _StreamingDecoder.Decoder;

module.exports = {
  Encoder,
  BertTuple,
  BertAtom,
  Decoder,
  StreamingDecoder
}
