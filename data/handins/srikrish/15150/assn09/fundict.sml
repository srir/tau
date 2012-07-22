
(* Purpose: represent a dictionary using a function
 *)
functor FunDict (O: ORDERED) : DICT =
struct
    structure Key : ORDERED = O
    
    datatype 'v func = Func of Key.t -> 'v option
    type 'v dict = 'v func
    
    val empty = Func(fn _ => NONE)
    
    fun insert (Func(f): 'v dict) ((k,v): Key.t * 'v) : ('v dict) =
        let
            val g = (fn x => case O.compare(x,k) of
                                EQUAL => SOME v
                            |   _     => f x)
        in
            Func(g)
        end
        
    fun lookup (Func(f): 'v dict) (k: Key.t) = (f k)
    
    fun remove (Func(f): 'v dict) (k: Key.t) : ('v dict) =
        let
            val g = (fn x => case O.compare(x,k) of
                                EQUAL => NONE
                            |   _     => f x)
        in
            Func(g)
        end

    fun map (g: 'u -> 'v) (Func(f): 'u dict) : ('v dict) =
        Func(fn x => (case (f x) of NONE => NONE | SOME v => SOME (g v)))
        
    fun filter (p: 'v -> bool) (Func(f): 'v dict) : ('v dict) =
        Func(fn x =>
            (case (f x) of
                NONE => NONE
            | SOME v => (case p v of
                            false => NONE
                        |    true => SOME v)))
end

(* Tests for FunDict: stolen from dictclient.sml *)
 
structure StrDict = FunDict (StringOrder : ORDERED)

val sipairs = [("one", 1), ("two", 2), ("three", 3), ("four", 4), ("five", 5)]
val sd5 = List.foldl (fn (p, d) => StrDict.insert d p) StrDict.empty sipairs

val SOME 3 = StrDict.lookup sd5 "three"
val SOME 5 = StrDict.lookup sd5 "five"

val sd4 = StrDict.remove sd5 "four"

val NONE = StrDict.lookup sd4 "four"
val SOME 5 = StrDict.lookup sd4 "five"

val ssd5 = StrDict.map Int.toString sd5

val NONE = StrDict.lookup ssd5 "six"
val SOME "5" = StrDict.lookup ssd5 "five"

val sd3 = StrDict.filter (fn x => x > 2) sd5

val NONE = StrDict.lookup sd3 "one"
val SOME 3 = StrDict.lookup sd3 "three"
val SOME 5 = StrDict.lookup sd3 "five"

structure IntDict = FunDict (IntOrder : ORDERED)

val ispairs = [(1, "one"), (2, "two"), (3, "three"), (4, "four"), (5, "five")]
val id5 = List.foldl (fn (p, d) => IntDict.insert d p) IntDict.empty ispairs

val SOME "three" = IntDict.lookup id5 3
val SOME "five"  = IntDict.lookup id5 5

val id4 = IntDict.remove id5 4

val NONE = IntDict.lookup id4 4
val SOME "five" = IntDict.lookup id4 5

