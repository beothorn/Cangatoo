function lineIntersect(line1,line2){
   var mua,mub;
   var denom,numera,numerb;
   var _x,_y;

   denom  = (line2.y2-line2.y1) * (line1.x2-line1.x1) - (line2.x2-line2.x1) * (line1.y2-line1.y1);
   numera = (line2.x2-line2.x1) * (line1.y1-line2.y1) - (line2.y2-line2.y1) * (line1.x1-line2.x1);
   numerb = (line1.x2-line1.x1) * (line1.y1-line2.y1) - (line1.y2-line1.y1) * (line1.x1-line2.x1);
   
   /* Are the line coincident? */
   if (numera == 0 && numerb == 0 && denom == 0) {
   	 if(line1.x1>line2.x2){
   	 	 return null;
   	 }
   	 if(line2.x1>line1.x2){
   	 	 return null;
   	 }
   	 if(line1.y1>line2.y2){
   	 	 return null;
   	 }
   	 if(line2.y1>line1.y2){
   	 	 return null;
   	 }
   	 if(line1.x1<line2.x1 || line1.y1<line2.y1){
   	 	 return {x : line2.x1, y : line2.y1};
   	 }
   	 if(line1.x1>line2.x1 || line1.y1>line2.y1){
   	 	 return {x : line1.x1, y : line1.y1};
   	 }
   }

   /* Is the intersection along the the segments */
   mua = numera / denom;
   mub = numerb / denom;
   if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
      return null;
   }
   
   /* Are the line parallel */
   if (denom == 0) {
      return null;
   }
   
   _x = line1.x1 + mua * (line1.x2 - line1.x1);
   _y = line1.y1 + mua * (line1.y2 - line1.y1);
   return {x : _x, y : _y};
}

function isPointInsideRectangle(point,rectangle){
	if(point.x<rectangle.x1)
		return false;
	if(point.x>rectangle.x2)
		return false;
	if(point.y<rectangle.y1)
		return false;
	if(point.y>rectangle.y2)
		return false;
	return true;
}

function rectangleHaveAPointInside(rectA,rectB){
	var rectATopLeft = {x:rectA.x1,y:rectA.y1};
	if(isPointInsideRectangle(rectATopLeft,rectB))
		return true;
	var rectATopRight = {x:rectA.x1,y:rectA.y2};
	if(isPointInsideRectangle(rectATopRight,rectB))
		return true;
	var rectABottomLeft = {x:rectA.x2,y:rectA.y1};
	if(isPointInsideRectangle(rectABottomLeft,rectB))
		return true;
	var rectABottomRight = {x:rectA.x2,y:rectA.y2};
	if(isPointInsideRectangle(rectABottomRight,rectB))
		return true;
	return false;
}

function rectanglesIntersect(rectA,rectB){
	if(rectangleHaveAPointInside(rectA,rectB))
		return true;
	if(rectangleHaveAPointInside(rectB,rectA))
		return true;
	return false;
}