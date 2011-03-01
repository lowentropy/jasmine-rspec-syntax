A set of functions that add on to [Jasmine][] and make
it look more like RSpec.

This plugin is written in [Coffeescript][], and looks
and feels best when the tests are written in coffeescript
as well. That being said, there's nothing to stop you
from using it for your javascript testing.

# Installation

Add src/jasmine-rspec.js to your jasmine helpers in
spec/javascripts/support/jasmine.yml:

  helpers:
    - helpers/**/*.js

# Examples

See the examples in examples/*.coffee for more detail, but here's a taste:

  describe 'SomeClass', ->
    
    shared_examples_for 'any object', ->
      it 'should be an object', ->
        _(typeof(subject)).should equal('object')
        
    let_ 'options', ->
      option1: value1
      option2: value2
    
    subject -> new SomeClass(options)
    
    it_should_behave_like 'any object', ->
    
      its 'options', -> should equal(options)  
      it -> should respond_to('foo')
      
      it "should return something near 216", ->
        _(subject.foo()).should be_within(0.25).of(216)
      
      # equivalently
      its 'foo()', -> should be_within(0.25).of(216)

[Jasmine]: 		http://pivotal.github.com/jasmine/
[Coffeescript]: 	http://jashkenas.github.com/coffee-script/
