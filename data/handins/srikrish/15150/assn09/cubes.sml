structure Cubes : BOXES =
struct

  structure Box = BoundingCube

  datatype abscubes = CS of Box.polytope Seq.seq

  type polys = abscubes

  fun toString (CS s : polys) : string = Seq.toString (s, Box.toString)

  (* contained p cs evaluates to true if and only if there exists a bounding
   * cube bb in the collection of cubes such that the point p is in bb *)
  fun contained (p : Box.Space.point, CS s : polys) : bool =
      SeqUtil.seqExists (fn bb => Box.contained (p, bb)) s

  (* fromPoint p returns the collection consisting of the single smallest
   * bounding box containing p (i.e., the box consisting of the single point p)
   *)
  fun fromPoint (p : Box.Space.point) : polys =
      CS (Seq.singleton (Box.fromPoint p))

  (* If the argument point is contained in a bounding box in the argument
   * sequence then the result polys is the same as the argument.  Otherwise, if
   * there is a bounding box in the sequence with a center within threshold of
   * the argument point then the bounding box whose center is closest to the
   * point is expanded to include the point in the resulting polys.
   *)
  fun addPoint (p : Box.Space.point, CS s : polys) (threshold : real) : polys =
      case contained (p, CS s) of
          true => CS s
        | false =>
          let
            val (dmin : real, minbox : Box.polytope) =
                Seq.mapreduce
                  (fn (bb : Box.polytope) =>
                     (Box.Space.distance p (Box.center bb), bb))
                  (Real.posInf, Box.fromPoint Box.Space.origin)
                  (fn ((d1, bb1), (d2, bb2)) =>
                     case Real.<=(d1, d2) of
                         true => (d1, bb1)
                       | false => (d2, bb2))
                  s
          in
            case Real.< (dmin, threshold) of
                true =>
                CS (Seq.map
                      (fn (bb : Box.polytope) : Box.polytope =>
                         case Box.equal (bb, minbox) of
                             true => Box.addPoint (p, bb)
                           | false => bb)
                      s)
              | false => CS (Seq.cons (Box.fromPoint p, s))
          end

  val boxes : polys -> Box.polytope Seq.seq = fn (CS s) => s

end
