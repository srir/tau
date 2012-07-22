signature BOUNDING_SHAPE =
sig

  structure Space : SPACE

  type polytope

  val toString : polytope -> string
  val equal : polytope * polytope -> bool

  val contained : Space.point * polytope -> bool
  val vertices : polytope -> Space.point Seq.seq
  val addPoint : Space.point * polytope -> polytope
  val fromPoint : Space.point -> polytope

  val center : polytope -> Space.point

end
