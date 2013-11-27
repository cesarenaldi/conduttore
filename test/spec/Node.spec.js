define([
	'underscore',
	'Node'
], function (_, Node) {

	function createNode (type, value, specificity) {
		var matcher = sinon.stub()
		type = type || _.uniqueId('type-')
		specificity = specificity || 0
		type = type || false;
		return new Node(type, matcher, specificity, value)
	}

	describe('Node', function () {

		describe('when changing the levels property', function () {
			var childNode = createNode(),
				rootNode = createNode()

			before(function () {
				rootNode.insert(childNode)
			})

			describe('for a node that is not the root', function () {

				it('should also update the parent node levels', function () {
					expect(rootNode.levels).to.equal(1)
					childNode.levels++
					expect(rootNode.levels).to.equal(2)
					childNode.levels += 4
					expect(rootNode.levels).to.equal(6)
				})
			})
		})

		describe('length property', function () {

			var testObj = createNode()

			it('should reflect the number of direct children', function () {
				expect(testObj.length).to.equal(0)
				testObj.insert(createNode())
				expect(testObj.length).to.equal(1)
			})
		})

		describe('value property', function () {

			var VALUE = 'bob';
			var testObj = createNode('pippo', VALUE);

			it('should return the value provided in the constructor', function () {
				expect(testObj.value).to.equal(VALUE)
			})

			it('should set the internal value', function () {
				var NEW_VALUE = '1234'
				testObj.value = NEW_VALUE
				expect(testObj.value).to.equal(NEW_VALUE)
			})
		})

		describe('when checking if two nodes are equal', function () {

			var TYPE = ':type',
				testObj = createNode(TYPE);

			it('should return true if the keys match', function () {
				var nodeWithSameKey = createNode(TYPE)
				expect( testObj.equal(nodeWithSameKey) ).to.be.true
			})

			it('should return false if the keys does NOT match', function () {
				var anotherNode = createNode('anotherkey')
				expect( testObj.equal(anotherNode) ).to.be.false
			})
		})

		describe('when inserting a new node', function () {
			
			var TYPE = ':type',
				VALUE = 'value',

				testObj = createNode();

			it('should save it in the children nodes and return it', function () {
				
				var result = testObj.insert(createNode(TYPE, VALUE))

				expect( testObj.length ).to.equal(1)
				expect( result ).to.be.an.instanceof(Node)
				expect( result.equal(createNode(TYPE, VALUE)) ).to.be.true
			})
		})

		describe('when inserting an already existing node', function () {

			var TYPE = ':type',
				VALUE = 'value',
				testObj = createNode(),
				previous = testObj.insert(createNode(TYPE, VALUE));

			it('should avoid duplication and return the already existing node', function () {
				
				var result = testObj.insert(createNode(TYPE, VALUE));

				expect( testObj.length ).to.equal(1)
				expect( result ).to.be.an.instanceof(Node)
				expect( result ).to.equal(previous)
			})
		})

		describe('when calling match method', function () {
			var TOKEN = 'part1',
				PARAMS = [];

			var testObj = createNode()

			before(function () {
				testObj.levels = 3
				testObj._match.returns(true)
			})

			it('should check if the node levels property match first', function () {
				result = testObj.match(TOKEN, 4, PARAMS)
				expect(result).to.be.false
				expect(testObj._match).to.not.be.called
			})

			describe('when the levels match', function () {

				it('should delegate the check to the matching function', function () {
					result = testObj.match(TOKEN, 3, PARAMS)
					expect(result).to.be.true
					expect(testObj._match).to.be.calledWith(TOKEN, PARAMS)
				})
			})
		})

		describe('when searching a token', function () {

			var TOKEN = 'part1',
				PARAMS = [];

			var testObj = createNode(),
				childNode1 = new Node('type1', sinon.stub(), 0),
				childNode2 = new Node('type2', sinon.stub(), 0),
				childNode3 = new Node('type3', sinon.stub(), 0);

			before(function () {
				testObj.insert(childNode1)
				testObj.insert(childNode2)
				testObj.insert(childNode3)

				childNode2.levels++

				sinon.stub(childNode1, 'match')
				sinon.stub(childNode2, 'match')
				sinon.stub(childNode3, 'match')

				childNode1.match.returns(false)
				childNode2.match.returns(true)
				childNode3.match.returns(false)
			})

			it('should walk through the children and stop to the first one that does NOT returns false', function () {
				var result = testObj.first(TOKEN, 1, PARAMS)

				expect( childNode1.match ).to.be.calledWith(TOKEN, 1, PARAMS)
				expect( childNode2.match ).to.be.calledWith(TOKEN, 1, PARAMS)
				expect( childNode3.match ).to.not.be.called
				expect( result ).to.equal(childNode2)
			})

			it('should returns undefined if there is no matching childrens', function () {
				childNode2.match.returns(false)
				var result = testObj.first(TOKEN, 0, PARAMS)
				expect( result ).to.equal(undefined)
			})
		})
	})
})