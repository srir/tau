signature BOXES =
sig

  structure Box : BOUNDING_SHAPE

  type polys

  val toString : polys -> string

  val contained : Box.Space.point * polys -> bool
  val fromPoint : Box.Space.point -> polys
  val addPoint : Box.Space.point * polys -> real -> polys
  val boxes : polys -> Box.polytope Seq.seq

end
