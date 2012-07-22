(* Write your implementations of SerializeInt and SerializeList in this
   file. Read the code in serialize.sig, util.sig, util.sml, and
   serializebool.sml to understand the tools we've given you and see an
   example of one structure that ascribes to SERIALIZABLE.
 *)

(* Task 5.1 -- Hint: use ^, Int.toString, peelInt, and peelOff *)

(* Purpose: serialize data in int form to a string *)
structure SerializeInt : SERIALIZABLE =
struct
    type t = int
    
    fun write i = ("(INT " ^ Int.toString i ^ ")")
    
    fun read (s:string) : (t * string) option =
        let
            val rest = Util.peelOff("(INT ", s)
        in case rest of
            NONE => NONE
        |   SOME s' => let
                            val rest' = Util.peelInt(s')
                       in
                            case rest' of
                                NONE => NONE
                            |   SOME (i, s'') => let
                                                    val rest'' = Util.peelOff(")", s'')
                                                 in
                                                    case rest'' of
                                                        NONE => NONE
                                                    | SOME r => SOME (i, r)
                                                 end
                       end
        end
end

(* Tests for SerializeInt *)
val "(INT 32768)" = SerializeInt.write(32768)
val SOME(32768, "") = SerializeInt.read(SerializeInt.write(32768))

(* Task 5.2 -- Hint: use peelOff and ^ *)

(* Purpose: serialize data of 'a list type to string *)
functor SerializeList (E : SERIALIZABLE) : SERIALIZABLE =
struct
    type t = E.t list
    
    fun write (l:t) : string =
        "([" ^ (List.foldr (fn (x,y) => x ^ "," ^ y) "" (List.map E.write l)) ^ "])"
                
        
    fun read (s:string): (t * string) option =
        let
            fun readElem(s:string): (t * string) =
                let
                    val eo = E.read(s)
                in
                    case eo of
                        NONE => (nil, s)
                    | SOME(e,s') => let
                                        val SOME(s'') = Util.peelOff(",",s')
                                        val (r,j) = readElem(s'')
                                    in
                                        (e::r,j)
                                    end
                end
            
            val a = Util.peelOff("([",s)
        in
            case a of
                NONE => NONE
            | SOME s' => let
                            val (l,q) = readElem(s')
                            val b = Util.peelOff("])",q)
                         in
                            case b of
                                NONE => NONE
                            | SOME r' => SOME(l,r')
                         end
        end
        

end

(* Tests for SerializeList *)
structure SIL = SerializeList(SerializeInt)
val "([(INT 1),(INT 2),(INT 3),])" = SIL.write([1,2,3])
val SOME([1,2,3,4,5],"") = SIL.read("([(INT 1),(INT 2),(INT 3),(INT 4),(INT 5),])")
val SOME([1,2,3,4,5],"") = SIL.read(SIL.write([1,2,3,4,5]))

structure SBL = SerializeList(SerializeBool)
val "([(TRUE),(FALSE),(TRUE),])" = SBL.write([true,false,true])
val SOME([true,false,true,true],"") = SBL.read("([(TRUE),(FALSE),(TRUE),(TRUE),])")
val SOME([true,false,true,true],"") = SBL.read(SBL.write([true,false,true,true]))

structure SILL = SerializeList(SerializeList(SerializeInt))
val SOME ([[1,2,3],[4,5,6]],"") = SILL.read (SILL.write [[1,2,3],[4,5,6]])
