signature SPACE =
sig

  (* distinguish between a point in the plane 
   * and a vector (which tacitly has an externally specified tail end) *)
  type point
  type vec

  val ++ : vec * vec -> vec
  val ** : vec * real -> vec
  val // : vec * real -> vec

  val --> : point * point -> vec

  val zero : vec

  val origin : point

  val displace : point * vec -> point

  val dot : vec * vec -> real
  val mag : vec -> real

  val unitVec : vec -> vec
  val proj : vec * vec -> vec

  val vecToString : vec -> string
  val pointToString : point -> string

  val vecEqual : vec * vec -> bool
  val pointEqual : point * point -> bool

  val midpoint : point -> point -> point

  val distance : point -> point -> real

  val cartcoord : point -> real Seq.seq

  val fromcoord : real Seq.seq -> point

  val head : vec -> point

  val sum : ('a -> vec) -> 'a Seq.seq -> vec

end