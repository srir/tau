structure Space3D : SPACE =
struct

  datatype abspoint = P of real * real * real
  datatype absvec = V of real * real * real

  (* distinguish between a point in the plane 
   * and a vector (which tacitly has an externally specified tail end) *)
  type point = abspoint
  type vec = absvec

  val pointToTriple = fn P(x, y, z) => (x, y, z)
  val vecToTriple = fn V(x, y, z) => (x, y, z)

  infixr 3 ++
  infixr 4 **
  infixr 4 //

  (* v1 ++ v2 evaluates to the sum of the vectors *)
  fun (V(x1,y1,z1) : vec) ++ (V(x2,y2,z2) : vec) : vec =
      V (x1 + x2 , y1 + y2, z1 + z2)

  (* v ** c evaluates to the scalar product of v with c *)
  fun (V(x,y,z) : vec) ** (c : real) : vec =
      V (c * x, c * y, c * z)

  (* v // c evaluates to the scalar product of v with (1/c) *)
  fun (V(x,y,z) : vec) // (c : real) : vec =
      V (x / c, y / c, z / c)

  infixr 3 -->
  (* X --> Y is the vector from X to Y 
   * computed by Y - X componentwise 
   *)
  fun (P(x1,y1,z1) : point) --> (P(x2,y2,z2) : point) : vec =
      V (x2 - x1, y2 - y1, z2 - z1)

  (* The zero vector *)
  val zero : vec = V(0.0, 0.0, 0.0)

  (* The origin point *)
  val origin : point = P(0.0, 0.0, 0.0)

  (* displace p v computes the point that results in displacing p by v *)
  (* assumes the vector is in the vector space of the point *)
  fun displace (P(x,y,z) : point, V(vx, vy, vz) : vec) : point =
      P(x + vx, y + vy, z + vz)

  (* Computes the dot product of two vectors *)
  fun dot (V(x1, y1, z1) : vec, V(x2, y2, z2) : vec) : real =
      x1*x2 + y1*y2 + z1*z2

  (* Computes the magnitude of the given vector *)
  fun mag (v : vec) : real = Math.sqrt (dot (v, v))

  (* Computes the unit vector in the direction of the given vector *)
  (* Invariant: the argument should not be the zero vector *)
  fun unitVec (v : vec) : vec = v ** (1.0 / mag v)

  (* The projection of the vector v onto the vector u *)
  fun proj (u : vec, v : vec) : vec = (unitVec u) ** (dot (u, v) / mag (v))

  fun tripleToString ((x,y,z) : real * real * real) : string =
      "(" ^ Real.toString x ^ ", " ^
            Real.toString y ^ ", " ^
            Real.toString z ^ ")"

  val vecToString : vec -> string = tripleToString o vecToTriple
  val pointToString : point -> string = tripleToString o pointToTriple

  fun tripleEqual ((x1,y1,z1) : real * real * real,
                   (x2,y2,z2) : real * real * real) : bool =
      Real.== (x1, x2) andalso (Real.== (y1, y2)) andalso (Real.== (z1, z2))

  (* Tests two points for equality *)
  val pointEqual : point * point -> bool =
      tripleEqual o (fn (p1, p2) => (pointToTriple p1, pointToTriple p2))
  (* Tests two vectors for equality *)
  val vecEqual : vec * vec -> bool =
      tripleEqual o (fn (p1, p2) => (vecToTriple p1, vecToTriple p2))

  (* Computes the midpoint of the argument points *)
  fun midpoint (P(x1, y1, z1) : point) (P(x2, y2, z2) : point) : point =
      P((x1 + x2) / 2.0, (y1 + y2) / 2.0, (z1 + z2) / 2.0)

  (* Computes the distance between the argument points *)
  fun distance (p1 : point) (p2 : point) : real =
      mag (p1 --> p2)

  (* Computes the cartesian coordinates of the given point *)
  fun cartcoord (P(x, y, z) : point) : real Seq.seq =
      SeqUtil.seqFromTriple (x, y, z)

  (* Return a point in 3D space with the given Cartesian coordinates *)
  fun fromcoord (s : real Seq.seq) : point =
      P (SeqUtil.tripleFromSeq s)

  (* Compute the point corresponding to the displacement by the given vector
   * from the origin.
   *)
  fun head (v : vec) : point = displace (origin, v)

  (* Computes the sum of the vectors in the sequence that results from
   * mapping the argument function over the argument sequence.
   *)
  fun sum (f : 'a -> vec) : 'a Seq.seq -> vec =
      Seq.mapreduce f zero op++

end