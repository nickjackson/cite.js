var expect = require('expect.js');
var StyleGuide = require('..');

/**
 * foo bar baz
 * multi line
 *
 * This is a test fixture style
 *
 * @id BOOK12345
 * @type Book
 * @type Online
 */

exports[0] = function(){
  return 'foo bar';
}

describe('styleguide', function(){
  var sg;

  beforeEach(function(){
    sg = StyleGuide()
  })

  it('should be a fn', function(){
    expect(StyleGuide).to.be.a('function');
    expect(StyleGuide()).to.be.a(StyleGuide);
  })

  describe('.config()', function(){
    it('should setup config correctly', function(){
      sg.config({id: 'test', title: 'TEST', version:'1'})
      expect(sg.id).to.eql('test')
      expect(sg.title).to.eql('TEST')
      expect(sg.version).to.eql('1')
    })
  })

  describe('.add()', function(){
    it('should add types correctly', function(){
      sg.add({id: 'abc', title: '123', types: [{id:'Book'}], description: 'test'}, function(){return 'foo bar'})
      expect(sg.types.abc.title).to.eql('123')
      expect(sg.types.abc.types).to.eql([{id:'Book'}])
      expect(sg.types.abc.description).to.eql('test')
      expect(sg.types.abc.fn()).to.eql('foo bar')
    })

    it('should not allow same id', function(){
      sg.add({id: 'abc', title: '123', types: [{id:'Book'}]})
      expect(sg.add.bind(sg, {id:'abc'})).to.throwException(function (e) {
        expect(e).to.be.a(Error);
        expect(e.message).to.eql('must have a UNIQUE id')
      });
    })

    it('must have an id', function(){
      expect(sg.add.bind(sg, {})).to.throwException(function (e) {
        expect(e).to.be.a(Error);
        expect(e.message).to.eql('must have a (unique) id')
      });
    })

    it('should have title', function(){
      expect(sg.add.bind(sg, {id:'abc'})).to.throwException(function (e) {
        expect(e).to.be.a(Error);
        expect(e.message).to.eql('must have a title')
      });
    })

    it('should have type', function(){
      expect(sg.add.bind(sg, {id:'abc', title: 'foo'})).to.throwException(function (e) {
        expect(e).to.be.a(Error);
        expect(e.message).to.eql('must have a type or default')
      });
    })

    it('should have type', function(){
      expect(sg.add.bind(sg, {id:'abc', title: 'foo', types: [{id:'bar', 'default': true}]})).to.not.throwException();
      expect(sg.add.bind(sg, {id:'abc1', title: 'foo', types: [{id:'bar'}]})).to.not.throwException();
    })

    it('allows multiple types', function(){

    })

    it('should not have 2 identical defaults', function(){
      sg.add({id: 'abc', title: '123', types: [{id:'Book', 'default': true}]});
      var fn = sg.add.bind(sg, {id: 'abc1', title: '123', types: [{id:'Book', 'default': true}]});
      expect(fn).to.throwException(function (e) {
        expect(e).to.be.a(Error);
        expect(e.message).to.eql('must have only 1 default for type Book')
      });
    })
  })

  describe('.load()', function(){
    it('should load types correctly', function(){
      sg.path(__dirname)
      sg.load('./styleguide');
      expect(sg.types.BOOK12345).to.not.be(undefined);
      expect(sg.types.BOOK12345.title).to.eql('foo bar baz multi line')
      expect(sg.types.BOOK12345.description).to.eql('<p>This is a test fixture style</p>')
      expect(sg.types.BOOK12345.fn()).to.eql('foo bar')
    })
  })

})
