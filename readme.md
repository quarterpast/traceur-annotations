
```js
/* jshint esnext: true */
```

`traceur-annotations`
---

A shim for Traceur's annotations. Can be used 
directly as an annotation in Traceur:
```javascript
var Foo = Annotation.extend();
@Foo function bar() {}
```
or as a regular function in ES5/CoffeeScript/etc.:
```coffeescript
Foo = Annotation.extend()
Foo bar = ->
```
Traceur instantiates the class and adds it to the
annotatee's `annotations` array, so we simulate
that in other environments.

```js
class Annotation { init() {} }
```

#### `has :: Object → Maybe Annotation`
If the object is annotated with this annotation,
return the instance. Otherwise, return undefined.

```js
Annotation.has = function (obj) {
	return (obj.annotations || []).find((a) => a instanceof this);
};
```

#### `extend :: Object → typeof Annotation`
Create a new annotation based on this one. Can't do
this with regular subclassing, as we wouldn't be
able to dynamically delegate to the original class
if we need to instantiate it ourselves without
resorting to `arguments.callee`.

```js
Annotation.extend = function (proto = {}) {
	var sub = class extends this {
		constructor(...args) {
			if(this instanceof Annotation) {
				this.init(...args);
			} else {
				var obj = args.pop() || this;
				obj.annotations = obj.annotations || [];
				obj.annotations.push(new sub(...args));
				return obj; // for chaining
			}
		}
	};
	Object.assign(sub.prototype, proto);
	Object.assign(sub, Annotation);
	return sub;
};
```

module.exports

```js
export default Annotation;
```
