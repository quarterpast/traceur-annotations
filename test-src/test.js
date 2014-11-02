/* jshint esnext:true */
var sinon  = require('sinon');
var expect = require('sinon-expect').enhance(
	require('expect.js'),
	sinon,
	'was'
);
var Annotation = require('../lib');

exports["Annotation tests"] = {
	"extend": {
		"should create a subclass"() {
			var Foo = Annotation.extend();
			expect(new Foo()).to.be.an(Annotation);
		},

		"should assign prototype properties"() {
			var Foo = Annotation.extend({
				bar: "baz"
			});

			expect(Foo.prototype).to.have.property("bar", "baz");
		},

		"should assign class properties"() {
			var Foo = Annotation.extend();

			expect(Foo).to.have.property("extend", Annotation.extend);
		},

		"should create grandchild classes"() {
			var Foo = Annotation.extend();
			var Bar = Foo.extend();
			expect(new Bar()).to.be.an(Annotation);
			expect(new Bar()).to.be.a(Foo);
		},

		"constructor": {
			"should call init"(done) {
				var Foo = Annotation.extend({
					init() {
						done();
					}
				});

				new Foo();
			},

			"should pass args to init"(done) {
				var args = ['a', 'b', 'c'];
				var Foo = Annotation.extend({
					init(...a) {
						expect(a).to.eql(args);
						done();
					}
				});

				new Foo(...args);
			},

			"without new": {
				"should instantiate the class"() {
					var Foo = Annotation.extend({
						init: sinon.spy()
					});
					Foo();
					expect(Foo.prototype.init).was.calledOnce();
				},

				"should add annotations to its arg"() {
					var Foo = Annotation.extend();
					var o = {};
					Foo(o);
					expect(o).to.have.property('annotations');
				},

				"should add annotations to the last arg"() {
					var Foo = Annotation.extend();
					var o = {};
					Foo('a', 'b', o);
					expect(o).to.have.property('annotations');
				},

				"should pass the rest of the args to init"() {
					var Foo = Annotation.extend({
						init: sinon.spy()
					});
					var o = {};
					Foo('a', 'b', o);
					expect(Foo.prototype.init).was.calledWithExactly('a', 'b');
				},

				"with no args acts on context"() {
					var Foo = Annotation.extend();
					var o = {};
					Foo.call(o);
					expect(o).to.have.property('annotations');
				},

				"adds instance to annotations"() {
					var Foo = Annotation.extend();
					var o = {};
					Foo(o);
					expect(o.annotations[0]).to.be.a(Foo);
				},

				"returns object it acted on"() {
					var Foo = Annotation.extend();
					var o = {};
					expect(Foo(o)).to.be(o);
				}
			}
		}
	}
};