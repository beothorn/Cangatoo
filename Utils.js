function lineIntersect(x1,y1,x2,y2,x3,y3,x4,y4)
{
   var mua,mub;
   var denom,numera,numerb;
   var _x,_y;

   denom  = (y4-y3) * (x2-x1) - (x4-x3) * (y2-y1);
   numera = (x4-x3) * (y1-y3) - (y4-y3) * (x1-x3);
   numerb = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);
   
   /* Are the line coincident? */
   if (numera == 0 && numerb == 0 && denom == 0) {
   	 
   	 if(x1>x4){
   	 	 return null;
   	 }
   	 if(x3>x2){
   	 	 return null;
   	 }
   	 if(y1>y4){
   	 	 return null;
   	 }
   	 if(y3>y2){
   	 	 return null;
   	 }
   	 if(x1<x3 || y1<y3){
   	 	 return {x : x3, y : y3};
   	 }
   	 if(x1>x3 || y1>y3){
   	 	 return {x : x1, y : y1};
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
   
   _x = x1 + mua * (x2 - x1);
   _y = y1 + mua * (y2 - y1);
   return {x : _x, y : _y};
}