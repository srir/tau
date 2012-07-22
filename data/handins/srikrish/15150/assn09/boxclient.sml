
val threshold = 2.0

val p1 = Cubes.Box.Space.fromcoord (SeqUtil.seqFromTriple (1.0, 3.0, ~1.0))
val p2 = Cubes.Box.Space.fromcoord (SeqUtil.seqFromTriple (71.5, 72.25, 22.75))
val p3 = Cubes.Box.Space.fromcoord (SeqUtil.seqFromTriple (2.0, 3.5, ~0.5))
val p4 = Cubes.Box.Space.fromcoord (SeqUtil.seqFromTriple (72.5, 72.75, 23.0))

val cubes1 = Cubes.fromPoint p1
val cubes2 = Cubes.addPoint (p2, cubes1) threshold
val cubes3 = Cubes.addPoint (p3, cubes2) threshold
val cubes4 = Cubes.addPoint (p4, cubes3) threshold

val () = print("cubes1 =\n" ^ Cubes.toString cubes1 ^ "\n\n")
val () = print("cubes2 =\n" ^ Cubes.toString cubes2 ^ "\n\n")
val () = print("cubes3 =\n" ^ Cubes.toString cubes3 ^ "\n\n")
val () = print("cubes4 =\n" ^ Cubes.toString cubes4 ^ "\n\n")

val bc = VectorSeq.nth (Cubes.boxes cubes4) 0

val pmid = Cubes.Box.center bc
val () = print("c = " ^ Cubes.Box.Space.pointToString pmid ^
               " is the center of:\n ")
val () = print(Cubes.Box.toString bc ^ "\n\n")

