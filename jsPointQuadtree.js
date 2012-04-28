if (typeof(ajuc) != undefined) {
	ajuc = {};
}

/***
Javascript Point Quadtree (jsPointQuadtree)

Copyright 2012 Sebastian "Ajuć" Pidek

You can mail to me ajuc00 on google email service.

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
Niniejszy program jest wolnym oprogramowaniem; możesz go
rozprowadzać dalej i/lub modyfikować na warunkach Powszechnej
Licencji Publicznej GNU, wydanej przez Fundację Wolnego
Oprogramowania - według wersji 3 tej Licencji lub (według twojego
wyboru) którejś z późniejszych wersji.

Niniejszy program rozpowszechniany jest z nadzieją, iż będzie on
użyteczny - jednak BEZ JAKIEJKOLWIEK GWARANCJI, nawet domyślnej
gwarancji PRZYDATNOŚCI HANDLOWEJ albo PRZYDATNOŚCI DO OKREŚLONYCH
ZASTOSOWAŃ. W celu uzyskania bliższych informacji sięgnij do
Powszechnej Licencji Publicznej GNU.

Z pewnością wraz z niniejszym programem otrzymałeś też egzemplarz
Powszechnej Licencji Publicznej GNU (GNU General Public License);
jeśli nie - napisz do Free Software Foundation, Inc., 59 Temple
Place, Fifth Floor, Boston, MA  02110-1301  USA

**/
ajuc.jsPointQuadtree = (function() {
	/**
	 *  This implementation is inteded for use as a static tiled level representation.
	 *  
	 *  So it requires user to put every point into a quadtree, before it is correctly built (even "empty" points).
	 *  
	 *  It also assumes we want to subdivide quads only to the point when one quad is one point in coordinates system.
	 */
	
	
	function topLeftSubQuad(coordinates) {
		return [coordinates[0], coordinates[1], Math.floor((coordinates[0]+coordinates[2])/2), Math.floor((coordinates[1]+coordinates[3])/2)];
	};
	function topRightSubQuad(coordinates) {
		return [Math.ceil((coordinates[0] + coordinates[2])/2), coordinates[1], coordinates[2], Math.floor((coordinates[1]+coordinates[3])/2)];
	};
	function bottomLeftSubQuad(coordinates) {
		return [coordinates[0], Math.ceil((coordinates[1]+coordinates[3])/2), Math.floor((coordinates[0]+coordinates[2])/2), coordinates[3]];
	};
	function bottomRightSubQuad(coordinates) {
		return [Math.ceil((coordinates[0]+coordinates[2])/2), Math.ceil((coordinates[1]+coordinates[3])/2), coordinates[2], coordinates[3]];
	};
	
	function isOnePoint(coordinates) {
		return	coordinates[0] === coordinates[2] &&
				coordinates[1] === coordinates[3];
	};
	
	function whichSubQuad(coordinates, point) {
		var middleX = (coordinates[0]+coordinates[2])/2;
		var middleY = (coordinates[1]+coordinates[3])/2;
		
		if (point[0]< middleX) {
			if (point[1]< middleY) {
				return 0;
			} else {
				return 2;
			}
		} else {
			if (point[1]< middleY) {
				return 1;
			} else {
				return 3;
			}
		};
	};
	
	function Node(coordinates, kids, value) {
		this.coordinates = coordinates;
		this.kids = kids;
		this.value = value;
	};
	
	Node.prototype.isLeaf = function () {
		return this.kids[0] === undefined;
	};
	
	Node.prototype.valueAt = function (point) {
		if (this.isLeaf()) {
			return this.value;
		} else {
			var kidNo = whichSubQuad(this.coordinates, point);
			//assert(function() {// because it's not leaf node
			//	return this.kids[kidNo] !== undefined; 
			//});
			return this.kids[kidNo].valueAt(point);
		};
	};
	
	Node.prototype.add = function(point, value) {
		var kidNo;
		
		if (this.isLeaf()) {
			if (this.value!==value) {
				if (isOnePoint(this.coordinates)) {
					// we don't subdivide points to fractional parts
					// so just overwrite this point
					this.value = value;
				} else {
					// divide
					this.kids[0] = new Node(topLeftSubQuad(this.coordinates), [undefined, undefined, undefined, undefined], this.value);
					this.kids[1] = new Node(topRightSubQuad(this.coordinates), [undefined, undefined, undefined, undefined], this.value);
					this.kids[2] = new Node(bottomLeftSubQuad(this.coordinates), [undefined, undefined, undefined, undefined], this.value);
					this.kids[3] = new Node(bottomRightSubQuad(this.coordinates), [undefined, undefined, undefined, undefined], this.value);
					this.value = undefined; // becouse kids exist
					kidNo = whichSubQuad(this.coordinates, point);
					this.kids[kidNo].add(point,value); // recurse
				};
			};
		} else {
			// descent to apropriate kid
			kidNo = whichSubQuad(this.coordinates, point);
			this.kids[kidNo].add(point,value); // recurse
		};
	};
	
	Node.prototype.rejoin = function() {
		if (!this.isLeaf()) {
			// descent
			var values = [ this.kids[0].rejoin(),
			               this.kids[1].rejoin(),
			               this.kids[2].rejoin(),
			               this.kids[3].rejoin() ];
			
			//check
			if ( values[0][0] &&
				 values[1][0] &&
				 values[2][0] &&
				 values[3][0] &&
				 values[0][1] === values[1][1] &&
				 values[1][1] === values[2][1] &&
				 values[2][1] === values[3][1]
			) {
				// join
				this.kids = [undefined, undefined, undefined, undefined];
				this.value = values[0][1];
				return [true, this.value];  // [same values in kids, value]
			} else {
				return [false, this.value]; // [same values in kids, value]
			}
		} else {
			return [true, this.value]; // [same values in kids, value]
		}
	};
	
	function Quadtree(coordinates, options) {
		this.coordinates = coordinates;
		if (options===undefined) {
			options = {};
		}
		this.options = {
				'joinSameValues': options['joinSameValues']
				// other options in the future, maybe
		};
		
		
		this.root = new Node(coordinates, [undefined, undefined, undefined, undefined], undefined);
	};
	
	Quadtree.prototype.add = function(point, value) {
		this.root.add(point, value);
		if (this.options['joinSameValues'] === true) {
			//TODO
			this.rejoin();
		}
	};

	Quadtree.prototype.rejoin = function() {
		this.root.rejoin();
	};

	
	Quadtree.prototype.valueAt = function(point) {
		return this.root.valueAt(point);
	};
	
	return {
		Quadtree : Quadtree,
		Node : Node,
		isOnePoint : isOnePoint
	};
}) ();