structure SeqUtil =
struct

  (* seqExists f s evaluates to true if and only if there exits an element x in
   * s such that f x ==> true
   *)
  fun seqExists (f : 'a -> bool) (s : 'a Seq.seq) : bool =
      Seq.mapreduce f false (fn (b1, b2) => b1 orelse b2) s

  (* Returns a sequence of three elements corresponding to the three elements
   * in the argument triple
   *)
  fun seqFromTriple (x : 'a, y : 'a, z : 'a) : 'a Seq.seq =
      Seq.cons (x, Seq.cons (y, Seq.singleton z))

  (* Returns a triple of the first three elements of the given sequence *)
  fun tripleFromSeq (s : 'a Seq.seq) : 'a * 'a * 'a =
      (Seq.nth s 0, Seq.nth s 1, Seq.nth s 2)

end