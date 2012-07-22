(* you need to understand this signature and the specs, but not the
   implementation in the structure Util defined in util.sml
*)
signature UTIL =
sig
  (* peelOff (s1,s2) ==> SOME s' if s2 = s1 ^ s'
                     ==> NONE otherwise *)
  val peelOff : string * string -> string option

  (* peelInt s ==> SOME (i,s') if a prefix of s is a sequence of digits
                    that parses as an integer i
               ==> NONE otherwise
   *)
  val peelInt : string -> (int * string) option
end
