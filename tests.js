function runTests() {
	module("see if testing framework works :)");

	test("hello", function() {
        	ok(true, "world");
	});
	
	module("isOnePoint");
	test("isOnePoint works", function() {
		equal(ajuc.jsPointQuadtree.isOnePoint([0, 0, 1, 0]), false);
		equal(ajuc.jsPointQuadtree.isOnePoint([1, 0, 1, 1]), false);
		equal(ajuc.jsPointQuadtree.isOnePoint([0, 1, 1, 0]), false);
		equal(ajuc.jsPointQuadtree.isOnePoint([0, 0, 0, 0]), true);
		equal(ajuc.jsPointQuadtree.isOnePoint([0.0, 1.0, 0.0, 1.0]), true);
	});
	
	
	module("creating quadtree");
	test("making a quadtree", function() {
		var qt = new ajuc.jsPointQuadtree.Quadtree([0,0,4095, 4095]);
		deepEqual(qt.coordinates, [0, 0, 4095, 4095]);
		deepEqual(qt.root.coordinates, [0, 0, 4095, 4095]);
		deepEqual(qt.root.kids, [null, null, null, null]);
		deepEqual(qt.root.value, null);
	});
		
	module("loading into quadtree");
	test("loading one point into a one-point quad tree", function() {
		var qt = new ajuc.jsPointQuadtree.Quadtree([0,0,0,0]);
		qt.add([0,0], 997);
		deepEqual(qt.coordinates, [0, 0, 0, 0]);
		deepEqual(qt.root.coordinates, [0, 0, 0, 0]);
		deepEqual(qt.root.kids, [null, null, null, null]);
		deepEqual(qt.root.value, 997);
	});

	test("loading one point into a 4-point quad tree", function() {
		var qt = new ajuc.jsPointQuadtree.Quadtree([0,0,1,1]);
		qt.add([0,0], 997);
		deepEqual(qt.coordinates, [0, 0, 1, 1]);
		deepEqual(qt.root.coordinates, [0, 0, 1, 1]);
		deepEqual(qt.root.kids[0].coordinates, [0, 0, 0, 0]);
		deepEqual(qt.root.kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].value, 997);
		
		deepEqual(qt.root.kids[1].coordinates, [1, 0, 1, 0]);
		deepEqual(qt.root.kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[1].value, null);
		
		deepEqual(qt.root.kids[2].coordinates, [0, 1, 0, 1]);
		deepEqual(qt.root.kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].value, null);
		
		deepEqual(qt.root.kids[3].coordinates, [1, 1, 1, 1]);
		deepEqual(qt.root.kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].value, null);

		deepEqual(qt.root.value, null);
	});

	test("loading 2 points into a 4-point quad tree", function() {
		var qt = new ajuc.jsPointQuadtree.Quadtree([0,0,1,1]);
		qt.add([0,0], 997);
		deepEqual(qt.coordinates, [0, 0, 1, 1]);
		deepEqual(qt.root.coordinates, [0, 0, 1, 1]);
		deepEqual(qt.root.kids[0].coordinates, [0, 0, 0, 0]);
		deepEqual(qt.root.kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].value, 997);
		
		deepEqual(qt.root.kids[1].coordinates, [1, 0, 1, 0]);
		deepEqual(qt.root.kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[1].value, null);
		
		deepEqual(qt.root.kids[2].coordinates, [0, 1, 0, 1]);
		deepEqual(qt.root.kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].value, null);
		
		deepEqual(qt.root.kids[3].coordinates, [1, 1, 1, 1]);
		deepEqual(qt.root.kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].value, null);
		qt.add([0,1], 998);
		deepEqual(qt.root.kids[0].coordinates, [0, 0, 0, 0]);
		deepEqual(qt.root.kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].value, 997);
		
		deepEqual(qt.root.kids[1].coordinates, [1, 0, 1, 0]);
		deepEqual(qt.root.kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[1].value, null);
		
		deepEqual(qt.root.kids[2].coordinates, [0, 1, 0, 1]);
		deepEqual(qt.root.kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].value, 998);
		
		deepEqual(qt.root.kids[3].coordinates, [1, 1, 1, 1]);
		deepEqual(qt.root.kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].value, null);
		
		deepEqual(qt.root.value, null);
	});

	test("loading 2 points into a 16-point (2 level) quad tree", function() {
		var qt = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3]);
		qt.add([1,2], 997);
		deepEqual(qt.coordinates, [0, 0, 3, 3]);
		deepEqual(qt.root.coordinates, [0, 0, 3, 3]);
		
		deepEqual(qt.root.kids[0].coordinates, [0, 0, 1, 1]);
		deepEqual(qt.root.kids[0].kids, [null, null, null, null]);
		
		deepEqual(qt.root.kids[1].coordinates, [2, 0, 3, 1]);
		deepEqual(qt.root.kids[1].kids, [null, null, null, null]);
		
		deepEqual(qt.root.kids[2].coordinates, [0, 2, 1, 3]);
		deepEqual(qt.root.kids[2].kids[0].coordinates, [0, 2, 0, 2]);
		deepEqual(qt.root.kids[2].kids[1].coordinates, [1, 2, 1, 2]);
		deepEqual(qt.root.kids[2].kids[2].coordinates, [0, 3, 0, 3]);
		deepEqual(qt.root.kids[2].kids[3].coordinates, [1, 3, 1, 3]);
		deepEqual(qt.root.kids[2].kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].kids[0].value, null);
		deepEqual(qt.root.kids[2].kids[1].value, 997);
		deepEqual(qt.root.kids[2].kids[2].value, null);
		deepEqual(qt.root.kids[2].kids[3].value, null);
		
		deepEqual(qt.root.kids[3].coordinates, [2, 2, 3, 3]);
		deepEqual(qt.root.kids[3].kids, [null, null, null, null]);
		
		
 		qt.add([0,1], 998);
 		
		deepEqual(qt.root.kids[0].kids[0].coordinates, [0, 0, 0, 0]);
		deepEqual(qt.root.kids[0].kids[1].coordinates, [1, 0, 1, 0]);
		deepEqual(qt.root.kids[0].kids[2].coordinates, [0, 1, 0, 1]);
		deepEqual(qt.root.kids[0].kids[3].coordinates, [1, 1, 1, 1]);
		deepEqual(qt.root.kids[0].kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].kids[0].value, null);
		deepEqual(qt.root.kids[0].kids[1].value, null);
		deepEqual(qt.root.kids[0].kids[2].value, 998);
		deepEqual(qt.root.kids[0].kids[3].value, null);
	});

	module("searching in a quadtree");
		
	test("searching in 2 level quad tree", function() {
		var qt = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3]);
		
		deepEqual(qt.valueAt([1,2]), null);
		deepEqual(qt.valueAt([0,1]), null);
		
		qt.add([1,2], 997);
		
		deepEqual(qt.valueAt([1,2]), 997);
		deepEqual(qt.valueAt([0,1]), null);

 		qt.add([0,1], 998);
 		
 		deepEqual(qt.valueAt([1,2]), 997);
 		deepEqual(qt.valueAt([0,1]), 998);
 		deepEqual(qt.valueAt([0,0]), null);
	});
	
	module("joining points into nodes");
	
	test("joining", function() {
		var qt = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3]);
		qt.add([2,2], 997);
		qt.add([2,3], 997);
		qt.add([3,2], 997);
		qt.add([3,3], 998);
		deepEqual(qt.coordinates, [0, 0, 3, 3]);
		deepEqual(qt.root.coordinates, [0, 0, 3, 3]);
		
		deepEqual(qt.root.kids[0].coordinates, [0, 0, 1, 1]);
		deepEqual(qt.root.kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].value, null);
		
		deepEqual(qt.root.kids[1].coordinates, [2, 0, 3, 1]);
		deepEqual(qt.root.kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[1].value, null);
		
		deepEqual(qt.root.kids[2].coordinates, [0, 2, 1, 3]);
		deepEqual(qt.root.kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].value, null);
		
		deepEqual(qt.root.kids[3].coordinates, [2, 2, 3, 3]);
		deepEqual(qt.root.kids[3].value, null);
		
		deepEqual(qt.root.kids[3].kids[0].coordinates, [2,2,2,2]);
		deepEqual(qt.root.kids[3].kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[0].value, 997);
		deepEqual(qt.root.kids[3].kids[1].coordinates, [3,2,3,2]);
		deepEqual(qt.root.kids[3].kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[1].value, 997);
		deepEqual(qt.root.kids[3].kids[2].coordinates, [2,3,2,3]);
		deepEqual(qt.root.kids[3].kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[2].value, 997);
		deepEqual(qt.root.kids[3].kids[3].coordinates, [3,3,3,3]);
		deepEqual(qt.root.kids[3].kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[3].value, 998);
		
		qt.rejoin();

		deepEqual(qt.root.kids[3].kids[0].coordinates, [2,2,2,2]);
		deepEqual(qt.root.kids[3].kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[0].value, 997);
		deepEqual(qt.root.kids[3].kids[1].coordinates, [3,2,3,2]);
		deepEqual(qt.root.kids[3].kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[1].value, 997);
		deepEqual(qt.root.kids[3].kids[2].coordinates, [2,3,2,3]);
		deepEqual(qt.root.kids[3].kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[2].value, 997);
		deepEqual(qt.root.kids[3].kids[3].coordinates, [3,3,3,3]);
		deepEqual(qt.root.kids[3].kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[3].value, 998);
		
		qt.add([3,3], 997);

		deepEqual(qt.root.kids[3].kids[0].coordinates, [2,2,2,2]);
		deepEqual(qt.root.kids[3].kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[0].value, 997);
		deepEqual(qt.root.kids[3].kids[1].coordinates, [3,2,3,2]);
		deepEqual(qt.root.kids[3].kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[1].value, 997);
		deepEqual(qt.root.kids[3].kids[2].coordinates, [2,3,2,3]);
		deepEqual(qt.root.kids[3].kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[2].value, 997);
		deepEqual(qt.root.kids[3].kids[3].coordinates, [3,3,3,3]);
		deepEqual(qt.root.kids[3].kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[3].value, 997);

		qt.rejoin();
		
		deepEqual(qt.coordinates, [0, 0, 3, 3]);
		deepEqual(qt.root.coordinates, [0, 0, 3, 3]);
		
		deepEqual(qt.root.kids[0].coordinates, [0, 0, 1, 1]);
		deepEqual(qt.root.kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].value, null);
		
		deepEqual(qt.root.kids[1].coordinates, [2, 0, 3, 1]);
		deepEqual(qt.root.kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[1].value, null);
		
		deepEqual(qt.root.kids[2].coordinates, [0, 2, 1, 3]);
		deepEqual(qt.root.kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].value, null);
		
		deepEqual(qt.root.kids[3].coordinates, [2, 2, 3, 3]);
		deepEqual(qt.root.kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].value, 997);
		
		
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				qt.add([i,j], 998);
			}
		}
		qt.rejoin();
		
		deepEqual(qt.root.kids, [null, null, null, null]);
		deepEqual(qt.root.value, 998);
	});

	test("auto joining", function() {
		var qt = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3], {'joinSameValues': true});
		qt.add([2,2], 997);
		qt.add([2,3], 997);
		qt.add([3,2], 997);
		qt.add([3,3], 998);


		deepEqual(qt.root.kids[3].kids[0].coordinates, [2,2,2,2]);
		deepEqual(qt.root.kids[3].kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[0].value, 997);
		deepEqual(qt.root.kids[3].kids[1].coordinates, [3,2,3,2]);
		deepEqual(qt.root.kids[3].kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[1].value, 997);
		deepEqual(qt.root.kids[3].kids[2].coordinates, [2,3,2,3]);
		deepEqual(qt.root.kids[3].kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[2].value, 997);
		deepEqual(qt.root.kids[3].kids[3].coordinates, [3,3,3,3]);
		deepEqual(qt.root.kids[3].kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].kids[3].value, 998);
		
		qt.add([3,3], 997);

		deepEqual(qt.coordinates, [0, 0, 3, 3]);
		deepEqual(qt.root.coordinates, [0, 0, 3, 3]);
		
		deepEqual(qt.root.kids[0].coordinates, [0, 0, 1, 1]);
		deepEqual(qt.root.kids[0].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[0].value, null);
		
		deepEqual(qt.root.kids[1].coordinates, [2, 0, 3, 1]);
		deepEqual(qt.root.kids[1].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[1].value, null);
		
		deepEqual(qt.root.kids[2].coordinates, [0, 2, 1, 3]);
		deepEqual(qt.root.kids[2].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[2].value, null);
		
		deepEqual(qt.root.kids[3].coordinates, [2, 2, 3, 3]);
		deepEqual(qt.root.kids[3].kids, [null, null, null, null]);
		deepEqual(qt.root.kids[3].value, 997);
		
		
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				qt.add([i,j], 998);
			}
		}
		
		deepEqual(qt.root.kids, [null, null, null, null]);
		deepEqual(qt.root.value, 998);
	});

	module("serialization");
	test("serialization", function() {
		var qt1A = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3], {'joinSameValues': true});
		qt1A.add([2,2], 997);
		qt1A.add([2,3], 997);
		qt1A.add([3,2], 997);
		qt1A.add([3,3], 998);
		var str1A = qt1A.toString();

		var qt1B = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3], {'joinSameValues': true});
		qt1B.add([2,2], 997);
		qt1B.add([2,3], 997);
		qt1B.add([3,2], 997);
		qt1B.add([3,3], 998);
		var str1B = qt1B.toString();
		
		var qt2 = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3], {'joinSameValues': true});
		qt2.add([2,2], 997);
		qt2.add([2,3], 997);
		qt2.add([3,2], 997);
		qt2.add([3,3], 997);
		var str2 = qt2.toString();

		
		deepEqual(str1A, str1B);
		ok(str1A !== str2);
	});
	
	test("deserialization", function() {
		var qt1A = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3], {'joinSameValues': true});
		qt1A.add([2,2], 997);
		qt1A.add([2,3], 997);
		qt1A.add([3,2], 997);
		qt1A.add([3,3], 998);
		var str1A = qt1A.toString();
		
		//deepEqual(str1A, "");
		
		var qt1B = new ajuc.jsPointQuadtree.Quadtree([0,0,3,3], {'joinSameValues': true});
		qt1B.fromString(str1A);
		
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				if (i===3 && j===3) {
					deepEqual(qt1B.valueAt([i,j]), 998);
				} else if ((i===2 || i===3) && (j===2 || j===3)) {
					deepEqual(qt1B.valueAt([i,j]), 997);
				} else {
					deepEqual(qt1B.valueAt([i,j]), null);
				}
			}
		}
	});
<!-- TODO -->
	
};