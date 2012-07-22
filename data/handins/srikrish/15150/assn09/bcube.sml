structure BoundingCube : BOUNDING_SHAPE =
struct

  structure Space = Space3D

  datatype abscube =
      C of Space.point * Space.point
   (* C (fll, bur) where fll is the front lower left corner of the cube
    *              and bur is the back upper right corner of the box
    *)

  type polytope = abscube

  fun toString (C(p1, p2) : polytope) : string =
      let
        val s1 = Space.cartcoord p1
        val (sx1, sy1, sz1) =
            SeqUtil.tripleFromSeq (Seq.map Real.toString s1)
        val s2 = Space.cartcoord p2
        val (sx2, sy2, sz2) =
            SeqUtil.tripleFromSeq (Seq.map Real.toString s2)
      in
        "{" ^ sx1 ^ " <= x <= " ^ sx2 ^ ";\n  " ^
              sy1 ^ " <= y <= " ^ sy2 ^ ";\n  " ^
              sz1 ^ " <= z <= " ^ sz2 ^ "}\n"
      end

  fun equal (C(p1, p2) : polytope, C(q1, q2) : polytope) : bool =
      Space.pointEqual (p1, q1) andalso Space.pointEqual (p2, q2)

  (* contained p bb evaluates to true if and only if the point p is in b *)
  fun contained (p : Space.point, C(fll, bur) : polytope) : bool =
      let
        val s = Space.cartcoord p
        val (x, y, z) = SeqUtil.tripleFromSeq s
        val sfll = Space.cartcoord fll
        val (xleft, ylow, zfront) = SeqUtil.tripleFromSeq sfll
        val sbur = Space.cartcoord bur
        val (xright, yup, zback) = SeqUtil.tripleFromSeq sbur
      in
        Real.>= (x, xleft) andalso Real.<= (x, xright) andalso
        Real.>= (y, ylow) andalso Real.<= (y, yup) andalso
        Real.>= (z, zfront) andalso Real.<= (z, zback)
      end

  (* Returns the eight corners of the bounding cube in top left front, top
   * right front, bottom left front, bottom right front, top left back, top
   * right back, bottom left back, bottom right back order *)
  fun vertices (C(fll, bur) : polytope)
      : Space.point Seq.seq =
      let
        val sfll = Space.cartcoord fll
        val (xleft, ylow, zfront) = SeqUtil.tripleFromSeq sfll
        val sbur = Space.cartcoord bur
        val (xright, yup, zback) = SeqUtil.tripleFromSeq sbur
      in
        Seq.tabulate (Space.fromcoord o SeqUtil.seqFromTriple o
                            (fn 0 => (xleft, yup, zfront)
                              | 1 => (xright, yup, zfront)
                              | 2 => (xleft, ylow, zfront)
                              | 3 => (xright, ylow, zfront)
                              | 4 => (xleft, yup, zback)
                              | 5 => (xright, yup, zback)
                              | 6 => (xleft, ylow, zback)
                              | 7 => (xright, ylow, zback)
                              | _ => raise Fail "out of range"))
                      8
      end

  (* addPoint (p, bb) returns the smallest bounding box containing both
   * p and all the points in bb
   *)
  fun addPoint (p : Space.point, C(fll, bur) : polytope) : polytope =
      let
        val s = Space.cartcoord p
        val (x, y, z) = SeqUtil.tripleFromSeq s
        val sfll = Space.cartcoord fll
        val sbur = Space.cartcoord bur

        val (xleft, ylow, zfront) = SeqUtil.tripleFromSeq sfll
        val (xright, yup, zback) = SeqUtil.tripleFromSeq sbur
      in
        C((Space.fromcoord o SeqUtil.seqFromTriple) (Real.min (x, xleft),
                                                     Real.min (y, ylow),
                                                     Real.min (z, zfront)),
          (Space.fromcoord o SeqUtil.seqFromTriple) (Real.max (x, xright),
                                                     Real.max (y, yup),
                                                     Real.max (z, zback)))
      end

  (* fromPoint p returns the smallest bounding box containing p
   * Namely, it returns the box consisting of the single point p
   *)
  fun fromPoint (p : Space.point) : polytope = C(p, p)

  (* Computes the center point of the bounding box *)
  fun center (C(fll, bur) : polytope) : Space.point =
      Space.midpoint fll bur

end
