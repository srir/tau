
(* Purpose: order by the first value in a pair, and then the second
 *) 
functor PairOrder (P: PAIROFORDERS) : ORDERED =
struct
    type t = (P.O1.t * P.O2.t)
    
    fun compare ((a1,b1):t, (a2,b2):t) : order =
        let
            val cmp = P.O1.compare(a1, a2) 
        in case cmp of
                EQUAL => (P.O2.compare(b1,b2))
           |    _     => cmp
        end
end

(* Tests for PairOrder *)
structure ISPO : PAIROFORDERS = struct structure O1 = IntOrder structure O2 = StringOrder end;
structure IS : ORDERED = PairOrder(ISPO)

val a = (1,"a")
val ba = (2,"a")

val b = (2,"b")
val bb = (2,"b")

val c = (1,"c")
val d = (2,"d")

val LESS = IS.compare(a,b)
val LESS = IS.compare(a,ba)

val GREATER = IS.compare(bb,ba)
val GREATER = IS.compare(d,b)

val EQUAL = IS.compare(b,bb)

(* Purpose: order lists based on an order O
 *)
functor ListOrder (O: ORDERED) : ORDERED =
struct
    type t = (O.t list)
    
    fun compare (a:t, b:t) : order =
        case (a, b) of
            (nil, nil)   => EQUAL
        |   (nil, y::ys) => LESS
        |   (x::xs, nil) => GREATER
        |   (x::xs, y::ys) =>  (let
                                    val cmp = O.compare(x,y)
                                in case cmp of
                                        EQUAL => compare(xs, ys)
                                    |   _     => cmp
                                end)
end

(* Tests for ListOrder *)
structure IntListOrder : ORDERED = ListOrder(IntOrder)

val GREATER:order = IntListOrder.compare ([1,2,4], [])
val EQUAL:order = IntListOrder.compare([],[])
val LESS:order = IntListOrder.compare([],[1])
val GREATER:order = IntListOrder.compare([2],[1])

